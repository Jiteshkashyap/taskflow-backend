import { teamModel } from "../model/teamModel.js";

export const ifTeamCreator=async(req,res,next)=>{

    try{
        const teamId= req.params.teamId || req.body.teamId
        const userId=req.id

        if(!teamId){
            return res.status(400).json({
                success:false,
                message:"TeamId required"
            })
        }

        const team=await  teamModel.findById(teamId)
        if(!team){
            return res.status(400).json({
                success:false,
                message:"Team not found"
            })
        }
        if(String(team.creator) !== String(userId)){
            return res.status(400).json({
                success:false,
                message:"Only team creator allowed"
            })
        }
        req.team=team
        next()
    }catch(err){
        next(err)

    }
}

export const ifTeamMember=async(req,res,next)=>{

    try{
    const teamId=req.params.teamId 
    const userId=req.id
    
    if(!teamId){
            return res.status(400).json({
                success:false,
                message:"TeamId required"
            })
        }

        const team= await  teamModel.findById(teamId)
        if(!team){
            return res.status(404).json({
                success:false,
                message:"Team not found"
            })
        }
        const isMember = team.member.map(String).includes(String(userId))
        if(!isMember){
            return res.status(403).json({
               success:false,
               message:"Only team members allowed "
            })
        }
        req.team=team
        next()

    }catch(err){
        next(err)
    }
}