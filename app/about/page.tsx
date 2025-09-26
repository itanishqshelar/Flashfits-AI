import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Users, Award } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 font-serif">
            About Flashfits
          </Badge>
          <h1 className="font-sans font-bold text-4xl md:text-6xl text-foreground mb-6">
            Revolutionizing Fashion
            <span className="text-primary block">Through AI</span>
          </h1>
          <p className="font-serif text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            We believe everyone deserves to look and feel their best. Our AI-powered platform makes personalized fashion
            accessible, intuitive, and enjoyable for everyone.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-sans font-bold text-xl mb-2">Our Mission</h3>
              <p className="font-serif text-muted-foreground">
                To democratize fashion by making personalized styling accessible to everyone through cutting-edge AI
                technology.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-sans font-bold text-xl mb-2">Our Community</h3>
              <p className="font-serif text-muted-foreground">
                Building a diverse community of fashion enthusiasts who celebrate individual style and self-expression.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-sans font-bold text-xl mb-2">Our Promise</h3>
              <p className="font-serif text-muted-foreground">
                Delivering quality, sustainability, and innovation in every recommendation and product we offer.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Story Section */}
        <div className="bg-muted/30 rounded-2xl p-8 md:p-12 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-sans font-bold text-3xl md:text-4xl text-foreground mb-6">Our Story</h2>
            <p className="font-serif text-lg text-muted-foreground mb-6">
              Founded in 2024, Flashfits emerged from a simple observation: finding the perfect outfit shouldn't be
              overwhelming. Our team of fashion experts, data scientists, and AI engineers came together with a shared
              vision of making personalized fashion recommendations as natural as having a conversation with your most
              stylish friend.
            </p>
            <p className="font-serif text-lg text-muted-foreground">
              Today, we're proud to serve thousands of fashion enthusiasts worldwide, helping them discover their unique
              style through the power of artificial intelligence and human creativity.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="font-sans font-bold text-3xl md:text-4xl text-foreground mb-4">
            Ready to Discover Your Style?
          </h2>
          <p className="font-serif text-lg text-muted-foreground mb-8">
            Join our community and experience personalized fashion like never before.
          </p>
          <Link href="/shop">
            <Button size="lg" className="font-serif">
              Start Your Journey
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
