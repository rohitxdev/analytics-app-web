import { useEffect } from 'react';

import countryCodes from '../../assets/country-codes.json';
import WorldMap from '../../assets/world-map.min.svg';
import { Widget } from '../atoms/widget';
import { BarGraph } from './top-stats';

const viewsByCountriesPercentage = {
	AU: 6,
	US: 47,
	IN: 32,
	JP: 15,
	BR: 18,
	FR: 20,
	GA: 8,
};

export type CountryCode = keyof typeof countryCodes;

export const VisitorsByCountry = ({ data }: { data: KeyValue[] }) => {
	useEffect(() => {
		Object.entries(viewsByCountriesPercentage).forEach((entry) => {
			const country = document.getElementById(entry[0].toLowerCase());
			if (!country) return;
			country.style.fill = `hsl(210,100%,${100 - entry[1]}%)`;
		});
	}, []);

	return (
		<Widget.Container className="aspect-video text-center">
			<div className="mb-4 flex justify-between">
				<Widget.Title>Visitors by Country</Widget.Title>
			</div>
			<WorldMap
				width={550}
				className="fill-transparent stroke-white stroke-1 [&_path:hover]:fill-white/30"
			/>
			<BarGraph
				name="Country"
				data={data}
				labelIcon={(key) => (
					<img alt={key} src={`https://flagsapi.com/${key}/flat/64.png`} className="w-6" />
				)}
			/>
		</Widget.Container>
	);
};
