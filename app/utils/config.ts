import { z } from 'zod';

export const GOOGLE_CLIENT_ID = z.string().parse(import.meta.env.VITE_GOOGLE_CLIENT_ID);
