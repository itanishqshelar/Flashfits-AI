"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, Send, Bot, User, ExternalLink } from 'lucide-react'

interface ReferencedProduct {
  id: string
  name: string
  image: string | null
  price: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  referencedProducts?: ReferencedProduct[]
}

interface AiChatbotProps {
  isOpen: boolean
  onClose: () => void
  initialMessage?: string
}

export function AiChatbot({ isOpen, onClose, initialMessage }: AiChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm your Flashfits AI styling assistant! I can help you find the perfect outfits from our collection. What kind of look are you going for today?",
      timestamp: new Date(),
      referencedProducts: []
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle initial message when chatbot is opened
  useEffect(() => {
    if (isOpen && initialMessage && initialMessage.trim()) {
      // Set the input and automatically send the message
      setInput(initialMessage)
      // Small delay to ensure the component is fully rendered
      const timer = setTimeout(() => {
        const messageToSend = initialMessage.trim()
        setInput('')
        
        const userMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content: messageToSend,
          timestamp: new Date(),
          referencedProducts: []
        }

        setMessages(prev => [...prev, userMessage])
        setIsLoading(true)

        // Send to AI
        const sendInitialMessage = async () => {
          try {
            const conversationHistory = messages
              .map(m => `${m.role}: ${m.content}`)
              .join('\n')

            const response = await fetch('/api/ai-chat', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                message: messageToSend,
                conversationHistory
              }),
            })

            const data = await response.json()

            if (!response.ok) {
              throw new Error(data.error || 'Failed to get response')
            }

            const assistantMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: data.message,
              timestamp: new Date(),
              referencedProducts: data.referencedProducts || []
            }

            setMessages(prev => [...prev, assistantMessage])
          } catch (error) {
            console.error('Error sending initial message:', error)
            const errorMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
              timestamp: new Date(),
              referencedProducts: []
            }
            setMessages(prev => [...prev, errorMessage])
          } finally {
            setIsLoading(false)
          }
        }

        sendInitialMessage()
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [isOpen, initialMessage])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      referencedProducts: []
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Build conversation history for context
      const conversationHistory = messages
        .map(m => `${m.role}: ${m.content}`)
        .join('\n')

      console.log('Sending message to AI:', input.trim())
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input.trim(),
          conversationHistory
        }),
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        referencedProducts: data.referencedProducts || []
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
        referencedProducts: []
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleProductClick = (productId: string) => {
    // Navigate to shop with the specific product highlighted
    window.open(`/shop?product=${productId}`, '_blank')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 flex-shrink-0">
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            Flashfits AI Styling Assistant
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col space-y-4 p-4 overflow-hidden min-h-0">
          <ScrollArea className="flex-1 pr-4 min-h-0">
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  
                  <div className={`flex-1 max-w-[calc(100%-3rem)] ${message.role === 'user' ? 'flex flex-col items-end' : 'flex flex-col items-start'}`}>
                    <div
                      className={`w-fit max-w-full rounded-lg px-3 py-2 break-words ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere">
                        {/* Remove product IDs from display text */}
                        {message.content.replace(/\[ID:\s*[^\]]+\]/g, '')}
                      </p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    
                    {/* Product Cards - only show for assistant messages with referenced products */}
                    {message.role === 'assistant' && message.referencedProducts && message.referencedProducts.length > 0 && (
                      <div className="mt-2 w-full max-w-full">
                        <p className="text-xs text-muted-foreground mb-2 font-medium">Sources:</p>
                        <div className="flex flex-wrap gap-2">
                          {message.referencedProducts.map((product) => (
                            <div
                              key={product.id}
                              onClick={() => handleProductClick(product.id)}
                              className="bg-background border rounded-lg p-2 cursor-pointer hover:bg-accent transition-colors flex items-center gap-2 max-w-[280px] min-w-[180px]"
                            >
                              {product.image ? (
                                <img 
                                  src={product.image} 
                                  alt={product.name}
                                  className="w-10 h-10 rounded object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs text-muted-foreground">No img</span>
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate text-foreground">{product.name}</p>
                                <p className="text-xs text-muted-foreground">₹{product.price}</p>
                              </div>
                              <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>
          
          <div className="flex gap-2 flex-shrink-0">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about styling, outfits, or our fashion collection..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}