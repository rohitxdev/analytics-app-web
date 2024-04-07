import { useSearchParams } from '@remix-run/react';
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';

import { viewsSchema } from '~/schemas/events';

import { TimePeriodSelect } from './atoms/time-period-select';

export const TopPages = ({ pageViewCounter }: { pageViewCounter: Record<string, number> }) => {
	const [counter, setCounter] = useState<typeof pageViewCounter | null>(null);
	const [sortBy] = useState<'ascending' | 'descending'>('descending');
	const [searchParams] = useSearchParams();

	const sortedEntries = Object.entries(counter ?? pageViewCounter).sort((a, b) =>
		sortBy === 'ascending' ? a[1] - b[1] : b[1] - a[1],
	);

	const [keys, values] = sortedEntries.reduce<[string[], number[]]>(
		(prev, curr) => {
			prev[0].push(curr[0]);
			prev[1].push(curr[1]);
			return prev;
		},
		[[], []],
	);

	return (
		<section className="flex w-[400px] flex-1 flex-col gap-2 rounded-xl bg-white/5 p-4">
			<div className="flex items-center">
				<h2 className="mr-auto text-center text-2xl font-bold">Top Pages</h2>
				<TimePeriodSelect
					onSelect={async (timePeriod) => {
						console.time(timePeriod);
						const res = await fetch(
							`/top-pages?projectId=${searchParams.get('projectId')}&timePeriod=${timePeriod}`,
						);
						const data = await res.json();
						const views = viewsSchema.parse(data.views);
						const pagesCounter: typeof pageViewCounter = {};
						views.forEach((val) => {
							const key = val.path ?? '/';
							if (pagesCounter[key]) {
								pagesCounter[key]++;
							} else {
								pagesCounter[key] = 1;
							}
						});
						setCounter(pagesCounter);
						console.timeEnd(timePeriod);
					}}
				/>
				{/* <Label className="flex items-center gap-2 w-fit scale-90">
					Sort by
					<Select
						placeholder="Sort by"
						defaultSelectedKey="descending"
						onSelectionChange={(key) => {
							setSortBy(key === 'descending' ? 'descending' : 'ascending');
						}}
					>
						<SelectItem id={'descending'}>High to Low</SelectItem>
						<SelectItem id={'ascending'}>Low to High</SelectItem>
					</Select>
				</Label> */}
			</div>
			<Bar
				data={{
					labels: keys,
					datasets: [
						{
							data: values,
							backgroundColor: 'rgb(0, 110, 255)',
							label: 'Views',
							barThickness: 24,
							normalized: true,
						},
					],
				}}
				options={{
					indexAxis: 'y',
					scales: {
						y: {
							ticks: {
								color: 'white',
								font: {
									family: 'Space Grotesk',
									size: 14,
								},
							},
						},
					},
				}}
			/>
		</section>
	);
};
