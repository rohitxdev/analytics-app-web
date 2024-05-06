import { Area, AreaChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Widget } from '../atoms/widget';

const data = [
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

export const LineGraph = () => {
	return (
		<Widget.Container className="w-full max-w-[600px] space-y-4 self-stretch rounded-lg bg-white/5 p-4">
			<ResponsiveContainer height={300}>
				<AreaChart data={data} className="font-inter">
					<defs>
						<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor="#4d43ff" stopOpacity={0.8} />
							<stop offset="95%" stopColor="#4d43ff" stopOpacity={0} />
						</linearGradient>
						<linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
							<stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
						</linearGradient>
					</defs>
					<XAxis dataKey="name" />
					<YAxis />
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
					<Legend />
					<Area
						type="monotone"
						dataKey="uv"
						stroke="#4d43ff"
						fillOpacity={0.5}
						fill="url(#colorUv)"
						animationDuration={1000}
					/>
					<Area
						type="monotone"
						dataKey="pv"
						stroke="#82ca9d"
						fillOpacity={0.5}
						fill="url(#colorPv)"
						animationDuration={1000}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</Widget.Container>
	);
};