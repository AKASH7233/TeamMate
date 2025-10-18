import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import axiosInstance from '../utils/apiClient'

const initialState = {
    summary: null,
    answer: null,
    loading: false,
    error: null
}

export const summarizeTasks = createAsyncThunk('ai/summarize', async (projectId, { rejectWithValue }) => {
    try {
        console.log('[Frontend] Sending summarize request for project:', projectId)
        // Use longer timeout for AI operations (60 seconds)
        const response = await axiosInstance.post('/ai/summarize', { projectId }, { timeout: 60000 })
        console.log('[Frontend] Received response:', response)
        console.log('[Frontend] Response data:', response.data)
        console.log('[Frontend] Summary data:', response.data.data)
        toast.success(response.data.message)
        return response.data
    } catch (error) {
        console.error('[Frontend] Error in summarizeTasks:', error)
        console.error('[Frontend] Error response:', error.response)
        console.error('[Frontend] Error response data:', error.response?.data)
        const message = error.response?.data?.message || 'Failed to generate summary'
        toast.error(message)
        return rejectWithValue(message)
    }
})

export const askAboutTasks = createAsyncThunk('ai/ask', async ({ projectId, question, taskIds }, { rejectWithValue }) => {
    try {
        // Use longer timeout for AI operations (60 seconds)
        const response = await axiosInstance.post('/ai/ask', {
            projectId,
            question,
            taskIds
        }, { timeout: 60000 })
        toast.success(response.data.message)
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to get answer'
        toast.error(message)
        return rejectWithValue(message)
    }
})

const aiSlice = createSlice({
    name: 'ai',
    initialState,
    reducers: {
        clearSummary: (state) => {
            state.summary = null
        },
        clearAnswer: (state) => {
            state.answer = null
        },
        clearError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(summarizeTasks.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(summarizeTasks.fulfilled, (state, action) => {
                state.loading = false
                state.summary = action.payload.data.summary
            })
            .addCase(summarizeTasks.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || action.error.message
            })
            .addCase(askAboutTasks.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(askAboutTasks.fulfilled, (state, action) => {
                state.loading = false
                state.answer = action.payload.data.answer
            })
            .addCase(askAboutTasks.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || action.error.message
            })
    }
})

export const { clearSummary, clearAnswer, clearError } = aiSlice.actions
export default aiSlice.reducer