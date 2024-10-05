import 'chart.js/auto';

import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import {
	Outlet,
	useLoaderData,
	useLocation,
	useNavigate,
	useParams,
	useSearchParams,
} from '@remix-run/react';
import { ComponentPropsWithRef } from 'react';
import { Tab as AriaTab, TabList, Tabs } from 'react-aria-components';
import { BsBarChart } from 'react-icons/bs';
import { LuAlertTriangle, LuMousePointer2, LuSettings } from 'react-icons/lu';
import { TbWorldSearch } from 'react-icons/tb';
import { z } from 'zod';

import { ProjectSelect } from '~/components/atoms/project-select';
import { User } from '~/components/user';
import { projectsCollection } from '~/utils/database.server';

const Tab = ({ children, className, ...rest }: ComponentPropsWithRef<typeof AriaTab>) => {
	return (
		<AriaTab
			className={`flex w-full cursor-pointer items-center gap-3 rounded p-4 py-2 text-sm outline-none active:bg-neutral-800 hover:bg-neutral-800 selected:text-indigo-500 [&>span]:font-semibold [&>svg]:size-6 ${className}`}
			{...rest}
		>
			{children}
		</AriaTab>
	);
};

export const loader = async (args: LoaderFunctionArgs) => {
	const projectId = z.string().parse(args.params.projectId);
	const [project, projects] = await Promise.all([
		projectsCollection.findOne({ id: projectId }),
		projectsCollection.find().toArray(),
	]);
	return project ? { projects } : redirect('/not-found');
};

export default function Route() {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [searchParams] = useSearchParams();
	const { projectId } = useParams();
	const { projects } = useLoaderData<typeof loader>();

	return (
		<div className="flex">
			<nav className="flex w-64 shrink-0 ">
				<div className="fixed flex h-screen flex-col items-stretch bg-neutral-500/5 ring-1 ring-neutral-700">
					<ProjectSelect projects={projects} className="mx-auto my-4" />
					{/* <TimePeriodSelect /> */}
					<Tabs
						onSelectionChange={(key) =>
							navigate(
								{
									pathname: key.toString(),
									search: searchParams.toString(),
								},
								{
									unstable_viewTransition: true,
								},
							)
						}
						selectedKey={pathname}
						className="flex w-64 flex-col items-start px-2"
					>
						<h2 className="mx-2 scale-90 text-xs font-extrabold text-neutral-400">PROJECT</h2>
						{/* <LogoText className="scale-[0.8]" /> */}
						<TabList className="size-full">
							<Tab id={`/${projectId}/overview`}>
								<BsBarChart />
								<span>Overview</span>
							</Tab>
							<Tab id={`/${projectId}/events`}>
								<LuMousePointer2 />
								<span>Events</span>
							</Tab>
							<Tab id={`/${projectId}/errors`}>
								<LuAlertTriangle />
								<span>Errors</span>
							</Tab>
							<Tab id={`/${projectId}/seo`}>
								<TbWorldSearch />
								<span>SEO</span>
							</Tab>
							<Tab id={`/${projectId}/settings`}>
								<LuSettings />
								<span>Settings</span>
							</Tab>
						</TabList>
					</Tabs>
					<Tabs className="my-4 h-full">
						<h2 className="mx-2 scale-90 text-xs font-extrabold text-neutral-400">WORKSPACES</h2>
					</Tabs>
					<User />
				</div>
			</nav>
			<Outlet />
		</div>
	);
}
