import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import argon2 from 'argon2';
import { Button, Input, Label, TextField } from 'react-aria-components';

import { getUserFromToken, verifyJWT } from '~/utils/auth.server';
import { usersCollection } from '~/utils/database.server';

export const loader = async (args: LoaderFunctionArgs) => {
	const { searchParams } = new URL(args.request.url);
	const token = searchParams.get('token');
	if (!token) return redirect('/');
	return { token };
};

export const action = async (args: ActionFunctionArgs) => {
	const formData = await args.request.formData();
	const passwordResetToken = formData.get('token')?.toString();
	const newPassword = formData.get('new-password')?.toString();
	if (!passwordResetToken || !newPassword)
		return json({ error: 'token or/and new-password are missing' }, 422);
	const user = await getUserFromToken(passwordResetToken);
	if (!user) return redirect('/');
	if (user.passwordResetToken !== passwordResetToken) return redirect('/');
	if (!verifyJWT(passwordResetToken)) return json({ error: 'invalid token' }, 400);
	await usersCollection.findOneAndUpdate(
		{ email: user.email },
		{
			$set: { passwordHash: await argon2.hash(newPassword) },
			$unset: { passwordResetToken: true },
		},
	);
	return null;
};

export default function Route() {
	const data = useLoaderData<typeof loader>();

	return (
		<div className="flex min-h-svh w-full items-center justify-evenly">
			<Form
				className="flex h-fit w-full max-w-72 flex-col items-center gap-4 [&_button]:h-12 [&_button]:w-full"
				method="POST"
			>
				<TextField type="text" name="new-password" className="flex w-full flex-col gap-0.5">
					<Label>New password</Label>
					<Input required className="rounded-md bg-white/20 px-3 py-2 text-lg" />
				</TextField>
				<TextField type="text" name="confirm-new-password" className="flex w-full flex-col gap-0.5">
					<Label>Confirm new password</Label>
					<Input required className="rounded-md bg-white/20 px-3 py-2 text-lg" />
				</TextField>
				<Button
					type="submit"
					name="token"
					value={data.token}
					className="mt-2 rounded-lg bg-primary text-lg font-semibold"
				>
					Submit
				</Button>
			</Form>
		</div>
	);
}
