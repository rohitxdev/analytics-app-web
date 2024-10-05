//TODO: Fix session duration tracker for mobile devices. onbeforeunload won't work on mobile if user switches apps
//TODO: Fix session duration tracker for CMD+TAB / ALT+TAB

import { onCLS, onFCP, onFID, onINP, onLCP, onTTFB } from 'web-vitals';

import { ClientSession } from './session-map';

const API_URL = import.meta.env.VITE_API_URL;

interface Session {
	id: string;
	projectId: string;
	startTime: number;
	endTime: number;
	currentPath: string;
}

const session = new ClientSession<keyof Session, Session[keyof Session]>('session');

const startSession = async (): Promise<string> => {
	const sessionId = session.get('id');
	if (sessionId) return sessionId as string;
	const res = await fetch(API_URL + '/session/start', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			projectId: document.querySelector('script[data-vorp-id]')?.getAttribute('data-vorp-id'),
			referer: new URL(document.referrer || location.href).hostname,
			userAgent: navigator.userAgent,
			startTime: Date.now(),
		}),
	});
	const data = await res.json();
	session.set('id', data.sessionId);
	return data.sessionId as string;
};

const endSession = async () => {
	const sessionId = session.get('id');
	if (!sessionId) return;

	navigator.sendBeacon(
		API_URL + '/session/end',
		JSON.stringify({
			sessionId,
			endTime: Date.now(),
		}),
	);
	session.clear();
};

const capturePageVisitEvent = async () => {
	const sessionId = session.get('id');
	if (!sessionId) return;

	const path = window.location.pathname;
	if (path !== session.get('currentPath')) {
		session.set('currentPath', path);
		await fetch(API_URL + '/session/page-visit', {
			method: 'POST',
			body: JSON.stringify({
				sessionId,
				path: path,
				timestamp: new Date().toISOString(),
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}
};

let timerId: number | null = null;

const watchSession = () => {
	if (document.visibilityState === 'hidden') {
		timerId = window.setTimeout(endSession, 30 * 1000);
		return;
	}

	if (timerId) {
		window.clearTimeout(timerId);
		timerId = null;
	}

	if (!session.has('id')) {
		startSession();
	}
};

startSession().then((sessionId) => {
	//Watch web vitals
	onCLS(console.log);
	onFID(console.log);
	onLCP(console.log);
	onFCP(console.log);
	onINP(console.log);
	onTTFB(console.log);

	//Watch navigation
	capturePageVisitEvent();
	setInterval(capturePageVisitEvent, 1000);

	//Watch session
	document.addEventListener('visibilitychange', watchSession);

	//Watch errors
	window.onerror = (_event, _source, _lineNo, _colNo, error) => {
		if (!error) return;
		fetch(API_URL + '/session/error', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				sessionId,
				name: error?.name,
				description: error?.message,
				stackTrace: error?.stack,
				timestamp: new Date().toISOString(),
			}),
		});
	};

	window.onbeforeunload = () => {
		const performanceEntry = window?.performance?.getEntriesByType('navigation')?.at(-1);
		if (!performanceEntry) return;

		if ((performanceEntry as PerformanceNavigationTiming).type !== 'navigate') return;

		endSession();
	};
});
