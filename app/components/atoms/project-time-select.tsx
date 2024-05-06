import { useFetcher, useLocation, useNavigate, useParams, useSearchParams } from '@remix-run/react';
import { useEffect } from 'react';
import {
	Button,
	Label,
	ListBox,
	ListBoxItem,
	Popover,
	Select,
	SelectValue,
} from 'react-aria-components';
import { LuCalendar, LuChevronDown } from 'react-icons/lu';

import { getFaviconUrl } from '~/utils/misc';

import { TimePeriodSelect } from './time-period-select';

export const ProjectTimeSelect = () => {
	const fetcher = useFetcher();
	const { projectId } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();

	useEffect(() => {
		fetcher.load('/?index');
	}, []);

	return (
		<div className="ml-auto flex items-center gap-4">
			<Label className="flex items-center gap-2 text-sm font-semibold text-white">
				<LuCalendar size={20} />
				<TimePeriodSelect />
			</Label>
			<Select
				defaultSelectedKey={projectId}
				selectedKey={projectId}
				onSelectionChange={(key) => {
					navigate({
						pathname: location.pathname.replace(projectId!, key.toString()),
						search: searchParams.toString(),
					});
				}}
				className="flex w-64 items-center gap-2 text-sm font-semibold text-white"
			>
				<Button className="flex w-full rounded-md p-2 ring-white duration-100 focus:ring-1">
					<SelectValue />
					<LuChevronDown className="ml-auto self-center" aria-hidden />
				</Button>
				<Popover>
					<ListBox className="w-64 overflow-hidden rounded-md bg-dark ring-1 ring-white/10">
						{fetcher.data?.projects?.map((val) => (
							<ListBoxItem key={val.id} id={val.id} className="w-full  p-2 focus:bg-white/10">
								<img
									src={getFaviconUrl(val.baseUrl.replace('https://', ''))}
									alt=""
									height={32}
									width={32}
									className="mr-2 inline"
								/>{' '}
								{val.name}
							</ListBoxItem>
						))}
					</ListBox>
				</Popover>
			</Select>
		</div>
	);
};
