import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useRouteLoaderData } from '@remix-run/react';
import { Cell, Column, Row, Table, TableBody, TableHeader } from 'react-aria-components';
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { errorEventsCollection } from '~/utils/database.server';

import { loader as dashLoader } from './$projectId';

export const loader = async (args: LoaderFunctionArgs) => {
	const projectId = args.params.projectId;
	const errors = await errorEventsCollection
		.find({ projectId })
		.sort({ timestamp: -1 })
		.limit(20)
		.toArray();

	return { errors };
};

const dummyData = [
	{
		name: 'Page A',
		uv: 4000,
		pv: 2400,
		amt: 2400,
	},
	{
		name: 'Page B',
		uv: 3000,
		pv: 1398,
		amt: 2210,
	},
	{
		name: 'Page C',
		uv: 2000,
		pv: 9800,
		amt: 2290,
	},
	{
		name: 'Page D',
		uv: 2780,
		pv: 3908,
		amt: 2000,
	},
	{
		name: 'Page E',
		uv: 1890,
		pv: 4800,
		amt: 2181,
	},
	{
		name: 'Page F',
		uv: 2390,
		pv: 3800,
		amt: 2500,
	},
	{
		name: 'Page G',
		uv: 3490,
		pv: 4300,
		amt: 2100,
	},
];

export default function Route() {
	const data = useLoaderData<typeof loader>();
	const dashLoaderData = useRouteLoaderData<typeof dashLoader>('routes/dash');

	return (
		<div className="flex w-full flex-col justify-stretch gap-4 p-4 font-semibold">
			<ResponsiveContainer>
				<LineChart data={dummyData}>
					<XAxis dataKey="name" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Line type="monotone" dataKey="pv" stroke="red" animationDuration={1000} />
				</LineChart>
			</ResponsiveContainer>
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
