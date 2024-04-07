import 'chart.js/auto';

import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import {
	Link,
	Outlet,
	useLoaderData,
	useLocation,
	useNavigate,
	useSearchParams,
} from '@remix-run/react';
import { useEffect } from 'react';
import { CgWebsite } from 'react-icons/cg';
import { FaChartLine, FaHome } from 'react-icons/fa';
import { LuAlertTriangle } from 'react-icons/lu';
import { PiExportBold } from 'react-icons/pi';
import { RiSettings3Fill } from 'react-icons/ri';

import { Tab, TabList, Tabs } from '~/components/react-aria/Tabs';
import { projectsCollection } from '~/utils/database.server';
import { useRootLoader } from '~/utils/hooks';

const validPaths = [
	'',
	'/projects',
	'/seo',
	'/email-stats',
	'/errors',
	'/export-data',
	'/api-keys',
	'/settings',
];

const validTimePeriods = ['24h', '7d', '1m', '6m'];

export const loader = async (args: LoaderFunctionArgs) => {
	const url = new URL(args.request.url);
	const path = url.pathname.split('/dash')[1];

	if (!validPaths.includes(path ?? '')) return redirect('/dash');

	const timePeriod = url.searchParams.get('timePeriod');
	if (timePeriod && !validTimePeriods.includes(timePeriod)) {
		url.searchParams.set('timePeriod', '24h');
	}

	const projects = await projectsCollection.find().toArray();

	return {
		projects,
		locales: args.request.headers.get('Accept-Language')?.split(';')[0]?.split(',') ?? ['en-US'],
	};
};

export default function Route() {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const data = useLoaderData<typeof loader>();
	const [searchParams, setSearchParams] = useSearchParams();
	const rootLoaderData = useRootLoader();

	useEffect(() => {
		const projectId = data?.projects[0]?.id;
		if (projectId && !searchParams.get('projectId')) {
			searchParams.set('projectId', projectId);
			setSearchParams(searchParams);
		}
	}, [data?.projects, searchParams, setSearchParams]);

	return (
		<div className="flex h-screen w-full">
			<Tabs
				onSelectionChange={(key) =>
					navigate({
						pathname: key.toString(),
						search: searchParams.toString(),
					})
				}
				selectedKey={pathname}
				orientation="vertical"
				className="flex h-full w-fit max-w-[18ch] shrink-0 flex-col items-center bg-white/5 p-2 max-md:px-0 max-md:[&_span]:hidden"
			>
				<Link to="/" className="py-2 text-center text-2xl font-extrabold">
					<img
						src="/logo.png"
						alt=""
						height={32}
						width={32}
						className="inline-block align-top md:mr-1.5"
					/>
					<span>Snowball</span>
				</Link>
				<TabList
					aria-label="Tabs"
					className="grid content-start justify-items-center [&>*]:flex [&>*]:w-full [&>*]:gap-2 [&_svg]:size-6"
				>
					<Tab id="/dash/projects">
						<CgWebsite /> <span>Projects</span>
					</Tab>
					<Tab id="/dash">
						<FaHome />
						<span>Home</span>
					</Tab>
					<Tab id="/dash/seo">
						<FaChartLine />
						<span>SEO</span>
					</Tab>
					<Tab id="/dash/errors">
						<LuAlertTriangle />
						<span>Errors</span>
					</Tab>
					<Tab id="/dash/export-data">
						<PiExportBold />
						<span>Export Data</span>
					</Tab>
					<Tab id="/dash/settings">
						<RiSettings3Fill />
						<span>Settings</span>
					</Tab>
				</TabList>
				<div className="h-full w-full"></div>
				<div className="flex w-full flex-col items-center justify-center gap-2 rounded-lg bg-white/10 p-2 max-md:bg-transparent max-md:p-0">
					<img
						src={
							rootLoaderData?.user.pictureUrl ??
							`https://api.dicebear.com/7.x/lorelei/svg?seed=6969`
						}
						alt=""
						height={64}
						width={64}
						className="rounded-full bg-black/30"
					/>
					<div className="text-center max-md:hidden">
						<p className="text-xs text-gray-400">Welcome,</p>
						<p className="text-lg font-semibold">
							{rootLoaderData?.user.fullName ?? rootLoaderData?.user.email}
						</p>
					</div>
				</div>
			</Tabs>
			<Outlet />
		</div>
	);
}
