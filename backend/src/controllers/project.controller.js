import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { Project } from "../models/project.model.js"
import { Task } from "../models/task.model.js"
import mongoose, { isValidObjectId } from "mongoose"

const createProject = asyncHandler(async (req, res) => {
    const { name, description } = req.body

    if (!name || !description) {
        throw new ApiError(400, "Name and description are required")
    }

    const project = await Project.create({
        name,
        description,
        createdBy: req.user._id
    })

    if (!project) {
        throw new ApiError(500, "Failed to create project")
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, project, "Project created successfully")
        )
})

const getAllProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find({ createdBy: req.user._id })
        .sort({ createdAt: -1 })

    return res
        .status(200)
        .json(
            new ApiResponse(200, projects, "Projects fetched successfully")
        )
})

const getProjectById = asyncHandler(async (req, res) => {
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

    return res
        .status(200)
        .json(
            new ApiResponse(200, project, "Project fetched successfully")
        )
})

const updateProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    const { name, description } = req.body

    if (!isValidObjectId(projectId)) {
        throw new ApiError(400, "Invalid project ID")
    }

    if (!name || !description) {
        throw new ApiError(400, "Name and description are required")
    }

    const project = await Project.findOneAndUpdate(
        {
            _id: projectId,
            createdBy: req.user._id
        },
        {
            $set: {
                name,
                description
            }
        },
        { new: true }
    )

    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, project, "Project updated successfully")
        )
})

const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params

    if (!isValidObjectId(projectId)) {
        throw new ApiError(400, "Invalid project ID")
    }

    const project = await Project.findOneAndDelete({
        _id: projectId,
        createdBy: req.user._id
    })

    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    await Task.deleteMany({ projectId })

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Project deleted successfully")
        )
})

export {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
}