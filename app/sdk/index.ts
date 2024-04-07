//TODO: Fix session duration tracker for mobile devices. onbeforeunload won't work on mobile if user switches apps
//TODO: Fix session duration tracker for CMD+TAB / ALT+TAB

import { onCLS, onFCP, onFID, onINP, onLCP, onTTFB } from 'web-vitals';
import { z } from 'zod';

import { SessionMap } from './session-map';

const API_URL = import.meta.env.VITE_API_URL;

const projectId = new URL(location.href).searchParams.get('projectId');

const sessionSchema = z.object({
	sessionId: z.string().min(1),
	sessionTimeoutInSeconds: z.number().min(1),
	previousPath: z.string().min(1).optional(),
});

type Session = z.infer<typeof sessionSchema>;

const session = new SessionMap<keyof Session, Session[keyof Session]>('session');

const startSessionResponseSchema = z.object({
	sessionId: z.string().min(1),
	sessionTimeoutInSeconds: z.number(),
});

const startSession = async () => {
	try {
		const res = await fetch(API_URL + '/session/start', {
			method: 'POST',
			body: JSON.stringify({
				projectId: projectId,
				referrer: document.referrer,
				userAgent: navigator.userAgent,
				startTime: Date.now(),
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = startSessionResponseSchema.parse(await res.json());
		session.set('sessionId', data.sessionId);
		session.set('sessionTimeoutInSeconds', data.sessionTimeoutInSeconds);
	} catch (err) {
		console.error(err);
	}
};

const endSession = async () => {
	const sessionId = session.get('sessionId');
	if (!sessionId) return;

	navigator.sendBeacon(
		API_URL + '/session/end',
		JSON.stringify({
			projectId: projectId,
			sessionId: sessionId,
			endTime: Date.now(),
		}),
	);
	sessionStorage.removeItem('session');
};

window.onbeforeunload = () => {
	const performanceEntry = window?.performance?.getEntriesByType('navigation')?.at(-1);
	if (!performanceEntry) return;

	const navigationType = (performanceEntry as PerformanceNavigationTiming).type;
	if (navigationType !== 'navigate') return;

	endSession();
};

const fireViewEvent = async () => {
	await fetch(API_URL + '/events/views', {
		method: 'POST',
		body: JSON.stringify({
			projectId: projectId,
			path: location.pathname,
			referrer: new URL(document.referrer || location.href).hostname,
			timestamp: new Date().toISOString(),
			userAgent: navigator.userAgent,
		}),
		headers: { 'Content-Type': 'application/json', 'User-Agent': navigator.userAgent },
	});
};

window.onerror = (_event, _source, lineNo, colNo, error) => {
	fetch(API_URL + '/events/errors', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			projectId: projectId,
			name: error?.name,
			description: error?.message,
			stackTrace: `error occurred at line ${lineNo}, column ${colNo}. ${error?.stack}`,
			timestamp: new Date().toISOString(),
		}),
	});
};

document.onvisibilitychange = () => {
	const sessionTimeoutInSeconds = session.get('sessionTimeoutInSeconds');
	let timerId: number | null = null;

	if (document.visibilityState === 'hidden') {
		timerId = window.setTimeout(
			() => {
				endSession();
			},
			(sessionTimeoutInSeconds as number) * 1000,
		);
		return;
	}

	if (timerId) {
		window.clearTimeout(timerId);
		timerId = null;
	}

	if (!session.has('sessionId')) {
		startSession();
		fireViewEvent();
	}
};

window.addEventListener('load', () => {
	onCLS(console.log);
	onFID(console.log);
	onLCP(console.log);
	onFCP(console.log);
	onINP(console.log);
	onTTFB(console.log);
	fireViewEvent().catch(console.log);

	if (!session.has('sessionId')) {
		startSession();
	}

	if (session.has('previousPath')) {
		const currentPath = location.pathname;
		const previousPath = session.get('previousPath')?.toString();
		if (currentPath !== previousPath) {
			fireViewEvent();
		}
	}
	session.set('previousPath', location.pathname);
});
