import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import {
	Button,
	Cell,
	Column,
	Row,
	Table,
	TableBody,
	TableHeader,
	Tooltip,
} from 'react-aria-components';
import { LuArrowUpDown, LuFilter, LuMaximize2, LuSearch } from 'react-icons/lu';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import { ToggleButton } from '~/components/atoms/inputs';
import { Pagination } from '~/components/atoms/pagination';
import { errorEventsCollection } from '~/utils/database.server';
import { useLocale } from '~/utils/hooks';
import { getRandomNumber } from '~/utils/numbers';

const formatTime = (date: Date, locale: string) =>
	date.toLocaleString(locale, {
		dateStyle: 'medium',
		timeStyle: 'long',
		hourCycle: 'h24',
	});

export const loader = async (args: LoaderFunctionArgs) => {
	const projectId = args.params.projectId;
	const errors = await errorEventsCollection
		.find({ projectId })
		.sort({ timestamp: -1 })
		.limit(20)
		.toArray();

	return { errors };
};

const ddata = new Array(30)
	.fill(null)
	.map((_, i) => ({ key: `April ${i + 1}`, value: getRandomNumber(1000, 6000) }));

export default function Route() {
	const data = useLoaderData<typeof loader>();
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = 10;
	const locale = useLocale();

	return (
		<div className="flex w-full flex-col items-center gap-4 p-4">
			<ResponsiveContainer width={1000} height={300}>
				<LineChart data={ddata}>
					<XAxis dataKey="key" />
					<YAxis />
					<Tooltip />
					<Line type="linear" dataKey="value" stroke="red" animationDuration={1000} />
				</LineChart>
			</ResponsiveContainer>
			<div className="flex flex-col items-center gap-4">
				<div className="flex w-full gap-2">
					<div className="mr-auto flex w-fit items-center gap-2 rounded px-2 py-1 ring-1 ring-neutral-400 focus-within:outline">
						<LuSearch className="size-5" />
						<input
							type="text"
							className="min-w-[24ch] bg-transparent outline-none"
							placeholder="Search"
						/>
					</div>
					<ToggleButton>
						<LuFilter />
					</ToggleButton>
					<ToggleButton>
						<LuArrowUpDown className="size-4" />
					</ToggleButton>
				</div>
				<Table className="w-fit rounded ring-2 ring-neutral-400/20">
					<TableHeader className="text-sm [&_th]:bg-neutral-400/20 [&_th]:px-6 [&_th]:py-3 [&_th]:font-semibold">
						<Column isRowHeader>Type</Column>
						<Column>Message</Column>
						<Column>Timestamp</Column>
						<Column>Page</Column>
						<Column>Severity</Column>
						<Column></Column>
					</TableHeader>
					<TableBody>
						{data?.errors?.slice(10).map((val, i) => (
							<Row
								key={val.timestamp + i}
								className="group rounded font-mono text-sm font-medium ring-indigo-400 *:px-6 *:py-3 *:text-center even:bg-neutral-400/10 [&:hover]:ring-2 [&:hover_button:last-of-type]:visible"
							>
								<Cell className="text-red-400">{val.name}</Cell>
								<Cell className="max-w-30 overflow-hidden text-ellipsis">{val.description}</Cell>
								<Cell>{formatTime(new Date(val.timestamp), locale)}</Cell>
								<Cell>/dash</Cell>
								<Cell>{val?.severityLevel ?? 1}</Cell>
								<Cell>
									<Button className="invisible align-middle">
										<LuMaximize2 />
									</Button>
								</Cell>
							</Row>
						))}
					</TableBody>
				</Table>
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					setCurrentPage={setCurrentPage}
				/>
			</div>
		</div>
	);
}
