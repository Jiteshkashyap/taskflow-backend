import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name:{type:String , required:true, trim:true},
    creator:{type:mongoose.Schema.Types.ObjectId , ref:"User", required:true , index:true},
    member:[{type:mongoose.Schema.Types.ObjectId , ref:"User"}]
},{timestamps:true})

export const teamModel =mongoose.model("Team" ,teamSchema)