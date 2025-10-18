import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: function (origin, callback) {
        // Allow all origins (including undefined for same-origin requests)
        callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./src/routes/user.routes.js"
import projectRouter from "./src/routes/project.routes.js"
import taskRouter from "./src/routes/task.routes.js"
import aiRouter from "./src/routes/ai.routes.js"
import errorHandler from "./src/middlewares/error.middleware.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/projects", projectRouter)
app.use("/api/v1/tasks", taskRouter)
app.use("/api/v1/ai", aiRouter)

app.get("/", (req, res) => {
    res.json({
        message: "TaskMate API - Project & Task Management System with AI",
        version: "1.0.0",
        endpoints: {
            users: "/api/v1/users",
            projects: "/api/v1/projects",
            tasks: "/api/v1/tasks",
            ai: "/api/v1/ai"
        }
    })
})

app.use(errorHandler)

export { app }