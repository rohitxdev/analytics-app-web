import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { getRandomNumber, numFormatter } from '~/utils/numbers';

const data = new Array(30)
	.fill(null)
	.map((_, i) => ({ key: `April ${i + 1}`, value: getRandomNumber(1000, 6000) }));

export const LineGraph = () => {
	return (
		<ResponsiveContainer>
			<AreaChart margin={{ left: -10 }} data={data} className="font-inter">
				<defs>
					<linearGradient id="colorKey" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="#4d43ff" stopOpacity={0.8} />
						<stop offset="95%" stopColor="#4d43ff" stopOpacity={0} />
					</linearGradient>
					{/* <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
						<stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
					</linearGradient> */}
				</defs>
				<XAxis dataKey="key" className="text-xs not-italic" />
				<YAxis dataKey="value" className="text-xs not-italic" tickFormatter={numFormatter.format} />
				<Tooltip
					cursor={{ stroke: 'rgb(255 255 255 / 0.75)', strokeDasharray: 5 }}
					animationDuration={100}
					content={({ payload, label }) => {
						if (!payload) return null;
						const data = payload[0];
						if (!data) return null;

						return (
							<div className="rounded-md bg-dark p-2 text-xs text-white ring-1 ring-white/30">
								<p>{`${label} : ${data.value} views`}</p>
							</div>
						);
					}}
				/>
				<Area
					type="linear"
					dataKey="value"
					stroke="#4d43ff"
					fillOpacity={0.5}
					fill="url(#colorKey)"
					animationDuration={1000}
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
};
