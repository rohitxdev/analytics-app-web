import { z, ZodError, ZodSchema } from 'zod';

export const logDoge = () => {
	console.info(
		`%c         ▄              ▄    
        ▌▒█           ▄▀▒▌   
        ▌▒▒█        ▄▀▒▒▒▐   
       ▐▄█▒▒▀▀▀▀▄▄▄▀▒▒▒▒▒▐   
     ▄▄▀▒▒▒▒▒▒▒▒▒▒▒█▒▒▄█▒▐   
   ▄▀▒▒▒░░░▒▒▒░░░▒▒▒▀██▀▒▌   
  ▐▒▒▒▄▄▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▀▄▒▌  
  ▌░░▌█▀▒▒▒▒▒▄▀█▄▒▒▒▒▒▒▒█▒▐  
 ▐░░░▒▒▒▒▒▒▒▒▌██▀▒▒░░░▒▒▒▀▄▌ 
 ▌░▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░▒▒▒▒▌ 
▌▒▒▒▄██▄▒▒▒▒▒▒▒▒░░░░░░░░▒▒▒▐ 
▐▒▒▐▄█▄█▌▒▒▒▒▒▒▒▒▒▒░▒░▒░▒▒▒▒▌
▐▒▒▐▀▐▀▒▒▒▒▒▒▒▒▒▒▒▒▒░▒░▒░▒▒▐ 
 ▌▒▒▀▄▄▄▄▄▄▒▒▒▒▒▒▒▒░▒░▒░▒▒▒▌ 
 ▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░▒░▒▒▄▒▒▐  
  ▀▄▒▒▒▒▒▒▒▒▒▒▒▒▒░▒░▒▄▒▒▒▒▌  
    ▀▄▒▒▒▒▒▒▒▒▒▒▄▄▄▀▒▒▒▒▄▀   
      ▀▄▄▄▄▄▄▀▀▀▒▒▒▒▒▄▄▀     
         ▀▀▀▀▀▀▀▀▀▀▀▀        %c such console, much wow.`,
		'background: #d9bd62; color: black;',
		'color: white;',
	);
};

export const timePeriodSchema = z.enum(['24h', '7d', '1m', '6m', '1y']);

export type TimePeriod = z.infer<typeof timePeriodSchema>;

export const getTimestampsFromTimePeriod = (timePeriod: TimePeriod) => {
	const startDate = new Date();
	startDate.setHours(0, 0, 0, 0);

	const endDate = new Date();
	endDate.setHours(0, 0, 0, 0);

	switch (timePeriod) {
		case '24h':
			startDate.setDate(endDate.getDate() - 1);
			break;
		case '7d':
			startDate.setDate(endDate.getDate() - 7);
			break;
		case '1m':
			startDate.setDate(endDate.getDate() - 30);
			break;
		case '6m':
			startDate.setDate(endDate.getDate() - 180);
			break;
		case '1y':
			startDate.setDate(endDate.getDate() - 365);
			break;
		default:
			break;
	}

	return { startDate, endDate };
};

export const parseFormData = (formData: FormData, schema: ZodSchema) => {
	try {
		const data = Object.fromEntries(formData.entries());
		return schema.parse(data);
	} catch (error) {
		if (error instanceof ZodError) {
			return error.errors;
		}
		return null;
	}
};

const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity] as const;
const timeUnits: Intl.RelativeTimeFormatUnit[] = [
	'second',
	'minute',
	'hour',
	'day',
	'week',
	'month',
	'year',
] as const;

const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

export const getRelativeTimeString = (date: Date | number) => {
	const timeMs = typeof date === 'number' ? date : date.getTime();

	const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);

	const unitIndex = cutoffs.findIndex((cutoff) => cutoff > Math.abs(deltaSeconds));

	const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;

	return rtf.format(Math.floor(deltaSeconds / (divisor ?? 1)), timeUnits[unitIndex] ?? 'year');
};

export const timeFormatter = new Intl.DateTimeFormat(locale, { timeStyle: 'short' });

export const getFaviconUrl = (domain: string, size?: number) => {
	const url = new URL('https://www.google.com/s2/favicons');
	url.searchParams.set('domain', domain);
	url.searchParams.set('sz', (size ? size : 40).toString(10));
	return url.toString();
};

interface Domain {
	subDomain?: string;
	domainName: string;
	tld: string;
	fullDomain: string;
}

export const parseDomain = (text: string): Domain => {
	let domain = text;
	if (text.startsWith('http://') || text.startsWith('https://')) {
		domain = new URL(text).hostname;
	}
	const parts = domain.split('.');
	switch (parts.length) {
		case 3:
			return {
				domainName: parts[1]!,
				tld: parts[2]!,
				fullDomain: domain,
			};
		case 2:
			return {
				domainName: parts[0]!,
				tld: parts[1]!,
				fullDomain: domain,
			};
		default:
			if (parts.length > 3) {
				return {
					subDomain: parts.slice(0, -2).join('.'),
					domainName: parts.at(-2)!,
					tld: parts.at(-1)!,
					fullDomain: domain,
				};
			}
			return {
				domainName: domain,
				tld: domain,
				fullDomain: domain,
			};
	}
};
