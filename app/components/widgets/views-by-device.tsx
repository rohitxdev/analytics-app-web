import { Tab, TabList, TabPanel, Tabs } from 'react-aria-components';
import { Bar, BarChart, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { z } from 'zod';

import { numFormatter } from '~/utils/numbers';

import { Widget } from '../atoms/widget';

const platformSchema = z.enum(['android', 'ios', 'windows', 'macos', 'linux', 'other']);
const browserSchema = z.enum(['chrome', 'safari', 'firefox', 'brave', 'opera', 'other']);

const BAR_RADIUS = [0, 4, 4, 0] as const satisfies [number, number, number, number];

export const UsersByDevice = ({ devicesCounter }: { devicesCounter: Record<string, number> }) => {
	const data: { key: z.infer<typeof platformSchema>; value: number }[] = [
		{ key: 'android', value: 40 },
		{ key: 'ios', value: 30 },
		{ key: 'windows', value: 40 },
		{ key: 'linux', value: 20 },
	];

	return (
		<Widget.Container className="flex flex-col gap-2 rounded-lg bg-white/5 p-4 text-center">
			<Tabs>
				<div className="flex justify-between">
					<Widget.Title>Users by device</Widget.Title>
					<TabList className="flex cursor-pointer gap-4 text-sm [&>div]:outline-none">
						<Tab id="device" className="selected:text-indigo-500">
							Device
						</Tab>
						<Tab id="platform" className="selected:text-indigo-500">
							Platform
						</Tab>
						<Tab id="os" className="selected:text-indigo-500">
							OS
						</Tab>
					</TabList>
				</div>
				<TabPanel id="device">
					<ResponsiveContainer height={300} width={600}>
						<BarChart data={data} layout="vertical">
							<XAxis dataKey="value" type="number" stroke="white" />
							<YAxis dataKey="key" type="category" stroke="white" width={120} />
							<Bar dataKey="value" barSize={40} radius={BAR_RADIUS} className="fill-white/20">
								<LabelList dataKey="value" position="center" formatter={numFormatter.format} />
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</TabPanel>
				<TabPanel id="platform"></TabPanel>
				<TabPanel id="os"></TabPanel>
			</Tabs>
		</Widget.Container>
	);
};
