'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingBag, ArrowRight, Search, SlidersHorizontal } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import AiAssistant from '@/components/AiAssistant'
import { getProducts } from '@/lib/db'
import { useCart } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'

export default function AllProductsPage() {
  const { addItem } = useCart()
  const [products, setProducts] = useState<any[]>([])
  
  // Search, filter, and sort states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sortBy, setSortBy] = useState<string>('featured')

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

  // Categories list
  const categories = ['All', 'Sleep Health', 'Science', 'Cognitive']

  // Filter & Sort logic
  const filteredProducts = products
    .filter((p) => {
      // 1. Search filter
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      // 2. Category filter
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory || (selectedCategory === 'Sleep Health' && p.slug.includes('melatonin'))
      
      // 3. Stock filter
      const matchesStock = !inStockOnly || p.stock_qty > 0

      return matchesSearch && matchesCategory && matchesStock
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return 0 // featured
    })

  return (
    <>
      <Navbar />
      <CartDrawer />
      <AiAssistant />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        
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

        {/* ── SEARCH & FILTER CONTROLS BAR ── */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-warm-beige/10 dark:bg-dark-card/25 border border-premium-gold/15 p-5 rounded-2xl">
          {/* Search Box */}
          <div className="relative w-full md:max-w-xs">
            <input
              type="text"
              placeholder="Search supplement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border border-premium-gold/15 dark:border-white/10 text-xs pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-premium-gold/50 transition-colors"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-matte-black/40 dark:text-dark-text/40" size={13} />
          </div>

          {/* Categories selectors */}
          <div className="hidden lg:flex items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? 'bg-premium-gold text-white shadow-sm'
                    : 'border border-premium-gold/10 hover:border-premium-gold/30 text-matte-black/60 dark:text-dark-text/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Filters toggle / sorting dropdown */}
          <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-3">
            {/* Stock Toggle */}
            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer text-matte-black/60 dark:text-dark-text/60">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-premium-gold rounded"
              />
              In-Stock Only
            </label>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border border-premium-gold/15 dark:border-white/10 text-xs px-3 py-2.5 rounded-xl focus:outline-none text-matte-black/60 dark:text-dark-text/60"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProducts.length === 0 ? (
              <div className="col-span-full py-16 text-center space-y-4">
                <SlidersHorizontal className="text-premium-gold mx-auto" size={32} />
                <h3 className="font-serif text-lg">No Formulations Match</h3>
                <p className="text-xs text-matte-black/50 dark:text-dark-text/50 max-w-sm mx-auto">
                  Try clearing your search queries or resetting filters to explore other items.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setInStockOnly(false); }}
                  className="rounded-full bg-premium-gold px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredProducts.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                >
                  <Link
                    href={`/products/${p.slug}`}
                    className="group flex flex-col justify-between glass-panel rounded-3xl border border-premium-gold/10 hover:border-premium-gold/30 transition-all p-5 hover:shadow-xl bg-warm-beige/5 dark:bg-dark-card/5 h-full"
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
                        {p.stock_qty <= 0 ? (
                          <span className="absolute top-3 left-3 bg-red-500 text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                            Out of Stock
                          </span>
                        ) : p.stock_qty <= 10 ? (
                          <span className="absolute top-3 left-3 bg-amber-500 text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                            Low Stock
                          </span>
                        ) : null}
                      </div>

                      {/* Info */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold text-premium-gold uppercase tracking-wider">
                            {p.category || 'Supplement'}
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
                        {p.stock_qty > 0 ? (
                          <button
                            onClick={(e) => handleAddToCart(p, e)}
                            className="p-3 bg-premium-gold text-white rounded-full hover:bg-premium-gold/90 transition-all shadow-md flex items-center justify-center"
                            title="Add to Cart"
                          >
                            <ShoppingBag size={12} />
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider px-3 py-1.5 border border-red-500/20 bg-red-500/5 rounded-full">
                            Sold Out
                          </span>
                        )}
                        <div className="p-3 bg-warm-beige/20 dark:bg-white/5 text-matte-black dark:text-dark-text rounded-full group-hover:bg-premium-gold group-hover:text-white transition-all flex items-center justify-center">
                          <ArrowRight size={12} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

      </main>

      <Footer />
    </>
  )
}
