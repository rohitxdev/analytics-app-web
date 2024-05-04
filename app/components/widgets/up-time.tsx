import { useFetcher, useParams } from '@remix-run/react';
import { useEffect } from 'react';
import { Button, TooltipTrigger } from 'react-aria-components';
import { LuInfo } from 'react-icons/lu';

import { Tooltip } from '~/components/react-aria/Tooltip';
import { uptimeEventSchema } from '~/schemas/events';
import { timeFormatter } from '~/utils/misc';

import { Switch } from '../atoms/switch';
import { Widget } from '../atoms/widget';

export const UpTime = () => {
	const { projectId } = useParams();
	const fetcher = useFetcher<{ events?: (typeof uptimeEventSchema)[] }>();
	const loaderData = uptimeEventSchema.array().catch([]).parse(fetcher.data?.events);
	const lastUpdatedTimestamp = loaderData[1]?.timestamp;

	useEffect(() => {
		fetcher.load(`/up-time?projectId=${projectId}`);

		const timerId = window.setInterval(() => {
			fetcher.load(`/up-time?projectId=${projectId}`);
		}, 30 * 1000);

		return () => {
			window.clearInterval(timerId);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [projectId]);

	return (
		<Widget.Container aria-label="Up time of project" className="flex w-fit flex-col gap-1">
			<div className="flex items-center justify-between gap-2">
				<Widget.Title>
					Uptime
					<TooltipTrigger delay={100}>
						<Button className="bg-transparent! size-4 rounded-full p-0">
							<LuInfo />
						</Button>
						<Tooltip>
							<span className="text-sm">Uptime of project</span>
						</Tooltip>
					</TooltipTrigger>
				</Widget.Title>
				{lastUpdatedTimestamp && (
					<h3 className="text-xs text-neutral-400">
						Last checked at&nbsp;&nbsp;
						<span className="font-bold text-white">
							{lastUpdatedTimestamp.getHours() + ':' + lastUpdatedTimestamp.getMinutes()}
						</span>
					</h3>
				)}
				<Switch />
			</div>
			<div className="flex items-center gap-1">
				{loaderData.reverse().map((val, i) => (
					<div key={val.timestamp.toTimeString() + i} className="relative">
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
			<h3 className="mt-2 text-sm text-neutral-300">Recent incidents</h3>
			<ul className="divide-y-[1px] divide-white/40">
				{loaderData
					.slice(0, 5)
					.reverse()
					.map((val, i) => (
						<li key={val.timestamp.toDateString()} className="flex gap-8 p-3">
							<p>{timeFormatter.format(val.timestamp)}</p>
							<p
								data-down={i % 2 === 0}
								className="flex w-[8ch] items-center justify-end rounded-full bg-green-400/20 px-2 py-1 text-sm font-medium text-green-400 data-[down=true]:bg-red-400/20 data-[down=true]:text-red-400"
							>
								<span className="w-full text-center">{i % 2 === 0 ? 'down' : 'up'}</span>
								<span
									data-down={i % 2 === 0}
									className="ml-2 inline-block size-1.5 shrink-0 rounded-full bg-green-400 data-[down=true]:bg-red-400"
								></span>
							</p>
						</li>
					))}
			</ul>
		</Widget.Container>
	);
};
