import { ComponentProps, ComponentPropsWithRef, ReactNode, useState } from 'react';
import { Button } from 'react-aria-components';
import { LuArrowUpDown, LuPercent } from 'react-icons/lu';

import { numFormatter } from '~/utils/numbers';

import { Favicon } from '../atoms/favicon';
import { Widget } from '../atoms/widget';

interface BarGraphProps extends ComponentProps<'div'> {
	data: { key: string; value: number }[];
	name?: string;
	labelIcon?: (key: string, value: number) => ReactNode;
}

export const BarGraph = ({ data, name, labelIcon, ...rest }: BarGraphProps) => {
	const [showPercent, setShowPercent] = useState(false);
	const [sortBy, setSortBy] = useState<Sort>('descending');
	const sortedData = data.sort((a, b) =>
		sortBy === 'ascending' ? a.value - b.value : b.value - a.value,
	);
	const maxWidth = Math.max(...data.map((item) => item.value));
	const sum = data.reduce((acc, curr) => acc + curr.value, 0);

	return (
		<Widget.Container {...rest}>
			<div className="flex gap-1">
				<Widget.Title>{name}</Widget.Title>
				<Button
					aria-label={`Sort by ${sortBy === 'ascending' ? 'descending' : 'ascending'} order`}
					onPress={() => setSortBy((val) => (val === 'ascending' ? 'descending' : 'ascending'))}
					className={`active:bg-white/20" relative flex aspect-square items-center justify-center p-2 outline-none before:absolute before:size-full before:scale-0 before:rounded-md before:bg-white/20 before:duration-75 before:content-[''] active:before:scale-100 ${sortBy === 'ascending' && 'before:scale-100'}`}
				>
					<LuArrowUpDown size={18} />
				</Button>
				<Button
					aria-label={`Show ${showPercent ? 'values' : 'percent'}`}
					onPress={() => setShowPercent((val) => !val)}
					className={`active:bg-white/20" relative flex aspect-square items-center justify-center p-2 outline-none before:absolute before:size-full before:scale-0 before:rounded-md before:bg-white/20 before:duration-75 before:content-[''] active:before:scale-100 ${showPercent && 'before:scale-100'}`}
				>
					<LuPercent size={18} />
				</Button>
			</div>
			<div className="mt-2 grid aspect-[2/1] w-screen max-w-[600px] auto-rows-[2.5rem] gap-1">
				{sortedData.map((item) => {
					return (
						<div
							key={item.key}
							className="flex items-center justify-between gap-4 rounded-md ring-white/10 hover:bg-white/5 hover:ring-1"
						>
							<div
								className="animate-grow-width flex items-center gap-2 rounded-r-md bg-indigo-600 p-2"
								style={{
									width: `${(item.value / maxWidth) * 100}%`,
								}}
							>
								{labelIcon && labelIcon(item.key, item.value)}
								<p className="animate-fade-in overflow-hidden text-ellipsis font-semibold">
									{item.key}
								</p>
							</div>
							<p className="animate-fade-in mr-4 min-w-[5ch] text-center text-sm font-semibold">
								{showPercent
									? `${((item.value / sum) * 100).toFixed(1)}%`
									: numFormatter.format(item.value)}
							</p>
						</div>
					);
				})}
			</div>
		</Widget.Container>
	);
};

interface TopStatsProps extends ComponentPropsWithRef<'div'> {
	data: KeyValue[];
}

export const TopSources = ({ data, ...rest }: TopStatsProps) => {
	return (
		<BarGraph
			data={data}
			name="Top Sources"
			labelIcon={(key) => (
				<Favicon
					websiteUrl={key}
					className="animate-fade-in size-6 object-contain"
					style={{ filter: 'drop-shadow(0 4px 4px rgb(0 0 0 / 0.25))' }}
				/>
			)}
			{...rest}
		/>
	);
};

export const TopPages = ({ data, ...rest }: TopStatsProps) => {
	return <BarGraph data={data} name="Top Pages" {...rest} />;
};
