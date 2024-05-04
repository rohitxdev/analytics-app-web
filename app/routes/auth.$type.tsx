import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Form, Link, useLoaderData, useNavigation, useParams } from '@remix-run/react';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { useRef } from 'react';
import { Button, Input, Label, TextField } from 'react-aria-components';
import toast from 'react-hot-toast';
import { LuArrowLeft } from 'react-icons/lu';
import { z } from 'zod';

import { CopyrightText, LogoText } from '~/components/atoms/texts';
import { FieldError } from '~/components/react-aria/Field';
import { userSchema } from '~/schemas/auth';
import { getGoogleAuthUrl } from '~/utils/auth';
import { checkLoggedIn, logInCookie } from '~/utils/auth.server';
import { usersCollection } from '~/utils/database.server';
import { useRootLoader } from '~/utils/hooks';
import { getRandomNumber } from '~/utils/numbers';

import GitHubLogoIcon from '../assets/github.svg';
import GoogleLogoIcon from '../assets/google.svg';
import SpinnerVector from '../assets/spinner.svg';

const authTypeSchema = z.enum(['log-in', 'sign-up', 'forgot-password']);

const validPasswordRegex = new RegExp(
	'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$',
);

const logInBodySchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});

const signUpBodySchema = z
	.object({
		email: z.string().email(),
		password: z
			.string()
			.regex(
				validPasswordRegex,
				'Password has to be at least 8 characters and contain 1 uppercase letter, 1 number, and 1 special character',
			),
		'confirm-password': z.string(),
	})
	.refine((val) => val['password'] === val['confirm-password']);

const forgotPasswordBodySchema = z.object({
	email: z.string().email(),
});

export const action = async ({ request }: ActionFunctionArgs) => {
	if (await checkLoggedIn(request.headers.get('Cookie'))) {
		return json({ error: 'user is already logged in' }, 400);
	}

	const formData = Object.fromEntries(await request.formData());
	if (formData['bot-trap']) return null;

	switch (formData['auth-type']) {
		case 'log-in': {
			const logInData = logInBodySchema.safeParse(formData);
			if (!logInData.success) return json(logInData.error, 422);

			const user = await usersCollection.findOne({ email: logInData.data.email });
			if (!user) return json({ error: 'user not found' }, 404);
			if (!user.passwordHash) return json({ error: 'password not set' });
			if (!(await argon2.verify(user.passwordHash, logInData.data.password))) {
				return json({ error: 'incorrect password' }, 400);
			}
			return redirect('/', {
				headers: {
					'Set-Cookie': await logInCookie.serialize({
						refreshToken: jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
							expiresIn: '30d',
						}),
					}),
				},
			});
		}
		case 'sign-up': {
			const signUpData = signUpBodySchema.safeParse(formData);
			if (!signUpData.success) return json(signUpData.error, 422);

			if (await usersCollection.findOne({ email: signUpData.data.email })) {
				return json({ error: 'user with this email already exists' }, 400);
			}

			const user = await usersCollection.insertOne({
				email: signUpData.data.email,
				passwordHash: await argon2.hash(signUpData.data.password),
				pictureUrl: `https://api.dicebear.com/7.x/lorelei/svg?seed=${getRandomNumber(9999, 99999)}`,
				preferences: {
					shouldSendEmailReports: true,
					analyticsReportsFrequency: 'weekly',
					errorReportsFrequency: 'weekly',
					graphAnimationsEnabled: true,
				},
				role: 'user',
				isBanned: false,
			} satisfies z.infer<typeof userSchema>);

			return redirect('/', {
				headers: {
					'Set-Cookie': await logInCookie.serialize({
						refreshToken: jwt.sign({ sub: user.insertedId }, process.env.JWT_SECRET, {
							expiresIn: '30d',
						}),
					}),
				},
			});
		}
		case 'forgot-password': {
			const forgotPasswordData = forgotPasswordBodySchema.safeParse(formData);
			if (!forgotPasswordData.success) return json(forgotPasswordData.error, 422);
			const user = await usersCollection.findOne({ email: forgotPasswordData.data.email });
			if (!user) return json({ error: 'user not found' }, 404);
			const passwordResetToken = jwt.sign(
				{
					sub: user._id,
					type: 'password-reset',
				},
				process.env.JWT_SECRET,
				{ expiresIn: '10m' },
			);
			await usersCollection.findOneAndUpdate({ _id: user._id }, { $set: { passwordResetToken } });
			return { message: 'Sent reset password email', passwordResetToken };
		}
		default:
			return json({ error: 'Invalid auth type' }, 400);
	}
};

export const loader = async (args: LoaderFunctionArgs) => {
	const isLoggedIn = await checkLoggedIn(args.request.headers.get('Cookie'));
	const { origin } = new URL(args.request.url);

	const authType = authTypeSchema.safeParse(args.params.type);
	if (!authType.success) return redirect(`/auth/log-in`);

	return {
		googleAuthUrl: isLoggedIn
			? ''
			: getGoogleAuthUrl({
					clientId: process.env.GOOGLE_CLIENT_ID!,
					redirectUri: origin,
					responseType: 'code',
					scope: 'email profile',
					prompt: 'consent',
					state: 'google',
					accessType: 'offline',
				}),
		gitHubAuthUrl: ' ',
	};
};

