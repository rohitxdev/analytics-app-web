export const WaitList = () => {
	return (
		<div className="flex w-full max-w-[400px] flex-col items-center gap-8 rounded-lg bg-white/5 p-4 text-center font-semibold ring-1 ring-white/30">
			<div>
				<h3 className="text-2xl">Join the waitlist</h3>
				<p className="mt-2 text-sm text-neutral-400">
					Pre-launch users get 2 months of analytics for free
				</p>
			</div>
			<div className="flex gap-2 text-base [&>*]:rounded-md">
				<input
					type="email"
					className="border-none bg-neutral-200 px-3 py-2 text-black
				outline-none outline-1 placeholder:text-neutral-600 focus:outline-primary"
					placeholder="Enter your email"
				/>
				<button className="bg-primary px-4 py-2 font-bold">Join</button>
			</div>
		</div>
	);
};
