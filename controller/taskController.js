import { taskModel } from "../model/taskModel.js";
import { teamModel } from "../model/teamModel.js";
import { userModel } from "../model/userModel.js";
import { cacheGet,cacheSet,delByPattern } from "../utils/cache.js";
import { activityQueue } from "../queue/activityQueue.js";




export const createTask=async(req,res,next)=>{
    try{
    const {teamId}=req.params
    const{title,description,assignedTo}=req.body
    const userId=req.id

    const task = await taskModel.create({
        teamId:teamId,
        title,
        description:description,
        assignedTo:assignedTo|| null,
        createdBy:userId
    })

    await activityQueue.add('task',{
         team:teamId,
         task:task._id,
         action:'CREATED',
         payload:{title , assignedTo},
         createdBy:userId,
         timestamps:Date.now()

    })

    await delByPattern(`team:${teamId}:tasks*`)
    return res.status(201).json({
        success:true,
        message:"Task created succesfully",
        data:task
    })
   }catch(err){
        next(err)
   }
}

export const getTask=async(req,res,next)=>{
    try{
    const {teamId,taskId}=req.params

    const task =await taskModel.findById({_id:taskId}).populate('assignedTo' , 'name email')
    if(!task){
        return res.status(404).json({
            success:false,
            message:"Task not found "
        })
    }
    return res.status(200).json({
        success:true,
        data:task
    })}catch(err){
        next(err)
    }
}

export const deleteTask=async(req,res,next)=>{
try{
    const {teamId,taskId} =req.params
    

    const task =await taskModel.findOneAndDelete({_id:taskId,teamId})
    if(!task){
        return res.status(404).json({
            success:false,
            message:"Task not found"
        })
    }
    await activityQueue.add('task',{
        team:teamId,
        task:taskId,
        action:"DELETED",
        payload:{},
        createdBy:req.user.id,
        timestamps:Date.now()

    })

    await delByPattern(`team:${teamId}:task:${taskId}*`);

    return res.status(200).json({
        success:true,
        message:"Task deleted succesfully"
    })
     }catch(err){
      next(err)
      }
   }

   export const updateTask=async(req,res,next)=>{
    try{
    const {teamId,taskId}=req.params
    const{title , description}=req.body
    const userId=req.id

    const updates={}
    if(title)updates.title=title
    if(description)updates.description=description

    const task=await taskModel.findOneAndUpdate({_id:taskId,teamId},updates,{new:true})
    if(!task){
        return res.status(404).json({
            success:false,
            message:"Task not found"
        })
    }

    await activityQueue.add('task',{
        teamId:teamId,
        taskId:task._id,
        action:'UPDATED',
        payload:updates,
        createdBy:userId,
        timestamp: Date.now()

    })
    await delByPattern(`team:${teamId}:task:${taskId}*`);

    return res.status(200).json({
        success:true,
        message:"Task updated succesfully",
        data:task
        })

    }catch(err){
        next(err)
    }
        
   }

   export const comments=async(req,res,next)=>{
    try{
    const {teamId,taskId}=req.params
    const {text}=req.body
    const userId=req.id

    const task = await taskModel.findOne({_id:taskId ,teamId})
    if(!task){
        return res.status(404).json({
            success:false,
            message:"Task not found"
        })
    }

    const newComment = {text,createdBy:userId}
    task.comments.push(newComment)

    await task.save()

    await activityQueue.add('task',{
        teamId:teamId,
        task:task._id,
        action:"Commented",
        payload:{text},
        createdBy:userId,
        timestamp: Date.now()
    })
    await delByPattern(`team:${teamId}:task:${taskId}*`);

    return res.status(200).json({
        success:true,
        message:"Commented succesfully",
        data:task
    })

    }catch(err){
        next(err)
    }
   }

   export const assignTask=async(req,res,next)=>{
    try{

        const {teamId,taskId}=req.params 
        const {assignedTo} =req.body
        const userId=req.id

        const team = await teamModel.findById(teamId)
        if(!team){
            return res.status(404).json({
                success:false,
                message:"team not found"
            })
        }
        if(!team.member.map(String).includes(String(assignedTo))){
            return res.status(400).json({
                success:false,
                message:'User must a member of team'
            })
        }

        const task=await taskModel.findOneAndUpdate({_id:taskId, teamId},{assignedTo},{new:true})
        if(!task){
            return res.status(404).json({
                success:false,
                message:"Task not found"
            })
        }
        await activityQueue.add('task',{
            teamId:teamId,
            task:task._id,
            action:"ASSIGNED",
            payload:{assignedTo},
            createdBy:userId ,
            timestamp:Date.now()
        })

        await delByPattern(`team:${teamId}:tasks*`);
        await delByPattern(`team:${teamId}:task:${taskId}*`);


        return res.status(200).json({
            success:true,
            message:"Task assigned succesfully",
            data:task
        })

    }catch(err){
          next(err)
    }
   }

   export const moveTask=async(req,res,next)=>{
    try{
        const {teamId ,taskId}=req.params
        const {status}=req.body
        const userId=req.id

        const task = await taskModel.findOneAndUpdate({_id:taskId , teamId},{status} ,{new:true})
        if(!task){
            return res.status(404).json({
                success:false,
                message:"Task not found"
            })
        }

        await activityQueue.add('task',{
            team:teamId,
            task:task._id,
            action:"MOVED",
            payload:{status},
            createdBy:userId,
            timestamp : Date.now()
        })

        await delByPattern(`team:${teamId}:task:${taskId}*`);

        return res.status(200).json({
            success:true,
            message:"Task moved along column",
            data:task
        })

    }catch(err){
      next(err)
    }
   }

   

   export const listTasks =async(req,res,next)=>{
    try{

        const {teamId}=req.params
        const page=Math.max(1,parseInt(req.query.page || '1', 10));
        const limit=Math.max(1,parseInt(req.query.limit || '10',10))
        const search=req.query.search || ''
        const assignedTo=req.query.assignedTo || ''
        const sort = (req.query.sort || 'desc').toLowerCase()

        const key =`team:${teamId}:tasks:page${page}:limit${limit}:search:${search || ''}:assignedTo:${assignedTo|| ''}:sort:${sort ||'desc'}`




        const cached= await cacheGet(key)
        if(cached){
            return res.status(200).json({
                success:true,
                source:"cached",
                ...cached
            })
        }
        const query={teamId}
        if(search)query.$text={$search:search}
        if(assignedTo)query.assignedTo=assignedTo

        const skip= (page-1)*limit

        const [items,total]=await Promise.all([
            taskModel.find(query).populate('assignedTo' , 'name email').sort({createdAt: sort === 'asc'? 1:-1}).skip(skip).limit(limit),
            taskModel.countDocuments(query)
        ])

        const payload={
            page,
            limit,
            total,
            totalPages:Math.ceil(total/limit),
            data:items
        }
       await cacheSet(key,payload,60)
       res.status(200).json({
        success:true,
        source:"db",
        ...payload
       })

    }catch(err){
       next(err)
    }
   }
