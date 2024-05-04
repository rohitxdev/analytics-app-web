import './root.css';
import '@radix-ui/themes/styles.css';

import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { StrictMode, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { z } from 'zod';

import { getUserFromCookie, logInCookie } from '~/utils/auth.server';

import { googleUserSchema } from './schemas/auth';
// eslint-disable-next-line import/default
import sdkUrl from './sdk?url';
import { exchangeCodeForToken, exchangeTokenForUserInfo } from './utils/auth';
import { usersCollection } from './utils/database.server';
import { logDoge } from './utils/misc';

export const loader = async (args: LoaderFunctionArgs) => {
	const user = await getUserFromCookie(args.request.headers.get('Cookie'));
	if (user) return { user };

	const { searchParams, origin, pathname } = new URL(args.request.url);
	if (pathname.startsWith('/auth') || pathname.startsWith('/not-found')) {
		return null;
	}

	const code = searchParams.get('code');
	if (!code) return redirect('/auth/log-in');

	switch (searchParams.get('state')) {
		case 'google': {
			const token = await exchangeCodeForToken(code, origin);
			if (!token) return null;

			const userInfo = await exchangeTokenForUserInfo(token);
			if (!userInfo) return null;

			const googleUser = googleUserSchema.safeParse(userInfo);
			if (!googleUser.success) return null;

			const { email, name, picture } = googleUser.data;
			const user = await usersCollection.findOne({ email });
			let userId: ObjectId | null = user?._id ?? null;
			if (!user) {
				const { insertedId } = await usersCollection.insertOne({
					email,
					fullName: name,
					pictureUrl: picture,
					role: 'user',
					isBanned: false,
					preferences: {
						shouldSendEmailReports: true,
						analyticsReportsFrequency: 'weekly',
						errorReportsFrequency: 'weekly',
						graphAnimationsEnabled: true,
					},
				});
				userId = insertedId;
			}

			return redirect('/', {
				headers: {
					'Set-Cookie': await logInCookie.serialize({
						refreshToken: jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
							expiresIn: '30d',
						}),
					}),
				},
			});
		}
		case 'github': {
			return null;
		}
		default: {
			return new Response(null, {
				status: 200,
				headers: {
					'Set-Cookie': await logInCookie.serialize(null, { maxAge: 0 }),
				},
			});
		}
	}
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
