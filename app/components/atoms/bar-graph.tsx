import { ComponentProps, FC, useState } from 'react';
import { LuArrowUpDown, LuMaximize2 } from 'react-icons/lu';

import { ToggleButton } from '~/components/atoms/inputs';
import { Widget } from '~/components/atoms/widget';
import { numFormatter } from '~/utils/numbers';

import { Modal } from './modal';

const Graph = <T extends KeyValue>({
	data,
	barContent,
	leftTitle,
	rightTitle,
}: {
	data: T[];
	barContent: FC<{ key: T['key']; value: T['value'] }>;
	leftTitle: string;
	rightTitle: string;
}) => {
	const maxWidth = Math.max(...data.map((item) => item.value));
	const sum = data.reduce((acc, curr) => acc + curr.value, 0);

	return (
		<>
			<div className="my-2 flex items-end text-xs font-bold uppercase text-neutral-400">
				<h4 className="mr-auto">{leftTitle}</h4>
				<h4 className="pr-2">{rightTitle}</h4>
			</div>
			<div className="grid aspect-[2/1] auto-rows-[2.5rem] gap-1">
				{data.map((item) => {
					return (
						<div
							key={item.key}
							className="flex items-center justify-between gap-6 rounded-md ring-neutral-700 hover:bg-white/5 hover:ring-1"
						>
							<div className="size-full">
								<div
									className="animate-grow-width flex h-full items-center gap-2 rounded-r-md bg-indigo-600 px-3"
									style={{
										width: `${(item.value / maxWidth) * 100}%`,
									}}
								>
									{barContent({ key: item.key, value: item.value })}
								</div>
							</div>
							<p className="animate-fade-in flex items-center gap-2 text-center text-sm font-semibold">
								<span className="text-end">{numFormatter.format(item.value)} </span>
								<span className="text-neutral-600">|</span>
								<span className="w-12 text-start font-medium text-neutral-400">{`${((item.value / sum) * 100).toFixed(1)}%`}</span>
							</p>
						</div>
					);
				})}
			</div>
		</>
	);
};

interface BarGraphProps<T extends KeyValue> extends ComponentProps<'div'> {
	data: T[];
	name?: string;
	barContent: FC<{ key: T['key']; value: T['value'] }>;
	leftTitle: string;
	rightTitle: string;
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
	const [sortBy, setSortBy] = useState<Sort>('descending');
	const sortedData = data.sort((a, b) =>
		sortBy === 'ascending' ? a.value - b.value : b.value - a.value,
	);
	const [showModal, setShowModal] = useState(false);

	const graph = (
		<Graph
			data={sortedData}
			barContent={barContent}
			leftTitle={leftTitle}
			rightTitle={rightTitle}
		/>
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
					<ToggleButton isSelected={showModal} onPress={() => setShowModal((val) => !val)}>
						<LuMaximize2 />
					</ToggleButton>
				</div>
				{graph}
			</Widget.Container>
		</Modal>
	);
};
