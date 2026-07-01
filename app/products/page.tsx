'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingBag, ArrowRight, Search, SlidersHorizontal, Eye } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import AiAssistant from '@/components/AiAssistant'
import { getProducts, getCategories } from '@/lib/db'
import { useCart } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'

export default function AllProductsPage() {
  const { addItem } = useCart()
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  
  // Search, filter, and sort states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sortBy, setSortBy] = useState<string>('featured')

  useEffect(() => {
    async function loadData() {
      try {
        const prodData = await getProducts()
        setProducts(prodData || [])
        
        const catData = await getCategories()
        const catList = ['All', ...(catData || []).map((c: any) => c.name)]
        setCategories(catList)
      } catch (err) {
        console.error('Failed to load catalog data:', err)
      }
    }
    loadData()
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

  // Filter & Sort logic
  const filteredProducts = products
    .filter((p) => {
      // 1. Search filter
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      // 2. Category filter
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory
      
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

      {/* Hero background overlay */}
      <div className="relative overflow-hidden bg-matte-white dark:bg-dark-bg transition-colors duration-300">
        
        {/* Subtle decorative glow background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-premium-gold/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
          
          {/* Header Hero Section */}
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold tracking-[0.2em] text-premium-gold uppercase bg-premium-gold/5 border border-premium-gold/15 px-3 py-1 rounded-full">
              Formulation Shop
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light leading-tight tracking-wide text-matte-black dark:text-dark-text">
              Clean Bio-Supports
            </h1>
            <p className="text-xs sm:text-sm text-matte-black/55 dark:text-dark-text/55 leading-relaxed max-w-lg mx-auto">
              Every formula is clinically researched, verified for clean dosage potency, and crafted specifically for cognitive support and circadian recovery.
            </p>
          </div>

          {/* ── SEARCH & FILTER CONTROLS BAR ── */}
          <div className="flex flex-col gap-5 bg-warm-beige/20 dark:bg-dark-card/30 border border-premium-gold/15 p-6 rounded-3xl backdrop-blur-md shadow-lg">
            
            {/* Top row: search & sort */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full">
              {/* Search Box */}
              <div className="relative w-full md:max-w-sm">
                <input
                  type="text"
                  placeholder="Search formulations (e.g. Melatonin)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 dark:border-white/10 text-xs pl-10 pr-4 py-3 rounded-2xl focus:outline-none focus:border-premium-gold focus:ring-1 focus:ring-premium-gold/20 transition-all text-matte-black dark:text-dark-text shadow-sm"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-matte-black/40 dark:text-dark-text/40" size={14} />
              </div>

              {/* Filters toggle / sorting dropdown */}
              <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-5">
                {/* Stock Toggle */}
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-matte-black/60 dark:text-dark-text/60 select-none">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-premium-gold h-4 w-4 rounded border-premium-gold/20"
                  />
                  In-Stock Only
                </label>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-matte-white dark:bg-dark-bg border border-premium-gold/15 dark:border-white/10 text-xs px-4 py-3 rounded-2xl focus:outline-none focus:border-premium-gold text-matte-black/60 dark:text-dark-text/60 cursor-pointer shadow-sm font-semibold"
                >
                  <option value="featured">Featured Catalog</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A-Z</option>
                </select>
              </div>
            </div>

            {/* Bottom row: Category Tabs */}
            {categories.length > 1 && (
              <div className="border-t border-premium-gold/10 dark:border-white/5 pt-4 flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                      selectedCategory === cat
                        ? 'bg-premium-gold text-white shadow-md'
                        : 'bg-matte-white dark:bg-dark-bg border border-premium-gold/10 hover:border-premium-gold/30 text-matte-black/60 dark:text-dark-text/60'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProducts.length === 0 ? (
                <div className="col-span-full py-20 text-center space-y-4 glass-panel rounded-3xl border border-premium-gold/10">
                  <SlidersHorizontal className="text-premium-gold mx-auto animate-bounce" size={36} />
                  <h3 className="font-serif text-xl">No Formulations Match</h3>
                  <p className="text-xs text-matte-black/50 dark:text-dark-text/50 max-w-sm mx-auto">
                    We couldn't find any supplements matching your active filters. Try clearing your search queries or tabs.
                  </p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setInStockOnly(false); }}
                    className="rounded-full bg-premium-gold hover:bg-premium-gold/90 transition-colors px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                filteredProducts.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <Link
                      href={`/products/${p.slug}`}
                      className="group flex flex-col justify-between glass-panel rounded-3xl border border-premium-gold/10 hover:border-premium-gold/30 hover:shadow-2xl transition-all duration-300 p-5 bg-warm-beige/5 dark:bg-dark-card/5 h-full relative overflow-hidden"
                    >
                      <div className="space-y-5">
                        
                        {/* Image Showcase */}
                        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-warm-beige/25 dark:bg-dark-bg/40 flex items-center justify-center p-6 border border-premium-gold/5 shadow-inner">
                          <Image
                            src={p.images[0]}
                            alt={p.name}
                            fill
                            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                          />
                          {p.stock_qty <= 0 ? (
                            <span className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm text-white text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                              Out of Stock
                            </span>
                          ) : p.stock_qty <= 10 ? (
                            <span className="absolute top-3 left-3 bg-amber-500/90 backdrop-blur-sm text-white text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                              Low Stock ({p.stock_qty})
                            </span>
                          ) : null}

                          {/* Quick view overlay icon */}
                          <div className="absolute inset-0 bg-matte-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <div className="p-3 bg-white/95 dark:bg-dark-bg/95 rounded-full text-premium-gold shadow-md">
                              <Eye size={16} />
                            </div>
                          </div>
                        </div>

                        {/* Info details */}
                        <div className="space-y-2.5">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-bold text-premium-gold uppercase tracking-wider bg-premium-gold/5 border border-premium-gold/10 px-2 py-0.5 rounded-md">
                              {p.category || 'Supplement'}
                            </span>
                            <div className="flex items-center gap-1 text-[10px] text-premium-gold">
                              <Star size={10} className="fill-current" />
                              <span className="font-semibold">4.8</span>
                            </div>
                          </div>
                          <h3 className="font-serif text-xl font-light text-matte-black dark:text-dark-text group-hover:text-premium-gold transition-colors line-clamp-1">
                            {p.name}
                          </h3>
                          <p className="text-[11px] text-matte-black/50 dark:text-dark-text/50 line-clamp-2 leading-relaxed h-8">
                            {p.description}
                          </p>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-premium-gold/8">
                        <div>
                          <span className="block text-[8px] text-matte-black/40 dark:text-dark-text/40 uppercase tracking-widest font-bold">Total Price</span>
                          <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="text-lg font-bold text-premium-gold">₹{p.price}</span>
                            {p.compare_price && (
                              <span className="text-xs line-through text-matte-black/35 dark:text-dark-text/35">₹{p.compare_price}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {p.stock_qty > 0 ? (
                            <button
                              onClick={(e) => handleAddToCart(p, e)}
                              className="p-3 bg-premium-gold hover:bg-premium-gold/90 text-white rounded-full transition-all shadow-md flex items-center justify-center hover:scale-105 active:scale-95"
                              title="Quick Add to Cart"
                            >
                              <ShoppingBag size={13} />
                            </button>
                          ) : (
                            <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider px-3 py-2 border border-red-500/20 bg-red-500/5 rounded-full select-none">
                              Sold Out
                            </span>
                          )}
                          <div className="p-3 bg-warm-beige/20 dark:bg-white/5 text-matte-black dark:text-dark-text rounded-full group-hover:bg-premium-gold group-hover:text-white transition-all flex items-center justify-center">
                            <ArrowRight size={13} />
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
      </div>

      <Footer />
    </>
  )
}
