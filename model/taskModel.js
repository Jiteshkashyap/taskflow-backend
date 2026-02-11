import mongoose from "mongoose";

const commentSchema= new mongoose.Schema({
    text:{type:String , required:true},
    createdBy:{type:mongoose.Schema.Types.ObjectId , ref:"User",required:true},
    createdAt:{type:Date , default:Date.now()}
})

const taskSchema= new mongoose.Schema({
    teamId:{type:mongoose.Schema.Types.ObjectId , ref:"Team",required:true,index:true},
    title:{type:String , required:true , trim:true , index:"text"},
    description:{type:String ,default:''},
    status:{type:String , enum:['TODO','DOING','DONE'],default:'TODO',index:true},
    assignedTo:{type:mongoose.Schema.Types.ObjectId , ref:'User',default:null},
    comments:[commentSchema],
    createdBy:{type:mongoose.Schema.Types.ObjectId ,ref:'User',required:true}

},{timestamps:true})

taskSchema.index({title:'text' , description:'text'})

export const taskModel = mongoose.model('Task',taskSchema)