import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [
		svgr({
			include: '**/*.svg',
		}),
		remix(),
		tsconfigPaths(),
	],
	optimizeDeps: {
		esbuildOptions: {
			target: 'esnext',
		},
	},
	build: {
		target: 'esnext',
	},
});
