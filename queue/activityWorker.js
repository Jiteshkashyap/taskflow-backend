import { Worker } from "bullmq";
import fs from'fs';
import redis from "../config/redis";
import path from "path";

const logPath=path.join(process.cwd(), 'activity_log.txt')

export const activityWorker= new Worker(
    "activity-log-queue",
    async(job)=>{
        const log= `[${new Date().toISOString()}]${job.data.message}\n`

        fs.appendFileSync(logPath,log)

        console.log('Activity Logged:',log)
    },{connection:redis}
)
activityWorker.on("failed",(job,err)=>{
    console.log(`Activity failed: ${err.message}`)
})