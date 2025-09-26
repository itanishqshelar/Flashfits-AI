import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const supabase = await supabaseServer()

  // Require auth
  const { data: userData } = await supabase.auth.getUser()
  const user = (userData as any)?.user
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Look up the product so we can optionally remove its storage object
  const { data: product, error: prodErr } = await supabase
    .from('products')
    .select('id,image_url')
    .eq('id', id)
    .single()

  if (prodErr) {
    // Not found or other DB error
    return NextResponse.json({ error: prodErr.message }, { status: 404 })
  }

  // If product had an image uploaded to the 'products' bucket, try removing it
  try {
    if (product?.image_url) {
      try {
        const url = new URL(product.image_url)
        // public URL path: /storage/v1/object/public/products/<path>
        const parts = url.pathname.split('/')
        const idx = parts.findIndex((p) => p === 'products')
        if (idx > -1) {
          const objectPath = parts.slice(idx + 1).join('/')
          // remove expects an array of paths
          await supabase.storage.from('products').remove([objectPath])
        }
      } catch (e) {
        // ignore errors parsing/removing the storage object
      }
    }
  } catch (e) {
    // noop
  }

  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ success: true })
}
