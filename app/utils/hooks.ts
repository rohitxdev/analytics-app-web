import { useRouteLoaderData } from '@remix-run/react';

import { User } from '~/schemas/auth';

import { loader } from '../root';

export const useRootLoader = () =>
	useRouteLoaderData<typeof loader>('root') as { user: User } | null;
