import { useState } from 'react';
import { Key } from 'react-aria-components';

import { TimePeriod } from '~/utils/misc';

import { DateRangePicker } from '../react-aria/DateRangePicker';
import { Select, SelectItem } from '../react-aria/Select';

const validTimePeriods: TimePeriod[] = ['24h', '7d', '1m', '6m', '1y'];

interface TimeRange {
	start: Date;
	end: Date;
}

const getTimeRange = (start: TimePeriod): TimeRange => {
	const range: TimeRange = {
		start: new Date(),
		end: new Date(),
	};

	switch (start) {
		case '24h':
			range.start.setDate(range.start.getDate() - 1);
			break;
		case '7d':
			range.start.setDate(range.start.getDate() - 7);
			break;
		case '1m':
			range.start.setDate(range.start.getDate() - 30);
			break;
		case '6m':
			range.start.setDate(range.start.getDate() - 180);
			break;
		case '1y':
			range.start.setDate(range.start.getDate() - 365);
			break;
		default:
			break;
	}

	return range;
};

export const TimePeriodSelect = ({ onSelect }: { onSelect?: (val: TimePeriod) => void }) => {
	const [timePeriod, setTimePeriod] = useState<TimePeriod>('24h');
	const [showDatePicker, setShowDatePicker] = useState(false);

	const onSelectionChange = (key: Key) => {
		if (key === 'custom-period') {
			setShowDatePicker(true);
		}

		if (!onSelect) return;
		onSelect(key as any);
	};
	return (
		<>
			<Select onSelectionChange={onSelectionChange} selectedKey={timePeriod}>
				{validTimePeriods.map((val) => (
					<SelectItem key={val} id={val} className="w-[6ch] overflow-hidden">
						{val}
					</SelectItem>
				))}
				<SelectItem id="custom-period">Custom</SelectItem>
			</Select>
			{showDatePicker && <DateRangePicker onChange={(val) => {}} defaultOpen />}
		</>
	);
};
