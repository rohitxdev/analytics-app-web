import { useParams } from '@remix-run/react';
import { ComponentPropsWithRef } from 'react';
import { Button, ListBox, ListBoxItem, Popover, Select, SelectValue } from 'react-aria-components';
import { LuChevronDown } from 'react-icons/lu';
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
				<Button className="flex h-10 w-64 items-center gap-3 rounded-md px-4 py-2 text-sm font-semibold ring-1 ring-neutral-700">
					<SelectValue />
					<LuChevronDown className="ml-auto size-5" />
				</Button>
				<Popover>
					<ListBox className="w-64 rounded-md bg-dark text-sm font-medium ring-1 ring-neutral-700">
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
