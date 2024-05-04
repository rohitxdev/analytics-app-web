import 'chart.js/auto';

import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Outlet, useLoaderData, useLocation, useNavigate, useSearchParams } from '@remix-run/react';
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
import { Tab, TabList, Tabs } from '~/components/react-aria/Tabs';
import { User } from '~/components/user';
import { projectsCollection } from '~/utils/database.server';

const StyledTab = ({ children, className, ...rest }: ComponentPropsWithRef<typeof Tab>) => {
	return (
		<Tab
			className={`flex gap-4 rounded-none border-indigo-500 text-neutral-700 !outline-none hover:bg-transparent selected:border-b-[3px] selected:bg-transparent selected:text-white [&>span]:font-semibold [&>svg]:size-6 ${className}`}
			{...rest}
		>
			{children}
		</Tab>
	);
};

export const loader = async (args: LoaderFunctionArgs) => {
	const projectId = z.string().parse(args.params.projectId);
	const project = await projectsCollection.findOne({ id: projectId });
	if (!project) return redirect('/not-found');
	return { project };
};

export default function Route() {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [searchParams] = useSearchParams();
	const { project } = useLoaderData<typeof loader>();

	return (
		<>
			<nav className="bg-neutral-500/5 p-2 pb-0">
				<div className="flex">
					<ProjectSelect className="mx-auto" />
					<User />
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
						<StyledTab id={`/${project.id}`}>
							<LuLayoutGrid />
							<span>Overview</span>
						</StyledTab>
						<StyledTab id={`/${project.id}/seo`}>
							<TbWorldSearch />
							<span>SEO</span>
						</StyledTab>
						<StyledTab id={`/${project.id}/events`}>
							<LuMousePointer2 />
							<span>Events</span>
						</StyledTab>
						<StyledTab id={`/${project.id}/errors`}>
							<LuAlertTriangle />
							<span>Errors</span>
						</StyledTab>
						<StyledTab id={`/${project.id}/settings`}>
							<LuSettings />
							<span>Settings</span>
						</StyledTab>
						<StyledTab id="/">
							<LuLayers />
							<span>Projects</span>
						</StyledTab>
					</TabList>
				</Tabs>
				{/* <span className="w-full text-start text-xs font-light text-neutral-400">
					v{import.meta.env.VITE_VERSION}
				</span> */}
			</nav>
			<Outlet />
		</>
	);
}
