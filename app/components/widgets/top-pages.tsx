import { useState } from 'react';
import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { numFormatter } from '~/utils/numbers';

import { Widget } from '../atoms/widget';

export const TopPages = ({ pageViewCounter }: { pageViewCounter: Record<string, number> }) => {
	const [counter, setCounter] = useState<typeof pageViewCounter | null>(null);
	const [sortBy] = useState<'ascending' | 'descending'>('descending');

	const sortedEntries = Object.entries(counter ?? pageViewCounter)
		.sort((a, b) => (sortBy === 'ascending' ? a[1] - b[1] : b[1] - a[1]))
		.map(([key, value]) => ({ key, value }));

	return (
		<Widget.Container className="flex flex-col gap-2">
			<Widget.Title>Top Pages</Widget.Title>
			<ResponsiveContainer height={300} width={600}>
				<BarChart data={sortedEntries} layout="vertical">
					<XAxis dataKey="value" type="number" stroke="white" className="text-sm not-italic" />
					<YAxis
						dataKey="key"
						type="category"
						stroke="white"
						width={120}
						className="text-sm not-italic"
					/>
					<Tooltip
						animationDuration={100}
						content={({ payload, label }) => {
							if (!payload) return null;
							const data = payload[0];
							if (!data) return null;

							return (
								<div className="rounded-md bg-dark p-2 text-xs text-white ring-1 ring-white/30">
									<p>{`${label} : ${data.value}`}</p>
								</div>
							);
						}}
					/>
					<Bar
						dataKey="value"
						barSize={40}
						radius={[0, 4, 4, 0]}
						className="font-semibold not-italic"
					>
						<LabelList
							dataKey="value"
							position="center"
							formatter={numFormatter.format}
							className="fill-white text-sm"
						/>
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</Widget.Container>
	);
};
