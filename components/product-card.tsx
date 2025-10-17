"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag } from "lucide-react"
import { resolveColor } from "@/lib/utils"

interface Product {
  id: number
  dbId?: string
  name: string
  price: number
  originalPrice?: number
  category: string
  image: string
  colors: string[]
  sizes: string[]
  isNew: boolean
  isSale: boolean
}

interface ProductCardProps {
  product: Product
  onAddToCart?: (productId: number) => void
  onToggleWishlist?: (productId: number) => void
}

export function ProductCard({ product, onAddToCart, onToggleWishlist }: ProductCardProps) {
  return (
    <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-[3/4] bg-muted">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <Badge variant="secondary" className="text-xs">
              New
            </Badge>
          )}
          {product.isSale && <Badge className="bg-destructive text-destructive-foreground text-xs">Sale</Badge>}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onToggleWishlist?.(product.id)}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Add Button */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button className="w-full" size="sm" onClick={() => onAddToCart?.(product.id)}>
            <ShoppingBag className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-2">
          <Link href={`/product/${product.dbId || product.id}`}>
            <h3 className="font-sans font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer hover:underline">
              {product.name}
            </h3>
          </Link>
          <p className="font-serif text-sm text-muted-foreground">{product.category}</p>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="font-sans font-bold text-lg text-foreground">₹{product.price.toFixed(0)}</span>
          {product.originalPrice && (
            <span className="font-serif text-sm text-muted-foreground line-through">₹{product.originalPrice.toFixed(0)}</span>
          )}
        </div>

        {/* Color Options */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-serif text-xs text-muted-foreground">Colors:</span>
          <div className="flex gap-1">
      {product.colors.slice(0, 3).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-border"
        style={{ backgroundColor: resolveColor(color) }}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="font-serif text-xs text-muted-foreground">+{product.colors.length - 3}</span>
            )}
          </div>
        </div>

        {/* Size Options */}
        <div className="flex items-center gap-2">
          <span className="font-serif text-xs text-muted-foreground">Sizes:</span>
          <span className="font-serif text-xs text-foreground">{product.sizes.join(", ")}</span>
        </div>
      </CardContent>
    </Card>
  )
}
