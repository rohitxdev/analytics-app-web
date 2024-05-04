import { ActionFunctionArgs, json } from '@remix-run/node';
import { Link, useFetcher, useLoaderData } from '@remix-run/react';
import { Button, DialogTrigger, MenuTrigger } from 'react-aria-components';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { LuFolderPlus, LuGlobe, LuPlus, LuX } from 'react-icons/lu';

import { LogoText } from '~/components/atoms/texts';
import { Dialog } from '~/components/react-aria/Dialog';
import { Menu, MenuItem } from '~/components/react-aria/Menu';
import { Popover } from '~/components/react-aria/Popover';
import { User } from '~/components/user';
import { getUserFromCookie } from '~/utils/auth.server';
import { projectsCollection } from '~/utils/database.server';
import { getFaviconUrl } from '~/utils/misc';

import { Modal } from '../components/react-aria/Modal';
import { TextField } from '../components/react-aria/TextField';

interface ProjectCardProps {
	name: string;
	baseUrl: string;
	id: string;
}

const ProjectCard = (props: ProjectCardProps) => {
	const url = getFaviconUrl(new URL(props.baseUrl).hostname, 128);
	return (
		<Link
			to={`/${props.id}`}
			className="group relative aspect-[4/3] w-64 rounded-lg p-2 ring-1 ring-white/50"
		>
			<div className="mb-2 flex aspect-[2/1] items-center justify-center rounded-md bg-white/5">
				{url ? <img src={url} alt="" height={64} width={64} /> : <LuGlobe size={48} />}
			</div>
			<h3 className="font-medium">{props.name}</h3>
			<p className="font-mono text-neutral-400">{props.baseUrl}</p>
			<MenuTrigger>
				<Button className="absolute right-0 top-0 m-3 opacity-0 duration-100 group-active:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100">
					<BsThreeDotsVertical size={24} />
				</Button>
				<Popover>
					<Menu placement="top right">
						<MenuItem id="edit">Edit</MenuItem>
						<MenuItem id="delete">Delete</MenuItem>
					</Menu>
				</Popover>
			</MenuTrigger>
		</Link>
	);
};

export const action = async (args: ActionFunctionArgs) => {
	switch (args.request.method) {
		case 'POST': {
			const user = await getUserFromCookie(args.request.headers.get('Cookie'));
			if (!user) return json({ error: 'User is not logged in' }, { status: 401 });
			const formData = await args.request.formData();
			const projectName = formData.get('project-name');
			const projectBaseUrl = formData.get('project-base-url');
			if (!projectName || !projectBaseUrl)
				return json({ error: 'Project name or base url is missing in body' }, { status: 422 });

			const arr = new Uint32Array(1);
			crypto.getRandomValues(arr);
			const projectId = arr[0]?.toString(16);
			if (!projectId) break;
			await projectsCollection.insertOne({
				name: projectName.toString(),
				baseUrl: projectBaseUrl.toString(),
				id: projectId,
				shouldMonitorUpTime: true,
				ownerId: user._id.toString(),
			});

			break;
		}
		case 'DELETE': {
			const formData = await args.request.formData();
			const projectId = formData.get('project-id');
			if (!projectId) return json({ error: 'Project ID is missing in body' }, { status: 422 });
			await projectsCollection.deleteOne({ id: projectId });
			break;
		}

		default:
			break;
	}
	return null;
};

export const loader = async () => {
	const projects = await projectsCollection.find().toArray();
	return {
		projects,
	};
};

export default function Route() {
	const data = useLoaderData<typeof loader>();
	const fetcher = useFetcher();
	const projects = data.projects;

	return (
		<section className="flex size-full flex-col gap-4 p-4">
			<div className="flex items-center justify-between px-2 py-4">
				<LogoText />
				<User />
			</div>
			<div className="mx-auto w-full border border-white/20"></div>
			<div className="flex items-center justify-between gap-4 px-2">
				<h1 className="text-4xl font-semibold">My Websites</h1>
				<DialogTrigger>
					<Button className="flex size-fit items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-base font-semibold">
						<LuPlus /> Add Website
					</Button>
					<Modal isDismissable>
						<Dialog className="flex flex-col gap-4">
							{({ close }) => (
								<fetcher.Form onSubmit={close} method="POST" className="flex flex-col gap-4">
									<Button onPress={close} className="ml-auto block bg-transparent p-1">
										<LuX />
									</Button>
									<TextField label="Website Name" name="project-name" autoFocus isRequired />
									<TextField
										label="Website Base URL (https://...)"
										name="project-base-url"
										errorMessage="Please enter a valid URL"
										isRequired
									/>
									<Button
										type="submit"
										className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold"
									>
										Create
									</Button>
								</fetcher.Form>
							)}
						</Dialog>
					</Modal>
				</DialogTrigger>
			</div>
			<div className="flex flex-wrap gap-4">
				{projects.length > 0 ? (
					projects.map((project) => <ProjectCard key={project.id} {...project} />)
				) : (
					<div className="flex size-full flex-col items-center justify-center gap-4">
						<LuFolderPlus size={48} />
						<p className="text-xl font-medium">No projects yet</p>
					</div>
				)}
			</div>
		</section>
	);
}
