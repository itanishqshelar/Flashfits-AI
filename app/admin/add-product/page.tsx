"use client"

import { useState, useEffect } from 'react'
import { supabaseBrowser } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'

export default function AddProductPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState<number | ''>('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [colors, setColors] = useState('')
  const [sizes, setSizes] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)

  const onSubmit = async () => {
    setStatus(null)
    const supabase = supabaseBrowser()

    // Require auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setStatus('Please sign in to add products.')
      return
    }

    let image_url: string | null = null
    if (imageFile) {
      // sanitize filename to avoid spaces and special chars in public URL
      const orig = imageFile.name
      const dot = orig.lastIndexOf('.')
      const base = (dot > 0 ? orig.slice(0, dot) : orig)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
      const ext = dot > 0 ? orig.slice(dot + 1) : 'jpg'
      const rand = Math.floor(Math.random() * 1000)
      const path = `${user.id}/${Date.now()}-${rand}-${base}.${ext}`

      const { error: upErr } = await supabase.storage.from('products').upload(path, imageFile)
      if (upErr) {
        setStatus(`Upload failed: ${upErr.message}`)
        return
      }
      const { data: pub } = supabase.storage.from('products').getPublicUrl(path)
      image_url = pub.publicUrl
    }

    const price_cents = typeof price === 'number' ? Math.round(price * 100) : 0
    if (!name.trim()) {
      setStatus('Name is required.')
      return
    }
    if (!description.trim()) {
      setStatus('Description is required.')
      return
    }

    // Parse colors and sizes from comma-separated strings
    const colorsArray = colors.split(',').map(c => c.trim()).filter(c => c.length > 0)
    const sizesArray = sizes.split(',').map(s => s.trim()).filter(s => s.length > 0)

    const { error: insErr } = await supabase
      .from('products')
      .insert({ 
        name, 
        description, 
        price_cents, 
        image_url, 
        category: category || 'General',
        colors: colorsArray,
        sizes: sizesArray
      })
    if (insErr) setStatus(`Insert failed: ${insErr.message}`)
    else {
      setStatus('Product added!')
      setName('')
      setDescription('')
      setPrice('')
      setColors('')
      setSizes('')
      setCategory('')
      setImageFile(null)
      // refresh list after adding
      fetchProducts()
    }
  }

  const fetchProducts = async () => {
    setLoadingProducts(true)
    try {
      const res = await fetch('/api/products')
      const json = await res.json()
      setProducts(json.items ?? [])
    } catch (e) {
      // ignore
    } finally {
      setLoadingProducts(false)
    }
  }

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onDelete = async (dbId: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return
    setStatus(null)
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(dbId)}`, { method: 'DELETE' })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setStatus(j?.error ?? 'Delete failed')
        return
      }
      setStatus('Product deleted')
      // refresh list
      fetchProducts()
    } catch (e: any) {
      setStatus(e?.message ?? 'Delete failed')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-xl mx-auto px-4 py-10">
        <h1 className="font-sans font-bold text-3xl mb-4">Add Product</h1>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="font-serif text-sm text-muted-foreground">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" />
            </div>
            <div>
              <label className="font-serif text-sm text-muted-foreground">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the product"
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div>
              <label className="font-serif text-sm text-muted-foreground">Price (INR)</label>
              <Input
                type="number"
                inputMode="decimal"
                min={0}
                step={1}
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 1999"
              />
            </div>
            <div>
              <label className="font-serif text-sm text-muted-foreground">Category</label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Formal, Casual, Streetwear"
              />
            </div>
            <div>
              <label className="font-serif text-sm text-muted-foreground">Colors (comma-separated)</label>
              <Input
                value={colors}
                onChange={(e) => setColors(e.target.value)}
                placeholder="e.g. Red, Blue, Black, White"
              />
            </div>
            <div>
              <label className="font-serif text-sm text-muted-foreground">Sizes (comma-separated)</label>
              <Input
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
                placeholder="e.g. XS, S, M, L, XL"
              />
            </div>
            <div>
              <label className="font-serif text-sm text-muted-foreground">Image</label>
              <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
            </div>
            <Button onClick={onSubmit} disabled={!name.trim() || !description.trim() || price === '' || (typeof price === 'number' && price < 0)}>Add</Button>
            {status && <p className="font-serif text-sm text-muted-foreground">{status}</p>}
          </CardContent>
        </Card>

        <section className="mt-8">
          <h2 className="font-sans font-bold text-2xl mb-4">Products</h2>
          {loadingProducts && <p className="text-sm text-muted-foreground">Loading...</p>}
          {!loadingProducts && products.length === 0 && <p className="text-sm text-muted-foreground">No products found.</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.dbId} className="space-y-2">
                <ProductCard product={p} />
                <div className="flex gap-2">
                  <Button variant="destructive" onClick={() => onDelete(p.dbId)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}