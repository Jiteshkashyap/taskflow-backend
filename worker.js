import mongoose from 'mongoose';
import { activityQueue } from './queue/activityQueue.js';
import Activity from './models/activity.model.js';

await mongoose.connect(process.env.CONNECTION_URI);

activityQueue.process(async job => {
  const { team, task, action, payload, createdBy, timestamp } = job.data;
  await Activity.create({
     team, task, action, payload, createdBy,
      createdAt: timestamp || Date.now() });
  
});
