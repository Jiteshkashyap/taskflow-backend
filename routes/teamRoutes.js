import { createTeam ,listMembers ,addMember,removeMember,getTeam } from "../controller/teamController.js";
import { ifTeamCreator,ifTeamMember } from "../middleware/teamMiddleware.js";
import { createTeamSchema,addMemberSchema,removeMemberSchema } from "../validation/teamValidation.js";
import { validate } from "../middleware/middlewareValidate.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import express from 'express'

const router = express.Router()

router.post('/create' ,isAuthenticated ,validate(createTeamSchema),createTeam)

router.get('/:teamId',isAuthenticated,getTeam)

router.post('/:teamId/members',isAuthenticated,ifTeamCreator,validate(addMemberSchema),addMember)

router.delete('/:teamId/members',isAuthenticated,ifTeamCreator,validate(removeMemberSchema),removeMember)

router.get('/:teamId/getMembers',isAuthenticated,listMembers)

export default router;