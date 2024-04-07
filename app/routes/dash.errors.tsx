import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useRouteLoaderData } from '@remix-run/react';
import { Cell, Column, Row, Table, TableBody, TableHeader } from 'react-aria-components';
import { Line } from 'react-chartjs-2';

import { ProjectTimeSelect } from '~/components/project-time-select';
import { errorEventsCollection } from '~/utils/database.server';

import { loader as dashLoader } from '../routes/dash';

export const loader = async (args: LoaderFunctionArgs) => {
	const { searchParams } = new URL(args.request.url);
	const projectId = searchParams.get('projectId');
	if (!projectId) return null;

	const errors = await errorEventsCollection
		.find({ projectId })
		.sort({ timestamp: -1 })
		.limit(20)
		.toArray();

	return { errors };
};

export default function Route() {
	const data = useLoaderData<typeof loader>();
	const dashLoaderData = useRouteLoaderData<typeof dashLoader>('routes/dash');

	console.log(dashLoaderData);

	return (
		<div className="flex w-full flex-col justify-stretch gap-4 p-4 font-semibold">
			<div className="flex items-center gap-4">
				<h1 className="text-4xl font-semibold">Errors</h1>
				<ProjectTimeSelect />
			</div>
			<Line
				data={{
					labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
					datasets: [
						{
							data: [
								{ x: 1, y: 8 },
								{ x: 2, y: 22 },
								{ x: 3, y: 55 },
								{ x: 4, y: 15 },
								{ x: 5, y: 12 },
								{ x: 6, y: 42 },
								{ x: 7, y: 7 },
								{ x: 8, y: 87 },
								{ x: 9, y: 26 },
								{ x: 10, y: 12 },
								{ x: 11, y: 8 },
								{ x: 12, y: 22 },
								{ x: 13, y: 55 },
								{ x: 14, y: 15 },
								{ x: 15, y: 12 },
								{ x: 16, y: 42 },
								{ x: 17, y: 7 },
								{ x: 18, y: 87 },
								{ x: 19, y: 26 },
								{ x: 20, y: 12 },
							],
							label: 'Project 1',
							fill: true,
							borderColor: 'rgb(255,0,0,0.75)',
							backgroundColor: 'rgb(255,0,0,0.1)',
						},
					],
				}}
				options={{
					plugins: {
						legend: {
							labels: {
								font: {
									family: 'Poppins',
									weight: 700,
								},
							},
						},
					},
					scales: {
						x: {
							ticks: {
								color: 'white',
							},
						},
						y: {
							ticks: {
								color: 'white',
							},
						},
					},
				}}
				className="aspect-video w-full p-4"
			/>
			<Table className="w-full">
				<TableHeader className="block w-full rounded-md bg-black/40 p-4 text-center [&>tr]:flex [&>tr]:w-full [&_th]:w-1/4">
					<Column isRowHeader>Title</Column>
					<Column>Description</Column>
					<Column>Timestamp</Column>
					<Column className="relative">Severity</Column>
				</TableHeader>
				<TableBody className="block h-[400px] overflow-scroll">
					{data?.errors?.map((val, i) => (
						<Row
							key={val.timestamp + i}
							className="h-16 divide-y-8 divide-transparent text-center font-normal [&>*]:w-1/4"
						>
							<Cell>{val.name}</Cell>
							<Cell>{val.description}</Cell>
							<Cell>
								{new Date(val.timestamp).toLocaleString(dashLoaderData?.locales, {
									dateStyle: 'short',
									timeStyle: 'short',
								})}
							</Cell>
							<Cell>{val?.severityLevel ?? 1}</Cell>
						</Row>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
