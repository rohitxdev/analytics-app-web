import { fromDate as fromDatetoZonedDate } from '@internationalized/date';
import { useSearchParams } from '@remix-run/react';
import { ComponentProps, useCallback, useEffect, useState } from 'react';
import { Key } from 'react-aria';
import {
	Button,
	ListBox,
	ListBoxItem as AriaListBoxItem,
	Popover,
	Select,
	SelectValue,
} from 'react-aria-components';
import { LuCalendar, LuCheck, LuChevronDown } from 'react-icons/lu';

import { DateRangePicker } from '~/components/react-aria/DateRangePicker';
import { TimePeriod, timePeriodSchema } from '~/utils/misc';

const timePeriodToDate = (timePeriod: TimePeriod) => {
	const date = new Date();
	switch (timePeriod) {
		case '24h':
			date.setDate(date.getDate() - 1);
			break;
		case '7d':
			date.setDate(date.getDate() - 7);
			break;
		case '1m':
			date.setDate(date.getDate() - 30);
			break;
		case '6m':
			date.setDate(date.getDate() - 180);
			break;
		case '1y':
			date.setDate(date.getDate() - 365);
			break;
		default:
			break;
	}
	return date;
};

const formatDate = (date: Date) => date.toLocaleDateString('en-GB', { dateStyle: 'short' });
const getDate = (dateString: string) => new Date(dateString);

const ListBoxItem = ({ children, className, ...rest }: ComponentProps<typeof AriaListBoxItem>) => (
	<AriaListBoxItem
		className={`group flex h-10 items-center rounded-md px-4 outline-none focus:bg-neutral-800 ${className}`}
		{...rest}
	>
		<>
			{children}
			<LuCheck className="ml-auto mr-2 hidden size-5 group-selected:block" />
		</>
	</AriaListBoxItem>
);

interface TimePeriodSelectProps extends ComponentProps<'section'> {}

export const TimePeriodSelect = (props: TimePeriodSelectProps) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const timePeriod = searchParams.get('period');
	const from = searchParams.get('from');
	const to = searchParams.get('to');
	const [showDatePicker, setShowDatePicker] = useState(false);

	const setTimePeriod = useCallback(
		(timePeriod: TimePeriod) => {
			setSearchParams((params) => {
				if (timePeriod !== 'custom') {
					const fromDate = timePeriodToDate(timePeriod);
					const toDate = new Date();
					params.set('from', fromDate.toISOString());
					params.set('to', toDate.toISOString());
				}
				params.set('period', timePeriod);
				return params;
			});
		},
		[setSearchParams],
	);

	const setFromDate = (date: string) => {
		const fromDate = new Date(date);
		fromDate.setHours(-24, 0, 0, 0);
		setSearchParams((params) => {
			params.set('from', fromDate.toISOString());
			return params;
		});
	};

	const setToDate = (date: string) => {
		const toDate = new Date(date);
		toDate.setHours(23, 59, 59, 0);
		setSearchParams((params) => {
			params.set('to', toDate.toISOString());
			return params;
		});
	};

	const onSelectionChange = (key: Key) => {
		const val = timePeriodSchema.parse(key);
		if (val === 'custom') setShowDatePicker(true);
		setTimePeriod(val);
	};

	useEffect(() => {
		const timePeriod = searchParams.get('period');
		if (!timePeriod) setTimePeriod('24h');
	}, [searchParams, setTimePeriod]);

	return (
		<section {...props}>
			<Select defaultSelectedKey={timePeriod ?? '24h'} onSelectionChange={onSelectionChange}>
				<Button className="flex h-10 w-72 items-center gap-3 rounded-md px-4 py-2 text-sm font-semibold ring-1 ring-neutral-700">
					<LuCalendar className="size-5" />
					{timePeriod === 'custom' && from && to ? (
						<span>
							{formatDate(getDate(from))} - {formatDate(getDate(to))}
						</span>
					) : (
						<SelectValue />
					)}
					<LuChevronDown className="ml-auto size-5" />
				</Button>
				<Popover>
					<ListBox className="w-72 rounded-md bg-dark text-sm font-medium ring-1 ring-neutral-700">
						<ListBoxItem id="24h">Last 24h</ListBoxItem>
						<ListBoxItem id="7d">Last week</ListBoxItem>
						<ListBoxItem id="1m">Last month</ListBoxItem>
						<ListBoxItem id="6m">Last 6 months</ListBoxItem>
						<ListBoxItem id="1y">Last 1 year</ListBoxItem>
						<ListBoxItem id="custom">Custom</ListBoxItem>
					</ListBox>
				</Popover>
			</Select>
			<DateRangePicker
				granularity="day"
				isOpen={showDatePicker}
				defaultValue={{
					start: fromDatetoZonedDate(new Date(from ?? Date.now()), '+00:00'),
					end: fromDatetoZonedDate(new Date(to ?? Date.now()), '+00:00'),
				}}
				onChange={({ start, end }) => {
					setShowDatePicker(false);
					setTimePeriod('custom');
					setFromDate(start.toAbsoluteString());
					setToDate(end.toAbsoluteString());
				}}
				onOpenChange={setShowDatePicker}
			/>
		</section>
	);
};
