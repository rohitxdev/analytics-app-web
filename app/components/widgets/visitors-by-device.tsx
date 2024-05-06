import { ComponentProps } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-aria-components';
import { z } from 'zod';

import { browserSchema, osSchema, platformSchema } from '~/schemas/events';

import { Icon } from '../atoms/icon';
import { Widget } from '../atoms/widget';
import { BarGraph } from './top-stats';

const IconWithShadow = ({ style, ...rest }: ComponentProps<typeof Icon>) => (
	<Icon style={{ filter: 'drop-shadow(0 4px 4px rgb(0 0 0 / 0.25))', ...style }} {...rest} />
);

interface VisitorsByDeviceProps {
	data: {
		visitorsByOs: KeyValue<z.infer<typeof osSchema>>[];
		visitorsByBrowser: KeyValue<z.infer<typeof browserSchema>>[];
		visitorsByPlatform: KeyValue<z.infer<typeof platformSchema>>[];
	};
}

export const VisitorsByDevice = ({
	data: { visitorsByBrowser, visitorsByOs, visitorsByPlatform },
}: VisitorsByDeviceProps) => {
	return (
		<Widget.Container className="flex flex-col gap-2 rounded-lg bg-white/5 p-4 text-center">
			<Tabs className="flex flex-col gap-4">
				<div className="flex justify-between">
					<Widget.Title>Users by device</Widget.Title>
					<TabList className="flex cursor-pointer gap-4 text-sm">
						<Tab id="browsers" className="font-semibold selected:text-indigo-500">
							Browsers
						</Tab>
						<Tab id="platforms" className="font-semibold selected:text-indigo-500">
							Platforms
						</Tab>
						<Tab id="os" className="font-semibold selected:text-indigo-500">
							OS
						</Tab>
					</TabList>
				</div>
				<TabPanel id="browsers">
					<BarGraph
						className="border-none bg-transparent"
						style={{ padding: 0 }}
						data={visitorsByBrowser}
						labelIcon={(key) => <IconWithShadow name={key} className="size-6 object-contain" />}
					/>
				</TabPanel>
				<TabPanel id="platforms">
					<BarGraph
						className="border-none bg-transparent"
						style={{ padding: 0 }}
						data={visitorsByPlatform}
						labelIcon={(key) => <IconWithShadow name={key} className="size-6 object-contain" />}
					/>
				</TabPanel>
				<TabPanel id="os">
					<BarGraph
						className="border-none bg-transparent"
						style={{ padding: 0 }}
						data={visitorsByOs}
						labelIcon={(key) => <IconWithShadow name={key} className="size-6 object-contain" />}
					/>
				</TabPanel>
			</Tabs>
		</Widget.Container>
	);
};
