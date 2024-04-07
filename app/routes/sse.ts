import { LoaderFunctionArgs } from '@remix-run/node';
import { eventStream } from 'remix-utils/sse/server';

import { getRandomNumber } from '~/utils/numbers';

export const loader = async (args: LoaderFunctionArgs) => {
	return eventStream(args.request.signal, (send) => {
		const timer = setInterval(() => {
			send({ event: 'error', data: getRandomNumber(1, 1000).toString() });
		}, 1000);

		return () => {
			clearInterval(timer);
			console.log('Connection closed');
		};
	});
};
