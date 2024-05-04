import { ComponentPropsWithRef } from 'react';
import {
	Bar,
	BarChart,
	Label,
	LabelList,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

import { numFormatter } from '~/utils/numbers';

import { Favicon } from '../atoms/favicon';
import { Widget } from '../atoms/widget';

interface TopSourcesProps extends ComponentPropsWithRef<'section'> {
	data: Record<string, number>;
}

export const TopSources = ({ data, className, ...rest }: TopSourcesProps) => {
	const _data = Object.entries(data)
		.map((item) => ({ key: item[0], value: item[1] }))
		.concat([
			{ key: 'google.com', value: 4300 },
			{ key: 'instagram.com', value: 2800 },
			{ key: 'facebook.com', value: 2400 },
			{ key: 'reddit.com', value: 2300 },
			{ key: 'tiktok.com', value: 2200 },
		])
		.sort((a, b) => b.value - a.value);

	return (
		<Widget.Container className={`flex flex-col gap-2 ${className}`} {...rest}>
			<Widget.Title>Top Sources</Widget.Title>
			<ResponsiveContainer height={300} width={600}>
				<BarChart data={_data} barCategoryGap={'8%'} layout="vertical" margin={{ bottom: 16 }}>
					<XAxis dataKey="value" type="number" stroke="#c4c4c4" className="text-sm not-italic">
						<Label value="views" className="fill-white font-semibold" position="bottom" />
					</XAxis>
					<YAxis
						dataKey="key"
						type="category"
						stroke="#c4c4c4"
						width={0}
						className=" fill-slate-400 text-sm not-italic"
					/>
					<Tooltip
						animationDuration={100}
						content={({ payload, label }) => {
							if (!payload) return null;
							const data = payload[0];
							if (!data) return null;

							return (
								<div className="rounded bg-dark p-2 text-xs font-semibold text-white ring-1 ring-white/30">
									<p>{`${label}: ${numFormatter.format(Number(data.value))} views`}</p>
								</div>
							);
						}}
						itemStyle={{ backgroundColor: 'transparent' }}
						cursor={
							<foreignObject>
								<div className="size-full rounded border border-neutral-700 bg-neutral-800"></div>
							</foreignObject>
						}
					/>
					<Bar dataKey="value" radius={[0, 4, 4, 0]}>
						<LabelList
							dataKey="key"
							content={(props) => {
								const { x, y, width, height, index, value } = props;
								if (index === undefined) return null;
								const domain = value?.toString();
								const views = _data[index]?.value;
								if (!domain || !views) return null;
								return (
									<foreignObject x={x} y={y} width={'100%'} height={height}>
										<div className="flex items-center">
											<div
												className="flex h-full items-center justify-start gap-2 px-2 py-1 fade-in"
												style={{ width, height }}
											>
												<Favicon
													websiteUrl={domain}
													height={32}
													width={32}
													draggable={false}
													className="select-none object-contain"
												/>
												<p className="overflow-hidden text-ellipsis text-sm font-semibold not-italic">
													{domain}
												</p>
											</div>
											<div className="ml-auto px-2">
												<p>{numFormatter.format(views)}</p>
											</div>
										</div>
									</foreignObject>
								);
							}}
							position="center"
						/>
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</Widget.Container>
	);
};
