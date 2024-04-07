import { TooltipTrigger } from 'react-aria-components';
import { LuArrowDown, LuArrowUp, LuInfo } from 'react-icons/lu';

import { Button } from '~/components/react-aria/Button';
import { Tooltip } from '~/components/react-aria/Tooltip';
import { numFormatter } from '~/utils/numbers';

export const TotalVisits = ({ viewCount }: { viewCount: number }) => {
	return (
		<section className="flex w-[200px] items-start justify-between rounded-xl bg-white/5 p-4">
			<h3>Total visits</h3>
			<div className="flex items-center gap-1">
				<span className="text-neutral-400">{numFormatter.format(viewCount)}</span>
				<TooltipTrigger delay={100}>
					<Button className="bg-transparent! size-4 rounded-full p-0">
						<LuInfo />
					</Button>
					<Tooltip>
						<span className="flex items-center text-sm text-green-300">
							+4.3%
							<LuArrowUp className="size-fit h-4" />
						</span>
					</Tooltip>
				</TooltipTrigger>
				<span className="flex items-center rounded-md bg-red-200/20 p-1 text-xs text-red-400">
					-1.3%
					<LuArrowDown className="size-fit h-4" />
				</span>
			</div>
		</section>
	);
};
