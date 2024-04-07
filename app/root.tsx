import './root.css';

import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { StrictMode, useEffect, useState } from 'react';
import { z } from 'zod';

import { getUserFromCookie, logInCookie } from '~/utils/auth.server';

import { Footer } from './components/layout/footer';
import { googleUserSchema } from './schemas/auth';
// eslint-disable-next-line import/default
import sdkUrl from './sdk?url';
import { exchangeCodeForToken, exchangeTokenForUserInfo } from './utils/auth';
import { usersCollection } from './utils/database.server';
import { logDoge } from './utils/misc';

export const loader = async (args: LoaderFunctionArgs) => {
	const user = await getUserFromCookie(args.request.headers.get('Cookie'));
	if (user) return { user };
	const { searchParams, origin } = new URL(args.request.url);
	const code = searchParams.get('code');
	if (!code) return null;

	switch (searchParams.get('state')) {
		case 'google': {
			const token = await exchangeCodeForToken(code, origin);
			if (!token) return null;
			const userInfo = await exchangeTokenForUserInfo(token);
			if (!userInfo) return null;
			const googleUser = googleUserSchema.safeParse(userInfo);
			if (!googleUser.success) return null;
			const {
				data: { email, name, picture },
			} = googleUser;
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
	const [shouldShowFooter, setShouldShowFooter] = useState(false);

	useEffect(() => {
		if (!location?.pathname.includes('dash')) {
			setShouldShowFooter(true);
		}

		logDoge();

		//Browser env variables
		z.object({
			VITE_API_URL: z.string().url(),
			VITE_GOOGLE_CLIENT_ID: z.string().min(1),
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
					href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=block"
					rel="stylesheet"
				></link>
				<link
					href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=block"
					rel="stylesheet"
				></link>
				<link rel="shortcut icon" href="/logo.png" type="image/svg+xml" />
				<script src={sdkUrl} async type="module" />
				<Meta />
				<Links />
			</head>
			<body className="grid min-h-screen grid-cols-1 justify-items-center bg-dark font-space-grotesk text-white">
				<StrictMode>
					<Outlet />
				</StrictMode>
				<ScrollRestoration />
				<Scripts />
				{shouldShowFooter && <Footer />}
			</body>
		</html>
	);
}
