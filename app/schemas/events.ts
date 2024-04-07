import { z } from 'zod';

export const viewsSchema = z.array(
	z.object({
		country: z.string(),
		os: z.string(),
		path: z.string().nullish(),
		referrer: z.string(),
		timestamp: z.string().nullish(),
		_id: z.string(),
	}),
);

export const errorEventSchema = z.object({
	projectId: z.string(),
	name: z.string(),
	description: z.string().optional(),
	stackTrace: z.string(),
	timestamp: z.coerce.date(),
	severityLevel: z.number().optional(),
});

export const uptimeEventSchema = z.object({
	projectId: z.string(),
	baseUrl: z.string().url(),
	isDown: z.boolean(),
	statusChanged: z.boolean(),
	timestamp: z.coerce.date(),
});

export const viewEventSchema = z.object({
	projectId: z.string(),
	path: z.string(),
	referrer: z.string(),
	country: z.string(),
	device: z.string(),
	os: z.string(),
	timestamp: z.coerce.date(),
});

export const projectSchema = z.object({
	id: z.string(),
	name: z.string(),
	baseUrl: z.string().url(),
	shouldMonitorUpTime: z.boolean(),
	ownerId: z.string(),
});
