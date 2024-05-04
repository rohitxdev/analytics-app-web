import { ComponentPropsWithRef } from 'react';

import VorpIcon from '~/assets/vorp-bw.svg';

export const CopyrightText = ({ className, ...rest }: ComponentPropsWithRef<'p'>) => {
	const currentYear = new Date().getFullYear();

	return (
		<p className={`text-xs font-medium text-neutral-300 ${className}`} {...rest}>
			&copy;&nbsp;{currentYear} Vorp. All rights reserved.
		</p>
	);
};

export const LogoText = ({ className, ...rest }: ComponentPropsWithRef<'div'>) => (
	<div className={`flex items-center gap-4 fill-white ${className}`} {...rest}>
		<VorpIcon height={48} width={48} className="fill-inherit" />
		<span className="text-5xl font-bold">Vorp</span>
	</div>
);
