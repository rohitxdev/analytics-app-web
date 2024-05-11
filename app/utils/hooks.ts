import { useRouteLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';

import { loader } from '../root';

export const useRootLoader = () => useRouteLoaderData<typeof loader>('root');

export const useUser = () => {
	const data = useRootLoader();
	return data?.user ?? null;
};

export const useLocale = () => {
	const data = useRootLoader();
	return data?.locale ?? 'en-GB';
};

export const usePointer = (element: HTMLElement | null) => {
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isInside, setIsInside] = useState(true);

	useEffect(() => {
		if (!element) return;

		const onPointerEnter = () => setIsInside(true);

		const onPointerMove = (e: PointerEvent) => setPosition({ x: e.clientX, y: e.clientY });

		const onPointerLeave = () => setIsInside(false);

		element.addEventListener('pointerenter', onPointerEnter);
		element.addEventListener('pointermove', onPointerMove);
		element.addEventListener('pointerleave', onPointerLeave);

		return () => {
			element.removeEventListener('pointerenter', onPointerEnter);
			element.removeEventListener('pointermove', onPointerMove);
			element.removeEventListener('pointerleave', onPointerLeave);
		};
	}, [element]);

	return { ...position, isInside };
};
