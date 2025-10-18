import { GoogleGenerativeAI } from '@google/generative-ai'

let genAI = null

const initializeGemini = () => {
    if (!process.env.GEMINI_API_KEY) {
        console.warn('GEMINI_API_KEY not found in environment variables')
        return null
    }
    
    if (!genAI) {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    }
    return genAI
}

const getGeminiModel = () => {
    const ai = initializeGemini()
    if (!ai) return null
    return ai.getGenerativeModel({ model: "gemini-2.5-flash" })
}

export { initializeGemini, getGeminiModel }