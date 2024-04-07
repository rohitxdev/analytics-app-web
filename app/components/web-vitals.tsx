import { useEffect, useState } from 'react';
import { onCLS, onFCP, onFID, onINP, onLCP, onTTFB } from 'web-vitals';

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
		<section className="flex flex-col gap-2 rounded-xl bg-white/5 p-4 text-center font-semibold">
			<h2 className="text-xl">Web Vitals</h2>
			<div className="flex gap-2 [&>div>p]:text-xs [&>div>p]:font-light">
				<div>
					<h3>LCP: {lcp?.value}ms</h3>
					<p>
						measures loading performance. To provide a good user experience, LCP must occur within
						2.5 seconds of when the page first starts loading.
					</p>
				</div>
				<div>
					<h3>INP: {inp?.value}</h3>
					<p>
						measures interactivity. To provide a good user experience, pages must have a INP of 200
						milliseconds or less.
					</p>
				</div>
				<div>
					<h3>CLS: {cls?.value}</h3>
					<p>
						measures visual stability. To provide a good user experience, must should maintain a CLS
						of 0.1. or less.
					</p>
				</div>
			</div>
		</section>
	);
};
