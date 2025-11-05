import { supabaseServer } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json()

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      )
    }

    // Fetch products from Supabase
    const supabase = await supabaseServer()
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .limit(50) // Limit for API response size

    if (error) {
      console.error('Error fetching products:', error)
    }

    console.log(`Fetched ${products?.length || 0} products from database`)

    // Create context about available products with their IDs for linking
    const productContext = products && products.length > 0
      ? products
          .map(
            (p) =>
              `- ${p.name} (ID: ${p.id || p.dbId}): ${p.description}, Price: $${(p.price_cents / 100).toFixed(2)}, Category: ${p.category || 'General'}`
          )
          .join('\n')
      : 'No products available in catalog yet'

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
- IMPORTANT: Always include a clickable link when recommending a product using this exact format: [Product Name](/product/PRODUCT_ID)
- For example: "Check out the [ZARA Beige Satin Button-Down Blouse](/product/123) - it's perfect for your needs!"
- Include multiple product links if recommending several items
- Consider user's style preferences, body type, occasion, and budget
- Provide practical styling tips
- If asked about products not in our catalog, politely redirect to available options
- Keep responses concise but helpful

Conversation History:
${conversationHistory || 'No previous conversation'}

User's current message: ${message}`

    // Try multiple models with fallback
    const models = [
      'meta-llama/llama-3-8b-instruct:free',  // Primary free model
      'meta-llama/llama-3.2-3b-instruct:free',
      'microsoft/phi-3-mini-128k-instruct:free',
      'mistralai/mistral-7b-instruct:free'
    ]

    let lastError = null
    
    for (const model of models) {
      try {
        console.log(`Trying model: ${model}`)
        
        // Call OpenRouter API
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://flashfits.vercel.app',
            'X-Title': 'Flashfits Fashion AI'
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'user',
                content: systemPrompt
              }
            ],
            temperature: 0.7,
            max_tokens: 1500
          })
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error(`OpenRouter API error for ${model}:`, JSON.stringify(errorData, null, 2))
          lastError = errorData
          continue // Try next model
        }

        const data = await response.json()
        const text = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.'
        
        console.log(`Success with model: ${model}`)
        return NextResponse.json({ message: text })
      } catch (err) {
        console.error(`Error with model ${model}:`, err)
        lastError = err
        continue // Try next model
      }
    }

    // If all models failed
    console.error('All models failed. Last error:', lastError)
    return NextResponse.json(
      { error: 'All AI models are currently unavailable. Please try again later.' },
      { status: 503 }
    )
  } catch (error) {
    console.error('Error in AI chat:', error)
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again.' },
      { status: 500 }
    )
  }
}