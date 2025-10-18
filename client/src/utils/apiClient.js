import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

const axiosInstance = axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true,
})

// Create a separate instance for refresh token requests to avoid infinite loops
const refreshAxiosInstance = axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true,
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Track if we're currently refreshing to prevent multiple refresh requests
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    
    failedQueue = []
}

axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        const originalRequest = error.config
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            
            if (isRefreshing) {
                // If we're already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`
                    return axiosInstance(originalRequest)
                }).catch(err => {
                    return Promise.reject(err)
                })
            }
            
            isRefreshing = true
            
            try {
                // Use the separate refresh instance to avoid interceptor loops
                const refreshResponse = await refreshAxiosInstance.post('/users/refresh-token')
                const { accessToken } = refreshResponse.data.data
                
                localStorage.setItem('accessToken', accessToken)
                originalRequest.headers.Authorization = `Bearer ${accessToken}`
                
                processQueue(null, accessToken)
                isRefreshing = false
                
                return axiosInstance(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError, null)
                isRefreshing = false
                
                // Clear auth data and redirect to login
                localStorage.removeItem('accessToken')
                localStorage.removeItem('user')
                
                // Only redirect if we're not already on login/register pages
                if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                    window.location.href = '/login'
                }
                
                return Promise.reject(refreshError)
            }
        }
        
        return Promise.reject(error)
    }
)

export default axiosInstance