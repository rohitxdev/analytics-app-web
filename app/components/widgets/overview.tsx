import { LuTrendingUp } from 'react-icons/lu';

import { LineGraph } from '../atoms/line-graph';
import { Widget } from '../atoms/widget';

interface MetricProps {
	title: string;
	content: string;
	deltaPercent: number;
	isInverted?: boolean;
}

const Metric = ({ title, content, deltaPercent, isInverted }: MetricProps) => {
	const isPositive = isInverted ? deltaPercent < 0 : deltaPercent >= 0;
	return (
		<div className="flex flex-col items-center gap-1 px-4">
			<div className="flex w-full items-center justify-start gap-2">
				<h4 className="text-start text-xs font-bold text-neutral-400">
					{title.toLocaleUpperCase(navigator.language)}
				</h4>
				<LuTrendingUp
					className={`stroke-[3] ${isPositive ? 'text-green-500' : 'text-red-500'} ${deltaPercent < 0 && 'rotate-180 -scale-x-100'}`}
				/>
			</div>
			<div className="flex items-center gap-2 font-semibold">
				<p className="text-3xl">{content}</p>
				<div
					className={`flex gap-1 rounded-full px-1.5 py-0.5 text-2xs tabular-nums ${isPositive ? 'bg-green-300/20 text-green-500' : 'bg-red-300/20 text-red-500'}`}
				>
					<span>{deltaPercent >= 0 ? '+' + deltaPercent : deltaPercent}%</span>
				</div>
			</div>
		</div>
	);
};

export const Overview = () => {
	return (
		<Widget.Container className="flex aspect-[5/2] min-w-full flex-col gap-8 p-6">
			<div className="flex divide-x-[1px] divide-neutral-400">
				<Metric title="visitors" content="2.67k" deltaPercent={4} />
				<Metric title="views" content="6.32k" deltaPercent={6} />
				<Metric title="sessions" content="2.54k" deltaPercent={-2.4} />
				<Metric title="session duration" content="1m 28s" deltaPercent={6.6} />
				<Metric title="bounce rate" content="34%" deltaPercent={-12} isInverted />
			</div>
			<LineGraph />
		</Widget.Container>
	);
};
