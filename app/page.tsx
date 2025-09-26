"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, User } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sphere, Float, Environment } from "@react-three/drei"
import type * as THREE from "three"

function FloatingSphere({
  position,
  color,
  size = 1,
}: { position: [number, number, number]; color: string; size?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={meshRef} position={position} args={[size, 32, 32]}>
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </Sphere>
    </Float>
  )
}

function Scene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <FloatingSphere position={[-4, 2, 0]} color="#06b6d4" size={0.8} />
      <FloatingSphere position={[4, -1, -2]} color="#84cc16" size={0.6} />
      <FloatingSphere position={[2, 3, -1]} color="#f59e0b" size={0.4} />
      <FloatingSphere position={[-2, -2, 1]} color="#ec4899" size={0.5} />
      <Environment preset="city" />
    </Canvas>
  )
}

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
              <span className="text-primary block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Perfectly Curated
              </span>
            </h1>
            <p className="font-serif text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Experience personalized fashion recommendations powered by advanced algorithms. Discover pieces that match
              your unique style and preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button size="lg" className="font-serif transform hover:scale-105 transition-transform duration-200">
                  Start Shopping
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="font-serif bg-transparent transform hover:scale-105 transition-transform duration-200"
              >
                Take Style Quiz
              </Button>
            </div>
          </div>

          <div ref={collectionsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[
              {
                src: "/elegant-woman-in-minimalist-fashion-outfit.png",
                alt: "Minimalist Collection",
                title: "Minimalist",
                desc: "Clean lines, timeless pieces",
                delay: "0ms",
              },
              {
                src: "/trendy-streetwear-fashion-collection.png",
                alt: "Streetwear Collection",
                title: "Streetwear",
                desc: "Urban edge, bold statements",
                delay: "200ms",
              },
              {
                src: "/elegant-formal-business-attire-collection.png",
                alt: "Formal Collection",
                title: "Formal",
                desc: "Professional elegance",
                delay: "400ms",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="group cursor-pointer overflow-hidden scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out transform hover:scale-105 hover:shadow-2xl"
                style={{
                  animationDelay: item.delay,
                  transform: `translateY(${scrollY * 0.05 * (index + 1)}px) scale(${1 + Math.sin(scrollY * 0.01 + index) * 0.02})`,
                }}
              >
                <div className="aspect-[4/5] bg-muted relative">
                  <img
                    src={item.src || "/placeholder.svg"}
                    alt={item.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/40 transition-all duration-300" />
                  <div className="absolute bottom-4 left-4 text-white transform group-hover:translate-y-[-4px] transition-transform duration-300">
                    <h3 className="font-sans font-bold text-xl mb-1">{item.title}</h3>
                    <p className="font-serif text-sm opacity-90">{item.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
                className="text-center p-6 scroll-animate opacity-0 translate-y-8 transition-all duration-1000 ease-out transform hover:scale-105 hover:shadow-lg group"
                style={{ animationDelay: feature.delay }}
              >
                <CardContent className="pt-6">
                  <div
                    className={`w-12 h-12 bg-${feature.color}/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className={`h-6 w-6 text-${feature.color}`} />
                  </div>
                  <h3 className="font-sans font-bold text-xl mb-2">{feature.title}</h3>
                  <p className="font-serif text-muted-foreground">{feature.desc}</p>
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
      `}</style>
    </div>
  )
}
