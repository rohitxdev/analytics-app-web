import { json, LoaderFunctionArgs } from '@remix-run/node';

import { uptimeEventsCollection } from '~/utils/database.server';

export const loader = async (args: LoaderFunctionArgs) => {
	const { searchParams } = new URL(args.request.url);
	const projectId = searchParams.get('projectId');
	if (!projectId) return json({ message: 'projectId not provided in search params' }, 422);
	const data = await uptimeEventsCollection
		.find({ projectId })
		.sort({ _id: -1 })
		.limit(20)
		.toArray();
	return { events: data };
};
