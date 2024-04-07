import { ActionFunctionArgs, json } from '@remix-run/node';
import { Form, useFetcher, useRouteLoaderData } from '@remix-run/react';
import { Button, DialogTrigger, TableBody } from 'react-aria-components';
import { FaTrash } from 'react-icons/fa';
import { LuPlus, LuX } from 'react-icons/lu';

import { Dialog } from '~/components/react-aria/Dialog';
import { Cell, Column, Row, Table, TableHeader } from '~/components/react-aria/Table';
import { getUserFromCookie } from '~/utils/auth.server';
import { projectsCollection } from '~/utils/database.server';

import { Modal } from '../components/react-aria/Modal';
import { TextField } from '../components/react-aria/TextField';
import { loader } from './dash';

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

export default function Route() {
	const data = useRouteLoaderData<typeof loader>('routes/dash');
	const fetcher = useFetcher();

	return (
		<section className="flex flex-col gap-4 p-4">
			<div className="flex items-center gap-4">
				<h1 className="text-4xl font-semibold">Projects</h1>
				<DialogTrigger>
					<Button className="flex size-fit items-center gap-2 rounded-lg bg-primary px-4 py-2 text-base font-semibold">
						<LuPlus /> Create Project
					</Button>
					<Modal isDismissable>
						<Dialog className="flex flex-col gap-4">
							{({ close }) => (
								<fetcher.Form onSubmit={close} method="POST" className="flex flex-col gap-4">
									<Button onPress={close} className="ml-auto block bg-transparent p-1">
										<LuX />
									</Button>
									<TextField label="Project Name" name="project-name" autoFocus isRequired />
									<TextField
										label="Project Base URL"
										name="project-base-url"
										errorMessage="Please enter a valid URL"
										isRequired
									/>
									<Button type="submit">Create</Button>
								</fetcher.Form>
							)}
						</Dialog>
					</Modal>
				</DialogTrigger>
			</div>
			<Form method="DELETE">
				<Table>
					<TableHeader>
						<Column isRowHeader>Id</Column>
						<Column>Title</Column>
						<Column>Domain</Column>
					</TableHeader>
					<TableBody>
						{data?.projects.map((val, i) => (
							<Row key={val.id + i}>
								<Cell>{val.id}</Cell>
								<Cell>
									<span>{val.name}</span>
									<Button type="submit" name="project-id" value={val.id} className="ml-10">
										<FaTrash />
									</Button>
								</Cell>
								<Cell>
									<span>{val.baseUrl}</span>
									<img
										src={`https://www.google.com/s2/favicons?domain=${new URL(val.baseUrl).hostname}`}
										height={24}
										width={24}
										alt=""
										className="ml-4 inline rounded-full"
									/>
								</Cell>
							</Row>
						))}
					</TableBody>
				</Table>
			</Form>
		</section>
	);
}
