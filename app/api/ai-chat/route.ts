import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabaseServer } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    // Fetch products from Supabase
    const supabase = await supabaseServer()
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .limit(50) // Limit for API response size

    if (error) {
      console.error('Error fetching products:', error)
    }

    // Create context about available products
    const productContext = products
      ? products
          .map(
            (p) =>
              `- ${p.name}: ${p.description}, Price: $${(p.price_cents / 100).toFixed(2)}`
          )
          .join('\n')
      : 'No products available'

    // Build the prompt with context
    const systemPrompt = `You are Flashfits AI, a helpful fashion styling assistant for an e-commerce platform. 

Your role is to:
1. Help users find the perfect fashion items from our catalog
2. Provide styling advice and outfit recommendations
3. Suggest products based on user preferences, occasions, and style needs
4. Answer questions about fashion trends and styling tips

Available Products in our catalog:
${productContext}

Guidelines:
- Be friendly, knowledgeable, and enthusiastic about fashion
- When recommending products, mention specific items from our catalog
- Consider user's style preferences, body type, occasion, and budget
- Provide practical styling tips
- If asked about products not in our catalog, politely redirect to available options
- Keep responses concise but helpful

Conversation History:
${conversationHistory || 'No previous conversation'}

User's current message: ${message}`

    // Generate response
    const result = await model.generateContent(systemPrompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ message: text })
  } catch (error) {
    console.error('Error in AI chat:', error)
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again.' },
      { status: 500 }
    )
  }
}