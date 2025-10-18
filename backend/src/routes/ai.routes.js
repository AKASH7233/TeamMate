import { Router } from "express"
import {
    summarizeTasks,
    askAboutTasks
} from "../controllers/ai.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJWT)

router.route("/summarize").post(summarizeTasks)
router.route("/ask").post(askAboutTasks)

export default router