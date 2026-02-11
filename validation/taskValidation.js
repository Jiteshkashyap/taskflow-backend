import { Types } from "mongoose";
import Joi from "joi";

const objectId=Joi.string().custom((value,helpers)=>{
    if(!Types.ObjectId.isValid(value)){
        return helpers.error('any.invalid')
    }
    return value
},'ObjectId Validation')

export const createTaskSchema=Joi.object({
    title:Joi.string().min(3).max(100).required(),
    description:Joi.string().allow(''),
    assignedTo:objectId.allow(null ,'')
    
})

export const updateTaskSchema=Joi.object({
    title:Joi.string().min(3).max(100).optional(),
    description:Joi.string().allow().optional(),
    assignedTo:objectId.allow(null,'').optional(),
    status:Joi.string().optional().valid('TODO','DOING','DONE')
})

export const moveTaskSchema=Joi.object({
    status:Joi.string().valid('TODO','DOING','DONE').required()
})

export const commentSchema=Joi.object({
    text:Joi.string().min(1).required()
})