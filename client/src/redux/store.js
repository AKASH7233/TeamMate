import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import projectSlice from './projectSlice'
import taskSlice from './taskSlice'
import aiSlice from './aiSlice'

export const store = configureStore({
    reducer: {
        auth: authSlice,
        projects: projectSlice,
        tasks: taskSlice,
        ai: aiSlice
    }
})