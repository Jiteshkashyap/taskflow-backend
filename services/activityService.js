import { activityQueue } from "../queue/activityQueue";

export const addActivity=async(data)=>{
    await activityQueue.add('log',data)
}