export default function Route() {
	const params = useParams();
	const authType = params.type as z.infer<typeof authTypeSchema>;
	const { googleAuthUrl, gitHubAuthUrl } = useLoaderData<typeof loader>();
	const passwordRef = useRef<string | null>(null);
	const rootData = useRootLoader();
	const { state } = useNavigation();

	return (
		<div className="flex flex-col items-center justify-center gap-12 ring">
			<Link
				to="/"
				className="absolute left-0 top-0 m-6 block size-12 rounded-full p-2 duration-200 ease-out hover:bg-white hover:text-black"
				aria-label="Go back"
			>
				<LuArrowLeft className="size-full" />
			</Link>
			{rootData?.user ? (
				<>
					<h2 className="text-2xl font-semibold">You are already logged in.</h2>
				</>
			) : (
				<>
					<LogoText />
					<Form
						className="flex w-[36ch] shrink-0 flex-col items-center gap-4 rounded-lg p-6 ring-1 ring-white/30"
						method="POST"
					>
						<TextField
							type="email"
							name="email"
							autoComplete="email"
							className="flex w-full flex-col gap-0.5"
						>
							<Label className="font-medium">Email</Label>
							<Input
								required
								placeholder="Email"
								className="rounded-md bg-white/20 px-3 py-2 text-lg font-medium placeholder:text-lg"
							/>
							<FieldError>
								{({ validationDetails }) => {
									if (validationDetails.typeMismatch) {
										return 'Please enter a valid email.';
									}
									return 'Please enter your email.';
								}}
							</FieldError>
						</TextField>
						{authType === 'forgot-password' && (
							<Button
								type="submit"
								name="auth-type"
								value={authType}
								className="mt-2 h-12 w-full rounded-lg bg-indigo-600 text-lg font-semibold"
								onPress={() => toast.success('Sent email!', { style: { fontWeight: 500 } })}
							>
								Send Reset Email
							</Button>
						)}
						{authType !== 'forgot-password' && (
							<TextField
								type="text"
								name="password"
								autoComplete="current-password"
								validate={(val) => {
									if (!val) return 'Please enter your password.';
									if (authType === 'log-in') return;
									if (validPasswordRegex.test(val)) return;
									return 'Password has to be at least 8 characters and contain 1 uppercase letter, 1 number, and 1 special character.';
								}}
								onInput={(e) => {
									passwordRef.current = e.currentTarget.value;
								}}
								className="flex w-full flex-col gap-0.5"
								isRequired
							>
								<div className="flex items-end justify-between">
									<Label className="font-medium">Password</Label>
									{authType === 'log-in' && (
										<Link
											to="/auth/forgot-password"
											className="ml-auto text-xs text-neutral-400 hover:text-white hover:underline"
										>
											Forgot password?
										</Link>
									)}
								</div>
								<Input
									placeholder="Password"
									className="rounded-md bg-white/20 px-3 py-2 text-lg font-medium"
								/>
								<FieldError />
							</TextField>
						)}
						{authType === 'sign-up' && (
							<>
								<TextField
									type="text"
									name="confirm-password"
									validate={(val) => {
										if (!val) return 'Please enter your password.';
										if (val !== passwordRef.current) return 'Passwords do not match.';
									}}
									className="flex w-full flex-col gap-0.5"
									isRequired
								>
									<Label>Confirm password</Label>
									<Input
										placeholder="ilovecats123"
										className="rounded-md bg-white/20 px-3 py-2 text-lg"
									/>
									<FieldError />
								</TextField>
								<div id="captcha" />
								<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"></script>
							</>
						)}
						{authType !== 'forgot-password' && (
							<>
								<Button
									type="submit"
									name="auth-type"
									value={authType}
									className="mt-2 h-12 w-full rounded-lg bg-indigo-600 text-lg font-semibold"
								>
									{state === 'submitting' ? (
										<SpinnerVector className="mx-auto fill-white p-2" />
									) : authType === 'log-in' ? (
										'Log In'
									) : (
										'Sign Up'
									)}
								</Button>
								<p className="text-sm">
									{authType === 'log-in' ? "Don't have an account?" : 'Already have an account?'}
									<Link
										replace
										to={`/auth/${authType === 'log-in' ? 'sign-up' : 'log-in'}`}
										className="ml-1 font-semibold text-indigo-400 underline-offset-4 hover:underline"
									>
										{authType === 'log-in' ? 'Sign up' : 'Log in'}
									</Link>
								</p>
								<div className="my-2 flex w-full items-center justify-center gap-4 px-2 [&>hr]:h-0.5 [&>hr]:grow [&>hr]:bg-white">
									<hr />
									<span>OR</span>
									<hr />
								</div>
								<Link
									to={googleAuthUrl}
									className="flex h-12 w-full items-center justify-center gap-5 rounded-lg bg-white font-semibold text-black"
								>
									Continue with Google <GoogleLogoIcon width={24} height={24} />
								</Link>
								<Link
									to={gitHubAuthUrl}
									className="flex h-12 w-full items-center justify-center gap-5 rounded-lg bg-white font-semibold text-black"
								>
									Continue with GitHub <GitHubLogoIcon width={24} height={24} />
								</Link>
							</>
						)}
						<input type="email" name="bot-trap" aria-hidden className="hidden" />
					</Form>
					<CopyrightText className="-mt-6" />
				</>
			)}
		</div>
	);
}
