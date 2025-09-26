import { Sparkles } from "lucide-react"
import Link from "next/link"

const footerLinks = {
  Shop: [
    { name: "New Arrivals", href: "/shop?filter=new" },
    { name: "Best Sellers", href: "/shop?filter=bestsellers" },
    { name: "Sale", href: "/shop?filter=sale" },
    { name: "Gift Cards", href: "/gift-cards" },
  ],
  Support: [
    { name: "Size Guide", href: "/size-guide" },
    { name: "Shipping & Returns", href: "/shipping" },
    { name: "Contact Us", href: "/contact" },
    { name: "FAQ", href: "/faq" },
  ],
  Company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Sustainability", href: "/sustainability" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="font-sans font-bold text-xl text-foreground">Flashfits</span>
            </div>
            <p className="font-serif text-muted-foreground mb-6 max-w-md">
              AI-powered fashion platform delivering personalized style recommendations for your unique taste.
            </p>
            <div className="flex gap-4">
              <Link href="/newsletter" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Newsletter
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-sans font-semibold text-foreground mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="font-serif text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="font-serif text-sm text-muted-foreground mb-4 md:mb-0">
            © 2024 Flashfits. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/accessibility" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Accessibility
            </Link>
            <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
