import 'chart.js/auto';

import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';

import { TopSources } from '~/components/widgets/top-sources';
import { WebVitals } from '~/components/widgets/web-vitals';
import { viewEventsCollection } from '~/utils/database.server';

import { LineGraph } from '../components/widgets/line-graph';
import { TopPages } from '../components/widgets/top-pages';
import { UpTime } from '../components/widgets/up-time';
import { UsersByCountry } from '../components/widgets/views-by-country';
import { UsersByDevice } from '../components/widgets/views-by-device';

export const loader = async (args: LoaderFunctionArgs) => {
	const { searchParams } = new URL(args.request.url);
	const projectId = args.params.projectId;
	const views = await viewEventsCollection.find({ projectId }).limit(100).toArray();
	const viewCount = await viewEventsCollection.countDocuments({
		projectId,
		timestamp: {
			$gte: new Date(searchParams.get('from') ?? Date.now() - 86400),
			$lte: new Date(searchParams.get('to') ?? Date.now()),
		},
	});
	return { views, viewCount };
};

export default function Route() {
	const data = useLoaderData<typeof loader>();
	const [pageViewCounter, setPageViewCounter] = useState<Record<string, number>>({});
	const [devicesCounter, setDevicesCounter] = useState<Record<string, number>>({});
	const [topSourcesData, setTopSourcesData] = useState<Record<string, number>>({});

	useEffect(() => {
		const views = data.views;
		const pagesCounter: typeof pageViewCounter = {};
		const deviceCounter: typeof devicesCounter = {};
		const topSourcesCounter: typeof topSourcesData = {};

		views.forEach((val) => {
			const key = val.path ?? '/';
			if (pagesCounter[key]) {
				pagesCounter[key]++;
			} else {
				pagesCounter[key] = 1;
			}

			if (deviceCounter[val.os]) {
				deviceCounter[val.os]++;
			} else {
				deviceCounter[val.os] = 1;
			}
			if (topSourcesCounter[val.referrer]) {
				topSourcesCounter[val.referrer]++;
			} else {
				topSourcesCounter[val.referrer] = 1;
			}
		});

		setPageViewCounter(pagesCounter);
		setDevicesCounter(deviceCounter);
		setTopSourcesData(topSourcesCounter);
	}, [data.views]);

	return (
		<div className="flex flex-wrap items-start gap-4 p-4">
			<TopSources data={topSourcesData} />
			<TopPages pageViewCounter={pageViewCounter} />
			<LineGraph />
			<UsersByCountry />
			<UpTime />
			<UsersByDevice devicesCounter={devicesCounter} />
			<WebVitals />
		</div>
	);
}
