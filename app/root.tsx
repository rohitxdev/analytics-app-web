import './root.css';
import '@radix-ui/themes/styles.css';

import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { ObjectId } from 'mongodb';
import { StrictMode, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { z } from 'zod';

import { getSession } from '~/utils/auth.server';

// eslint-disable-next-line import/default
import sdkUrl from './sdk?url';
import { usersCollection } from './utils/database.server';
import { logDoge } from './utils/misc';

export const loader = async (args: LoaderFunctionArgs) => {
	const { pathname } = new URL(args.request.url);
	if (pathname.startsWith('/auth') || pathname.startsWith('/not-found')) return null;

	const session = await getSession(args.request.headers.get('Cookie'));
	if (!session.has('userId')) return redirect('/auth/log-in');

	const user = await usersCollection.findOne({ _id: new ObjectId(session.get('userId')) });
	console.log({ user });

	return { user };
};

export default function App() {
	useEffect(() => {
		logDoge();

		//Browser env variables
		z.object({
			VITE_API_URL: z.string().url(),
			VITE_GOOGLE_CLIENT_ID: z.string().min(1),
			VITE_VERSION: z.string().min(1),
		}).parse(import.meta.env);
	}, []);

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link
					href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
					rel="stylesheet"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap"
					rel="stylesheet"
				></link>
				<link rel="shortcut icon" href="/vorp-logo.svg" type="image/svg+xml" />
				<script src={sdkUrl} async type="module" />
				<meta name="view-transition" content="same-origin" />
				<Meta />
				<Links />
			</head>
			<StrictMode>
				<body className="grid min-h-screen bg-dark font-inter text-white">
					<Toaster />
					<Outlet />
					<ScrollRestoration />
					<Scripts />
				</body>
			</StrictMode>
		</html>
	);
}
