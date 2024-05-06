import { Form } from '@remix-run/react';
import { ComponentProps, useState } from 'react';
import { Button, Dialog, DialogTrigger, OverlayArrow, Popover } from 'react-aria-components';
import { FaUser, FaUsers } from 'react-icons/fa';
import { LuChevronDown, LuLogOut } from 'react-icons/lu';

import { useRootLoader } from '~/utils/hooks';

export const User = ({ className, ...rest }: ComponentProps<'section'>) => {
	const data = useRootLoader();
	const user = data?.user;
	const profilePic = user?.pictureUrl ?? `https://api.dicebear.com/7.x/lorelei/svg?seed=6969`;
	const [isOpen, setIsOpen] = useState(false);

	return (
		<section aria-label="User" className={`flex items-center ${className}`} {...rest}>
			<DialogTrigger isOpen={isOpen} onOpenChange={() => setIsOpen((x) => !x)}>
				<Button>
					<img
						src={profilePic}
						alt=""
						height={48}
						width={48}
						className="inline select-none rounded-full bg-black/30"
					/>
					<Popover
						className="translate-y-2 data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:fade-in data-[exiting]:fade-out"
						placement="bottom"
					>
						<OverlayArrow>
							<div className="border-[8px] border-x-transparent border-b-neutral-200 border-t-transparent"></div>
						</OverlayArrow>
						<Dialog className="flex flex-col rounded-md bg-neutral-200 py-1 text-sm font-semibold text-dark *:px-4 *:py-2">
							<Button>
								<FaUser className="mr-2 inline" size={20} /> Account
							</Button>
							<Button>
								<FaUsers className="mr-2 inline" size={20} /> Teams
							</Button>
							<Form method="POST" action="/log-out">
								<Button type="submit" className="w-full">
									<LuLogOut className="mr-2 inline" size={20} />
									Log out
								</Button>
							</Form>
						</Dialog>
					</Popover>
				</Button>
				<button onClick={() => setIsOpen((x) => !x)} className="ml-2 scale-125">
					<LuChevronDown strokeWidth={3} />
				</button>
			</DialogTrigger>
		</section>
	);
};
