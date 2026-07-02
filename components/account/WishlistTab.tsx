'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import { useCart } from '@/lib/store'

interface WishlistTabProps {
  supabase: any
  user: any
}

export default function WishlistTab({ supabase, user }: WishlistTabProps) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  const loadWishlist = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('wishlist')
        .select('*, products(*)')
        .eq('user_id', user.id)

      if (!error && data) {
        setItems(data)
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadWishlist()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleRemove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('id', id)

      if (error) throw error
      setItems(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      console.error('Failed to remove from wishlist:', err)
    }
  }

  const handleMoveToCart = async (item: any) => {
    const prod = item.products
    if (!prod) return
    
    // Add to cart
    addItem({
      productId: prod.id,
      name: prod.name,
      price: prod.price,
      image: prod.images?.[0] || '/images/melatonin.png',
      isSubscription: false,
      quantity: 1
    })

    // Remove from database wishlist
    await handleRemove(item.id)
    alert(`${prod.name} moved to cart!`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-premium-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl font-light border-b border-premium-gold/10 pb-4">My Wishlist</h2>

      {items.length === 0 ? (
        <div className="glass-panel text-center py-16 rounded-2xl border border-premium-gold/10">
          <Heart className="text-premium-gold/25 mx-auto mb-3" size={32} />
          <p className="text-xs text-matte-black/45">Your wishlist is empty.</p>
          <button
            onClick={() => window.location.href = '/products'}
            className="mt-4 inline-flex items-center gap-1.5 text-xs text-premium-gold hover:underline font-bold uppercase tracking-wider"
          >
            Shop formulations <ArrowRight size={13} />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map(item => {
            const prod = item.products
            if (!prod) return null
            const inStock = prod.stock_qty > 0

            return (
              <div
                key={item.id}
                className="glass-panel p-5 rounded-2xl border border-premium-gold/10 flex gap-4 bg-warm-beige/5 hover:border-premium-gold/30 transition-all duration-300"
              >
                <div className="relative w-20 h-20 bg-warm-beige/25 rounded-xl overflow-hidden border border-premium-gold/10 p-2 flex-shrink-0 flex items-center justify-center">
                  <Image
                    src={prod.images?.[0] || '/images/melatonin.png'}
                    alt={prod.name}
                    fill
                    className="object-contain p-1"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="font-serif text-md text-matte-black dark:text-dark-text leading-tight">
                      {prod.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-premium-gold">₹{prod.price}</span>
                      {prod.compare_price && (
                        <span className="text-xs line-through text-matte-black/30">₹{prod.compare_price}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-premium-gold/8 pt-3 mt-3">
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-500 hover:text-red-600 transition-colors p-1"
                      title="Remove Item"
                    >
                      <Trash2 size={14} />
                    </button>

                    {inStock ? (
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="flex items-center gap-1.5 bg-premium-gold hover:bg-premium-gold/90 text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all"
                      >
                        <ShoppingBag size={11} /> Move to Cart
                      </button>
                    ) : (
                      <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider px-2.5 py-1.5 border border-red-500/10 bg-red-500/5 rounded-lg">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
