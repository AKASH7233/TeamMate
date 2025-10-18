import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import axiosInstance from '../utils/apiClient'

const initialState = {
    tasks: {
        todo: [],
        inprogress: [],
        done: []
    },
    loading: false,
    error: null
}

export const createTask = createAsyncThunk('tasks/create', async (taskData) => {
    try {
        const response = await axiosInstance.post('/tasks', taskData)
        toast.success(response.data.message)
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to create task'
        toast.error(message)
        throw new Error(message)
    }
})

export const getTasksByProject = createAsyncThunk('tasks/getByProject', async (projectId) => {
    try {
        const response = await axiosInstance.get(`/tasks/${projectId}`)
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch tasks'
        toast.error(message)
        throw new Error(message)
    }
})

export const updateTask = createAsyncThunk('tasks/update', async ({ taskId, taskData }) => {
    try {
        const response = await axiosInstance.put(`/tasks/${taskId}`, taskData)
        toast.success(response.data.message)
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to update task'
        toast.error(message)
        throw new Error(message)
    }
})

export const deleteTask = createAsyncThunk('tasks/delete', async (taskId) => {
    try {
        const response = await axiosInstance.delete(`/tasks/${taskId}`)
        toast.success(response.data.message)
        return { taskId }
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to delete task'
        toast.error(message)
        throw new Error(message)
    }
})

export const moveTask = createAsyncThunk('tasks/move', async ({ taskId, newStatus, newPosition }) => {
    try {
        const response = await axiosInstance.put(`/tasks/${taskId}/move`, {
            newStatus,
            newPosition
        })
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to move task'
        toast.error(message)
        throw new Error(message)
    }
})

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        clearTasks: (state) => {
            state.tasks = {
                todo: [],
                inprogress: [],
                done: []
            }
        },
        clearError: (state) => {
            state.error = null
        },
        optimisticMoveTask: (state, action) => {
            const { taskId, sourceStatus, destinationStatus, sourceIndex, destinationIndex } = action.payload
            
            const task = state.tasks[sourceStatus].find(t => t._id === taskId)
            if (!task) return
            
            state.tasks[sourceStatus].splice(sourceIndex, 1)
            
            task.status = destinationStatus
            task.position = destinationIndex
            
            state.tasks[destinationStatus].splice(destinationIndex, 0, task)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createTask.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.loading = false
                const task = action.payload.data
                state.tasks[task.status].push(task)
            })
            .addCase(createTask.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(getTasksByProject.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getTasksByProject.fulfilled, (state, action) => {
                state.loading = false
                state.tasks = action.payload.data
            })
            .addCase(getTasksByProject.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const updatedTask = action.payload.data
                const status = updatedTask.status
                const index = state.tasks[status].findIndex(t => t._id === updatedTask._id)
                if (index !== -1) {
                    state.tasks[status][index] = updatedTask
                }
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                const { taskId } = action.payload
                Object.keys(state.tasks).forEach(status => {
                    state.tasks[status] = state.tasks[status].filter(t => t._id !== taskId)
                })
            })
            .addCase(moveTask.fulfilled, (state, action) => {
                const updatedTask = action.payload.data
                Object.keys(state.tasks).forEach(status => {
                    state.tasks[status] = state.tasks[status].filter(t => t._id !== updatedTask._id)
                })
                state.tasks[updatedTask.status].push(updatedTask)
                state.tasks[updatedTask.status].sort((a, b) => a.position - b.position)
            })
    }
})

export const { clearTasks, clearError, optimisticMoveTask } = taskSlice.actions
export default taskSlice.reducer