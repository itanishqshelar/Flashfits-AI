import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'No API key' }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    
    // Try a simple generation test with different models (updated with latest stable models)
    const testModels = [
      'gemini-2.5-flash',      // Latest recommended model
      'gemini-2.5-pro',        // Most capable model  
      'models/gemini-2.5-flash',
      'models/gemini-2.5-pro',
      'gemini-1.5-flash',      // Fallback models
      'gemini-1.5-pro',
      'models/gemini-1.5-flash',
      'models/gemini-1.5-pro'
    ]
    const results = []
    
    for (const modelName of testModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName })
        const result = await model.generateContent('Hello')
        const response = await result.response
        const text = response.text()
        results.push({ 
          model: modelName, 
          status: 'success',
          response: text.substring(0, 50) + '...' 
        })
      } catch (err: any) {
        results.push({ 
          model: modelName, 
          status: 'failed', 
          error: err.message || 'Unknown error'
        })
      }
    }
    
    return NextResponse.json({ testResults: results })
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || 'Unknown error' 
    }, { status: 500 })
  }
}