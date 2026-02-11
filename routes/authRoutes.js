import express from "express"
import { registerSchema , loginSchema} from "../validation/authValidation.js"
import { register , login } from "../controller/authController.js"
import { loginLimiter } from "../middleware/rateLimit.js"
import { validate } from "../middleware/middlewareValidate.js"

const router =express.Router()

router.post("/register",validate(registerSchema),register)
router.post("/login",loginLimiter,validate(loginSchema),login)

export default router;