import { redirect } from '@remix-run/node';

import { logOutCookie } from '~/utils/auth.server';

export const action = async () =>
	redirect('/', {
		headers: {
			'Set-Cookie': await logOutCookie.serialize({
				refreshToken: '',
			}),
		},
	});
