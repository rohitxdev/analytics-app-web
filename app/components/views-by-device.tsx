import { Pie } from 'react-chartjs-2';

import AndroidUrl from '../assets/android.svg?url';
import iOsUrl from '../assets/apple.svg?url';
import chromeUrl from '../assets/chrome.svg?url';
import firefoxUrl from '../assets/firefox.svg?url';

export const UsersByDevice = ({ devicesCounter }: { devicesCounter: Record<string, number> }) => {
	return (
		<section className="flex flex-col gap-2 rounded-xl bg-white/5 p-4 text-center font-semibold">
			<h2 className="text-xl">Users by device</h2>
			<Pie
				data={{
					labels: Object.keys(devicesCounter),
					datasets: [
						{
							label: 'My First Dataset',
							data: Object.values(devicesCounter),
							backgroundColor: ['rgb(113, 198, 224)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
						},
					],
				}}
			/>
			<div className="flex justify-center gap-2">
				<img src={AndroidUrl} alt="" height={24} width={24} />
				<img src={iOsUrl} alt="" height={24} width={24} />
				<img src={chromeUrl} alt="" height={24} width={24} />
				<img src={firefoxUrl} alt="" height={24} width={24} />
			</div>
		</section>
	);
};
