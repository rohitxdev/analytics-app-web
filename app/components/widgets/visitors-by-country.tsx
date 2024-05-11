import { useEffect, useState } from 'react';
import { LuArrowUpDown, LuBarChart, LuMaximize2, LuPercent } from 'react-icons/lu';

import { ToggleButton } from '~/components/atoms/inputs';
import { numFormatter } from '~/utils/numbers';

import countryCodes from '../../assets/country-codes.json';
import WorldMap from '../../assets/world-map.min.svg';
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

export type CountryCode = keyof typeof countryCodes;

export const VisitorsByCountry = ({ data }: { data: KeyValue[] }) => {
	const [view, setView] = useState<'map' | 'graph'>('map');
	const [showPercent, setShowPercent] = useState(false);
	const [sortBy, setSortBy] = useState<Sort>('descending');
	const sortedData = data.sort((a, b) =>
		sortBy === 'ascending' ? a.value - b.value : b.value - a.value,
	);
	const maxWidth = Math.max(...data.map((item) => item.value));
	const sum = data.reduce((acc, curr) => acc + curr.value, 0);

	useEffect(() => {
		Object.entries(viewsByCountriesPercentage).forEach((entry) => {
			const country = document.getElementById(entry[0].toLowerCase());
			if (!country) return;
			country.style.fill = `hsl(243,75%,${(100 - entry[1]) * 0.59}%)`;
		});
	}, []);

	return (
		<Widget.Container>
			<div className="flex gap-1.5">
				<Widget.Title>Visitors by Country</Widget.Title>
				{view === 'map' ? (
					<div className="flex items-center justify-center gap-2 text-xs font-semibold text-neutral-300">
						<span>0%</span>
						<div className="h-2 w-24 rounded-sm bg-gradient-to-r from-white to-indigo-600"></div>
						<span>100% visits</span>
					</div>
				) : (
					<>
						<ToggleButton
							aria-label={`Sort by ${sortBy === 'ascending' ? 'descending' : 'ascending'} order`}
							onPress={() => setSortBy((val) => (val === 'ascending' ? 'descending' : 'ascending'))}
							isSelected={sortBy === 'ascending'}
						>
							<LuArrowUpDown size={18} />
						</ToggleButton>
						<ToggleButton
							aria-label={`Show ${showPercent ? 'values' : 'percent'}`}
							onPress={() => setShowPercent((val) => !val)}
							isSelected={showPercent}
						>
							<LuPercent size={18} />
						</ToggleButton>
					</>
				)}
				<ToggleButton
					aria-label={`Set ${view} view`}
					onPress={() => setView((val) => (val === 'map' ? 'graph' : 'map'))}
					isSelected={view === 'graph'}
				>
					<LuBarChart size={18} className="-rotate-90 -scale-y-100" />
				</ToggleButton>
				<ToggleButton>
					<LuMaximize2 />
				</ToggleButton>
			</div>
			<div className="relative">
				<WorldMap
					className={`absolute fill-transparent stroke-white stroke-1 p-2 [&_path:hover]:stroke-[3] [&_path:hover]:duration-100 ${view === 'graph' && 'pointer-events-none opacity-0'}`}
				/>
				<div
					className={`mt-2 grid aspect-[2/1] w-screen max-w-[600px] auto-rows-[2.5rem] gap-1 duration-150 ${view === 'map' && 'pointer-events-none opacity-0'}`}
				>
					{sortedData.map((item) => {
						return (
							<div
								key={item.key}
								className="flex items-center justify-between gap-4 rounded-md ring-white/10 hover:bg-white/5 hover:ring-1"
							>
								<div
									className="animate-grow-width flex items-center gap-2 rounded-r-md bg-indigo-600 p-2"
									style={{
										width: `${(item.value / maxWidth) * 100}%`,
									}}
								>
									<img
										alt={item.key}
										src={`https://flagsapi.com/${item.key}/flat/64.png`}
										className="w-6"
									/>
									<p className="animate-fade-in overflow-hidden text-ellipsis font-semibold">
										{item.key}
									</p>
								</div>
								<p className="animate-fade-in mr-4 min-w-[5ch] text-center text-sm font-semibold">
									{showPercent
										? `${((item.value / sum) * 100).toFixed(1)}%`
										: numFormatter.format(item.value)}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</Widget.Container>
	);
};
