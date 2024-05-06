import { useRouteLoaderData } from '@remix-run/react';

import { loader } from '../root';

export const useRootLoader = () => useRouteLoaderData<typeof loader>('root');

export const useUser = () => {
	const data = useRootLoader();
	return data?.user ?? null;
};
