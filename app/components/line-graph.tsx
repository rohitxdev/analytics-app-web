import { ComponentPropsWithRef, useId } from 'react';
import { Button } from 'react-aria-components';
import { Line } from 'react-chartjs-2';
import { BsThreeDots } from 'react-icons/bs';

export const LineGraph = (props: Omit<ComponentPropsWithRef<typeof Line>, 'data' | 'options'>) => {
	const id = useId();

	// useEffect(() => {
	// 	const ctx = (document.getElementById(id) as HTMLCanvasElement).getContext('2d');
	// 	if (!ctx) return;
	// 	const gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
	// 	gradientStroke.addColorStop(0, '#80b6f4');
	// 	gradientStroke.addColorStop(1, '#f49080');
	// }, [id]);

	return (
		<section className="w-full max-w-[600px] space-y-4 self-stretch rounded-xl bg-white/5 p-4">
			<div className="flex justify-end gap-4">
				<Button>
					<BsThreeDots className="size-6" />
				</Button>
			</div>
			<Line
				id={id}
				data={{
					labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
					datasets: [
						{
							data: [
								{ x: 1, y: 8 },
								{ x: 2, y: 22 },
								{ x: 3, y: 25 },
								{ x: 4, y: 15 },
								{ x: 5, y: 12 },
								{ x: 6, y: 22 },
								{ x: 7, y: 7 },
								{ x: 8, y: 12 },
								{ x: 9, y: 26 },
								{ x: 10, y: 12 },
							],
							label: 'Project 1',
							fill: true,
						},
					],
				}}
				options={{
					plugins: {
						legend: {
							labels: {
								font: {
									family: 'Poppins',
									weight: 700,
								},
							},
						},
					},
					scales: {
						x: {
							ticks: {
								color: 'white',
							},
						},
						y: {
							ticks: {
								color: 'white',
							},
						},
					},
				}}
				{...props}
			/>
		</section>
	);
};
