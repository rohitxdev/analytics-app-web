import { useEffect } from 'react';

import WorldMap from '../assets/world-map.min.svg';
import { TimePeriodSelect } from './atoms/time-period-select';

const viewsByCountriesPercentage = {
	AU: 6,
	US: 47,
	IN: 32,
	JP: 15,
	BR: 18,
	FR: 20,
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
		<section className="aspect-video rounded-xl bg-white/5 p-4 text-center">
			<div className="mb-4 flex justify-between">
				<h2 className="text-xl font-semibold">Viewers by country</h2>
				<TimePeriodSelect />
			</div>
			<WorldMap width={600} className="fill-white" />
		</section>
	);
};
