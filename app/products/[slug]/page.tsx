'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ShieldAlert, Check, ChevronDown, MessageSquare, ArrowRight, BookOpen, AlertCircle, X, Play } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import AiAssistant from '@/components/AiAssistant'
import { getProductBySlug, getReviews, addReview } from '@/lib/db'
import { useCart } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const { addItem } = useCart()
  const [product, setProduct] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'dosage'>('description')
  const [purchaseType, setPurchaseType] = useState<'one' | 'sub'>('one')
  
  // Review Form States
  const [reviewName, setReviewName] = useState('')
  const [reviewCity, setReviewCity] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewBody, setReviewBody] = useState('')
  const [reviewVideoFile, setReviewVideoFile] = useState<File | null>(null)
  const [reviewVideoUrl, setReviewVideoUrl] = useState('')
  const [reviewVideoName, setReviewVideoName] = useState('')
  const [activeVideoReview, setActiveVideoReview] = useState<any | null>(null)
  const [formSuccess, setFormSuccess] = useState(false)

  useEffect(() => {
    async function loadProductData() {
      const prod = await getProductBySlug(slug)
      setProduct(prod)
      if (prod) {
        const revs = await getReviews(prod.id)
        setReviews(revs)
      }
    }
    loadProductData()
  }, [slug])

  const handleAddToCart = () => {
    if (!product) return
    const isSub = purchaseType === 'sub'
    addItem({
      productId: product.id,
      name: product.name,
      price: isSub ? (product.price * 0.82) : product.price, // Apply subscription discount
      image: product.images[0],
      isSubscription: isSub,
      quantity: 1
    })
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReviewVideoFile(file)
      setReviewVideoName(file.name)
      const url = URL.createObjectURL(file)
      setReviewVideoUrl(url)
    }
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product || !reviewName || !reviewBody) return

    const res = await addReview({
      product_id: product.id,
      customer_name: reviewName,
      city: reviewCity,
      rating: reviewRating,
      title: reviewTitle,
      body: reviewBody,
      video_url: reviewVideoUrl
    })

    if (res.success) {
      setFormSuccess(true)
      const updatedRevs = await getReviews(product.id)
      setReviews(updatedRevs)
      
      // Reset form
      setReviewName('')
      setReviewCity('')
      setReviewRating(5)
      setReviewTitle('')
      setReviewBody('')
      setReviewVideoFile(null)
      setReviewVideoUrl('')
      setReviewVideoName('')
      setTimeout(() => setFormSuccess(false), 5000)
    }
  }

  if (!product) {
    return (
      <div className="flex h-screen items-center justify-center bg-matte-white dark:bg-dark-bg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-premium-gold" />
      </div>
    )
  }

  const ratingCounts = [0, 0, 0, 0, 0] // indices correspond to ratings 1-5
  reviews.forEach(r => {
    const idx = Math.min(4, Math.max(0, r.rating - 1))
    ratingCounts[idx]++
  })
  const totalReviewCount = reviews.length || 1

  return (
    <>
      <Navbar />
      <CartDrawer />
      <AiAssistant />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        
        {/* Breadcrumbs */}
        <div className="text-xs text-matte-black/45 dark:text-dark-text/45 mb-8 flex gap-2">
          <Link href="/" className="hover:text-premium-gold">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-premium-gold">Products</Link>
          <span>/</span>
          <span className="text-premium-gold font-medium">{product.name}</span>
        </div>

        {/* Core Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left: 3D Product Interactive Viewer & Images */}
          <div className="space-y-8 sticky top-28">
            <div className="glass-panel rounded-3xl p-6 flex items-center justify-center bg-warm-beige/10 dark:bg-dark-card/10 border border-premium-gold/15">
              <div className="relative flex h-[350px] w-full items-center justify-center cursor-pointer select-none overflow-visible">
                {/* Soft Lighting Backglow */}
                <div className="absolute inset-0 bg-premium-gold/20 blur-3xl -z-10 rounded-full scale-150 animate-pulse" />
                <div className="relative h-[250px] w-[150px] rounded-[30px] border border-premium-gold/30 shadow-2xl overflow-hidden flex items-center justify-center bg-[#1e130c]/90">
                  <Image src={product.images[0]} alt={product.name} fill className="object-contain p-4" />
                </div>
                {/* Shadow */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[110px] h-[15px] bg-black/30 rounded-full blur-md" />
              </div>
            </div>
            
            {/* Gallery fallback */}
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((img: string, idx: number) => (
                <div key={idx} className="relative h-20 rounded-xl overflow-hidden border border-premium-gold/10 hover:border-premium-gold transition-colors bg-warm-beige/20">
                  <Image src={img} alt="product view" fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product specifications & Pricing details */}
          <div className="space-y-8">
            
            {/* Title & Reviews summary */}
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest text-premium-gold uppercase">
                🌙 Doctor Formulated & Approved
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif leading-tight">{product.name}</h1>
              
              <div className="flex items-center gap-3">
                <div className="flex text-premium-gold">
                  <Star size={16} className="fill-current" />
                  <Star size={16} className="fill-current" />
                  <Star size={16} className="fill-current" />
                  <Star size={16} className="fill-current" />
                  <Star size={16} className="fill-current" />
                </div>
                <span className="text-xs font-semibold text-matte-black/60 dark:text-dark-text/65">
                  4.8 ({reviews.length} approved reviews)
                </span>
              </div>
            </div>

            {/* Price Cards & Buy options */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* One time */}
                <div
                  onClick={() => setPurchaseType('one')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    purchaseType === 'one'
                      ? 'border-premium-gold bg-premium-gold/5 dark:bg-premium-gold/5 shadow-md'
                      : 'border-premium-gold/10 bg-warm-beige/10 dark:bg-dark-card/10'
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-matte-black/60 dark:text-dark-text/60">One-Time Buy</span>
                  <div className="mt-4">
                    <span className="text-xl font-bold text-premium-gold">₹{product.price.toFixed(2)}</span>
                    {product.compare_price && (
                      <span className="text-xs line-through text-matte-black/40 dark:text-dark-text/40 block">₹{product.compare_price.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                {/* Subscription */}
                <div
                  onClick={() => setPurchaseType('sub')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden ${
                    purchaseType === 'sub'
                      ? 'border-premium-gold bg-premium-gold/5 dark:bg-premium-gold/5 shadow-md'
                      : 'border-premium-gold/10 bg-warm-beige/10 dark:bg-dark-card/10'
                  }`}
                >
                  <div className="absolute top-2 right-2 bg-premium-gold text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                    Save 18%
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-matte-black/60 dark:text-dark-text/60">Subscribe & Save</span>
                  <div className="mt-4">
                    <span className="text-xl font-bold text-premium-gold">₹{(product.price * 0.82).toFixed(2)} <span className="text-xs font-normal">/ mo</span></span>
                    <span className="text-xs line-through text-matte-black/40 dark:text-dark-text/40 block">₹{product.price.toFixed(2)}</span>
                  </div>
                </div>

              </div>

              {/* Add to Cart CTA */}
              <button
                onClick={handleAddToCart}
                className="w-full rounded-full bg-premium-gold py-4 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:bg-premium-gold/90 transition-all"
              >
                Add to Cart
              </button>
            </div>

            {/* Certifications Block */}
            <div className="p-4 rounded-xl border border-premium-gold/15 bg-warm-beige/25 dark:bg-dark-card/25 text-xs space-y-3">
              <span className="font-bold text-premium-gold uppercase tracking-wider text-[10px] block">Certified Medical Quality</span>
              <div className="grid grid-cols-2 gap-4 text-matte-black/70 dark:text-dark-text/75">
                <div className="flex items-center gap-2">🟢 FSSAI License: #11521008000412</div>
                <div className="flex items-center gap-2">🟢 WHO-GMP Facility</div>
                <div className="flex items-center gap-2">🟢 ISO 9001:2015 Approved</div>
                <div className="flex items-center gap-2">🟢 100% Kosher & Halal</div>
              </div>
            </div>

            {/* TAB SECTIONS: Description & Directions */}
            <div className="space-y-4 border-t border-premium-gold/10 dark:border-white/5 pt-8">
              <div className="flex gap-6 border-b border-premium-gold/10 dark:border-white/5 pb-3 text-xs font-bold uppercase tracking-wider">
                {['description', 'ingredients', 'dosage'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`transition-colors ${
                      activeTab === tab ? 'text-premium-gold' : 'text-matte-black/50 dark:text-dark-text/50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="text-xs leading-relaxed text-matte-black/60 dark:text-dark-text/60 space-y-4">
                {activeTab === 'description' && (
                  <p>{product.description}</p>
                )}
                {activeTab === 'ingredients' && (
                  <div className="grid gap-3">
                    {product.ingredients && product.ingredients.length > 0 ? (
                      product.ingredients.map((ing: any, i: number) => (
                        <div key={i}>
                          <strong className="text-matte-black dark:text-dark-text">{ing.name}:</strong> {ing.desc}
                        </div>
                      ))
                    ) : (
                      <p>Formulated with premium clinically tested active ingredients. See label packaging for full trace breakdown.</p>
                    )}
                  </div>
                )}
                {activeTab === 'dosage' && (
                  <p>Check usage instructions on the packaging box. Always consult with a doctor before starting any daily wellness supplement.</p>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* REVIEW SECTION */}
        <section className="mt-20 lg:mt-32 border-t border-premium-gold/10 dark:border-white/5 pt-16 space-y-12">
          
          {/* Video Reviews Gallery (Full Width Reels Showcase) */}
          {reviews.filter(r => r.video_url).length > 0 && (
            <div className="space-y-6">
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest text-premium-gold uppercase mb-1">
                  Customer Video Reels
                </span>
                <h3 className="text-xl font-serif">See What High-Performers Say</h3>
              </div>
              
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
                {reviews.filter(r => r.video_url).map((r) => (
                  <div
                    key={r.id}
                    onClick={() => setActiveVideoReview(r)}
                    className="relative w-44 h-72 rounded-2xl overflow-hidden cursor-pointer flex-shrink-0 snap-start group border border-premium-gold/10 hover:border-premium-gold/40 transition-all shadow-md bg-black"
                  >
                    {/* Hover play preview */}
                    <div className="absolute inset-0">
                      <video
                        src={r.video_url}
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                        onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                        onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0 }}
                      />
                    </div>
                    
                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent flex flex-col justify-end p-4 text-white space-y-1.5 pointer-events-none">
                      <div className="flex items-center gap-1">
                        <span className="text-[8px] font-bold text-premium-gold bg-premium-gold/10 px-1.5 py-0.5 rounded-full border border-premium-gold/25">Reel</span>
                        <div className="flex text-premium-gold">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} size={8} className="fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="font-semibold text-[11px] truncate">{r.customer_name}</p>
                      <p className="text-[9px] text-white/70 line-clamp-2 leading-snug">{r.body}</p>
                    </div>
                    
                    {/* Play Button Icon */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white opacity-90 group-hover:scale-110 transition-transform pointer-events-none">
                      <Play size={10} className="fill-current text-white ml-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-4">
            
            {/* Reviews Chart Breakdown */}
            <div className="lg:col-span-4 space-y-6">
              <h2 className="text-2xl font-serif">Customer Reviews</h2>
              
              <div className="flex items-center gap-4">
                <span className="text-4xl font-serif font-bold text-premium-gold">4.8</span>
                <div>
                  <div className="flex text-premium-gold">
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current text-matte-black/10 dark:text-white/10" />
                  </div>
                  <span className="text-xs text-matte-black/50 dark:text-dark-text/50">Based on {reviews.length} reviews</span>
                </div>
              </div>

              {/* Progress bars */}
              <div className="space-y-2 text-xs">
                {[5, 4, 3, 2, 1].map(stars => {
                  const count = ratingCounts[stars - 1]
                  const pct = Math.round((count / totalReviewCount) * 100)
                  return (
                    <div key={stars} className="flex items-center gap-3">
                      <span className="w-3">{stars}★</span>
                      <div className="flex-1 bg-warm-beige/30 dark:bg-dark-card rounded-full h-2 overflow-hidden">
                        <div className="bg-premium-gold h-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-right opacity-60">{pct}%</span>
                    </div>
                  )
                })}
              </div>

              {/* Form to submit review */}
              <form onSubmit={handleReviewSubmit} className="glass-panel p-6 rounded-2xl border border-premium-gold/15 space-y-4 bg-white/5 dark:bg-dark-card/5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-premium-gold">Write a Review</h4>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="bg-matte-white border border-premium-gold/15 dark:border-white/10 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="City (e.g. Pune)"
                    value={reviewCity}
                    onChange={(e) => setReviewCity(e.target.value)}
                    className="bg-matte-white border border-premium-gold/15 dark:border-white/10 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase text-matte-black/60 dark:text-dark-text/60">Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(parseInt(e.target.value))}
                    className="w-full bg-matte-white border border-premium-gold/15 dark:border-white/10 dark:bg-dark-bg text-xs p-2.5 rounded-xl focus:outline-none"
                  >
                    <option value={5}>5 Stars (Excellent)</option>
                    <option value={4}>4 Stars (Good)</option>
                    <option value={3}>3 Stars (Average)</option>
                    <option value={2}>2 Stars (Poor)</option>
                    <option value={1}>1 Star (Unsatisfactory)</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Review title"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full bg-matte-white border border-premium-gold/15 dark:border-white/10 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl focus:outline-none"
                />
                <textarea
                  required
                  placeholder="Tell us about your wellness experience..."
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                  rows={3}
                  className="w-full bg-matte-white border border-premium-gold/15 dark:border-white/10 dark:bg-dark-bg text-xs p-3 rounded-xl focus:outline-none resize-none"
                />

                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase text-matte-black/60 dark:text-dark-text/60 block">
                    Upload Video Review (Optional)
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="w-full bg-matte-white border border-premium-gold/15 dark:border-white/10 dark:bg-dark-bg text-xs p-2 rounded-xl focus:outline-none cursor-pointer"
                  />
                  {reviewVideoName && (
                    <p className="text-[9px] text-premium-gold font-semibold truncate">
                      ✓ {reviewVideoName} selected
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-premium-gold text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-full hover:bg-premium-gold/90 transition-all shadow-md"
                >
                  Submit Review
                </button>
                {formSuccess && (
                  <p className="text-[10px] text-green-600 dark:text-green-400 text-center font-semibold">
                    Review submitted! It will appear after medical board & admin approval.
                  </p>
                )}
              </form>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-8 space-y-6">
              {reviews.length === 0 ? (
                <p className="text-xs text-matte-black/45 dark:text-dark-text/45 italic">No reviews approved for this product yet. Be the first to share your experience!</p>
              ) : (
                reviews.map((r, idx) => (
                  <div key={idx} className="border-b border-premium-gold/10 dark:border-white/5 pb-6 last:border-0 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-semibold tracking-wide">{r.title || 'Verified Purchase Review'}</h4>
                        <div className="flex items-center gap-2 text-xs text-matte-black/50 dark:text-dark-text/50">
                          <span className="font-semibold text-premium-gold">{r.customer_name || 'Verified Buyer'}</span>
                          <span>&middot;</span>
                          <span>{r.city || 'India'}</span>
                          <span>&middot;</span>
                          <span className="bg-green-500/10 text-green-600 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            Verified Purchase
                          </span>
                        </div>
                      </div>
                      <div className="flex text-premium-gold">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} size={12} className="fill-current" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed text-matte-black/70 dark:text-dark-text/75">
                      {r.body}
                    </p>

                    {r.video_url && (
                      <button
                        onClick={() => setActiveVideoReview(r)}
                        className="inline-flex items-center gap-1.5 text-[10px] font-bold text-premium-gold hover:underline border border-premium-gold/20 rounded-full px-3 py-1 bg-premium-gold/5 mt-1"
                      >
                        <Play size={10} className="fill-current text-premium-gold" /> Watch Video Review
                      </button>
                    )}

                    {r.admin_reply && (
                      <div className="bg-warm-beige/30 dark:bg-dark-card/40 p-4 rounded-xl border border-premium-gold/10 border-l-2 border-l-premium-gold space-y-1 text-xs">
                        <strong className="block text-premium-gold font-serif italic">Response from Narva Team:</strong>
                        <p className="text-matte-black/60 dark:text-dark-text/60 leading-relaxed">{r.admin_reply}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

          </div>
        </section>

      </main>

      {/* Video Reels Lightbox Modal */}
      <AnimatePresence>
        {activeVideoReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-[#0b0b0e] border border-white/10 rounded-3xl overflow-hidden max-w-3xl w-full flex flex-col md:flex-row h-[80vh] shadow-2xl"
            >
              {/* Left Side: Video Player */}
              <div className="relative flex-1 bg-black flex items-center justify-center h-[55%] md:h-full">
                <video
                  src={activeVideoReview.video_url}
                  autoPlay
                  controls
                  loop
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Right Side: Review Details */}
              <div className="w-full md:w-80 bg-[#121216] p-6 flex flex-col justify-between text-white text-xs h-[45%] md:h-full border-t md:border-t-0 md:border-l border-white/10">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-semibold tracking-wide font-serif text-white">{activeVideoReview.title || 'Verified Video Review'}</h4>
                      <p className="text-[10px] text-white/50 mt-0.5">
                        {activeVideoReview.customer_name} &middot; {activeVideoReview.city || 'India'}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveVideoReview(null)}
                      className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <X size={14} className="text-white" />
                    </button>
                  </div>

                  <div className="flex text-premium-gold gap-0.5">
                    {Array.from({ length: activeVideoReview.rating }).map((_, i) => (
                      <Star key={i} size={12} className="fill-current" />
                    ))}
                  </div>

                  <p className="text-white/80 leading-relaxed overflow-y-auto max-h-40 pr-2">
                    {activeVideoReview.body}
                  </p>
                </div>

                <div className="border-t border-white/10 pt-4 space-y-3">
                  <div className="flex items-center gap-2 text-[10px] text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full w-fit font-bold uppercase tracking-wider">
                    Verified Customer Video
                  </div>
                  <button
                    onClick={() => setActiveVideoReview(null)}
                    className="w-full bg-premium-gold text-white font-bold py-3 rounded-xl hover:bg-premium-gold/90 transition-colors uppercase tracking-wider text-[10px]"
                  >
                    Close Player
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  )
}
