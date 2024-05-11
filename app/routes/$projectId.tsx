import 'chart.js/auto';

import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import {
	Link,
	Outlet,
	useLoaderData,
	useLocation,
	useNavigate,
	useParams,
	useSearchParams,
} from '@remix-run/react';
import { ComponentPropsWithRef } from 'react';
import { Tab as AriaTab, TabList, Tabs } from 'react-aria-components';
import {
	LuAlertTriangle,
	LuArrowLeft,
	LuLayoutGrid,
	LuMousePointer2,
	LuSettings,
} from 'react-icons/lu';
import { TbWorldSearch } from 'react-icons/tb';
import { z } from 'zod';

import { ProjectSelect } from '~/components/atoms/project-select';
import { TimePeriodSelect } from '~/components/atoms/time-period-select';
import { User } from '~/components/user';
import { projectsCollection } from '~/utils/database.server';

const Tab = ({ children, className, ...rest }: ComponentPropsWithRef<typeof AriaTab>) => {
	return (
		<AriaTab
			className={`flex w-32 translate-y-[1px] cursor-pointer items-center justify-center gap-3 rounded-t-md border-x border-t border-transparent border-b-dark p-4 py-2 text-sm text-neutral-400 outline-none selected:border-neutral-700 selected:bg-dark selected:text-white [&>span]:font-semibold [&>svg]:size-6 ${className}`}
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
		<>
			<nav className="flex w-full items-center border-b border-neutral-700 bg-neutral-500/5 px-8 py-2 pb-0">
				<Link
					className="group flex items-center gap-1 py-1 text-lg font-semibold underline-offset-4 hover:underline"
					to="/"
				>
					<LuArrowLeft
						className="duration-200 group-hover:-translate-x-1 group-hover:scale-105"
						size={36}
					/>
					My Websites
				</Link>
				<div className="mx-auto mt-2 flex flex-col items-center gap-4">
					<div className="mx-auto flex items-center gap-3">
						<ProjectSelect projects={projects} />
						<span className="text-2xl">/</span>
						<TimePeriodSelect />
					</div>
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
						className="flex w-full flex-col items-center"
					>
						{/* <LogoText className="scale-[0.8]" /> */}
						<TabList className="flex">
							<Tab id={`/${projectId}/overview`}>
								<LuLayoutGrid />
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
							{/* <Tab id="/">
								<LuLayers />
								<span>Projects</span>
							</Tab> */}
						</TabList>
					</Tabs>
				</div>
				<User />
			</nav>
			<Outlet />
		</>
	);
}
