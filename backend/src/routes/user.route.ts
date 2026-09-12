import { Router } from "express"
import { validate } from "../middleware/validate.middleware.js"
import { loginSchema, registerSchema, verifyOtpSchema } from "../schema/user.schema.js"
import { loginController, registerController, verifyOtpController } from "../controller/user.controller.js"

const router = Router()

router.post('/register', validate(registerSchema), registerController) 
router.post('/register/verify-otp', validate(verifyOtpSchema), verifyOtpController) 
router.post('/login', validate(loginSchema), loginController)

export default router 