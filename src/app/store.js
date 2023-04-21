import { configureStore } from '@reduxjs/toolkit'
import bgColorReducer from '../features/bgColor/BgColorSlice'

export const store = configureStore({
    reducer: {
        bgColor: bgColorReducer,
    },
})