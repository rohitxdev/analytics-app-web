import { useEffect, useState } from 'react';
import { useEventSource } from 'remix-utils/sse/react';

export default function Route() {
	const eventData = useEventSource('/sse', { event: 'error' });
	const [data, setData] = useState(['3', '14', '42', '23', '97', '68']);

	useEffect(() => {
		if (eventData) {
			setData((val) => val.slice(1).concat(eventData));
		}
	}, [eventData]);

	return (
		<div className="mb-8 grid w-full content-start justify-start gap-12 p-8 [&_h2]:mb-2 [&_h2]:text-2xl [&_h2]:font-bold [&_ul]:list-inside [&_ul]:list-disc">
			<p className="text-3xl">{data.toString()}</p>
			<h1 className="text-4xl font-bold">Changelog</h1>
			<section>
				<div className="flex items-center gap-4">
					<h2>v3.0</h2>
					<span className="text-sm text-neutral-300">{new Date().toISOString().split('T')[0]}</span>
				</div>
				<ul>
					<li>Add analytics</li>
					<li>Add error tracking</li>
					<li>Add uptime monitoring</li>
				</ul>
			</section>
			<section>
				<div className="flex items-center gap-4">
					<h2>v2.0</h2>
					<span className="text-sm text-neutral-300">{new Date().toISOString().split('T')[0]}</span>
				</div>
				<ul>
					<li>Add analytics</li>
					<li>Add error tracking</li>
					<li>Add uptime monitoring</li>
				</ul>
			</section>
			<section>
				<div className="flex items-center gap-4">
					<h2>v1.0</h2>
					<span className="text-sm text-neutral-300">{new Date().toISOString().split('T')[0]}</span>
				</div>
				<ul>
					<li>Add analytics</li>
					<li>Add error tracking</li>
					<li>Add uptime monitoring</li>
				</ul>
			</section>
		</div>
	);
}
