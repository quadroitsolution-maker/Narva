'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Star, ShoppingBag, ArrowRight, Search, SlidersHorizontal, Eye,
  X, ChevronDown, ChevronUp, Filter, Tag, IndianRupee, Package,
  ArrowUpDown, Sparkles, RotateCcw, Percent, Repeat
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import AiAssistant from '@/components/AiAssistant'
import { getProducts, getCategories } from '@/lib/db'
import { useCart } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Filter section accordion ─── */
function FilterSection({
  title,
  icon: Icon,
  defaultOpen = true,
  children,
}: {
  title: string
  icon: React.ElementType
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-premium-gold/10 dark:border-white/5 pb-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full group"
      >
        <span className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-matte-black/70 dark:text-dark-text/70 group-hover:text-premium-gold transition-colors">
          <Icon size={14} className="text-premium-gold" />
          {title}
        </span>
        {open ? (
          <ChevronUp size={14} className="text-matte-black/40 dark:text-dark-text/40" />
        ) : (
          <ChevronDown size={14} className="text-matte-black/40 dark:text-dark-text/40" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Price range constants ─── */
const PRICE_PRESETS = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 – ₹1,000', min: 500, max: 1000 },
  { label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
  { label: '₹2,000 – ₹5,000', min: 2000, max: 5000 },
  { label: 'Over ₹5,000', min: 5000, max: Infinity },
]

export default function AllProductsPage() {
  const { addItem } = useCart()
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])

  /* ── Filter states ── */
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null)
  const [availability, setAvailability] = useState<'all' | 'in-stock' | 'out-of-stock'>('all')
  const [onSaleOnly, setOnSaleOnly] = useState(false)
  const [subscriptionOnly, setSubscriptionOnly] = useState(false)
  const [sortBy, setSortBy] = useState<string>('featured')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const prodData = await getProducts()
        setProducts(prodData || [])
        const catData = await getCategories()
        setCategories((catData || []).map((c: any) => c.name))
      } catch (err) {
        console.error('Failed to load catalog data:', err)
      }
    }
    loadData()
  }, [])

  /* ── Category toggle helper ── */
  const toggleCategory = useCallback((cat: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }, [])

  /* ── Count active filters ── */
  const activeFilterCount = useMemo(() => {
    let c = 0
    if (selectedCategories.size > 0) c++
    if (priceRange) c++
    if (availability !== 'all') c++
    if (onSaleOnly) c++
    if (subscriptionOnly) c++
    if (searchQuery.trim()) c++
    return c
  }, [selectedCategories, priceRange, availability, onSaleOnly, subscriptionOnly, searchQuery])

  /* ── Reset all filters ── */
  const resetFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedCategories(new Set())
    setPriceRange(null)
    setAvailability('all')
    setOnSaleOnly(false)
    setSubscriptionOnly(false)
    setSortBy('featured')
  }, [])

  /* ── Filter & sort logic ── */
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search
        const q = searchQuery.toLowerCase()
        const matchesSearch =
          !q ||
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))

        // Category
        const matchesCategory =
          selectedCategories.size === 0 || selectedCategories.has(p.category)

        // Price range
        const matchesPrice =
          !priceRange ||
          (p.price >= priceRange.min && p.price <= priceRange.max)

        // Availability
        const matchesAvail =
          availability === 'all' ||
          (availability === 'in-stock' && p.stock_qty > 0) ||
          (availability === 'out-of-stock' && p.stock_qty <= 0)

        // On Sale
        const matchesSale = !onSaleOnly || (p.compare_price && p.compare_price > p.price)

        // Subscription
        const matchesSub = !subscriptionOnly || p.is_subscription_eligible

        return matchesSearch && matchesCategory && matchesPrice && matchesAvail && matchesSale && matchesSub
      })
      .sort((a: any, b: any) => {
        if (sortBy === 'price-low') return a.price - b.price
        if (sortBy === 'price-high') return b.price - a.price
        if (sortBy === 'name') return a.name.localeCompare(b.name)
        if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        return 0
      })
  }, [products, searchQuery, selectedCategories, priceRange, availability, onSaleOnly, subscriptionOnly, sortBy])

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      isSubscription: false,
      quantity: 1,
    })
  }

  /* ─────────────────────────────────────────────────────────────── */
  /*  Sidebar filter content (reused for desktop sidebar & mobile)  */
  /* ─────────────────────────────────────────────────────────────── */
  const filterContent = (
    <div className="space-y-6">

      {/* ── Active filter count & Reset ── */}
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between pb-2">
          <span className="text-[10px] font-bold text-premium-gold uppercase tracking-widest">
            {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
          </span>
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-[10px] font-semibold text-matte-black/50 dark:text-dark-text/50 hover:text-premium-gold transition-colors"
          >
            <RotateCcw size={11} />
            Clear all
          </button>
        </div>
      )}

      {/* ── Category Filter ── */}
      <FilterSection title="Category" icon={Tag}>
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={`w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                  selectedCategories.has(cat)
                    ? 'bg-premium-gold border-premium-gold shadow-[0_0_8px_rgba(197,168,128,0.3)]'
                    : 'border-premium-gold/25 dark:border-white/15 group-hover:border-premium-gold/50'
                }`}
                onClick={() => toggleCategory(cat)}
              >
                {selectedCategories.has(cat) && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </motion.svg>
                )}
              </div>
              <span
                onClick={() => toggleCategory(cat)}
                className={`text-xs transition-colors ${
                  selectedCategories.has(cat)
                    ? 'text-matte-black dark:text-dark-text font-semibold'
                    : 'text-matte-black/60 dark:text-dark-text/60 group-hover:text-matte-black dark:group-hover:text-dark-text'
                }`}
              >
                {cat}
              </span>
              <span className="ml-auto text-[10px] text-matte-black/30 dark:text-dark-text/30 font-medium">
                {products.filter((p) => p.category === cat).length}
              </span>
            </label>
          ))}
          {categories.length === 0 && (
            <p className="text-[11px] text-matte-black/40 dark:text-dark-text/40 italic">
              No categories available
            </p>
          )}
        </div>
      </FilterSection>

      {/* ── Price Range Filter ── */}
      <FilterSection title="Price Range" icon={IndianRupee}>
        <div className="space-y-2">
          {PRICE_PRESETS.map((preset) => {
            const isActive =
              priceRange?.min === preset.min && priceRange?.max === preset.max
            const count = products.filter(
              (p) => p.price >= preset.min && p.price <= preset.max
            ).length
            return (
              <button
                key={preset.label}
                onClick={() =>
                  setPriceRange(isActive ? null : { min: preset.min, max: preset.max })
                }
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200 ${
                  isActive
                    ? 'bg-premium-gold/10 border border-premium-gold/30 text-premium-gold font-semibold shadow-sm'
                    : 'border border-transparent hover:bg-warm-beige/30 dark:hover:bg-white/5 text-matte-black/60 dark:text-dark-text/60 hover:text-matte-black dark:hover:text-dark-text'
                }`}
              >
                <span>{preset.label}</span>
                <span className={`text-[10px] font-medium ${isActive ? 'text-premium-gold' : 'text-matte-black/30 dark:text-dark-text/30'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </FilterSection>

      {/* ── Availability Filter ── */}
      <FilterSection title="Availability" icon={Package}>
        <div className="space-y-2">
          {(
            [
              { key: 'all', label: 'All Products' },
              { key: 'in-stock', label: 'In Stock' },
              { key: 'out-of-stock', label: 'Out of Stock' },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setAvailability(key)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200 ${
                availability === key
                  ? 'bg-premium-gold/10 border border-premium-gold/30 text-premium-gold font-semibold shadow-sm'
                  : 'border border-transparent hover:bg-warm-beige/30 dark:hover:bg-white/5 text-matte-black/60 dark:text-dark-text/60 hover:text-matte-black dark:hover:text-dark-text'
              }`}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full border-2 transition-all ${
                  availability === key
                    ? 'border-premium-gold bg-premium-gold shadow-[0_0_6px_rgba(197,168,128,0.4)]'
                    : 'border-premium-gold/25 dark:border-white/15'
                }`}
              />
              {label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* ── On Sale Filter ── */}
      <FilterSection title="On Sale" icon={Percent} defaultOpen={false}>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            onClick={() => setOnSaleOnly(!onSaleOnly)}
            className={`w-[42px] h-[24px] rounded-full relative transition-all duration-300 cursor-pointer ${
              onSaleOnly
                ? 'bg-premium-gold shadow-[0_0_10px_rgba(197,168,128,0.3)]'
                : 'bg-premium-gold/15 dark:bg-white/10'
            }`}
          >
            <div
              className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-all duration-300 ${
                onSaleOnly ? 'left-[21px]' : 'left-[3px]'
              }`}
            />
          </div>
          <span className="text-xs text-matte-black/60 dark:text-dark-text/60 group-hover:text-matte-black dark:group-hover:text-dark-text transition-colors">
            Show only discounted items
          </span>
        </label>
        <p className="text-[10px] text-matte-black/35 dark:text-dark-text/35 mt-2 leading-relaxed">
          Products with a compare price higher than the current selling price.
        </p>
      </FilterSection>

      {/* ── Subscription Filter ── */}
      <FilterSection title="Subscription" icon={Repeat} defaultOpen={false}>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            onClick={() => setSubscriptionOnly(!subscriptionOnly)}
            className={`w-[42px] h-[24px] rounded-full relative transition-all duration-300 cursor-pointer ${
              subscriptionOnly
                ? 'bg-premium-gold shadow-[0_0_10px_rgba(197,168,128,0.3)]'
                : 'bg-premium-gold/15 dark:bg-white/10'
            }`}
          >
            <div
              className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-all duration-300 ${
                subscriptionOnly ? 'left-[21px]' : 'left-[3px]'
              }`}
            />
          </div>
          <span className="text-xs text-matte-black/60 dark:text-dark-text/60 group-hover:text-matte-black dark:group-hover:text-dark-text transition-colors">
            Subscription eligible only
          </span>
        </label>
        <p className="text-[10px] text-matte-black/35 dark:text-dark-text/35 mt-2 leading-relaxed">
          Products available for auto-refill subscription plans.
        </p>
      </FilterSection>

      {/* ── Sort By Filter ── */}
      <FilterSection title="Sort By" icon={ArrowUpDown} defaultOpen={false}>
        <div className="space-y-2">
          {[
            { key: 'featured', label: 'Featured' },
            { key: 'newest', label: 'Newest First' },
            { key: 'price-low', label: 'Price: Low → High' },
            { key: 'price-high', label: 'Price: High → Low' },
            { key: 'name', label: 'Name: A → Z' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200 ${
                sortBy === key
                  ? 'bg-premium-gold/10 border border-premium-gold/30 text-premium-gold font-semibold shadow-sm'
                  : 'border border-transparent hover:bg-warm-beige/30 dark:hover:bg-white/5 text-matte-black/60 dark:text-dark-text/60 hover:text-matte-black dark:hover:text-dark-text'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  )

  /* ─────────────────────────────────── */
  /*  Render                            */
  /* ─────────────────────────────────── */
  return (
    <>
      <Navbar />
      <CartDrawer />
      <AiAssistant />

      <div className="relative overflow-hidden bg-matte-white dark:bg-dark-bg transition-colors duration-300 min-h-screen">
        {/* Decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-premium-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-soft-blue/10 dark:bg-dark-blue/10 rounded-full blur-3xl pointer-events-none" />

        {/* ── Hero header ── */}
        <div className="relative z-10 pt-16 sm:pt-24 pb-10 text-center space-y-5 max-w-2xl mx-auto px-4">
          <span className="text-[10px] font-bold tracking-[0.2em] text-premium-gold uppercase bg-premium-gold/5 border border-premium-gold/15 px-3 py-1 rounded-full inline-block">
            Formulation Shop
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light leading-tight tracking-wide text-matte-black dark:text-dark-text">
            Clean Bio-Supports
          </h1>
          <p className="text-xs sm:text-sm text-matte-black/55 dark:text-dark-text/55 leading-relaxed max-w-lg mx-auto">
            Every formula is clinically researched, verified for clean dosage potency, and crafted specifically for cognitive support and circadian recovery.
          </p>
        </div>

        {/* ── Main 2-column layout ── */}
        <main className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pb-20">

          {/* ── Top bar: Search + mobile filter toggle + result count ── */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1 max-w-xl">
              <input
                type="text"
                placeholder="Search formulations (e.g. Melatonin)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-dark-card/50 border border-premium-gold/15 dark:border-white/10 text-xs pl-10 pr-4 py-3.5 rounded-2xl focus:outline-none focus:border-premium-gold focus:ring-2 focus:ring-premium-gold/15 transition-all text-matte-black dark:text-dark-text shadow-sm placeholder:text-matte-black/35 dark:placeholder:text-dark-text/35"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-premium-gold/60" size={14} />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-matte-black/30 dark:text-dark-text/30 hover:text-matte-black dark:hover:text-dark-text transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-premium-gold/20 bg-white dark:bg-dark-card/50 text-xs font-semibold text-matte-black/70 dark:text-dark-text/70 hover:border-premium-gold/40 transition-all shadow-sm"
            >
              <Filter size={14} className="text-premium-gold" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 bg-premium-gold text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Result count */}
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-matte-black/45 dark:text-dark-text/45 whitespace-nowrap ml-auto">
              <Sparkles size={12} className="text-premium-gold" />
              <span>
                <strong className="text-matte-black/70 dark:text-dark-text/70">{filteredProducts.length}</strong>{' '}
                of {products.length} formulations
              </span>
            </div>
          </div>

          <div className="flex gap-8">

            {/* ═══════════ LEFT SIDEBAR (Desktop) ═══════════ */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 bg-white/60 dark:bg-dark-card/30 backdrop-blur-xl border border-premium-gold/10 dark:border-white/5 rounded-3xl p-6 shadow-glass dark:shadow-glass-dark space-y-6 max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-thin">
                {/* Sidebar header */}
                <div className="flex items-center justify-between pb-2 border-b border-premium-gold/10 dark:border-white/5">
                  <h2 className="text-sm font-serif font-medium text-matte-black dark:text-dark-text flex items-center gap-2">
                    <SlidersHorizontal size={15} className="text-premium-gold" />
                    Refine Results
                  </h2>
                </div>
                {filterContent}
              </div>
            </aside>

            {/* ═══════════ MOBILE FILTER DRAWER ═══════════ */}
            <AnimatePresence>
              {mobileFiltersOpen && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                    onClick={() => setMobileFiltersOpen(false)}
                  />
                  {/* Drawer */}
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    className="fixed top-0 left-0 bottom-0 w-[320px] max-w-[85vw] bg-matte-white dark:bg-dark-bg z-50 overflow-y-auto shadow-2xl"
                  >
                    <div className="p-6 space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm font-serif font-medium text-matte-black dark:text-dark-text flex items-center gap-2">
                          <SlidersHorizontal size={15} className="text-premium-gold" />
                          Filters
                        </h2>
                        <button
                          onClick={() => setMobileFiltersOpen(false)}
                          className="p-2 rounded-xl hover:bg-warm-beige/30 dark:hover:bg-white/5 transition-colors"
                        >
                          <X size={16} className="text-matte-black/50 dark:text-dark-text/50" />
                        </button>
                      </div>
                      {filterContent}
                      {/* Apply button for mobile */}
                      <button
                        onClick={() => setMobileFiltersOpen(false)}
                        className="w-full py-3.5 bg-premium-gold hover:bg-premium-gold/90 text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition-all shadow-md"
                      >
                        Show {filteredProducts.length} Results
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* ═══════════ RIGHT: PRODUCT GRID ═══════════ */}
            <div className="flex-1 min-w-0">
              {/* Active filter chips */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  {Array.from(selectedCategories).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className="flex items-center gap-1.5 text-[10px] font-semibold bg-premium-gold/10 text-premium-gold border border-premium-gold/20 px-3 py-1.5 rounded-full hover:bg-premium-gold/20 transition-all"
                    >
                      <Tag size={10} />
                      {cat}
                      <X size={10} />
                    </button>
                  ))}
                  {priceRange && (
                    <button
                      onClick={() => setPriceRange(null)}
                      className="flex items-center gap-1.5 text-[10px] font-semibold bg-premium-gold/10 text-premium-gold border border-premium-gold/20 px-3 py-1.5 rounded-full hover:bg-premium-gold/20 transition-all"
                    >
                      <IndianRupee size={10} />
                      {PRICE_PRESETS.find(
                        (p) => p.min === priceRange.min && p.max === priceRange.max
                      )?.label || 'Custom'}
                      <X size={10} />
                    </button>
                  )}
                  {availability !== 'all' && (
                    <button
                      onClick={() => setAvailability('all')}
                      className="flex items-center gap-1.5 text-[10px] font-semibold bg-premium-gold/10 text-premium-gold border border-premium-gold/20 px-3 py-1.5 rounded-full hover:bg-premium-gold/20 transition-all"
                    >
                      <Package size={10} />
                      {availability === 'in-stock' ? 'In Stock' : 'Out of Stock'}
                      <X size={10} />
                    </button>
                  )}
                  {onSaleOnly && (
                    <button
                      onClick={() => setOnSaleOnly(false)}
                      className="flex items-center gap-1.5 text-[10px] font-semibold bg-premium-gold/10 text-premium-gold border border-premium-gold/20 px-3 py-1.5 rounded-full hover:bg-premium-gold/20 transition-all"
                    >
                      <Percent size={10} />
                      On Sale
                      <X size={10} />
                    </button>
                  )}
                  {subscriptionOnly && (
                    <button
                      onClick={() => setSubscriptionOnly(false)}
                      className="flex items-center gap-1.5 text-[10px] font-semibold bg-premium-gold/10 text-premium-gold border border-premium-gold/20 px-3 py-1.5 rounded-full hover:bg-premium-gold/20 transition-all"
                    >
                      <Repeat size={10} />
                      Subscription
                      <X size={10} />
                    </button>
                  )}
                  <button
                    onClick={resetFilters}
                    className="text-[10px] font-semibold text-matte-black/40 dark:text-dark-text/40 hover:text-premium-gold transition-colors underline underline-offset-2"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* Product grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredProducts.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="col-span-full py-20 text-center space-y-4 bg-white/40 dark:bg-dark-card/20 backdrop-blur-md rounded-3xl border border-premium-gold/10"
                    >
                      <SlidersHorizontal className="text-premium-gold mx-auto animate-bounce" size={36} />
                      <h3 className="font-serif text-xl text-matte-black dark:text-dark-text">No Formulations Match</h3>
                      <p className="text-xs text-matte-black/50 dark:text-dark-text/50 max-w-sm mx-auto">
                        We couldn't find any supplements matching your active filters. Try adjusting your criteria.
                      </p>
                      <button
                        onClick={resetFilters}
                        className="rounded-full bg-premium-gold hover:bg-premium-gold/90 transition-colors px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md"
                      >
                        Clear All Filters
                      </button>
                    </motion.div>
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
                          className="group flex flex-col justify-between bg-white/60 dark:bg-dark-card/20 backdrop-blur-md rounded-3xl border border-premium-gold/10 hover:border-premium-gold/30 hover:shadow-xl transition-all duration-300 p-5 h-full relative overflow-hidden"
                        >
                          <div className="space-y-4">
                            {/* Image */}
                            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-warm-beige/20 dark:bg-dark-bg/40 flex items-center justify-center border border-premium-gold/5">
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
                              <div className="absolute inset-0 bg-matte-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                <div className="p-3 bg-white/95 dark:bg-dark-bg/95 rounded-full text-premium-gold shadow-md">
                                  <Eye size={16} />
                                </div>
                              </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] font-bold text-premium-gold uppercase tracking-wider bg-premium-gold/5 border border-premium-gold/10 px-2 py-0.5 rounded-md">
                                  {p.category || 'Supplement'}
                                </span>
                                <div className="flex items-center gap-1 text-[10px] text-premium-gold">
                                  <Star size={10} className="fill-current" />
                                  <span className="font-semibold">4.8</span>
                                </div>
                              </div>
                              <h3 className="font-serif text-lg font-light text-matte-black dark:text-dark-text group-hover:text-premium-gold transition-colors line-clamp-1">
                                {p.name}
                              </h3>
                              <p className="text-[11px] text-matte-black/50 dark:text-dark-text/50 line-clamp-2 leading-relaxed h-8">
                                {p.description}
                              </p>
                            </div>
                          </div>

                          {/* Price & Action */}
                          <div className="flex items-center justify-between mt-5 pt-4 border-t border-premium-gold/8">
                            <div>
                              <span className="block text-[8px] text-matte-black/40 dark:text-dark-text/40 uppercase tracking-widest font-bold">
                                Total Price
                              </span>
                              <div className="flex items-baseline gap-1.5 mt-0.5">
                                <span className="text-lg font-bold text-premium-gold">₹{p.price}</span>
                                {p.compare_price && (
                                  <span className="text-xs line-through text-matte-black/35 dark:text-dark-text/35">
                                    ₹{p.compare_price}
                                  </span>
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
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </>
  )
}
