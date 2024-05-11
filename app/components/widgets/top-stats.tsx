import { ComponentPropsWithRef } from 'react';
import { LuExternalLink } from 'react-icons/lu';

import { getFaviconUrl } from '~/utils/misc';

import globeSrc from '../../assets/globe.svg?url';
import { BarGraph } from '../atoms/bar-graph';
import { Image } from '../atoms/image';

interface TopStatsProps extends ComponentPropsWithRef<'div'> {
	data: KeyValue[];
}

export const TopSources = ({ data, ...rest }: TopStatsProps) => {
	return (
		<BarGraph
			data={data}
			name="Top Sources"
			leftTitle="Referrer"
			rightTitle="Visits"
			barContent={({ key }) => (
				<>
					<Image
						src={getFaviconUrl(key)}
						fallbackSrc={globeSrc}
						className="animate-fade-in size-6"
						style={{ filter: 'drop-shadow(0 4px 4px rgb(0 0 0 / 0.25))' }}
					/>
					<p className="animate-fade-in overflow-hidden text-ellipsis font-semibold">{key}</p>
				</>
			)}
			{...rest}
		/>
	);
};

export const TopPages = ({ data, ...rest }: TopStatsProps) => {
	return (
		<BarGraph
			data={data}
			name="Top Pages"
			leftTitle="Page"
			rightTitle="Visits"
			barContent={({ key }) => (
				<div className="group flex w-full items-center gap-2 overflow-hidden">
					<p className="animate-fade-in overflow-hidden text-ellipsis font-semibold">{key}</p>
					<a href={key}>
						<LuExternalLink className="invisible group-hover:visible" />
					</a>
				</div>
			)}
			{...rest}
		/>
	);
};
