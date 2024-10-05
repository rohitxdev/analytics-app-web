import { useEffect, useState } from 'react';
import { Button, TooltipTrigger } from 'react-aria-components';
import { LuInfo } from 'react-icons/lu';
import { PiLightning } from 'react-icons/pi';
import { onCLS, onFCP, onFID, onINP, onLCP, onTTFB } from 'web-vitals';

import { Tooltip } from '~/components/react-aria/Tooltip';

import { Widget } from '../atoms/widget';

interface WebVitalMetric {
	value: number;
	rating: string;
}

export const WebVitals = () => {
	const [fcp, setFcp] = useState<WebVitalMetric | null>(null);
	const [ttfb, setTtfb] = useState<WebVitalMetric | null>(null);
	const [lcp, setLcp] = useState<WebVitalMetric | null>(null);
	const [cls, setCls] = useState<WebVitalMetric | null>(null);
	const [fid, setFid] = useState<WebVitalMetric | null>(null);
	const [inp, setInp] = useState<WebVitalMetric | null>(null);

	useEffect(() => {
		onFCP((metric) => {
			console.log(metric);
			setFcp(metric);
		});
		onTTFB((metric) => {
			console.log(metric);

			setTtfb(metric);
		});
		onLCP((metric) => {
			console.log(metric);

			setLcp(metric);
		});
		onCLS((metric) => {
			console.log(metric);

			setCls(metric);
		});
		onFID((metric) => {
			console.log(metric);

			setFid(metric);
		});
		onINP((metric) => {
			console.log(metric);

			setInp(metric);
		});
	}, []);

	const percent = 56;

	return (
		<Widget.Container className="flex flex-col">
			<Widget.Title>
				<PiLightning />
				Web Vitals
				<TooltipTrigger delay={100}>
					<Button className="bg-transparent! size-4 rounded-full p-0">
						<LuInfo />
					</Button>
					<Tooltip>
						<ul className="max-w-[40ch] text-sm text-white">
							<li>
								LCP: measures loading performance. To provide a good user experience, LCP must occur
								within 2.5 seconds of when the page first starts loading.
							</li>
							<br />
							<li>
								INP: measures interactivity. To provide a good user experience, pages must have a
								INP of 200 milliseconds or less.
							</li>
							<br />
							<li>
								CLS: measures visual stability. To provide a good user experience, must should
								maintain a CLS of 0.1. or less.
							</li>
						</ul>
					</Tooltip>
				</TooltipTrigger>
			</Widget.Title>
			<ul className="flex divide-x-2 text-start [&>li]:px-2">
				<li>LCP: {lcp?.value}ms</li>
				<li>INP: {inp?.value}</li>
				<li>CLS: {cls?.value.toPrecision(1)}</li>
			</ul>
			<div
				className="size-32 rounded-full p-4"
				style={{
					backgroundImage: `conic-gradient(rgb(96, 231, 89) ${(percent / 100) * 180}deg, rgb(83, 82, 82) ${(percent / 100) * 180}deg)`,
				}}
			>
				<div className="flex size-full items-center justify-center rounded-full bg-neutral-900">
					<span className="text-2xl font-bold tabular-nums">{percent}%</span>
				</div>
			</div>
		</Widget.Container>
	);
};
