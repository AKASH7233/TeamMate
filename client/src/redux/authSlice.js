import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import axiosInstance from '../utils/apiClient'

// Helper function to check if token exists and is valid
const isTokenValid = () => {
    const token = localStorage.getItem('accessToken')
    if (!token) return false
    
    try {
        // Basic check - decode JWT payload
        const parts = token.split('.')
        if (parts.length !== 3) return false
        
        const payload = JSON.parse(atob(parts[1]))
        const currentTime = Date.now() / 1000
        
        // Check if token is expired (with 30 second buffer)
        return payload.exp > (currentTime + 30)
    } catch (error) {
        console.error('Token validation error:', error)
        return false
    }
}

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: (() => {
        const token = localStorage.getItem('accessToken')
        const user = localStorage.getItem('user')
        return !!(token && user && isTokenValid())
    })(),
    loading: false,
    error: null
}

export const registerUser = createAsyncThunk('auth/register', async (userData) => {
    try {
        const response = await axiosInstance.post('/users/register', userData)
        toast.success(response.data.message)
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || 'Registration failed'
        toast.error(message)
        throw new Error(message)
    }
})

export const loginUser = createAsyncThunk('auth/login', async (credentials) => {
    try {
        // Send the credentials as is - backend handles both email and username
        const loginData = {
            email: credentials.email,
            username: credentials.email, // Use email as username fallback
            password: credentials.password
        }
        
        const response = await axiosInstance.post('/users/login', loginData)
        toast.success(response.data.message || 'Login successful')
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || 'Login failed'
        toast.error(message)
        throw new Error(message)
    }
})

export const logoutUser = createAsyncThunk('auth/logout', async () => {
    try {
        await axiosInstance.post('/users/logout')
        toast.success('Logged out successfully')
    } catch (error) {
        console.error('Logout error:', error)
        // Even if logout fails on server, clear local state
    } finally {
        // Always clear local storage
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
    }
})

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async (_, { rejectWithValue }) => {
    try {
        // Check if we have a valid token before making the request
        if (!isTokenValid()) {
            throw new Error('No valid token found')
        }
        
        const response = await axiosInstance.get('/users/current-user')
        return response.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to get user')
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        logout: (state) => {
            state.user = null
            state.isAuthenticated = false
            localStorage.removeItem('accessToken')
            localStorage.removeItem('user')
        },
        // Add action to handle token refresh
        setTokens: (state, action) => {
            const { accessToken, user } = action.payload
            state.isAuthenticated = true
            if (user) {
                state.user = user
                localStorage.setItem('user', JSON.stringify(user))
            }
            localStorage.setItem('accessToken', accessToken)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload.data
                state.isAuthenticated = true
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
                state.isAuthenticated = false
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload.data.user
                state.isAuthenticated = true
                localStorage.setItem('accessToken', action.payload.data.accessToken)
                localStorage.setItem('user', JSON.stringify(action.payload.data.user))
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
                state.isAuthenticated = false
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null
                state.isAuthenticated = false
                localStorage.removeItem('accessToken')
                localStorage.removeItem('user')
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.user = action.payload.data
                state.isAuthenticated = true
                localStorage.setItem('user', JSON.stringify(action.payload.data))
            })
            .addCase(getCurrentUser.rejected, (state) => {
                // If getCurrentUser fails, it might mean token is invalid
                state.user = null
                state.isAuthenticated = false
                localStorage.removeItem('accessToken')
                localStorage.removeItem('user')
            })
    }
})

export const { clearError, logout, setTokens } = authSlice.actions
export default authSlice.reducer