import 'chart.js/auto';

import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import { useEffect, useState } from 'react';

import { ProjectTimeSelect } from '~/components/project-time-select';
import { WebVitals } from '~/components/web-vitals';
import { viewsSchema } from '~/schemas/events';
import { viewEventsCollection } from '~/utils/database.server';

import { LineGraph } from '../components/line-graph';
import { TopPages } from '../components/top-pages';
import { TotalVisits } from '../components/total-visits';
import { UpTime } from '../components/up-time';
import { UsersByCountry } from '../components/views-by-country';
import { UsersByDevice } from '../components/views-by-device';

export const loader = async (args: LoaderFunctionArgs) => {
	const { searchParams } = new URL(args.request.url);
	const projectId = searchParams.get('projectId');
	if (!projectId) return { views: [], viewCount: 0 };
	const views = await viewEventsCollection.find({ projectId }).limit(100).toArray();
	const viewCount = await viewEventsCollection.countDocuments({ projectId });
	return { views, viewCount };
};

export default function Route() {
	const data = useLoaderData<typeof loader>();
	const [searchParams, setSearchParams] = useSearchParams();
	const [pageViewCounter, setPageViewCounter] = useState<Record<string, number>>({});
	const [devicesCounter, setDevicesCounter] = useState<Record<string, number>>({});

	console.log(devicesCounter);

	useEffect(() => {
		const views = viewsSchema.parse(data.views);
		console.log(views);
		const pagesCounter: typeof pageViewCounter = {};
		const deviceCounter: typeof devicesCounter = {};

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
		});

		setPageViewCounter(pagesCounter);
		setDevicesCounter(deviceCounter);
	}, [searchParams, setSearchParams, data.views]);

	return (
		<div className="flex flex-wrap items-start gap-4 overflow-y-auto p-4">
			<div className="flex w-full flex-wrap gap-2 max-md:flex-col">
				<h1 className="text-4xl font-semibold">Home</h1>
				<ProjectTimeSelect />
				{/* <DialogTrigger>
						<Button className="absolute top-0 right-0 p-2 outline-none">
							<IoNotificationsOutline className="size-6" />
							<Popover showArrow>
								<Dialog>
									<div className="aspect-[2/1] flex items-center">
										<p className="text-sm px-4">No new notifications</p>
									</div>
								</Dialog>
							</Popover>
						</Button>
					</DialogTrigger> */}
			</div>
			<LineGraph />
			<TopPages pageViewCounter={pageViewCounter} />
			<UsersByCountry />
			<UsersByDevice devicesCounter={devicesCounter} />
			<TotalVisits viewCount={data.viewCount} />
			<WebVitals />
			<UpTime />
		</div>
	);
}
