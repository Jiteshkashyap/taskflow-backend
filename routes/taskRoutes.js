import express from 'express'
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { ifTeamCreator,ifTeamMember } from "../middleware/teamMiddleware.js";
import { getTask,updateTask,deleteTask,moveTask,comments,createTask,assignTask, listTasks} from "../controller/taskController.js";
import { validate } from "../middleware/middlewareValidate.js";
import { createTaskSchema,updateTaskSchema,moveTaskSchema,commentSchema } from "../validation/taskValidation.js";

const router = express.Router()

router.use(isAuthenticated)

router.post('/:teamId/createTask',ifTeamMember,validate(createTaskSchema),createTask)
router.get('/:teamId/list',listTasks)

router.get('/:teamId/:taskId/getTask',getTask)
router.put('/:teamId/:taskId/updateTask',ifTeamMember,validate(updateTaskSchema),updateTask)
router.delete('/:teamId/:taskId/deleteTask',ifTeamMember, deleteTask)

router.patch('/:teamId/:taskId/move',ifTeamMember,validate(moveTaskSchema), moveTask)
router.post('/:teamId/:taskId/comment',ifTeamMember,validate(commentSchema),comments)
router.patch('/:teamId/:taskId/assign',ifTeamMember,assignTask)

export default router;