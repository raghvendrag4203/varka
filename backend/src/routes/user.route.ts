import { Router } from "express"
import { validate } from "../middleware/validate.middleware.js"
import { loginSchema, registerSchema } from "../schema/user.schema.js"
import { loginController } from "../controller/user.controller.js"

const router = Router()

router.post('/register', validate(registerSchema))
router.post('/login', validate(loginSchema), loginController)

export default router 