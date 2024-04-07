import { useFetcher, useSearchParams } from '@remix-run/react';
import { useEffect } from 'react';
import { Button, TooltipTrigger } from 'react-aria-components';
import { LuInfo } from 'react-icons/lu';

import { Tooltip } from '~/components/react-aria/Tooltip';
import { uptimeEventSchema } from '~/schemas/events';
import { getRelativeTimeString, timeFormatter } from '~/utils/misc';

export const UpTime = () => {
	const [searchParams] = useSearchParams();
	const fetcher = useFetcher<{ events?: (typeof uptimeEventSchema)[] }>();
	const loaderData = uptimeEventSchema.array().catch([]).parse(fetcher.data?.events);
	const lastUpdatedTimestamp = loaderData[1]?.timestamp;
	const projectId = searchParams.get('projectId');

	useEffect(() => {
		fetcher.load(`/up-time?projectId=${projectId}`);

		const timerId = window.setInterval(() => {
			fetcher.load(`/up-time?projectId=${projectId}`);
		}, 30 * 1000);

		return () => {
			window.clearInterval(timerId);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	return (
		<section
			aria-label="Up time of project"
			className="flex w-fit flex-col gap-1 rounded-xl bg-white/5 p-4"
		>
			<div className="flex items-center justify-between">
				<h2 className="flex items-center gap-1 text-lg font-semibold">
					Uptime
					<TooltipTrigger delay={100}>
						<Button className="bg-transparent! size-4 rounded-full p-0">
							<LuInfo />
						</Button>
						<Tooltip>
							<span className="text-sm text-green-300">Uptime of project</span>
						</Tooltip>
					</TooltipTrigger>
				</h2>
				{lastUpdatedTimestamp && (
					<h3 className="text-xs text-neutral-400">
						Last checked&nbsp;&nbsp;
						<span className="font-bold text-white">
							{getRelativeTimeString(lastUpdatedTimestamp)}
						</span>
					</h3>
				)}
			</div>
			<div className="flex items-center gap-1">
				{loaderData.reverse().map((val, i) => (
					<div key={i} className="relative">
						<div
							data-down={val?.isDown}
							className="peer h-4 w-1.5 rounded-sm bg-green-400 data-[down=true]:bg-red-400 hover:brightness-[0.6]"
						></div>
						<div
							data-down={val?.isDown}
							className="absolute bottom-full left-1/2 z-10 hidden -translate-x-1/2 items-center rounded bg-black p-1 text-xs peer-hover:flex"
						>
							<p className="whitespace-nowrap">{timeFormatter.format(val.timestamp)}</p>
						</div>
					</div>
				))}
				<p className="ml-4 align-text-bottom text-2xl font-bold">99%</p>
			</div>
		</section>
	);
};
