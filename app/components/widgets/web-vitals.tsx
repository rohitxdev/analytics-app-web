import { useEffect, useState } from 'react';
import { Button, TooltipTrigger } from 'react-aria-components';
import { LuInfo } from 'react-icons/lu';
import { PiLightning } from 'react-icons/pi';
import { onCLS, onFCP, onFID, onINP, onLCP, onTTFB } from 'web-vitals';

import { Tooltip } from '~/components/react-aria/Tooltip';

import { Widget } from '../atoms/widget';

export const WebVitals = () => {
	const [fcp, setFcp] = useState<{ value: number; rating: string } | null>(null);
	const [ttfb, setTtfb] = useState<{ value: number; rating: string } | null>(null);
	const [lcp, setLcp] = useState<{ value: number; rating: string } | null>(null);
	const [cls, setCls] = useState<{ value: number; rating: string } | null>(null);
	const [fid, setFid] = useState<{ value: number; rating: string } | null>(null);
	const [inp, setInp] = useState<{ value: number; rating: string } | null>(null);

	useEffect(() => {
		onFCP((metric) => {
			setFcp({ value: metric.value, rating: metric.rating });
		});
		onTTFB((metric) => {
			setTtfb({ value: metric.value, rating: metric.rating });
		});
		onLCP((metric) => {
			setLcp({ value: metric.value, rating: metric.rating });
		});
		onCLS((metric) => {
			setCls({ value: metric.value, rating: metric.rating });
		});
		onFID((metric) => {
			setFid({ value: metric.value, rating: metric.rating });
		});
		onINP((metric) => {
			setInp({ value: metric.value, rating: metric.rating });
		});
	}, []);

	console.log(fcp, ttfb, lcp, cls, fid, inp);
	return (
		<Widget.Container className="flex flex-col gap-2 rounded-lg bg-white/5 p-4 text-center font-semibold">
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
		</Widget.Container>
	);
};
