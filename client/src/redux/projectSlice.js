import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import axiosInstance from '../utils/apiClient'

const initialState = {
    projects: [],
    currentProject: null,
    loading: false,
    error: null
}

export const createProject = createAsyncThunk('projects/create', async (projectData) => {
    try {
        const response = await axiosInstance.post('/projects', projectData)
        toast.success(response.data.message)
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to create project'
        toast.error(message)
        throw new Error(message)
    }
})

export const getAllProjects = createAsyncThunk('projects/getAll', async () => {
    try {
        const response = await axiosInstance.get('/projects')
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch projects'
        toast.error(message)
        throw new Error(message)
    }
})

export const getProjectById = createAsyncThunk('projects/getById', async (projectId) => {
    try {
        const response = await axiosInstance.get(`/projects/${projectId}`)
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch project'
        toast.error(message)
        throw new Error(message)
    }
})

export const updateProject = createAsyncThunk('projects/update', async ({ projectId, projectData }) => {
    try {
        const response = await axiosInstance.put(`/projects/${projectId}`, projectData)
        toast.success(response.data.message)
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to update project'
        toast.error(message)
        throw new Error(message)
    }
})

export const deleteProject = createAsyncThunk('projects/delete', async (projectId) => {
    try {
        const response = await axiosInstance.delete(`/projects/${projectId}`)
        toast.success(response.data.message)
        return { projectId }
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to delete project'
        toast.error(message)
        throw new Error(message)
    }
})

const projectSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        clearCurrentProject: (state) => {
            state.currentProject = null
        },
        clearError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createProject.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.loading = false
                state.projects.unshift(action.payload.data)
            })
            .addCase(createProject.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(getAllProjects.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getAllProjects.fulfilled, (state, action) => {
                state.loading = false
                state.projects = action.payload.data
            })
            .addCase(getAllProjects.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(getProjectById.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getProjectById.fulfilled, (state, action) => {
                state.loading = false
                state.currentProject = action.payload.data
            })
            .addCase(getProjectById.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                const index = state.projects.findIndex(p => p._id === action.payload.data._id)
                if (index !== -1) {
                    state.projects[index] = action.payload.data
                }
                if (state.currentProject?._id === action.payload.data._id) {
                    state.currentProject = action.payload.data
                }
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.projects = state.projects.filter(p => p._id !== action.payload.projectId)
                if (state.currentProject?._id === action.payload.projectId) {
                    state.currentProject = null
                }
            })
    }
})

export const { clearCurrentProject, clearError } = projectSlice.actions
export default projectSlice.reducer