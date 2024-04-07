import { useSearchParams } from '@remix-run/react';
import { Key } from 'react-aria';

import { TimePeriod, timePeriodSchema } from '~/utils/misc';

import { Select, SelectItem } from '../react-aria/Select';

export const TimePeriodPicker = ({ onSelect }: { onSelect?: (val: TimePeriod) => void }) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const timePeriod = searchParams.get('timePeriod') ?? '24h';

	const onSelectionChange = (key: Key) => {
		const val = timePeriodSchema.safeParse(key);
		if (!val.success) return;
		setSearchParams((params) => {
			params.set('timePeriod', key.toString());
			return params;
		});
		if (!onSelect) return;
		onSelect(val.data);
	};

	return (
		<Select defaultSelectedKey={timePeriod} onSelectionChange={onSelectionChange}>
			<SelectItem id="24h">Last 24h</SelectItem>
			<SelectItem id="7d">Last week</SelectItem>
			<SelectItem id="1m">Last month</SelectItem>
			<SelectItem id="6m">Last 6 months</SelectItem>
		</Select>
	);
};
