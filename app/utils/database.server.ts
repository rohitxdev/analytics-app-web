import { MongoClient } from 'mongodb';
import { z } from 'zod';

import { userSchema } from '~/schemas/auth';
import {
	errorEventSchema,
	projectSchema,
	uptimeEventSchema,
	viewEventSchema,
} from '~/schemas/events';

const mongoClient = new MongoClient(process.env.MONGODB_URL!, {
	connectTimeoutMS: 5000,
	monitorCommands: true,
});

const connectToDb = async () => {
	try {
		await mongoClient.connect();
		console.log('connected to mongodb successfully ✔');
	} catch (error) {
		console.error(error);
		console.error('could not connect to mongodb. Trying again...');
		await connectToDb();
	}
};

console.log('connecting to mongodb...');
await connectToDb();

const db = mongoClient.db('app_db');

export const errorEventsCollection =
	db.collection<z.infer<typeof errorEventSchema>>('error_events');

export const uptimeEventsCollection =
	db.collection<z.infer<typeof uptimeEventSchema>>('uptime_events');

export const viewEventsCollection = db.collection<z.infer<typeof viewEventSchema>>('view_events');

export const usersCollection = db.collection<z.infer<typeof userSchema>>('users');

export const projectsCollection = db.collection<z.infer<typeof projectSchema>>('projects');
