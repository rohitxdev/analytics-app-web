import { ComponentProps, useLayoutEffect, useState } from 'react';
import { IoGlobeOutline } from 'react-icons/io5';

import { getFaviconUrl, parseDomain } from '~/utils/misc';

interface FaviconProps extends Omit<ComponentProps<'img'>, 'src' | 'alt' | 'onError'> {
	websiteUrl: string;
}

export const Favicon = ({ websiteUrl, ...rest }: FaviconProps) => {
	const [domain, setDomain] = useState<string | null>(null);
	const [isError, setIsError] = useState(false);

	useLayoutEffect(() => {
		try {
			const { fullDomain } = parseDomain(websiteUrl);
			setDomain(fullDomain);
		} catch (error) {
			setIsError(true);
		}
	}, [websiteUrl]);

	if (isError || !domain) {
		return <IoGlobeOutline size={24} className={rest.className} />;
	}

	return (
		<img
			src={getFaviconUrl(domain)}
			alt={`${domain}'s favicon`}
			onError={() => setIsError(true)}
			{...rest}
		/>
	);
};
