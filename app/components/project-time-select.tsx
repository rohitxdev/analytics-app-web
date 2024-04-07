import { useRouteLoaderData, useSearchParams } from '@remix-run/react';
import { useEffect } from 'react';
import { Label } from 'react-aria-components';

import { Select, SelectItem } from '~/components/react-aria/Select';

import { TimePeriodSelect } from './atoms/time-period-select';

interface Project {
	id: string;
	name: string;
}

export const ProjectTimeSelect = () => {
	const data = useRouteLoaderData<{ projects: Project[] }>('routes/dash');
	const [searchParams, setSearchParams] = useSearchParams();
	const projectId = searchParams.get('projectId') ?? '';

	useEffect(() => {
		setSearchParams((params) => {
			params.set('projectId', projectId);
			return params;
		});
	}, [projectId, searchParams, setSearchParams]);

	return (
		<div className="ml-auto flex items-center gap-4">
			<Label className="flex items-center gap-2 text-sm font-semibold text-white">
				Time period
				<TimePeriodSelect />
			</Label>
			<Label className="flex items-center gap-2 text-sm font-semibold text-white">
				Project
				<Select
					defaultSelectedKey={projectId}
					selectedKey={projectId}
					onSelectionChange={(key) => {
						setSearchParams((params) => {
							params.set('projectId', key.toString());
							return params;
						});
					}}
				>
					{data?.projects.map((val) => (
						<SelectItem id={val.id} key={val.id}>
							{val.name}
						</SelectItem>
					))}
				</Select>
			</Label>
		</div>
	);
};
