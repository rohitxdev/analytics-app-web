import 'chart.js/auto';

import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { z } from 'zod';

import { Overview } from '~/components/widgets/overview';
import { TopPages, TopSources } from '~/components/widgets/top-stats';
import { WebVitals } from '~/components/widgets/web-vitals';
import { browserSchema, osSchema, platformSchema } from '~/schemas/events';
import { uptimeEventsCollection, viewEventsCollection } from '~/utils/database.server';

import _idNameMap from '../assets/id-name-map.json';
import { UpTime } from '../components/widgets/up-time';
import { VisitorsByCountry } from '../components/widgets/visitors-by-country';
import { VisitorsByDevice } from '../components/widgets/visitors-by-device';

const idNameMap = z
	.record(z.union([browserSchema, osSchema, platformSchema]), z.string())
	.parse(_idNameMap);

idNameMap;

export const loader = async (args: LoaderFunctionArgs) => {
	const { searchParams } = new URL(args.request.url);
	const projectId = args.params.projectId;
	const viewsPromise = viewEventsCollection.find({ projectId }).limit(100).toArray();
	const viewCountPromise = viewEventsCollection.countDocuments({
		projectId,
		timestamp: {
			$gte: new Date(searchParams.get('from') ?? Date.now() - 86400),
			$lte: new Date(searchParams.get('to') ?? Date.now()),
		},
	});
	const uptimePromise = uptimeEventsCollection
		.find({ projectId })
		.sort({ _id: -1 })
		.limit(20)
		.toArray();

	const [views, viewCount, uptime] = await Promise.all([
		viewsPromise,
		viewCountPromise,
		uptimePromise,
	]);

	return json(
		{
			views,
			viewCount,
			uptime,
			topSources: [
				{ key: 'google.com', value: 4300 },
				{ key: 'instagram.com', value: 2800 },
				{ key: 'facebook.com', value: 2400 },
				{ key: 'reddit.com', value: 2300 },
				{ key: 'tiktok.com', value: 2200 },
				{ key: 'youtube.com', value: 1300 },
			] as KeyValue[],
			topPages: [
				{ key: '/', value: 4500 },
				{ key: '/about', value: 3100 },
				{ key: '/faq', value: 3000 },
				{ key: '/services', value: 2400 },
				{ key: '/subscription', value: 400 },
			] as KeyValue[],
			visitorsByCountry: [
				{ key: 'AU', value: 400 },
				{ key: 'US', value: 4700 },
				{ key: 'IN', value: 3200 },
				{ key: 'JP', value: 1500 },
				{ key: 'BR', value: 800 },
				{ key: 'FR', value: 450 },
				{ key: 'GA', value: 400 },
			] as KeyValue[],
			visitorsByOs: [
				{ key: 'android', value: 40 },
				{ key: 'ios', value: 30 },
				{ key: 'windows', value: 40 },
				{ key: 'linux', value: 20 },
			] as KeyValue<z.infer<typeof osSchema>>[],
			visitorsByBrowser: [
				{ key: 'brave', value: 1200 },
				{ key: 'chrome', value: 2100 },
				{ key: 'firefox', value: 300 },
				{ key: 'opera', value: 600 },
				{ key: 'safari', value: 900 },
			] as KeyValue<z.infer<typeof browserSchema>>[],
			visitorsByPlatform: [
				{ key: 'desktop', value: 4200 },
				{ key: 'mobile', value: 7000 },
			] as KeyValue<z.infer<typeof platformSchema>>[],
		},

		{ headers: { 'Cache-Control': 'max-age=360' } },
	);
};

export default function Route() {
	const {
		topPages,
		topSources,
		visitorsByCountry,
		visitorsByBrowser,
		visitorsByOs,
		visitorsByPlatform,
		uptime,
	} = useLoaderData<typeof loader>();

	return (
		<div className="flex flex-wrap justify-center gap-4 p-4">
			<Overview />
			<TopSources data={topSources} />
			<TopPages data={topPages} />
			<VisitorsByCountry data={visitorsByCountry} />
			<VisitorsByDevice data={{ visitorsByBrowser, visitorsByOs, visitorsByPlatform }} />
			<UpTime data={uptime.map((item) => ({ ...item, timestamp: new Date(item.timestamp) }))} />
			<WebVitals />
		</div>
	);
}
