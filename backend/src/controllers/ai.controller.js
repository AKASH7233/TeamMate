import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { Task } from "../models/task.model.js"
import { Project } from "../models/project.model.js"
import { getGeminiModel } from "../utils/gemini.js"
import mongoose, { isValidObjectId } from "mongoose"

const summarizeTasks = asyncHandler(async (req, res) => {
    console.log("[AI Controller] === Starting summarizeTasks function ===")
    const { projectId } = req.body
    console.log("[AI Controller] Project ID received:", projectId)
    console.log("[AI Controller] User ID:", req.user?._id)

    if (!projectId) {
        console.error("[AI Controller] No project ID provided")
        throw new ApiError(400, "Project ID is required")
    }

    if (!isValidObjectId(projectId)) {
        console.error("[AI Controller] Invalid project ID format:", projectId)
        throw new ApiError(400, "Invalid project ID")
    }

    console.log("[AI Controller] Searching for project...")
    const project = await Project.findOne({
        _id: projectId,
        createdBy: req.user._id
    })
    console.log("[AI Controller] Project found:", project ? `Yes (${project.name})` : "No")

    if (!project) {
        console.error("[AI Controller] Project not found or access denied")
        throw new ApiError(404, "Project not found")
    }

    console.log("[AI Controller] Searching for tasks in project...")
    const tasks = await Task.find({ projectId })
    console.log("[AI Controller] Tasks found:", tasks.length)

    if (tasks.length === 0) {
        console.log("[AI Controller] No tasks found, returning early response")
        return res
            .status(200)
            .json(
                new ApiResponse(200, { summary: "No tasks found in this project." }, "Summary generated successfully")
            )
    }

    console.log("[AI Controller] Getting Gemini model...")
    const model = getGeminiModel()
    
    if (!model) {
        console.error("[AI Controller] Failed to get Gemini model")
        throw new ApiError(500, "AI service is not available. Please check configuration.")
    }
    console.log("[AI Controller] Gemini model obtained successfully")

    const taskData = tasks.map(task => ({
        title: task.title,
        description: task.description,
        status: task.status,
        createdAt: task.createdAt
    }))

    const prompt = `Analyze the following tasks from project "${project.name}" and provide a concise summary:

**Project:** ${project.name}
**Description:** ${project.description}
**Total Tasks:** ${tasks.length}

**Tasks:**
${taskData.map((task, index) => 
    `${index + 1}. **${task.title}** (${task.status}) - ${task.description}`
).join('\n')}

Please provide a **short, focused summary** with exactly 5-6 key points:

1. **Progress Overview** - Current completion status
2. **Task Distribution** - Breakdown by status (To Do/In Progress/Done)
3. **Next Actions** - What should be prioritized
4. **Key Insights** - Important observations
5. **Potential Issues** - Any blockers or concerns
6. **Recommendations** - 1-2 actionable suggestions

Use markdown formatting (**bold**, *italic*, bullet points) and keep each point concise (1-2 sentences max).`

    try {
        console.log("[AI Controller] Sending request to Gemini API...")
        const result = await model.generateContent(prompt)
        console.log("[AI Controller] Received response from Gemini API")
        
        const response = await result.response
        console.log("[AI Controller] Extracted response object")
        
        const summary = response.text()
        console.log("[AI Controller] Successfully extracted text, length:", summary?.length)
        console.log("[AI Controller] Summary content preview:", summary?.substring(0, 100) + "...")

        if (!summary || summary.trim().length === 0) {
            console.error("[AI Controller] Empty response from Gemini API")
            throw new ApiError(500, "AI generated an empty response. Please try again.")
        }

        console.log("[AI Controller] Creating ApiResponse object...")
        const apiResponse = new ApiResponse(200, { summary }, "Summary generated successfully")
        console.log("[AI Controller] ApiResponse created successfully:", apiResponse)
        
        console.log("[AI Controller] Sending response to client...")
        const responseResult = res
            .status(200)
            .json(apiResponse)
        console.log("[AI Controller] Response sent successfully")
        return responseResult
    } catch (error) {
        console.error("[AI Controller] ENTERED CATCH BLOCK - this means an error occurred")
        console.error("[AI Controller] Detailed error information:")
        console.error("- Error name:", error.name)
        console.error("- Error message:", error.message)
        console.error("- Error stack:", error.stack)
        console.error("- Full error object:", error)
        
        if (error.message?.includes('API_KEY')) {
            console.error("[AI Controller] API Key error detected")
            throw new ApiError(500, "AI service configuration error. Please contact support.")
        }
        
        if (error.message?.includes('quota')) {
            console.error("[AI Controller] Quota error detected")
            throw new ApiError(503, "AI service is temporarily unavailable due to quota limits. Please try again later.")
        }
        
        if (error.message?.includes('blocked')) {
            console.error("[AI Controller] Content blocked error detected")
            throw new ApiError(400, "Request was blocked. Please try rephrasing your request.")
        }
        
        console.error("[AI Controller] Unknown error, throwing generic message")
        
        // Handle network/connectivity errors
        if (error.message?.includes('fetch failed') || error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            console.error("[AI Controller] Network connectivity error detected")
            throw new ApiError(503, "Unable to connect to AI service. Please check your internet connection and try again.")
        }
        
        throw new ApiError(500, `Failed to generate summary: ${error.message || 'Unknown error occurred'}`)
    }
})

