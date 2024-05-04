import { useNavigate, useParams, useRouteLoaderData } from '@remix-run/react';
import { z } from 'zod';

import { User } from '~/schemas/auth';

import { loader } from '../root';

export const useRootLoader = () =>
	useRouteLoaderData<typeof loader>('root') as { user: User } | null;

const projectParamsSchema = z
	.object({ projectId: z.string() })
	.transform((item) => ({ id: item.projectId }));

export const useProject = () => {
	const params = useParams();
	const navigate = useNavigate();

	try {
		return projectParamsSchema.parse(params);
	} catch (error) {
		navigate({ pathname: '/' });
		return null;
	}
};
