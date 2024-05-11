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
import {
	LuAlertTriangle,
	LuLayers,
	LuLayoutGrid,
	LuMousePointer2,
	LuSettings,
} from 'react-icons/lu';
import { TbWorldSearch } from 'react-icons/tb';
import { z } from 'zod';

import { ProjectSelect } from '~/components/atoms/project-select';
import { TimePeriodSelect } from '~/components/atoms/time-period-select';
import { Tab, TabList, Tabs } from '~/components/react-aria/Tabs';
import { User } from '~/components/user';
import { projectsCollection } from '~/utils/database.server';

const StyledTab = ({ children, className, ...rest }: ComponentPropsWithRef<typeof Tab>) => {
	return (
		<Tab
			className={`flex gap-4 rounded-none border-indigo-500 text-neutral-700 hover:bg-transparent selected:border-b-[3px] selected:bg-transparent selected:text-white [&>span]:font-semibold [&>svg]:size-6 ${className}`}
			{...rest}
		>
			{children}
		</Tab>
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
			<nav className="flex w-full bg-neutral-500/5 p-2 pb-0">
				<div className="mx-auto my-2 flex flex-col items-center gap-4">
					<div className="mx-auto flex gap-3">
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
							<StyledTab id={`/${projectId}/overview`}>
								<LuLayoutGrid />
								<span>Overview</span>
							</StyledTab>
							<StyledTab id={`/${projectId}/seo`}>
								<TbWorldSearch />
								<span>SEO</span>
							</StyledTab>
							<StyledTab id={`/${projectId}/events`}>
								<LuMousePointer2 />
								<span>Events</span>
							</StyledTab>
							<StyledTab id={`/${projectId}/errors`}>
								<LuAlertTriangle />
								<span>Errors</span>
							</StyledTab>
							<StyledTab id={`/${projectId}/settings`}>
								<LuSettings />
								<span>Settings</span>
							</StyledTab>
							<StyledTab id="/">
								<LuLayers />
								<span>Projects</span>
							</StyledTab>
						</TabList>
					</Tabs>
				</div>
				<User />
			</nav>
			<Outlet />
		</>
	);
}
