import type { Config } from 'tailwindcss';
import ta from 'tailwindcss-animate';
import trac from 'tailwindcss-react-aria-components';

export default {
	content: ['./app/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				inter: 'Inter, sans-serif',
				rubik: 'Rubik, sans-serif',
			},
			fontSize: {
				'2xs': '0.65rem',
			},
			colors: {
				dark: '#0E0E11',
				light: '#F4F5F8',
				secondary: '#D6FFF6',
				eucalyptus: {
					'50': '#edfff8',
					'100': '#d4ffef',
					'200': '#acffe1',
					'300': '#6bffcc',
					'400': '#24ffaf',
					'500': '#00ef91',
					'600': '#00c775',
					'700': '#009b5f',
					'800': '#028556',
					'900': '#046343',
					'950': '#003823',
				},
			},
		},
	},
	plugins: [trac, ta],
} satisfies Config;
