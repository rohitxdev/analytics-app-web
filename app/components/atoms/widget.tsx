import { ComponentProps } from 'react';

export const Widget = {
	Container: ({ className, children, ...rest }: ComponentProps<'section'>) => {
		return (
			<section
				className={`rounded-lg border border-neutral-400/10 bg-neutral-400/5 fill-indigo-600 p-4 ${className}`}
				{...rest}
			>
				{children}
			</section>
		);
	},
	Title: ({ className, children, ...rest }: ComponentProps<'h2'>) => {
		return (
			<h2
				className={`mr-auto flex items-center gap-1 text-center text-xl font-bold ${className}`}
				{...rest}
			>
				{children}
			</h2>
		);
	},
};
