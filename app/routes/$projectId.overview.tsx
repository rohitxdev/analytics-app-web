import 'chart.js/auto';

import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import { TopPages, TopSources } from '~/components/widgets/top-stats';
import { WebVitals } from '~/components/widgets/web-vitals';
import { browserSchema, osSchema, platformSchema } from '~/schemas/events';
import { uptimeEventsCollection, viewEventsCollection } from '~/utils/database.server';

import { LineGraph } from '../components/widgets/line-graph';
import { UpTime } from '../components/widgets/up-time';
import { VisitorsByCountry } from '../components/widgets/visitors-by-country';
import { VisitorsByDevice } from '../components/widgets/visitors-by-device';

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
	const events = await uptimeEventsCollection
		.find({ projectId })
		.sort({ _id: -1 })
		.limit(20)
		.toArray();
	return { views, viewCount, events };
};

export default function Route() {
	const data = useLoaderData<typeof loader>();
	const [devicesCounter, setDevicesCounter] = useState<Record<string, number>>({});
	const topSources: KeyValue[] = [
		{ key: 'google.com', value: 4300 },
		{ key: 'instagram.com', value: 2800 },
		{ key: 'facebook.com', value: 2400 },
		{ key: 'reddit.com', value: 2300 },
		{ key: 'tiktok.com', value: 2200 },
		{ key: 'youtube.com', value: 1300 },
	];
	const topPages: KeyValue[] = [
		{ key: '/', value: 4500 },
		{ key: '/about', value: 3100 },
		{ key: '/faq', value: 3000 },
		{ key: '/services', value: 2400 },
		{ key: '/subscription', value: 400 },
	];
	const visitorsByCountry: KeyValue[] = [
		{ key: 'AU', value: 400 },
		{ key: 'US', value: 4700 },
		{ key: 'IN', value: 3200 },
		{ key: 'JP', value: 1500 },
		{ key: 'BR', value: 800 },
		{ key: 'FR', value: 450 },
		{ key: 'GA', value: 400 },
	];

	useEffect(() => {
		const views = data.views;
		const deviceCounter: typeof devicesCounter = {};

		views.forEach((val) => {
			if (deviceCounter[val.os]) {
				deviceCounter[val.os]++;
			} else {
				deviceCounter[val.os] = 1;
			}
		});

		setDevicesCounter(deviceCounter);
	}, [data.views]);

	const uptimeData = data.events.map((item) => ({ ...item, timestamp: new Date(item.timestamp) }));

	const visitorsByOs: KeyValue<z.infer<typeof osSchema>>[] = [
		{ key: 'android', value: 40 },
		{ key: 'ios', value: 30 },
		{ key: 'windows', value: 40 },
		{ key: 'linux', value: 20 },
	];
	const visitorsByBrowser: KeyValue<z.infer<typeof browserSchema>>[] = [
		{ key: 'brave', value: 1200 },
		{ key: 'chrome', value: 2100 },
		{ key: 'firefox', value: 300 },
		{ key: 'opera', value: 600 },
		{ key: 'safari', value: 900 },
	];
	const visitorsByPlatform: KeyValue<z.infer<typeof platformSchema>>[] = [
		{ key: 'desktop', value: 4200 },
		{ key: 'mobile', value: 7000 },
	];
	return (
		<div className="flex flex-wrap justify-center gap-4 p-4">
			<TopSources data={topSources} />
			<TopPages data={topPages} />
			<LineGraph />
			<VisitorsByCountry data={visitorsByCountry} />
			<UpTime data={uptimeData} />
			<VisitorsByDevice data={{ visitorsByBrowser, visitorsByOs, visitorsByPlatform }} />
			<WebVitals />
		</div>
	);
}
