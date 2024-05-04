import { useFetcher, useParams } from '@remix-run/react';
import { ComponentPropsWithRef, useEffect } from 'react';
import { Button, ComboBox, Input, ListBox, ListBoxItem, Popover } from 'react-aria-components';
import { LuChevronDown } from 'react-icons/lu';

import { getFaviconUrl } from '~/utils/misc';

export const ProjectSelect = (props: ComponentPropsWithRef<'div'>) => {
	const fetcher = useFetcher();
	const { projectId } = useParams();
	const projects = fetcher.data?.projects ?? [];

	useEffect(() => {
		fetcher.load('/?index');
	}, []);

	return (
		<div {...props}>
			<ComboBox
				onSelectionChange={(key) => {
					window.location.href = '/' + key?.toString();
				}}
				defaultSelectedKey={projectId}
			>
				<div>
					<Input className="rounded-md bg-white/10 px-2 py-1" />
					<Button>
						<LuChevronDown className="ml-2 inline scale-125" strokeWidth={3} />
					</Button>
				</div>
				<Popover>
					<ListBox className="w-[20ch] rounded-md bg-dark ring-1 ring-white/30 [&>*:focus]:bg-white/10">
						{projects.map((item, i) => (
							<ListBoxItem
								key={item.id}
								id={item.id}
								textValue={item.name}
								className="rounded-md focus:bg-white/20"
							>
								<img
									src={getFaviconUrl(item.baseUrl.replace('https://', ''))}
									alt=""
									className="mr-2 inline p-2"
									height={48}
									width={48}
								/>
								<span>{item.name}</span>
							</ListBoxItem>
						))}
					</ListBox>
				</Popover>
			</ComboBox>
		</div>
	);
};
