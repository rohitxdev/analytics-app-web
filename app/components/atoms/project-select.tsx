import { useParams } from '@remix-run/react';
import { ComponentPropsWithRef } from 'react';
import { Button, ListBox, ListBoxItem, Popover, Select, SelectValue } from 'react-aria-components';
import { LuChevronsUpDown } from 'react-icons/lu';
import { z } from 'zod';

import { projectSchema } from '~/schemas/events';
import { getFaviconUrl } from '~/utils/misc';

interface ProjectSelectProps extends ComponentPropsWithRef<'div'> {
	projects: z.infer<typeof projectSchema>[];
}

export const ProjectSelect = ({ projects, ...rest }: ProjectSelectProps) => {
	const { projectId } = useParams();

	return (
		<div {...rest}>
			<Select
				defaultSelectedKey={projectId}
				onSelectionChange={(key) => {
					window.location.href = `/${key?.toString() ?? projectId}/overview`;
				}}
			>
				<Button className="flex h-10 w-52 items-center gap-3 divide-x-[1px] divide-neutral-700 rounded-md text-sm font-semibold ring-1 ring-neutral-700">
					<SelectValue className="p-2" />
					<div className="ml-auto flex aspect-square h-full items-center justify-center">
						<LuChevronsUpDown className="size-5" />
					</div>
				</Button>
				<Popover>
					<ListBox className="w-52 rounded-md bg-dark text-sm font-medium ring-1 ring-neutral-700">
						{projects.map((item) => (
							<ListBoxItem
								className="flex h-10 items-center rounded-md px-4 outline-none focus:bg-neutral-800"
								key={item.id}
								id={item.id}
								textValue={item.name}
							>
								<img
									className="mr-3 inline size-6"
									src={getFaviconUrl(new URL(item.baseUrl).hostname)}
									alt=""
								/>
								<span>{item.name}</span>
							</ListBoxItem>
						))}
					</ListBox>
				</Popover>
			</Select>
		</div>
	);
};
