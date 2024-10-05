import { ComponentProps } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-aria-components';
import { MdDevices } from 'react-icons/md';
import { z } from 'zod';

import { browserSchema, osSchema, platformSchema } from '~/schemas/events';

import { BarGraph } from '../atoms/bar-graph';
import { Icon } from '../atoms/icon';
import { Widget } from '../atoms/widget';

const IconWithShadow = ({ style, className, ...rest }: ComponentProps<typeof Icon>) => (
	<Icon
		className={`animate-fade-in shrink-0 ${className}`}
		style={{ filter: 'drop-shadow(0 4px 4px rgb(0 0 0 / 0.25))', ...style }}
		{...rest}
	/>
);

interface VisitorsByDeviceProps {
	data: {
		visitorsByOs: KeyValue<z.infer<typeof osSchema>>[];
		visitorsByBrowser: KeyValue<z.infer<typeof browserSchema>>[];
		visitorsByPlatform: KeyValue<z.infer<typeof platformSchema>>[];
	};
}

const types = ['browsers', 'platforms', 'os'] as const;

export const VisitorsByDevice = ({
	data: { visitorsByBrowser, visitorsByOs, visitorsByPlatform },
}: VisitorsByDeviceProps) => {
	return (
		<Widget.Container className="min-w-[400px]">
			<Tabs className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<Widget.Title>
						<MdDevices className="mr-2 size-6" /> Visitors by Device
					</Widget.Title>
					<TabList className="flex cursor-pointer gap-4 text-sm">
						<Tab id={types[0]} className="font-semibold selected:text-indigo-500">
							Browsers
						</Tab>
						<Tab id={types[1]} className="font-semibold selected:text-indigo-500">
							Platforms
						</Tab>
						<Tab id={types[2]} className="font-semibold selected:text-indigo-500">
							OS
						</Tab>
					</TabList>
				</div>
				<TabPanel id="browsers">
					<BarGraph
						className="border-none bg-transparent !p-0"
						leftTitle="Browser"
						rightTitle="Views"
						data={visitorsByBrowser}
						barContent={({ key }) => (
							<>
								<IconWithShadow name={key} className="size-6 shrink-0 object-contain" />
								<p className="animate-fade-in overflow-hidden text-ellipsis font-semibold">{key}</p>
							</>
						)}
						onlyGraph
					/>
				</TabPanel>
				<TabPanel id="platforms">
					<BarGraph
						className="border-none bg-transparent !p-0"
						leftTitle="Platform"
						rightTitle="Views"
						data={visitorsByPlatform}
						barContent={({ key }) => (
							<>
								<IconWithShadow name={key} className="size-6 object-contain" />
								<p className="animate-fade-in overflow-hidden text-ellipsis font-semibold">{key}</p>
							</>
						)}
						onlyGraph
					/>
				</TabPanel>
				<TabPanel id="os">
					<BarGraph
						className="border-none bg-transparent !p-0"
						leftTitle="Operating System"
						rightTitle="Views"
						data={visitorsByOs}
						barContent={({ key }) => (
							<>
								<IconWithShadow name={key} className="size-6 object-contain" />
								<p className="animate-fade-in overflow-hidden text-ellipsis font-semibold">{key}</p>
							</>
						)}
						onlyGraph
					/>
				</TabPanel>
			</Tabs>
		</Widget.Container>
	);
};
