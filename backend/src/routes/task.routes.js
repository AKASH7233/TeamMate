import { Router } from "express"
import {
    createTask,
    getTasksByProject,
    updateTask,
    deleteTask,
    moveTask
} from "../controllers/task.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJWT)

router.route("/").post(createTask)
router.route("/:projectId").get(getTasksByProject)
router.route("/:taskId").put(updateTask).delete(deleteTask)
router.route("/:taskId/move").put(moveTask)

export default router