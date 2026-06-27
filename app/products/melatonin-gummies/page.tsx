'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ShieldAlert, Check, ChevronDown, MessageSquare, ArrowRight, BookOpen, AlertCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import AiAssistant from '@/components/AiAssistant'
import Product3DViewer from '@/components/Product3DViewer'
import { getProductBySlug, getReviews, addReview } from '@/lib/db'
import { useCart } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProductPage() {
  const { addItem } = useCart()
  const [product, setProduct] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'ingredients' | 'how-it-works' | 'dosage'>('ingredients')
  const [purchaseType, setPurchaseType] = useState<'one' | 'sub'>('one')
  
  // Review Form States
  const [reviewName, setReviewName] = useState('')
  const [reviewCity, setReviewCity] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewBody, setReviewBody] = useState('')
  const [formSuccess, setFormSuccess] = useState(false)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  useEffect(() => {
    async function loadProductData() {
      const prod = await getProductBySlug('melatonin-gummies')
      setProduct(prod)
      const revs = await getReviews('88888888-8888-8888-8888-888888888888')
      setReviews(revs)
    }
    loadProductData()
  }, [])

  const handleAddToCart = () => {
    if (!product) return
    const isSub = purchaseType === 'sub'
    addItem({
      productId: product.id,
      name: product.name,
      price: isSub ? 329.00 : 399.00,
      image: product.images[0],
      isSubscription: isSub,
      quantity: 1
    })
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewName || !reviewBody) return

    const res = await addReview({
      product_id: '88888888-8888-8888-8888-888888888888',
      customer_name: reviewName,
      city: reviewCity,
      rating: reviewRating,
      title: reviewTitle,
      body: reviewBody
    })

    if (res.success) {
      setFormSuccess(true)
      // Reload reviews
      const updatedRevs = await getReviews('88888888-8888-8888-8888-888888888888')
      setReviews(updatedRevs)
      
      // Reset form
      setReviewName('')
      setReviewCity('')
      setReviewRating(5)
      setReviewTitle('')
      setReviewBody('')
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

      {/* Structured data JSON-LD Product & FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "image": product.images,
            "description": product.description,
            "sku": "NARVA-MEL-001",
            "brand": {
              "@type": "Brand",
              "name": "Narva"
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "INR",
              "price": purchaseType === 'sub' ? "329.00" : "399.00",
              "availability": "https://schema.org/InStock",
              "url": "https://narva.in/products/melatonin-gummies"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": String(reviews.length)
            }
          })
        }}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        
        {/* Breadcrumbs */}
        <div className="text-xs text-matte-black/45 dark:text-dark-text/45 mb-8 flex gap-2">
          <Link href="/" className="hover:text-premium-gold">Home</Link>
          <span>/</span>
          <Link href="/" className="hover:text-premium-gold">Products</Link>
          <span>/</span>
          <span className="text-premium-gold font-medium">{product.name}</span>
        </div>

        {/* Core Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left: 3D Product Interactive Viewer & Images */}
          <div className="space-y-8 sticky top-28">
            <div className="glass-panel rounded-3xl p-6 flex items-center justify-center bg-warm-beige/10 dark:bg-dark-card/10 border border-premium-gold/15">
              <Product3DViewer />
            </div>
            
            {/* Gallery fallback */}
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((img: string, idx: number) => (
                <div key={idx} className="relative h-20 rounded-xl overflow-hidden border border-premium-gold/10 hover:border-premium-gold transition-colors bg-warm-beige/20">
                  <Image src={img} alt="gummies bottle view" fill className="object-cover" />
                </div>
              ))}
              <div className="glass-panel rounded-xl flex flex-col justify-center items-center text-center p-2 border border-premium-gold/10 text-[9px] font-bold text-premium-gold uppercase tracking-wider">
                🔄 Rotate Bottle above
              </div>
            </div>
          </div>

          {/* Right: Product specifications & Pricing details */}
          <div className="space-y-8">
            
            {/* Title & Reviews summary */}
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest text-premium-gold uppercase">
                🌙 Sleep & circadian support
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
                    <span className="text-xl font-bold text-premium-gold">₹399.00</span>
                    <span className="text-xs line-through text-matte-black/40 dark:text-dark-text/40 block">₹499.00</span>
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
                    <span className="text-xl font-bold text-premium-gold">₹329.00 <span className="text-xs font-normal">/ mo</span></span>
                    <span className="text-xs line-through text-matte-black/40 dark:text-dark-text/40 block">₹399.00</span>
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
              <p className="text-[10px] text-matte-black/45 dark:text-dark-text/45 pt-1 border-t border-premium-gold/10">
                Manufactured by Sevenq Nutrition LLP under WHO-GMP and ISO certified conditions.
              </p>
            </div>

            {/* TAB SECTIONS: Ingredients, How it Works, Dosage */}
            <div className="space-y-4 border-t border-premium-gold/10 dark:border-white/5 pt-8">
              <div className="flex gap-6 border-b border-premium-gold/10 dark:border-white/5 pb-3 text-xs font-bold uppercase tracking-wider">
                {['ingredients', 'how-it-works', 'dosage'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`transition-colors ${
                      activeTab === tab ? 'text-premium-gold' : 'text-matte-black/50 dark:text-dark-text/50'
                    }`}
                  >
                    {tab.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <div className="text-xs leading-relaxed text-matte-black/60 dark:text-dark-text/60 space-y-4">
                {activeTab === 'ingredients' && (
                  <div className="grid gap-3">
                    <div>
                      <strong className="text-matte-black dark:text-dark-text">Melatonin (3mg):</strong> Helps align your pineal gland's sleeping rhythms without creating hormonal over-dependencies.
                    </div>
                    <div>
                      <strong className="text-matte-black dark:text-dark-text">L-Theanine (100mg):</strong> Amino acid crossing blood-brain barrier. Triggers alpha-waves, calming mental anxiety.
                    </div>
                    <div>
                      <strong className="text-matte-black dark:text-dark-text">Magnesium (50mg):</strong> Promotes muscle relaxation and keeps your sleep deep.
                    </div>
                    <p className="text-[10px] italic text-premium-gold pt-2">
                      <BookOpen size={10} className="inline mr-1" /> Scientific citations link: PubMed clinically tested sleep aids.
                    </p>
                  </div>
                )}
                {activeTab === 'how-it-works' && (
                  <p>
                    Within 30 minutes of taking a gummy, melatonin begins to dissolve, initiating standard thermal sleep signals (lowering body temperature). Simultaneously, L-Theanine stimulates neurotransmitters, suppressing rapid cortisol pathways. This allows you to ease directly into delta-wave deep sleep cycles without the heavy chemical knock-out effect of sleeping pills.
                  </p>
                )}
                {activeTab === 'dosage' && (
                  <p>
                    Take exactly 1 gummy 30 minutes before your planned bedtime. Ensure screen light is dimmed for maximum efficacy. Safe for nightly use. Do not operate heavy machinery within 6 hours of consumption.
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* REVIEW SECTION */}
        <section className="mt-20 lg:mt-32 border-t border-premium-gold/10 dark:border-white/5 pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
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
              <form onSubmit={handleReviewSubmit} className="glass-panel p-6 rounded-2xl border border-premium-gold/15 space-y-4">
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
                  placeholder="Tell us about your sleep experience..."
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                  rows={3}
                  className="w-full bg-matte-white border border-premium-gold/15 dark:border-white/10 dark:bg-dark-bg text-xs p-3 rounded-xl focus:outline-none resize-none"
                />
                <button
                  type="submit"
                  className="w-full bg-premium-gold text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-full hover:bg-premium-gold/90 transition-all shadow-md"
                >
                  Submit Review
                </button>
                {formSuccess && (
                  <p className="text-[10px] text-green-600 dark:text-green-400 text-center">
                    Review approved and posted successfully!
                  </p>
                )}
              </form>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-8 space-y-6">
              {reviews.map((r, idx) => (
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

                  {r.admin_reply && (
                    <div className="bg-warm-beige/30 dark:bg-dark-card/40 p-4 rounded-xl border border-premium-gold/10 border-l-2 border-l-premium-gold space-y-1 text-xs">
                      <strong className="block text-premium-gold font-serif italic">Response from Narva Team:</strong>
                      <p className="text-matte-black/60 dark:text-dark-text/60 leading-relaxed">{r.admin_reply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}
