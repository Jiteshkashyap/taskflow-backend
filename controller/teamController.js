import { teamModel } from "../model/teamModel.js";
import { userModel } from "../model/userModel.js";


export const createTeam=async(req,res,next)=>{
    try{
       const {name}=req.body
       const userId =req.id
       const creatorId = userId

       const team = await teamModel.create({
        name,
        creator:creatorId,
        member:[creatorId]
       })
       return res.status(201).json({
        success:true,
        message:"Team created",
        data:team
       })
    }catch(err){
       next(err)
    }
}

export const getTeam =async(req,res,next)=>{
    try{

        const {teamId}=req.params
        const userId=req.id

        const team = await teamModel.findById(teamId).populate('member', 'name')
        if(!team){
            return res.status(404).json({
                success:false,
                message:"Team not found"
            })
        }
        if(!team.member.map(m=>String(m._id)).includes(String(userId))){
            return res.status(403).json({
                success:false,
                message:"Forbidden"
            })
        }
        return res.status(200).json({
            success:true,
            data:team
        })

    }catch(err){
        next(err)
    }
}

export const addMember=async(req,res,next)=>{
    try{
        const {teamId}=req.params
        const {userId}=req.body
        

        const team =await teamModel.findById(teamId)
        if(!team){
            return res.status(404).json({
                success:false,
                message:"Team not found"
            })
        }
      if(String(team.creator) !== String(req.id)){
        return res.status(403).json({
            success:false,
            message:"Only team cretor can add the members"
        })
      }
      const user = await userModel.findById(userId)
      if(!user){
        return res.status(404).json({
            success:false,
            message:"User not found"
        })
      }
      if(team.member.map(String).includes(String(userId))){
        return res.status(400).json({
            success:false,
            message:"User is already member of team"
        })
      }
      team.member.push(userId);
      await team.save()

    return res.status(200).json({ success: true, data: team });

    }catch(err){
        next(err)
    }
}

export const removeMember =async(req,res,next)=>{
    try{
        const {teamId}=req.params
        const {userId}=req.body;

        const team=await teamModel.findById(teamId)
         if(!team){
            return res.status(404).json({
                success:false,
                message:"Team not found"
            })
        }
        if(String(team.creator) !== String(req.id)){
            return res.status(403).json({
             success:false,
             message:"Only team cretor can remove the member"
            })       
         }

        if(String(userId) !== String(team.creator)){
            return res.status(400).json({
            success:false,
             message:"Cant remove the team creator"
            })
        }
        team.member=team.member.filter(m=>String(m) !==String(userId));
        await team.save()

       return res.status(200).json({
         success: true,
         data: team });

    }catch(err){
       next(err)
    }
}

export const listMembers= async(req,res,next)=>{
    try{

        const {teamId}=req.params
        const userId=req.id

        const team=await teamModel.findById(teamId).populate('member' , "name")
        if(!team){
            return res.status(404).json({
                success:false,
                message:"Team not found"
            })
        }
        if(!team.member.map(m=>String(m._id)).includes(String(userId))){
            return res.status(403).json({
                success:false,
                message:"Forbidden"
            })

        }
        return res.status(200).json({
            success:true,
            message:"List fetched succesfully",
            data:team.member
        })

    }catch(err){
        next(err)
    }
}