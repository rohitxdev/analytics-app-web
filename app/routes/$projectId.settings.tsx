import { ActionFunctionArgs } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { useState } from 'react';
import {
	Button,
	FileTrigger,
	Input,
	Label,
	TextField,
	TooltipTrigger,
} from 'react-aria-components';
import toast from 'react-hot-toast';
import { LiaEditSolid } from 'react-icons/lia';
import { LuLogOut, LuSave } from 'react-icons/lu';

import { Tooltip } from '~/components/react-aria/Tooltip';
import { userPreferencesSchema } from '~/schemas/auth';
import { getSession, getUserFromSession } from '~/utils/auth.server';
import { usersCollection } from '~/utils/database.server';
import { useUser } from '~/utils/hooks';

import { Switch } from '../components/atoms/switch';
import { Select, SelectItem } from '../components/react-aria/Select';

export const action = async (args: ActionFunctionArgs) => {
	const session = await getSession(args.request.headers.get('Cookie'));
	if (!session.has('userId')) return null;
	const user = await getUserFromSession(session);
	if (!user) return null;

	const formData = await args.request.formData();
	console.log(formData.get('should-send-email-reports') === 'on');

	switch (args.request.method) {
		case 'PUT': {
			await usersCollection.findOneAndUpdate(
				{ email: user.email },
				{
					$set: {
						fullName: formData.get('full-name')?.toString(),
						preferences: userPreferencesSchema.parse({
							shouldSendEmailReports: formData.get('should-send-email-reports') === 'on',
							analyticsReportsFrequency:
								formData.get('analytics-reports-frequency') ??
								user.preferences.analyticsReportsFrequency,
							errorReportsFrequency:
								formData.get('error-reports-frequency') ?? user.preferences.errorReportsFrequency,
						}),
					},
				},
				{ ignoreUndefined: true },
			);
			return null;
		}
		default:
			break;
	}
	return null;
};

export default function Route() {
	const user = useUser();
	const [profilePic, setProfilePic] = useState(
		user?.pictureUrl ?? `https://api.dicebear.com/7.x/lorelei/svg?seed=6969`,
	);
	const [isChanged, setIsChanged] = useState(false);
	const preferences = user?.preferences;

	return (
		<section className="flex flex-col gap-4 p-4 font-semibold">
			<Form method="PUT" className="flex w-fit flex-col gap-2">
				<div className="group relative w-fit">
					<FileTrigger
						acceptedFileTypes={['image/*']}
						onSelect={(files) => {
							const file = files?.item(0);
							if (!file) return;
							setProfilePic(URL.createObjectURL(file));
						}}
					>
						<img
							src={profilePic}
							alt=""
							height={80}
							width={80}
							className="size-[80px] rounded-full bg-white/5 object-cover p-2"
						/>
						<Button className="pointer-events-none absolute left-1/2 top-1/2 flex size-[80px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 opacity-0 duration-100 group-hover:pointer-events-auto group-hover:opacity-100 group-focus:pointer-events-auto group-focus:opacity-100">
							<LiaEditSolid />
						</Button>
					</FileTrigger>
				</div>
				<TooltipTrigger delay={100}>
					<Button className="[all:unset]">
						<TextField
							isDisabled
							defaultValue={user?.email ?? 'user@gmail.com'}
							className="flex flex-col"
						>
							<Label className="text-neutral-400">Email</Label>
							<Input className="w-[30ch] rounded-md bg-white/20 px-3 py-2 text-lg disabled:brightness-[60%]" />
						</TextField>
					</Button>
					<Tooltip placement="bottom">
						<span className="flex items-center text-xs text-neutral-100 opacity-75">
							Email cannot be changed
						</span>
					</Tooltip>
				</TooltipTrigger>
				<TextField
					name="full-name"
					defaultValue={user?.fullName ?? 'Set your name'}
					className="flex flex-col"
				>
					<Label className="text-neutral-400">Full name</Label>
					<div className="flex items-center">
						<Input
							required
							className="w-[30ch] rounded-l-md bg-white/20 px-3 py-2 text-lg"
							onInput={(e) => {
								setIsChanged(e.currentTarget.value.trim() !== user?.fullName);
							}}
						/>
						<Button
							className="h-full rounded-r-md bg-white/20 px-2 disabled:text-neutral-400"
							onPress={() => toast.success('Saved changes!')}
							isDisabled={!isChanged}
						>
							<LuSave size={24} />
						</Button>
					</div>
				</TextField>
				<hr className="my-5 w-full border-white/40" />
				<div className="flex items-center gap-2 text-lg">
					<h3>Email reports</h3>
					<Switch
						name="should-send-email-reports"
						defaultSelected={preferences?.shouldSendEmailReports}
						onChange={() => setIsChanged(true)}
					/>
				</div>
				<Select
					label="Errors email report frequency"
					name="error-reports-frequency"
					defaultSelectedKey={preferences?.errorReportsFrequency ?? 'weekly'}
					isDisabled={!preferences?.shouldSendEmailReports}
					onSelectionChange={() => setIsChanged(true)}
				>
					<SelectItem id="off">Off</SelectItem>
					<SelectItem id="daily">Daily</SelectItem>
					<SelectItem id="weekly">Weekly</SelectItem>
					<SelectItem id="monthly">Monthly</SelectItem>
				</Select>
				<Select
					label="Analytics email report frequency"
					name="analytics-reports-frequency"
					defaultSelectedKey={preferences?.analyticsReportsFrequency ?? 'weekly'}
					isDisabled={!preferences?.shouldSendEmailReports}
					onSelectionChange={() => setIsChanged(true)}
				>
					<SelectItem id="off">Off</SelectItem>
					<SelectItem id="daily">Daily</SelectItem>
					<SelectItem id="weekly">Weekly</SelectItem>
					<SelectItem id="monthly">Monthly</SelectItem>
				</Select>
				<Button className="flex w-fit items-center gap-2 rounded-lg bg-red-200/10 px-4 py-2 text-red-400">
					Log Out <LuLogOut />
				</Button>
				<section>
					<h3>Billing</h3>
					<div className="mt-2">
						<Button className="flex w-fit items-center gap-2 rounded-lg bg-red-200/10 px-4 py-2 text-red-400">
							Cancel subscription
						</Button>
					</div>
				</section>
				<section>
					<h3>Accessibility</h3>
					<ul className="mt-2 flex justify-between">
						<li>Animations</li>
						<Switch
							name="graph-animations-enabled"
							defaultSelected={preferences?.graphAnimationsEnabled}
							onChange={() => setIsChanged(true)}
						/>
					</ul>
				</section>
			</Form>
		</section>
	);
}
