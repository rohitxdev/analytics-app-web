import type { MetaFunction } from '@remix-run/node';
import { Form, Link } from '@remix-run/react';
import { Button } from 'react-aria-components';

import { WaitList } from '~/components/wait-list';
import { useRootLoader } from '~/utils/hooks';

export const meta: MetaFunction = () => {
	return [{ title: 'Home' }, { name: 'description', content: 'Analytics app' }];
};

export default function Route() {
	const data = useRootLoader();

	return (
		<div className="flex flex-col items-center justify-between gap-8 p-4">
			{data?.user ? (
				<div className="flex scale-75 items-center gap-4 rounded-lg bg-blue-600 p-2 font-semibold ring-2 ring-white">
					<p className="text-xl">{data.user.fullName ?? data.user.email}</p>
					{data?.user.pictureUrl && (
						<img
							src={data.user.pictureUrl}
							alt="User"
							height={64}
							width={64}
							className="rounded-full bg-black ring-1 ring-white"
						/>
					)}
					<Form method="POST" action="/log-out">
						<Button type="submit" className="rounded-md bg-black p-2 text-lg">
							Log Out
						</Button>
					</Form>
				</div>
			) : (
				<nav className="flex gap-8 text-xl font-bold [&>a:hover]:underline">
					<Link to="/auth" prefetch="intent">
						Log In/ Sign Up
					</Link>
				</nav>
			)}
			<div>
				<h1 className="mb-2 text-center text-5xl font-extrabold">
					<img
						src="/logo.png"
						alt=""
						height={48}
						width={48}
						className="mr-2 inline-block align-top"
					/>
					Snowball
				</h1>
				<h2>All in one tool for managing your website</h2>
			</div>
			<section className="grid grid-cols-2 gap-4 max-md:grid-cols-1 [&>div>h2]:mb-2 [&>div>h2]:text-2xl [&>div>h2]:font-semibold [&>div]:rounded-lg [&>div]:bg-white/5 [&>div]:p-6 [&_img]:float-left [&_img]:mr-4 [&_img]:size-[72px] [&_p]:italic">
				<div>
					<img src="/statistics.png" alt="" height={72} width={72} />
					<h2>Analytics</h2>
					<p>Real-time analytics to get insights</p>
				</div>
				<div>
					<img src="/warning.png" alt="" height={72} width={72} />

					<h2>Error Tracking</h2>
					<p>Get notified instantly when something goes wrong</p>
				</div>
				<div>
					<img src="/meter.png" alt="" height={72} width={72} />
					<h2>Uptime Monitoring</h2>
					<p>Get downtime alerts</p>
				</div>
				<div>
					<img src="/seo.png" alt="" height={72} width={72} />
					<h2>SEO Indexing</h2>
					<p>Manually submit index requests to google</p>
				</div>
				<div>
					<img src="/shield.png" alt="" height={72} width={72} draggable={false} />
					<h2>GDPR Compliant</h2>
					<p>No cookies are stored, so no need of a cookie banner</p>
				</div>
				<div>
					<img src="/file.png" alt="" height={72} width={72} />
					<h2>Export your data</h2>
					<p>Export your data in CSV & JSON formats</p>
				</div>
			</section>
			<Link
				to="/dash"
				className="rounded-lg border-2 border-white/60 bg-primary bg-gradient-to-r from-purple-600 to-red-400 px-6 py-3 text-xl font-bold"
			>
				View live demo
			</Link>
			<WaitList />
		</div>
	);
}
