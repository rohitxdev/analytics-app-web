import { ComponentProps, FC, useState } from 'react';
import { LuArrowUpDown, LuMaximize2, LuPercent } from 'react-icons/lu';

import { ToggleButton } from '~/components/atoms/inputs';
import { Widget } from '~/components/atoms/widget';
import { numFormatter } from '~/utils/numbers';

import { Modal } from './modal';

interface BarGraphProps<T extends KeyValue> extends ComponentProps<'div'> {
	data: T[];
	name?: string;
	barContent: FC<{ key: T['key']; value: T['value'] }>;
	leftTitle?: string;
	rightTitle?: string;
	onlyGraph?: boolean;
}

export const BarGraph = <T extends KeyValue>({
	data,
	name,
	barContent,
	leftTitle,
	rightTitle,
	onlyGraph,
	...rest
}: BarGraphProps<T>) => {
	const [showPercent, setShowPercent] = useState(false);
	const [sortBy, setSortBy] = useState<Sort>('descending');
	const sortedData = data.sort((a, b) =>
		sortBy === 'ascending' ? a.value - b.value : b.value - a.value,
	);
	const maxWidth = Math.max(...data.map((item) => item.value));
	const sum = data.reduce((acc, curr) => acc + curr.value, 0);
	const [showModal, setShowModal] = useState(false);

	const graph = (
		<div className="grid aspect-[2/1] auto-rows-[2.5rem] gap-1">
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
							{barContent({ key: item.key, value: item.value })}
						</div>
						<p className="animate-fade-in min-w-[5ch] text-center text-sm font-semibold">
							{showPercent
								? `${((item.value / sum) * 100).toFixed(1)}%`
								: numFormatter.format(item.value)}
						</p>
					</div>
				);
			})}
		</div>
	);

	if (onlyGraph) return graph;

	return (
		<Modal isOpen={showModal}>
			<Widget.Container className="w-screen max-w-[600px]" {...rest}>
				<div className="flex gap-1.5">
					<Widget.Title>{name}</Widget.Title>
					<ToggleButton
						aria-label={`Sort by ${sortBy === 'ascending' ? 'descending' : 'ascending'} order`}
						onPress={() => setSortBy((val) => (val === 'ascending' ? 'descending' : 'ascending'))}
						isSelected={sortBy === 'ascending'}
					>
						<LuArrowUpDown size={18} />
					</ToggleButton>
					<ToggleButton
						aria-label={`Show ${showPercent ? 'values' : 'percent'}`}
						onPress={() => setShowPercent((val) => !val)}
						isSelected={showPercent}
					>
						<LuPercent size={18} />
					</ToggleButton>
					<ToggleButton isSelected={showModal} onPress={() => setShowModal((val) => !val)}>
						<LuMaximize2 />
					</ToggleButton>
				</div>
				<div
					className={`flex items-end text-xs font-bold uppercase text-neutral-400 ${onlyGraph ? 'mb-2' : 'my-2'}`}
				>
					<h4 className="mr-auto">{leftTitle}</h4>
					<h4 className="min-w-[5ch]">{rightTitle}</h4>
				</div>
				<div className="grid aspect-[2/1] auto-rows-[2.5rem] gap-1">{graph}</div>
			</Widget.Container>
		</Modal>
	);
};
