"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Filter, Heart, ShoppingBag } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { resolveColor } from "@/lib/utils"

// UI shape of products fetched from backend
type UIProduct = {
  id: number
  dbId?: string
  name: string
  price: number
  originalPrice?: number
  category: string
  image: string
  colors: string[]
  sizes: string[]
  isNew?: boolean
  isSale?: boolean
}

interface QuickAddDialogProps {
  product: UIProduct
  onAddToCart: (productId: number, color: string, size: string) => void
}

function QuickAddDialog({ product, onAddToCart }: QuickAddDialogProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [isOpen, setIsOpen] = useState(false)

  const handleAddToCart = () => {
    onAddToCart(product.id, selectedColor, selectedSize)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size="sm">
          Quick Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-sans">{product.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="font-serif text-sm text-muted-foreground mb-2 block">Color</label>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color ? "border-primary" : "border-border"
                  }`}
                  style={{ backgroundColor: resolveColor(color) }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="font-serif text-sm text-muted-foreground mb-2 block">Size</label>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-2 border rounded-md font-serif text-sm ${
                    selectedSize === size
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <span className="font-sans font-bold text-lg">${product.price}</span>
            {product.originalPrice && (
              <span className="font-serif text-sm text-muted-foreground line-through">${product.originalPrice}</span>
            )}
          </div>

          <Button onClick={handleAddToCart} className="w-full">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function ShopPage() {
  const [products, setProducts] = useState<UIProduct[]>([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const pageSize = 12
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const { state, dispatch } = useCart()
  const [banner, setBanner] = useState<string | null>(null)

  async function fetchPage(startOffset = 0, replace = false) {
    const params = new URLSearchParams()
    params.set('limit', String(pageSize))
    params.set('offset', String(startOffset))
    if (searchQuery) params.set('search', searchQuery)
    if (selectedCategory) params.set('category', selectedCategory)
    if (sortBy) params.set('sort', sortBy)
    const res = await fetch(`/api/products?${params.toString()}`, { cache: 'no-store' })
    if (!res.ok) return
    const { items, nextOffset, hasMore } = await res.json()
    setProducts((prev) => (replace ? items : [...prev, ...items]))
    setOffset(nextOffset)
    setHasMore(hasMore)
  }

  // initial + refetch on filters/sort/search change
  useEffect(() => {
    fetchPage(0, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory, sortBy])

  const addToCart = async (productId: number, color: string, size: string) => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      // optimistic UI
      dispatch({
        type: "ADD_ITEM",
        payload: {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          category: product.category,
          selectedColor: color,
          selectedSize: size,
        },
      })
      // try persist to backend
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity: 1,
          product: { name: product.name, price: product.price, image: product.image },
        }),
      })
      if (res.status === 401) setBanner('Sign in to save your cart across devices.')
    }
  }

  const sortedProducts = products

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {banner && (
          <div className="mb-4 p-3 border border-border rounded text-sm">
            {banner} <a className="text-primary underline" href="/login">Sign in</a>
          </div>
        )}
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-sans font-bold text-3xl md:text-4xl text-foreground mb-2">Discover Your Style</h1>
          <p className="font-serif text-lg text-muted-foreground">
            Curated fashion pieces tailored to your unique preferences
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="streetwear">Streetwear</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <Card key={product.id} className="group cursor-pointer overflow-hidden hover:shadow-lg transition-shadow">
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

                {/* Wishlist Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="h-4 w-4" />
                </Button>

                {/* Quick Add Button */}
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <QuickAddDialog product={product} onAddToCart={addToCart} />
                </div>
              </div>

              <CardContent className="p-4">
                <div className="mb-2">
                  <h3 className="font-sans font-semibold text-foreground group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="font-serif text-sm text-muted-foreground">{product.category}</p>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="font-sans font-bold text-lg text-foreground">${product.price}</span>
                  {product.originalPrice && (
                    <span className="font-serif text-sm text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>

                {/* Color Options */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-serif text-xs text-muted-foreground">Colors:</span>
                  <div className="flex gap-1">
                    {product.colors?.slice(0, 3).map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: resolveColor(color) }}
                      />
                    ))}
                    {product.colors?.length > 3 && (
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
          ))}
        </div>

        {/* No Results */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="font-serif text-lg text-muted-foreground mb-4">No products found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Load More */}
        {sortedProducts.length > 0 && (
          <div className="text-center mt-12">
            {hasMore ? (
              <Button variant="outline" size="lg" className="font-serif bg-transparent" onClick={() => fetchPage(offset)}>
                Load More Products
              </Button>
            ) : (
              <Button variant="outline" size="lg" className="font-serif bg-transparent" disabled>
                No more products
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
