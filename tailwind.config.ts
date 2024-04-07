import type { Config } from 'tailwindcss';
import ta from 'tailwindcss-animate';
import trac from 'tailwindcss-react-aria-components';

export default {
	content: ['./app/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				poppins: 'Poppins, system-ui',
				'space-grotesk': 'Space Grotesk, sans-serif',
			},
			fontSize: {
				'2xs': '0.65rem',
			},
			colors: {
				dark: '#101323',
				primary: '#00B389',
				white: '#FBFBFB',
				'pure-white': '#FFFFFF',
			},
		},
	},
	plugins: [trac, ta],
} satisfies Config;
