import { createCookieSessionStorage, Session } from '@remix-run/node';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

import { userSchema } from '~/schemas/auth';

import { usersCollection } from './database.server';

interface GoogleAuthURLProps {
	clientId: string;
	redirectUri: string;
	responseType: string;
	scope: string;
	prompt: string;
	accessType?: string;
	state?: string;
}

export const getGoogleAuthUrl = (props: GoogleAuthURLProps) => {
	const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
	url.searchParams.set('client_id', props.clientId);
	url.searchParams.set('redirect_uri', props.redirectUri);
	url.searchParams.set('response_type', props.responseType);
	url.searchParams.set('scope', props.scope);
	url.searchParams.set('prompt', props.prompt);
	if (props?.accessType) {
		url.searchParams.set('access_type', props.accessType);
	}
	if (props?.state) {
		url.searchParams.set('state', props.state);
	}
	return url.toString();
};

export const exchangeCodeForToken = async (code: string, redirectUri: string) => {
	try {
		const url = new URL('https://oauth2.googleapis.com/token');
		url.searchParams.set('code', code);
		url.searchParams.set('redirect_uri', redirectUri);
		url.searchParams.set('grant_type', 'authorization_code');
		url.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID!);
		url.searchParams.set('client_secret', process.env.GOOGLE_CLIENT_SECRET!);
		const res = await fetch(url.toString(), { method: 'POST' });
		const data = await res.json();
		const accessToken = data?.access_token;
		if (!accessToken) throw new Error('Did not get access token as expected. Response:', data);
		return accessToken;
	} catch (err) {
		console.log('Error in exchanging auth code for refresh token:', err);
		return null;
	}
};

export const exchangeTokenForUserInfo = async (token: string) => {
	try {
		const res = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${token}`);
		return await res.json();
	} catch (err) {
		console.log('Error in exchanging token for user info:', err);
		return null;
	}
};

export const verifyJWT = (token: string) => {
	try {
		jwt.verify(token, process.env.JWT_SECRET);
		return true;
	} catch (err) {
		return false;
	}
};

export const getUserFromToken = async (token: string) => {
	try {
		const { sub } = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;
		if (!sub) return null;
		const user = await usersCollection.findOne({ _id: new ObjectId(sub) });
		if (!user) return null;
		const parsedUser = userSchema.parse(user);
		delete parsedUser.passwordHash;
		return { _id: user._id, ...parsedUser };
	} catch (err) {
		console.log('Error in getting user from token:', err);
		return null;
	}
};

interface SessionData {
	userId: string;
}

interface FlashData {
	error: string;
}

export const getUserFromSession = async (session: Session<SessionData, FlashData>) => {
	try {
		if (!session.has('userId')) return null;
		const user = await usersCollection.findOne({ _id: new ObjectId(session.get('userId')) });
		if (!user) return null;
		const parsedUser = userSchema.parse(user);
		delete parsedUser.passwordHash;
		return { _id: user._id, ...parsedUser };
	} catch (error) {
		console.log('Error in getting user from session:', error);
		return null;
	}
};

const ONE_DAY_IN_SECONDS = 1 * 24 * 60 * 60;

export const { getSession, commitSession, destroySession } = createCookieSessionStorage<
	SessionData,
	FlashData
>({
	cookie: {
		name: '__session',
		httpOnly: true,
		maxAge: ONE_DAY_IN_SECONDS * 7,
		path: '/',
		sameSite: 'strict',
		secrets: [process.env.JWT_SECRET],
		secure: process.env.NODE_ENV === 'production',
	},
});
