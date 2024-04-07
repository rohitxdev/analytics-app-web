/// <reference types="./app/types/svg.d.ts" />
/// <reference types="@remix-run/node" />
/// <reference types="vite/client" />

import { envVariables } from './server.js';

type Env = typeof envVariables;

declare global {
	namespace NodeJS {
		interface ProcessEnv extends Env {}
	}
}
