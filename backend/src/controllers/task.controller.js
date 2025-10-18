import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { Task } from "../models/task.model.js"
import { Project } from "../models/project.model.js"
import mongoose, { isValidObjectId } from "mongoose"

const createTask = asyncHandler(async (req, res) => {
    const { title, description, projectId, status = "todo" } = req.body

    if (!title || !description || !projectId) {
        throw new ApiError(400, "Title, description, and project ID are required")
    }

    if (!isValidObjectId(projectId)) {
        throw new ApiError(400, "Invalid project ID")
    }

    const project = await Project.findOne({
        _id: projectId,
        createdBy: req.user._id
    })

    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    const taskCount = await Task.countDocuments({ projectId, status })

    const task = await Task.create({
        title,
        description,
        status,
        projectId,
        createdBy: req.user._id,
        position: taskCount
    })

    if (!task) {
        throw new ApiError(500, "Failed to create task")
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, task, "Task created successfully")
        )
})

const getTasksByProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params

    if (!isValidObjectId(projectId)) {
        throw new ApiError(400, "Invalid project ID")
    }

    const project = await Project.findOne({
        _id: projectId,
        createdBy: req.user._id
    })

    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    const tasks = await Task.find({ projectId })
        .sort({ status: 1, position: 1 })

    const groupedTasks = {
        todo: tasks.filter(task => task.status === "todo"),
        inprogress: tasks.filter(task => task.status === "inprogress"),
        done: tasks.filter(task => task.status === "done")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, groupedTasks, "Tasks fetched successfully")
        )
})

const updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params
    const { title, description, status, position } = req.body

    if (!isValidObjectId(taskId)) {
        throw new ApiError(400, "Invalid task ID")
    }

    const existingTask = await Task.findOne({ _id: taskId })

    if (!existingTask) {
        throw new ApiError(404, "Task not found")
    }

    const project = await Project.findOne({
        _id: existingTask.projectId,
        createdBy: req.user._id
    })

    if (!project) {
        throw new ApiError(403, "Not authorized to update this task")
    }

    const updateData = {}
    if (title) updateData.title = title
    if (description) updateData.description = description
    if (status) updateData.status = status
    if (position !== undefined) updateData.position = position

    const task = await Task.findByIdAndUpdate(
        taskId,
        { $set: updateData },
        { new: true }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, task, "Task updated successfully")
        )
})

const deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params

    if (!isValidObjectId(taskId)) {
        throw new ApiError(400, "Invalid task ID")
    }

    const existingTask = await Task.findOne({ _id: taskId })

    if (!existingTask) {
        throw new ApiError(404, "Task not found")
    }

    const project = await Project.findOne({
        _id: existingTask.projectId,
        createdBy: req.user._id
    })

    if (!project) {
        throw new ApiError(403, "Not authorized to delete this task")
    }

    await Task.findByIdAndDelete(taskId)

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Task deleted successfully")
        )
})

const moveTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params
    const { newStatus, newPosition } = req.body

    if (!isValidObjectId(taskId)) {
        throw new ApiError(400, "Invalid task ID")
    }

    if (!newStatus || newPosition === undefined) {
        throw new ApiError(400, "New status and position are required")
    }

    const validStatuses = ["todo", "inprogress", "done"]
    if (!validStatuses.includes(newStatus)) {
        throw new ApiError(400, "Invalid status")
    }

    const existingTask = await Task.findOne({ _id: taskId })

    if (!existingTask) {
        throw new ApiError(404, "Task not found")
    }

    const project = await Project.findOne({
        _id: existingTask.projectId,
        createdBy: req.user._id
    })

    if (!project) {
        throw new ApiError(403, "Not authorized to move this task")
    }

    const oldStatus = existingTask.status
    const oldPosition = existingTask.position

    if (oldStatus !== newStatus) {
        await Task.updateMany(
            { 
                projectId: existingTask.projectId,
                status: oldStatus,
                position: { $gt: oldPosition }
            },
            { $inc: { position: -1 } }
        )

        await Task.updateMany(
            {
                projectId: existingTask.projectId,
                status: newStatus,
                position: { $gte: newPosition }
            },
            { $inc: { position: 1 } }
        )
    } else {
        if (newPosition > oldPosition) {
            await Task.updateMany(
                {
                    projectId: existingTask.projectId,
                    status: newStatus,
                    position: { $gt: oldPosition, $lte: newPosition }
                },
                { $inc: { position: -1 } }
            )
        } else if (newPosition < oldPosition) {
            await Task.updateMany(
                {
                    projectId: existingTask.projectId,
                    status: newStatus,
                    position: { $gte: newPosition, $lt: oldPosition }
                },
                { $inc: { position: 1 } }
            )
        }
    }

    const task = await Task.findByIdAndUpdate(
        taskId,
        {
            $set: {
                status: newStatus,
                position: newPosition
            }
        },
        { new: true }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, task, "Task moved successfully")
        )
})

export {
    createTask,
    getTasksByProject,
    updateTask,
    deleteTask,
    moveTask
}