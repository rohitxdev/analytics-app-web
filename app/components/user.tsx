import { Form, Link } from '@remix-run/react';
import { ComponentProps } from 'react';
import { Button, Dialog, DialogTrigger, Modal } from 'react-aria-components';
import { LuLogOut } from 'react-icons/lu';

import { useUser } from '~/utils/hooks';

export const User = ({ className, ...rest }: ComponentProps<'section'>) => {
	const user = useUser();
	const profilePic = user?.pictureUrl ?? `https://api.dicebear.com/7.x/lorelei/svg?seed=6969`;

	return (
		<section
			aria-label="User"
			className={`flex h-32 items-center justify-center gap-4 ring-1 ring-neutral-700 ${className}`}
			{...rest}
		>
			<Link to="/account" className="flex items-center gap-4 font-medium hover:underline">
				<img src={profilePic} alt="" height={36} width={36} className="rounded-full bg-black/30" />
				{user?.fullName ?? user?.email}
			</Link>
			<DialogTrigger>
				<Button className="ml-6">
					<LuLogOut size={20} />
				</Button>
				<Modal
					isDismissable
					className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-content-center"
				>
					<Dialog className="flex w-80 flex-wrap items-start gap-2 rounded-xl bg-white p-4 text-black [&_button]:h-8 [&_button]:w-20">
						{({ close }) => (
							<>
								<h2 className="mb-4 text-xl font-bold">Do you want to log out?</h2>
								<button
									onClick={close}
									className="ml-auto inline-block rounded-md border border-red-500 font-semibold text-red-500"
								>
									No
								</button>
								<Form method="POST" action="/auth/log-out" className="inline-block">
									<button type="submit" className="rounded-md bg-red-500 font-semibold text-white">
										Yes
									</button>
								</Form>
							</>
						)}
					</Dialog>
				</Modal>
			</DialogTrigger>
		</section>
	);
};
