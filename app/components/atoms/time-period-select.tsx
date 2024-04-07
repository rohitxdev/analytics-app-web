import { useState } from 'react';
import { Key, Tab, TabList, Tabs } from 'react-aria-components';

import { TimePeriod } from '~/utils/misc';

const validTimePeriods: TimePeriod[] = ['24h', '7d', '1m', '6m', '1y'];

const getIsValidTimePeriod = (timePeriod: unknown): timePeriod is TimePeriod =>
	validTimePeriods.includes(timePeriod as TimePeriod);

export const TimePeriodSelect = ({ onSelect }: { onSelect?: (val: TimePeriod) => void }) => {
	const [timePeriod, setTimePeriod] = useState<TimePeriod>('24h');

	const onSelectionChange = (timePeriodKey: Key) => {
		if (!getIsValidTimePeriod(timePeriodKey)) return;
		setTimePeriod(timePeriodKey);

		if (!onSelect) return;
		onSelect(timePeriodKey);
	};
	return (
		<Tabs onSelectionChange={onSelectionChange} selectedKey={timePeriod}>
			<TabList className="flex divide-x-2 overflow-hidden rounded-md border text-center text-sm">
				{validTimePeriods.map((val) => (
					<Tab
						id={val}
						key={val}
						className="w-[4ch] cursor-pointer p-1 outline-white selected:bg-white selected:text-dark"
					>
						{val}
					</Tab>
				))}
			</TabList>
		</Tabs>
	);
};
