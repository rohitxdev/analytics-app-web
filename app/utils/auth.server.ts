import { createCookie } from '@remix-run/node';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

import { userSchema } from '~/schemas/auth';

import { usersCollection } from './database.server';

export const logInCookie = createCookie('auth', {
	httpOnly: true,
	// secure: true,
	// sameSite: 'strict',
	path: '/',
	maxAge: 86400 * 30,
});

export const logOutCookie = createCookie('auth', {
	httpOnly: true,
	// secure: true,
	// sameSite: 'strict',
	path: '/',
	maxAge: 0,
});

export const verifyJWT = (token: string) => {
	try {
		jwt.verify(token, process.env.JWT_SECRET);
		return true;
	} catch (err) {
		return false;
	}
};

export const checkLoggedIn = async (cookie: string | null | undefined) => {
	if (!cookie) return false;
	const parsedCookie = await logInCookie.parse(cookie);
	if (!parsedCookie?.refreshToken) return null;
	return verifyJWT(parsedCookie.refreshToken);
};

export const getUserFromToken = async (token: string) => {
	try {
		const { sub } = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;
		if (!sub) return null;
		const user = await usersCollection.findOne({ _id: new ObjectId(sub) });
		if (!user) return null;
		const parsedUser = userSchema.parse(user);
		delete parsedUser.passwordHash;
		return { ...parsedUser, _id: user._id };
	} catch (err) {
		console.log('error in getting user from token:', err);
		return null;
	}
};

export const getUserFromCookie = async (cookie: string | null | undefined) => {
	if (!cookie) return null;
	const parsedCookie = await logInCookie.parse(cookie);
	if (!parsedCookie?.refreshToken) return null;
	return await getUserFromToken(parsedCookie.refreshToken);
};
