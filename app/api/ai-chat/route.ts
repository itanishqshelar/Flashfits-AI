import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabaseServer } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('AI Chat API called')
    const { message, conversationHistory } = await request.json()
    console.log('Received message:', message)

    if (!process.env.GEMINI_API_KEY) {
      console.error('Gemini API key not found')
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    console.log('Gemini API key found, initializing AI...')
    // Initialize Gemini AI with explicit configuration
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    
    
    let model;
    let modelUsed = '';
    
    
    const modelsToTry = [
      'gemini-2.5-flash',      
      'gemini-2.5-pro',        
      'models/gemini-2.5-flash',
      'models/gemini-2.5-pro',
    ];
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`Trying model: ${modelName}`)
        model = genAI.getGenerativeModel({ model: modelName })
        
        // Test the model with a simple prompt
        const testResult = await model.generateContent('Hello')
        const testResponse = await testResult.response
        testResponse.text() // This will throw if there's an issue
        
        modelUsed = modelName
        console.log(`Successfully initialized model: ${modelName}`)
        break
      } catch (modelError) {
        console.log(`Model ${modelName} failed:`, modelError)
        continue
      }
    }
    
    if (!model || !modelUsed) {
      return NextResponse.json(
        { error: 'No compatible Gemini model found. Please check your API key is from Google AI Studio (not Google Cloud Console).' },
        { status: 500 }
      )
    }

    console.log('Fetching products from Supabase...')
    // Fetch real products from Supabase
    const supabase = await supabaseServer()
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .limit(50) // Limit for API response size

    if (error) {
      console.error('Error fetching products:', error)
    } else {
      console.log('Products fetched successfully:', products?.length || 0, 'products')
    }

    // Create context about available products
    const productContext = products && products.length > 0
      ? products
          .map(
            (p) =>
              `- ${p.name}: ${p.description}, Price: ₹${(p.price_cents / 100).toFixed(0)} [ID: ${p.dbId}]`
          )
          .join('\n')
      : `- Classic White T-Shirt: Basic white cotton t-shirt, perfect for casual wear, Price: ₹1999 [ID: sample-1]
    - Blue Denim Jeans: Slim fit blue jeans made from premium denim, Price: ₹4999 [ID: sample-2]
    - Black Leather Jacket: Stylish black leather jacket for a bold look, Price: ₹12999 [ID: sample-3]
    - Summer Floral Dress: Light and airy floral dress perfect for summer, Price: ₹3999 [ID: sample-4]
    - Sneakers: Comfortable white sneakers for everyday wear, Price: ₹7999 [ID: sample-5]`

   
    const isStyleQuiz = message.toLowerCase().includes('style quiz') || message.toLowerCase().includes('take style quiz')
    
    const baseSystemPrompt = `You are Flashfits AI, a helpful fashion styling assistant for an e-commerce platform. 

Your role is to:
1. Help users find the perfect fashion items from our catalog
2. Provide styling advice and outfit recommendations
3. Suggest products based on user preferences, occasions, and style needs
4. Answer questions about fashion trends and styling tips
5. Conduct style quizzes to understand user preferences

Available Products in our catalog:
${productContext}

Guidelines:
- Be friendly, knowledgeable, and enthusiastic about fashion
- When recommending products, mention specific items from our catalog by name
- IMPORTANT: When mentioning a product, include its ID in square brackets like [ID: product-id]
- Consider user's style preferences, body type, occasion, and budget
- Provide practical styling tips
- If asked about products not in our catalog, politely redirect to available options
- Keep responses concise but helpful`

    const styleQuizPrompt = `
STYLE QUIZ MODE:
You are now conducting a personalized style quiz. Your goal is to understand the user's:
- Personal style preferences (minimalist, bold, classic, trendy, etc.)
- Lifestyle and occasions they dress for
- Color preferences
- Fit preferences
- Budget considerations
- Current wardrobe gaps

Start with a warm greeting and ask 3-5 thoughtful questions ONE AT A TIME. After each response, ask a follow-up question based on their answer. At the end, provide personalized product recommendations from our catalog.

Begin the quiz now with an engaging introduction and your first question.`

    const systemPrompt = baseSystemPrompt + (isStyleQuiz ? styleQuizPrompt : `

Conversation History:
${conversationHistory || 'No previous conversation'}

User's current message: ${message}`)

    console.log('Generating AI response...')
    // Generate response
    const result = await model.generateContent(systemPrompt)
    const response = await result.response
    const text = response.text()

    console.log('AI response generated successfully using model:', modelUsed)
    
    // Extract product IDs mentioned in the response and fetch their details
    const productIdRegex = /\[ID:\s*([^\]]+)\]/g
    const mentionedProductIds = []
    let match
    while ((match = productIdRegex.exec(text)) !== null) {
      mentionedProductIds.push(match[1])
    }

    // Fetch details for mentioned products
    const referencedProducts = []
    if (mentionedProductIds.length > 0 && products) {
      for (const productId of mentionedProductIds) {
        const product = products.find(p => p.dbId === productId)
        if (product) {
          referencedProducts.push({
            id: product.dbId,
            name: product.name,
            image: product.image_url,
            price: (product.price_cents / 100).toFixed(2)
          })
        }
      }
    }

    return NextResponse.json({ 
      message: text,
      referencedProducts: referencedProducts
    })
  } catch (error) {
    console.error('Error in AI chat:', error)
    // Return more detailed error information for debugging
    return NextResponse.json(
      { 
        error: 'Failed to process your request. Please verify your Gemini API key is from Google AI Studio.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}