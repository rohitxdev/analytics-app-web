import { useEffect } from 'react';

import WorldMap from '../../assets/world-map.min.svg';
import { TimePeriodSelect } from '../atoms/time-period-select';
import { Widget } from '../atoms/widget';

const viewsByCountriesPercentage = {
	AU: 6,
	US: 47,
	IN: 32,
	JP: 15,
	BR: 18,
	FR: 20,
	GA: 8,
};

export const UsersByCountry = () => {
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
				<Widget.Title>Viewers by country</Widget.Title>
				<TimePeriodSelect />
			</div>
			<WorldMap
				width={550}
				className="fill-transparent stroke-white stroke-1 [&_path:hover]:fill-white/30"
			/>
		</Widget.Container>
	);
};
