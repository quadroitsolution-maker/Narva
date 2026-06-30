'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Check, Star, ArrowRight, ShieldCheck, Stethoscope, Plus, X, ChevronDown } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import AiAssistant from '@/components/AiAssistant'
import HeroVideo from '@/components/HeroVideo'
import SleepQuiz from '@/components/SleepQuiz'
import HealthCalculators from '@/components/HealthCalculators'
import { getProducts, getReviews, getBlogs, addSubscriber } from '@/lib/db'
import { useCart } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'

export default function Home() {
  const { addItem } = useCart()
  const [product, setProduct] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [blogs, setBlogs] = useState<any[]>([])
  const [showQuiz, setShowQuiz] = useState(false)
  const [showCalc, setShowCalc] = useState(false)
  const [purchaseType, setPurchaseType] = useState<'one' | 'sub'>('one')
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [email, setEmail] = useState('')

  useEffect(() => {
    async function loadData() {
      const prods = await getProducts()
      if (prods && prods.length > 0) setProduct(prods[0])
      const revs = await getReviews('88888888-8888-8888-8888-888888888888')
      setReviews(revs)
      const journal = await getBlogs()
      setBlogs(journal)
    }
    loadData()
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

  const faqItems = [
    { q: 'Are Narva gummies addictive?', a: 'No. Narva Sleep Gummies are 100% non-habit forming. They use a low dose (3mg) of melatonin combined with calming amino acids like L-Theanine and Magnesium, which support your body\'s natural sleep cycle rather than overriding it.' },
    { q: 'How long before sleep should I take them?', a: 'We recommend taking 1 gummy 30 minutes before your planned bedtime. This gives the melatonin, L-theanine, and chamomile time to dissolve and enter your bloodstream naturally.' },
    { q: 'Can college students or teens take them?', a: 'Yes. The ingredients are natural, safe, and doctor-approved. However, we recommend consulting our medical team (which is free) or your family physician for custom dosage guidelines.' },
    { q: 'Are there any side effects?', a: 'There are no major side effects. Unlike synthetic sleeping pills, you will not experience morning grogginess or lethargy. However, do not consume them if you plan on driving or operating machinery.' },
    { q: 'Can I cancel my subscription easily?', a: 'Absolutely. You can pause, reschedule, or cancel your monthly subscription anytime from your customer account page with a single click. No hidden contracts.' },
  ]

  const staticReviews = [
    { name: 'Priya S.', rating: 5, text: 'Fell asleep within 20 minutes on day one. Nothing else has worked this well for me.', location: 'Mumbai' },
    { name: 'Arjun M.', rating: 5, text: 'As a medical student I was sceptical — but the science is solid and it genuinely works.', location: 'Delhi' },
    { name: 'Kavita R.', rating: 5, text: 'Love that it\'s non-habit forming. I\'ve tried so many things — Narva actually delivers.', location: 'Bangalore' },
  ]

  return (
    <>
      <Navbar />
      <CartDrawer />
      <AiAssistant />

      <main className="flex-1 overflow-x-hidden">

        {/* ═══════════════════════════════════════════
            HERO SECTION — unchanged
        ═══════════════════════════════════════════ */}
        <section className="relative w-full sm:min-h-[94vh] overflow-hidden bg-[#010101] flex flex-col">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-premium-gold/8 rounded-full blur-[140px]" />
          </div>
          <div className="relative h-[68vh] sm:absolute sm:inset-0 sm:h-auto z-10 pointer-events-none">
            <HeroVideo />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-40 z-20 bg-gradient-to-t from-[#010101] to-transparent pointer-events-none" />

          <div className="hero-reveal relative z-30 flex items-center justify-between sm:flex-1 sm:min-h-[80vh] px-6 sm:px-10 lg:px-16 py-8 sm:py-10 bg-[#010101] sm:bg-transparent">
            <div className="max-w-md space-y-7">
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-premium-gold">
                Doctor-Formulated · Sleep &amp; Recovery
              </span>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-[5.5rem] font-bold leading-[1.0] tracking-tight text-white">
                You<br />Hustle.<br />
                <span className="italic font-light text-premium-gold">We Heal.</span>
              </h1>
              <p className="text-sm text-white/55 leading-relaxed max-w-xs">
                Premium sleep gummies formulated by AIIMS doctors. Fall asleep faster, stay asleep longer.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => { const el = document.getElementById('purchase-card'); el?.scrollIntoView({ behavior: 'smooth' }) }}
                  className="rounded-full bg-premium-gold px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-premium-gold/20 hover:scale-105 hover:bg-premium-gold/90 transition-all flex items-center gap-2"
                >
                  Order Now <ArrowRight size={13} />
                </button>
                <Link
                  href="/science"
                  className="rounded-full border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/12 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white/80 transition-all"
                >
                  The Science
                </Link>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <div className="flex -space-x-2.5">
                  {[{ initials: 'AK', bg: 'bg-amber-300' }, { initials: 'RS', bg: 'bg-emerald-300' }, { initials: 'PM', bg: 'bg-sky-300' }].map(({ initials, bg }) => (
                    <div key={initials} className={`w-8 h-8 rounded-full border-2 border-[#010101] ${bg} flex items-center justify-center text-[9px] font-bold text-black`}>
                      {initials}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white/45 leading-tight">
                  Trusted by <span className="text-white font-semibold">10,000+</span> customers
                </p>
              </div>
            </div>

            <div className="hidden lg:flex flex-col gap-4 max-w-[260px]">
              <div className="bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-4 space-y-2">
                <div className="flex text-premium-gold gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} className="fill-current" />)}
                </div>
                <p className="text-2xl font-bold text-white">4.8 <span className="text-sm font-normal text-white/50">/ 5.0</span></p>
                <p className="text-[10px] text-white/40 mt-1">2,400+ verified reviews</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-4 space-y-3">
                <p className="text-[10px] font-bold tracking-widest uppercase text-white/40">Key Ingredients</p>
                {[{ label: '5mg Melatonin', sub: 'Clinically proven dose' }, { label: 'L-Theanine', sub: 'Calm without grogginess' }, { label: 'Ashwagandha KSM-66®', sub: 'Cortisol management' }].map(({ label, sub }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-premium-gold flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-white">{label}</p>
                      <p className="text-[10px] text-white/40">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[{ icon: <ShieldCheck size={15} className="text-premium-gold" />, label: 'FSSAI\nCertified' }, { icon: <Stethoscope size={15} className="text-premium-gold" />, label: 'Doctor\nApproved' }].map(({ icon, label }) => (
                  <div key={label} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-3 py-3 flex flex-col items-center gap-1.5 text-center">
                    {icon}
                    <p className="text-[9px] font-bold uppercase tracking-wider text-white/50 whitespace-pre-line">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* ═══════════════════════════════════════════
            1. TRUST MARQUEE STRIP
        ═══════════════════════════════════════════ */}
        <section className="bg-[#1a1a1a] py-4 overflow-hidden w-full relative">
          <div className="flex w-[200%] animate-scroll whitespace-nowrap">
            {Array.from({ length: 4 }).map((_, loopIdx) => (
              <div key={loopIdx} className="flex justify-around items-center w-full text-[11px] font-semibold tracking-[0.12em] text-white/70 uppercase gap-10 px-10">
                <span>FSSAI Certified</span>
                <span className="text-premium-gold">✦</span>
                <span>WHO-GMP Facility</span>
                <span className="text-premium-gold">✦</span>
                <span>ISO 9001 Certified</span>
                <span className="text-premium-gold">✦</span>
                <span>10,000+ Happy Customers</span>
                <span className="text-premium-gold">✦</span>
                <span>Lab Tested Ingredients</span>
                <span className="text-premium-gold">✦</span>
                <span>Free Doctor Consultation</span>
                <span className="text-premium-gold">✦</span>
              </div>
            ))}
          </div>
        </section>


        {/* ═══════════════════════════════════════════
            2. PRODUCT SHELF — horizontal card row
        ═══════════════════════════════════════════ */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-neutral-400 mb-2">Our Range</p>
                <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1a1a1a]">Sleep. Recover. Thrive.</h2>
              </div>
              <Link href="/products/melatonin-gummies" className="hidden sm:flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#1a1a1a] hover:text-premium-gold transition-colors group">
                View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Main product */}
              <div id="purchase-card" className="group bg-neutral-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative h-72 bg-[#0e0e18] overflow-hidden">
                  <Image
                    src="/product-hero.jpg"
                    alt="Narva Melatonin Sleep Gummies"
                    fill
                    className="object-contain p-6 scale-90 group-hover:scale-95 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <span className="absolute top-4 left-4 bg-premium-gold text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Best Seller
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-[11px] font-bold tracking-widest uppercase text-neutral-400">Sleep Support</p>
                    <h3 className="text-lg font-serif font-semibold text-[#1a1a1a] mt-1">Narva Melatonin Gummies</h3>
                    <p className="text-sm text-neutral-500 mt-1 leading-relaxed">3mg Melatonin · L-Theanine · Magnesium · Wild Berry</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-[#1a1a1a]">₹399</span>
                      <span className="text-sm text-neutral-400 line-through ml-2">₹499</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="flex text-premium-gold">
                        {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-current" />)}
                      </div>
                      <span className="text-xs text-neutral-400 ml-1">4.8</span>
                    </div>
                  </div>

                  {/* Purchase toggle */}
                  <div className="grid grid-cols-2 gap-2 border border-neutral-200 rounded-full p-1">
                    <button
                      onClick={() => setPurchaseType('one')}
                      className={`rounded-full py-2 text-[11px] font-semibold tracking-wide transition-all ${purchaseType === 'one' ? 'bg-[#1a1a1a] text-white' : 'text-neutral-500'}`}
                    >
                      One-time
                    </button>
                    <button
                      onClick={() => setPurchaseType('sub')}
                      className={`rounded-full py-2 text-[11px] font-semibold tracking-wide transition-all ${purchaseType === 'sub' ? 'bg-[#1a1a1a] text-white' : 'text-neutral-500'}`}
                    >
                      Subscribe &amp; Save
                    </button>
                  </div>
                  {purchaseType === 'sub' && (
                    <p className="text-[11px] text-center text-premium-gold font-semibold">₹329/month · Cancel anytime</p>
                  )}

                  <button
                    onClick={handleAddToCart}
                    className="w-full rounded-full bg-[#1a1a1a] text-white py-3.5 text-[11px] font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Coming soon cards */}
              {[
                { name: 'Narva Focus', type: 'Concentration & Clarity', bg: 'from-blue-950 to-indigo-900', emoji: '🧠' },
                { name: 'Narva Recover', type: 'Muscle Recovery & Rest', bg: 'from-emerald-950 to-teal-900', emoji: '⚡' },
              ].map((prod) => (
                <div key={prod.name} className="group bg-neutral-50 rounded-2xl overflow-hidden relative">
                  <div className={`relative h-72 bg-gradient-to-br ${prod.bg} flex items-center justify-center`}>
                    <span className="text-7xl opacity-20">{prod.emoji}</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-full">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                  <div className="p-6 space-y-2">
                    <p className="text-[11px] font-bold tracking-widest uppercase text-neutral-400">Next Release</p>
                    <h3 className="text-lg font-serif font-semibold text-[#1a1a1a]">{prod.name}</h3>
                    <p className="text-sm text-neutral-500">{prod.type}</p>
                    <button className="w-full mt-3 rounded-full border-2 border-neutral-200 text-neutral-400 py-3.5 text-[11px] font-bold uppercase tracking-wider cursor-not-allowed">
                      Notify Me
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ═══════════════════════════════════════════
            3. FEATURE SPLIT — image + text
        ═══════════════════════════════════════════ */}
        <section className="bg-[#f7f4f0]">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
              {/* Image */}
              <div className="relative bg-[#0e0e18] min-h-[400px] lg:min-h-auto overflow-hidden">
                <Image
                  src="/product-hero.jpg"
                  alt="Narva Melatonin Gummies product"
                  fill
                  className="object-contain p-12"
                  sizes="50vw"
                />
              </div>
              {/* Text */}
              <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-16 space-y-6">
                <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-premium-gold">Doctor-Led Formula</p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#1a1a1a] leading-tight">
                  Sleep like you were meant to.
                </h2>
                <p className="text-base text-neutral-600 leading-relaxed max-w-md">
                  Formulated by clinical medicos from AIIMS Nagpur, our melatonin gummies combine clinically dosed melatonin with calming L-Theanine and adaptogenic Ashwagandha. Fall asleep in 20 minutes. Wake up clear.
                </p>
                <div className="space-y-3 pt-2">
                  {['Non-habit forming — take it every night without worry', 'Zero morning grogginess, even on first use', 'Vegan, gluten-free, and made with real fruit extract'].map((point) => (
                    <div key={point} className="flex items-start gap-3">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-premium-gold/10 border border-premium-gold/30 flex items-center justify-center flex-shrink-0">
                        <Check size={11} className="text-premium-gold" />
                      </div>
                      <p className="text-sm text-neutral-600">{point}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 pt-4">
                  <Link
                    href="/products/melatonin-gummies"
                    className="inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] text-white px-8 py-3.5 text-[11px] font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                  >
                    Shop Now <ArrowRight size={13} />
                  </Link>
                  <Link
                    href="/science"
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-300 text-[#1a1a1a] px-8 py-3.5 text-[11px] font-bold uppercase tracking-wider hover:border-neutral-400 transition-colors"
                  >
                    The Science
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ═══════════════════════════════════════════
            4. WHY NARVA — clean minimal outcomes
        ═══════════════════════════════════════════ */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-3">
              <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-neutral-400">Scientific Efficacy</p>
              <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1a1a1a]">Designed for real outcomes</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-100">
              {[
                { num: '01', title: 'Sleep Better', desc: 'Regulate your circadian rhythm naturally, easing your brain into deep delta wave sleep within 20–30 minutes.' },
                { num: '02', title: 'Recover Faster', desc: 'Deep REM cycles drive cellular repair, growth hormone release, and tissue recovery overnight.' },
                { num: '03', title: 'Think Sharper', desc: 'Wake with clear cognitive function. L-Theanine clears metabolic waste accumulated during the day.' },
                { num: '04', title: 'Stay Consistent', desc: 'Non-habit-forming formula supports healthy hormonal patterns long-term without dependency.' },
              ].map((item) => (
                <div key={item.num} className="bg-white p-10 space-y-5 group hover:bg-neutral-50 transition-colors">
                  <span className="text-5xl font-light text-neutral-300 font-serif">{item.num}</span>
                  <h3 className="text-lg font-serif font-semibold text-[#1a1a1a]">{item.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ═══════════════════════════════════════════
            5. SCIENCE DARK BANNER — full bleed
        ═══════════════════════════════════════════ */}
        <section className="bg-[#0e0e18] py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-premium-gold">Clinical Integrity</p>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-white leading-tight">
                  Built on science.<br />
                  <span className="text-premium-gold italic">Supported by research.</span>
                </h2>
                <p className="text-base text-white/60 leading-relaxed max-w-md">
                  Every active compound in Narva is selected based on peer-reviewed clinical studies published in leading medical journals. No marketing fluff. No proprietary blends.
                </p>
                <Link
                  href="/science"
                  className="inline-flex items-center gap-2 rounded-full border border-premium-gold text-premium-gold px-8 py-3.5 text-[11px] font-bold uppercase tracking-wider hover:bg-premium-gold hover:text-white transition-all"
                >
                  Read Clinical Studies <ArrowRight size={13} />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {[
                  { ingredient: 'Melatonin 3mg', mechanism: 'Replicates natural circadian signalling — lowers core body temp and blood pressure to induce sleep.', journal: 'Journal of Clinical Endocrinology & Metabolism' },
                  { ingredient: 'L-Theanine 100mg', mechanism: 'Crosses the blood-brain barrier. Boosts alpha-wave activity for deep mental calm without sedation.', journal: 'Asia Pacific Journal of Clinical Nutrition' },
                  { ingredient: 'Magnesium 50mg', mechanism: 'Natural GABA agonist. Relaxes muscle fibres, preventing REM-disrupting cramps and restlessness.', journal: 'Journal of Research in Medical Sciences' },
                ].map((item) => (
                  <div key={item.ingredient} className="border-l-2 border-premium-gold/30 pl-6 space-y-2 hover:border-premium-gold transition-colors group">
                    <h3 className="text-base font-serif font-semibold text-premium-gold">{item.ingredient}</h3>
                    <p className="text-sm text-white/65 leading-relaxed">{item.mechanism}</p>
                    <p className="text-[11px] text-white/30 italic">{item.journal}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* ═══════════════════════════════════════════
            6. REVIEWS STRIP — 3-up star review cards
        ═══════════════════════════════════════════ */}
        <section className="py-24 bg-[#f7f4f0]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14 space-y-3">
              <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-neutral-400">Real People, Real Results</p>
              <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1a1a1a]">Trusted by 10,000+ customers</h2>
              <div className="flex items-center justify-center gap-1 pt-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-premium-gold text-premium-gold" />)}
                <span className="ml-2 text-sm font-semibold text-[#1a1a1a]">4.8/5</span>
                <span className="text-neutral-400 text-sm ml-1">from {reviews.length > 0 ? reviews.length : '2,400'}+ reviews</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {staticReviews.map((review, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl border border-neutral-100 space-y-4 hover:shadow-md transition-shadow">
                  <div className="flex text-premium-gold gap-0.5">
                    {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} className="fill-current" />)}
                  </div>
                  <p className="text-base font-serif text-[#1a1a1a] leading-relaxed">"{review.text}"</p>
                  <div className="flex items-center gap-3 pt-2 border-t border-neutral-50">
                    <div className="w-8 h-8 rounded-full bg-premium-gold/10 flex items-center justify-center text-xs font-bold text-premium-gold">
                      {review.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1a1a1a]">{review.name}</p>
                      <p className="text-[11px] text-neutral-400">{review.location}</p>
                    </div>
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-1 rounded-full">Verified</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/products/melatonin-gummies"
                className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#1a1a1a] hover:text-premium-gold transition-colors group"
              >
                Read all reviews <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>


        {/* ═══════════════════════════════════════════
            7. FOUNDER STORY — image right layout
        ═══════════════════════════════════════════ */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[560px]">
              {/* Text */}
              <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-16 space-y-6 order-2 lg:order-1">
                <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-premium-gold">Our Story</p>
                <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1a1a1a] leading-tight">
                  Co-founded by doctors<br />from AIIMS Nagpur
                </h2>
                <p className="text-base text-neutral-600 leading-relaxed">
                  While studying medicine, we watched thousands of patients struggle with poor sleep and chronic stress. Most supplements were overhyped and poorly formulated.
                </p>
                <p className="text-base text-neutral-600 leading-relaxed">
                  We built something different — science-backed wellness products grounded in real medical knowledge. Narva is built on transparency, credibility, and genuine care.
                </p>
                <div className="flex items-center gap-10 pt-4 border-t border-neutral-100">
                  {[{ name: 'Dr. Rohan Mehta', title: 'Co-founder' }, { name: 'Dr. Ananya Nair', title: 'Co-founder' }].map((person) => (
                    <div key={person.name}>
                      <p className="font-serif italic text-lg text-premium-gold">{person.name}</p>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-0.5">{person.title}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#1a1a1a] hover:text-premium-gold transition-colors group w-fit"
                >
                  Our full story <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              {/* Image */}
              <div className="relative bg-neutral-100 min-h-[400px] lg:min-h-auto order-1 lg:order-2 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop"
                  alt="Narva founders Dr. Rohan Mehta and Dr. Ananya Nair"
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
            </div>
          </div>
        </section>


        {/* ═══════════════════════════════════════════
            8. DOCTOR CONSULTATION — split
        ═══════════════════════════════════════════ */}
        <section className="py-24 bg-[#f7f4f0]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-neutral-400">Real Medical Expertise</p>
                <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1a1a1a]">Talk to real doctors. Not AI.</h2>
                <p className="text-base text-neutral-600 leading-relaxed max-w-md">
                  Have questions about your sleep quality, stress, or supplement combinations? Our AIIMS-trained medical team provides personalised guidance — free with every order.
                </p>
                <div className="space-y-3">
                  {['Questions about sleep quality or insomnia', 'Daily anxiety or chronic stress management', 'Nutrition & supplement combinations'].map((point) => (
                    <div key={point} className="flex items-center gap-3">
                      <Check size={16} className="text-premium-gold flex-shrink-0" />
                      <p className="text-sm text-neutral-600">{point}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/consultation"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] text-white px-8 py-3.5 text-[11px] font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                >
                  Book Free Consultation <ArrowRight size={13} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'Dr. Kabir Sen', degree: 'MBBS (AIIMS Nagpur)', spec: 'Sleep Hygiene Specialist', avail: 'Mon – Fri · 10am – 5pm' },
                  { name: 'Dr. Riya Chawla', degree: 'MBBS, MD', spec: 'Clinical Nutritionist', avail: 'Tue – Sat · 11am – 6pm' },
                ].map((doc) => (
                  <div key={doc.name} className="bg-white rounded-2xl p-6 border border-neutral-100 space-y-4 hover:shadow-sm transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-premium-gold/10 flex items-center justify-center text-premium-gold">
                      <Stethoscope size={20} />
                    </div>
                    <div>
                      <h4 className="font-serif font-semibold text-[#1a1a1a]">{doc.name}</h4>
                      <p className="text-[11px] text-premium-gold font-bold mt-0.5">{doc.degree}</p>
                    </div>
                    <div className="border-t border-neutral-50 pt-3 space-y-1">
                      <p className="text-xs text-neutral-500">{doc.spec}</p>
                      <p className="text-xs text-neutral-400">{doc.avail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* ═══════════════════════════════════════════
            9. FAQ — thin-border Huel-style accordion
        ═══════════════════════════════════════════ */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14 space-y-3">
              <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-neutral-400">Have questions?</p>
              <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1a1a1a]">Frequently Asked Questions</h2>
            </div>

            <div className="divide-y divide-neutral-100">
              {faqItems.map((faq, index) => (
                <div key={index} className="py-0">
                  <button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="w-full flex justify-between items-center py-5 text-left group"
                  >
                    <span className="text-base font-serif font-medium text-[#1a1a1a] group-hover:text-premium-gold transition-colors">{faq.q}</span>
                    <span className={`ml-6 flex-shrink-0 w-6 h-6 rounded-full border border-neutral-200 flex items-center justify-center transition-all ${activeFaq === index ? 'bg-[#1a1a1a] border-[#1a1a1a] rotate-45' : ''}`}>
                      <Plus size={14} className={activeFaq === index ? 'text-white' : 'text-neutral-400'} />
                    </span>
                  </button>
                  <AnimatePresence>
                    {activeFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm text-neutral-500 leading-relaxed pb-5 pr-10">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ═══════════════════════════════════════════
            10. EMAIL CTA STRIP
        ═══════════════════════════════════════════ */}
        <section className="py-24 bg-[#0e0e18]">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center space-y-8">
            <div className="space-y-4">
              <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-premium-gold">Stay informed</p>
              <h2 className="text-3xl sm:text-4xl font-serif font-light text-white">
                Sleep science, directly to your inbox.
              </h2>
              <p className="text-base text-white/50 leading-relaxed">
                Practical sleep tips, new research, product drops, and exclusive subscriber discounts. No spam — ever.
              </p>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                if (email.trim()) {
                  await addSubscriber({ email: email.trim(), source: 'Homepage CTA' })
                  setEmail('')
                  alert('Thank you for subscribing!')
                }
              }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-5 py-3.5 text-sm focus:outline-none focus:border-premium-gold transition-colors"
              />
              <button
                type="submit"
                className="rounded-full bg-premium-gold text-white px-7 py-3.5 text-[11px] font-bold uppercase tracking-wider hover:bg-premium-gold/90 transition-colors flex-shrink-0"
              >
                Subscribe
              </button>
            </form>
            <p className="text-[11px] text-white/30">By subscribing you agree to our Privacy Policy. Unsubscribe anytime.</p>
          </div>
        </section>


        {/* ── MODALS ── */}
        <AnimatePresence>
          {showQuiz && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-xl">
                <SleepQuiz onClose={() => setShowQuiz(false)} />
              </motion.div>
            </div>
          )}
          {showCalc && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-xl relative">
                <button onClick={() => setShowCalc(false)} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-neutral-100 text-neutral-600 hover:text-[#1a1a1a]">
                  <X size={16} />
                </button>
                <HealthCalculators />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>

      <Footer />
    </>
  )
}
