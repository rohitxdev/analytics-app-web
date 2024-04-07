import { json, LoaderFunctionArgs } from '@remix-run/node';

import { viewEventsCollection } from '~/utils/database.server';
import { getTimestampsFromTimePeriod, timePeriodSchema } from '~/utils/misc';

export const loader = async (args: LoaderFunctionArgs) => {
	const { searchParams } = new URL(args.request.url);
	const projectId = searchParams.get('projectId')?.toString();
	const timePeriod = searchParams.get('timePeriod')?.toString();
	if (!projectId || !timePeriod) return json(null, 400);

	const { startDate, endDate } = getTimestampsFromTimePeriod(timePeriodSchema.parse(timePeriod));

	const views = await viewEventsCollection
		.find({
			projectId,
			timestamp: { $gte: startDate, $lt: endDate },
		})
		.toArray();

	return {
		projectId,
		timePeriod,
		views,
	};
};
