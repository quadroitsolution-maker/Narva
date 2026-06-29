'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingBag, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import AiAssistant from '@/components/AiAssistant'
import { getProducts } from '@/lib/db'
import { useCart } from '@/lib/store'

export default function AllProductsPage() {
  const { addItem } = useCart()
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts()
      setProducts(data)
    }
    loadProducts()
  }, [])

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      isSubscription: false,
      quantity: 1
    })
  }

  return (
    <>
      <Navbar />
      <CartDrawer />
      <AiAssistant />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        
        {/* Header Hero Section */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <span className="text-[10px] font-bold tracking-widest text-premium-gold uppercase">
            The Formulation Shop
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-light leading-tight">
            Clean Bio-Supports
          </h1>
          <p className="text-xs text-matte-black/55 dark:text-dark-text/55 leading-relaxed">
            Every product is engineered with active ingredients, verified for dosage potency, and formulated specifically for cognitive and circadian recovery.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p) => (
            <Link
              href={`/products/${p.slug}`}
              key={p.id}
              className="group flex flex-col justify-between glass-panel rounded-3xl border border-premium-gold/10 hover:border-premium-gold/30 transition-all p-5 hover:shadow-xl bg-warm-beige/5 dark:bg-dark-card/5"
            >
              <div className="space-y-4">
                {/* Image Showcase */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-warm-beige/25 dark:bg-dark-bg/40 flex items-center justify-center p-6 border border-premium-gold/5">
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                  {p.stock_qty <= 10 && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                      Low Stock
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-premium-gold uppercase tracking-wider">
                      Supplement
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-premium-gold">
                      <Star size={10} className="fill-current" />
                      <span className="font-semibold">4.8</span>
                    </div>
                  </div>
                  <h3 className="font-serif text-lg text-matte-black dark:text-dark-text group-hover:text-premium-gold transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-[11px] text-matte-black/50 dark:text-dark-text/50 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-premium-gold/8">
                <div>
                  <span className="block text-[9px] text-matte-black/40 dark:text-dark-text/40 uppercase tracking-widest font-semibold">Price</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-md font-bold text-premium-gold">₹{p.price}</span>
                    {p.compare_price && (
                      <span className="text-xs line-through text-matte-black/35 dark:text-dark-text/35">₹{p.compare_price}</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => handleAddToCart(p, e)}
                    className="p-3 bg-premium-gold text-white rounded-full hover:bg-premium-gold/90 transition-all shadow-md flex items-center justify-center"
                    title="Add to Cart"
                  >
                    <ShoppingBag size={12} />
                  </button>
                  <div className="p-3 bg-warm-beige/20 dark:bg-white/5 text-matte-black dark:text-dark-text rounded-full group-hover:bg-premium-gold group-hover:text-white transition-all flex items-center justify-center">
                    <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </main>

      <Footer />
    </>
  )
}