const askAboutTasks = asyncHandler(async (req, res) => {
    const { projectId, question, taskIds } = req.body

    if (!projectId || !question) {
        throw new ApiError(400, "Project ID and question are required")
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

    let tasks
    if (taskIds && taskIds.length > 0) {
        const validTaskIds = taskIds.filter(id => isValidObjectId(id))
        tasks = await Task.find({
            _id: { $in: validTaskIds },
            projectId
        })
    } else {
        tasks = await Task.find({ projectId })
    }

    if (tasks.length === 0) {
        return res
            .status(200)
            .json(
                new ApiResponse(200, { answer: "No tasks found to analyze for your question." }, "Answer generated successfully")
            )
    }

    const model = getGeminiModel()
    
    if (!model) {
        throw new ApiError(500, "AI service is not available. Please check configuration.")
    }

    const taskData = tasks.map(task => ({
        title: task.title,
        description: task.description,
        status: task.status,
        createdAt: task.createdAt
    }))

    const prompt = `You are an AI assistant helping with project and task management. Answer the following question based on the provided task information:

Project: ${project.name}
Description: ${project.description}

Tasks Context:
${taskData.map((task, index) => 
    `${index + 1}. Title: ${task.title}
   Description: ${task.description}
   Status: ${task.status}
   Created: ${task.createdAt.toDateString()}
`).join('\n')}

Question: ${question}

Please provide a helpful and accurate answer based on the task information above. If the question cannot be answered with the available information, explain what additional information would be needed.`

    try {
        console.log("[AI Controller] Sending question to Gemini API...")
        const result = await model.generateContent(prompt)
        console.log("[AI Controller] Received response from Gemini API")
        
        const response = await result.response
        console.log("[AI Controller] Extracted response object")
        
        const answer = response.text()
        console.log("[AI Controller] Successfully extracted answer, length:", answer?.length)

        if (!answer || answer.trim().length === 0) {
            console.error("[AI Controller] Empty response from Gemini API")
            throw new ApiError(500, "AI generated an empty response. Please try again with a different question.")
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, { answer }, "Answer generated successfully")
            )
    } catch (error) {
        console.error("[AI Controller] Detailed error information for Q&A:")
        console.error("- Error name:", error.name)
        console.error("- Error message:", error.message)
        console.error("- Error stack:", error.stack)
        console.error("- Full error object:", error)
        
        if (error.message?.includes('API_KEY')) {
            console.error("[AI Controller] API Key error detected")
            throw new ApiError(500, "AI service configuration error. Please contact support.")
        }
        
        if (error.message?.includes('quota')) {
            console.error("[AI Controller] Quota error detected")
            throw new ApiError(503, "AI service is temporarily unavailable due to quota limits. Please try again later.")
        }
        
        if (error.message?.includes('blocked')) {
            console.error("[AI Controller] Content blocked error detected")
            throw new ApiError(400, "Request was blocked. Please try rephrasing your question.")
        }
        
        console.error("[AI Controller] Unknown error in Q&A, throwing generic message")
        
        // Handle network/connectivity errors
        if (error.message?.includes('fetch failed') || error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            console.error("[AI Controller] Network connectivity error detected")
            throw new ApiError(503, "Unable to connect to AI service. Please check your internet connection and try again.")
        }
        
        throw new ApiError(500, `Failed to generate answer: ${error.message || 'Unknown error occurred'}`)
    }
})

export {
    summarizeTasks,
    askAboutTasks
}