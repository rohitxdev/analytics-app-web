import { LuUser2 } from 'react-icons/lu';

import { numFormatter } from '~/utils/numbers';

export const NewUsers = () => {
	const newUsers = numFormatter.format(45630);
	return (
		<div className="flex w-fit flex-col items-center gap-1 rounded-xl bg-white/5 p-4 font-semibold">
			<LuUser2 className="size-10 rounded-full bg-green-200/20 p-2 text-green-400" />
			<p className="text-xl">+{newUsers}</p>
			<h2 className="text-sm text-neutral-400">New users</h2>
		</div>
	);
};
