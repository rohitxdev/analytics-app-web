import { fromDate } from '@internationalized/date';
import { useSearchParams } from '@remix-run/react';
import { useState } from 'react';
import { Key } from 'react-aria';

import { TimePeriod, timePeriodSchema } from '~/utils/misc';

import { DateRangePicker } from '../react-aria/DateRangePicker';
import { Select, SelectItem } from '../react-aria/Select';

const getTimeRange = (from: TimePeriod, to?: TimePeriod) => {
	const range = {
		from: new Date(),
		to: to ?? new Date(),
	};

	switch (from) {
		case '24h':
			range.from.setDate(range.from.getDate() - 1);
			break;
		case '7d':
			range.from.setDate(range.from.getDate() - 7);
			break;
		case '1m':
			range.from.setDate(range.from.getDate() - 30);
			break;
		case '6m':
			range.from.setDate(range.from.getDate() - 180);
			break;
		case '1y':
			range.from.setDate(range.from.getDate() - 365);
			break;
		default:
			break;
	}
	return range;
};

const parseISOString = (dateTime?: string | null) => {
	if (!dateTime) return new Date();
	try {
		return new Date(dateTime);
	} catch (error) {
		return new Date();
	}
};

export const TimePeriodPicker = ({ onSelect }: { onSelect?: (val: TimePeriod) => void }) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [dateRanges, setDateRanges] = useState({
		from: fromDate(parseISOString(searchParams.get('from')), '+00:00'),
		to: fromDate(parseISOString(searchParams.get('to')), '+00:00'),
	});

	const onSelectionChange = (key: Key) => {
		const val = timePeriodSchema.safeParse(key);
		if (!val.success) return;
		setSearchParams((params) => {
			params.set('from', key.toString());
			params.set('to', key.toString());
			return params;
		});
		if (!onSelect) return;
		onSelect(val.data);
	};

	return (
		<div>
			<Select defaultSelectedKey={0} onSelectionChange={onSelectionChange}>
				<SelectItem id="24h">Last 24h</SelectItem>
				<SelectItem id="7d">Last week</SelectItem>
				<SelectItem id="1m">Last month</SelectItem>
				<SelectItem id="6m">Last 6 months</SelectItem>
			</Select>
			<DateRangePicker
				onChange={(val) => {
					searchParams.set('from', val.start.toString());
					searchParams.set('to', val.end.toString());
					setSearchParams(searchParams);
				}}
			/>
		</div>
	);
};
