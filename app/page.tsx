"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, User } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AiChatbot } from "@/components/ai-chatbot"
import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"

// Dynamically import the entire Scene3D component to avoid SSR issues
const Scene3D = dynamic(() => import("./Scene3D").then(mod => ({ default: mod.Scene3D })), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 animate-pulse" />
})

function useScrollAnimation() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return scrollY
}

export default function HomePage() {
  const scrollY = useScrollAnimation()
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const collectionsRef = useRef<HTMLDivElement>(null)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const [initialMessage, setInitialMessage] = useState('')

  const handleStyleQuiz = () => {
    setInitialMessage('Take Style quiz')
    setIsChatbotOpen(true)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll(".scroll-animate")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="absolute top-0 left-0 right-0 h-96 pointer-events-none z-10">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-full">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-primary/30 via-secondary/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute top-8 left-1/3 transform -translate-x-1/2 w-64 h-64 bg-gradient-to-b from-accent/25 via-primary/15 to-transparent rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-4 right-1/3 transform translate-x-1/2 w-80 h-80 bg-gradient-to-b from-secondary/20 via-accent/15 to-transparent rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60"></div>
      </div>

      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 dark:from-primary/20 dark:via-secondary/10 dark:to-accent/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/40"></div>

        {/* 3D Background */}
        <div className="absolute inset-0 opacity-20">
          <Scene3D />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div
            ref={heroRef}
            className="text-center mb-16 scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out"
            style={{
              transform: `translateY(${scrollY * 0.1}px)`,
            }}
          >
            <Badge variant="secondary" className="mb-4 font-serif">
              AI-Powered Fashion
            </Badge>
            <h1 className="font-sans font-bold text-4xl md:text-6xl lg:text-7xl text-foreground mb-6">
              Your Style,
              <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Perfectly Curated
              </span>
            </h1>
            <p className="font-serif text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Experience personalized fashion recommendations powered by advanced algorithms. Discover pieces that match
              your unique style and preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button size="lg" className="font-serif transform hover:scale-105 transition-all duration-200 hover:shadow-2xl hover:animate-glow bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80">
                  Start Shopping
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="font-serif bg-transparent transform hover:scale-105 transition-all duration-200 hover:shadow-lg hover:border-primary hover:text-primary hover:animate-shimmer"
                onClick={handleStyleQuiz}
              >
                Take Style Quiz
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-accent/10 via-primary/5 to-secondary/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out">
            <h2 className="font-sans font-bold text-3xl md:text-4xl text-foreground mb-4">Featured Looks</h2>
            <p className="font-serif text-lg text-muted-foreground max-w-2xl mx-auto">
              Inspired by the latest trends from Zara. Discover styles that blend elegance and modernity.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              className="relative overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105 scroll-animate opacity-0 translate-y-8"
              style={{
                transform: `rotate(${scrollY * 0.02}deg) scale(${1 + Math.sin(scrollY * 0.001) * 0.05}) translateY(${scrollY * 0.1}px)`,
                animationDelay: "0ms",
              }}
            >
              <img
                src="/zara1.jpg"
                alt="Zara Inspired Look 1"
                className="w-full h-auto object-cover transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                <h3 className="font-sans font-bold text-xl mb-1">Elegant Minimalism</h3>
                <p className="font-serif text-sm">Timeless pieces with a modern twist</p>
              </div>
            </div>
            <div
              className="relative overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105 scroll-animate opacity-0 translate-y-8"
              style={{
                transform: `rotate(${-scrollY * 0.02}deg) scale(${1 + Math.sin(scrollY * 0.001 + Math.PI) * 0.05}) translateY(${scrollY * 0.15}px)`,
                animationDelay: "200ms",
              }}
            >
              <img
                src="/zara2.jpg"
                alt="Zara Inspired Look 2"
                className="w-full h-auto object-cover transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                <h3 className="font-sans font-bold text-xl mb-1">Urban Chic</h3>
                <p className="font-serif text-sm">Bold statements for the city streets</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out">
            <h2 className="font-sans font-bold text-3xl md:text-4xl text-white mb-4">Spring-Summer 2026 Show</h2>
            <p className="font-serif text-lg text-gray-300 max-w-2xl mx-auto">
              Experience the future of fashion with our exclusive runway preview.
            </p>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out" style={{ animationDelay: "200ms" }}>
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto max-h-[70vh] object-cover"
              poster="/placeholder.svg"
            >
              <source src="/diordemo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out">
            <h2 className="font-sans font-bold text-3xl md:text-4xl text-foreground mb-4">What Our Users Say</h2>
            <p className="font-serif text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from fashion enthusiasts who've transformed their style with Flashfits.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Flashfits completely changed how I shop. The AI recommendations are spot-on!",
                author: "Sarah M.",
                role: "Fashion Blogger",
                delay: "0ms",
              },
              {
                quote: "I discovered styles I never thought I'd love. It's like having a personal stylist.",
                author: "Alex K.",
                role: "Creative Director",
                delay: "200ms",
              },
              {
                quote: "The trend insights keep me ahead of the curve. Highly recommend!",
                author: "Jordan L.",
                role: "Marketing Exec",
                delay: "400ms",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="p-6 scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out hover:scale-105 hover:shadow-xl bg-white/50 backdrop-blur-sm"
                style={{ animationDelay: testimonial.delay }}
              >
                <CardContent className="pt-0">
                  <div className="mb-4">
                    <Sparkles className="h-8 w-8 text-primary mb-2" />
                    <p className="font-serif italic text-muted-foreground">"{testimonial.quote}"</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {testimonial.author[0]}
                    </div>
                    <div>
                      <p className="font-sans font-bold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Creative Style Inspiration Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-sans font-bold text-3xl md:text-4xl text-foreground mb-4">Style Inspiration</h2>
            <p className="font-serif text-lg text-muted-foreground max-w-2xl mx-auto">
              Let AI curate your perfect look from millions of possibilities. Discover trends that match your vibe.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-xl">AI-Powered Curation</h3>
                    <p className="text-muted-foreground">Personalized recommendations based on your preferences</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-xl">Trend Forecasting</h3>
                    <p className="text-muted-foreground">Stay ahead with cutting-edge fashion insights</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center overflow-hidden">
                  <div className="w-3/4 h-3/4 bg-gradient-to-br from-accent/30 to-primary/30 rounded-full animate-pulse"></div>
                  <div className="absolute inset-4 bg-gradient-to-br from-secondary/40 to-accent/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute inset-8 bg-gradient-to-br from-primary/50 to-secondary/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full animate-bounce"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute top-1/2 -left-6 w-4 h-4 bg-accent rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"
            style={{ transform: `translateX(${scrollY * 0.1}px)` }}
          />
          <div
            className="absolute bottom-20 right-10 w-48 h-48 bg-secondary rounded-full blur-3xl"
            style={{ transform: `translateX(${-scrollY * 0.15}px)` }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out">
            <h2 className="font-sans font-bold text-3xl md:text-4xl text-foreground mb-4">Why Choose Flashfits?</h2>
            <p className="font-serif text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform learns your preferences to deliver personalized fashion recommendations.
            </p>
          </div>

          <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "AI Recommendations",
                desc: "Advanced algorithms analyze your style preferences to suggest perfect matches.",
                color: "primary",
                delay: "0ms",
              },
              {
                icon: TrendingUp,
                title: "Trend Insights",
                desc: "Stay ahead with curated trends and seasonal fashion insights.",
                color: "secondary",
                delay: "200ms",
              },
              {
                icon: User,
                title: "Personal Styling",
                desc: "Get personalized styling advice tailored to your body type and lifestyle.",
                color: "accent",
                delay: "400ms",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="text-center p-6 scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out transform hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-br hover:from-primary/5 hover:to-secondary/5 group border-2 border-transparent hover:border-primary/20"
                style={{ animationDelay: feature.delay }}
              >
                <CardContent className="pt-6">
                  <div
                    className={`w-12 h-12 bg-${feature.color}/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-${feature.color}/20 transition-all duration-300 group-hover:shadow-lg`}
                  >
                    <feature.icon className={`h-6 w-6 text-${feature.color} group-hover:animate-pulse`} />
                  </div>
                  <h3 className="font-sans font-bold text-xl mb-2 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                  <p className="font-serif text-muted-foreground group-hover:text-foreground transition-colors duration-300">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out">
          <h2 className="font-sans font-bold text-3xl md:text-4xl text-foreground mb-4">
            Ready to Transform Your Wardrobe?
          </h2>
          <p className="font-serif text-lg text-muted-foreground mb-8">
            Join thousands of fashion enthusiasts who trust Flashfits for their style journey.
          </p>
          <Link href="/shop">
            <Button
              size="lg"
              className="font-serif transform hover:scale-110 transition-all duration-300 hover:shadow-lg"
            >
              Explore Collections
            </Button>
          </Link>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        /* Added pulsing animation for dynamic lighting effect */
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8); }
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      {/* AI Chatbot */}
      <AiChatbot 
        isOpen={isChatbotOpen} 
        onClose={() => setIsChatbotOpen(false)}
      />
    </div>
  )
}
