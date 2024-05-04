import { Link } from '@remix-run/react';

import SubmarineVector from '../assets/submarine.svg';

export default function Route() {
	return (
		<div className="flex flex-col items-center justify-center gap-8 text-center">
			<SubmarineVector className="w-full max-w-96 p-4" />
			<h1 className="text-[8rem] font-bold leading-none">404</h1>
			<h2 className="text-3xl font-semibold">You have found a secret place.</h2>
			<p className="text-xl font-medium">
				Unfortunately, this is only a 404 page. You may have mistyped the address, or the page has
				been moved to another URL.
			</p>
			<Link to={{ pathname: '/' }} className="rounded-full bg-indigo-600 px-6 py-2 font-semibold">
				Go back to home page
			</Link>
		</div>
	);
}
