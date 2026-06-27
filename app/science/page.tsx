'use client'

import React from 'react'
import Link from 'next/link'
import { BookOpen, Stethoscope, BrainCircuit, Heart, Award, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import AiAssistant from '@/components/AiAssistant'

export default function SciencePage() {
  const clinicalClaims = [
    {
      title: "1. Sleep Cycle Synchronization (Melatonin)",
      desc: "Our formula includes a clinical dose of 3mg melatonin. Scientific trials demonstrate that low-dose exogenous melatonin binds to MT1 and MT2 receptors in the suprachiasmatic nucleus (SCN), advancing sleep onset and syncing circadian schedules.",
      pubmedId: "PMID: 26613286",
      pubmedLink: "https://pubmed.ncbi.nlm.nih.gov/26613286/"
    },
    {
      title: "2. Cortisol Blocker & GABA Booster (L-Theanine)",
      desc: "L-Theanine (100mg) easily crosses the blood-brain barrier. It binds to glutamate receptors, suppressing excitatory brain activity while raising GABA, dopamine, and serotonin levels. The result is mental calm and alpha-wave brain rhythm amplification.",
      pubmedId: "PMID: 31758301",
      pubmedLink: "https://pubmed.ncbi.nlm.nih.gov/31758301/"
    },
    {
      title: "3. Neuromuscular Relaxation (Magnesium)",
      desc: "Magnesium (50mg) acts as a physiological calcium blocker, relaxing muscular fibers. Clinically, it acts as a mild NMDA antagonist and a GABA agonist, helping increase deep sleep cycles (stages 3 and 4 NREM).",
      pubmedId: "PMID: 23853635",
      pubmedLink: "https://pubmed.ncbi.nlm.nih.gov/23853635/"
    }
  ]

  return (
    <>
      <Navbar />
      <CartDrawer />
      <AiAssistant />

      {/* JSON-LD MedicalWebPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            "name": "The Science of Sleep and Cognitive Recovery | Narva Health",
            "description": "Doctor-led clinical research breakdowns on sleep aids, melatonin safety, and L-theanine GABA boosting properties.",
            "url": "https://narva.in/science",
            "specialty": "https://en.wikipedia.org/wiki/Somnology",
            "reviewedBy": {
              "@type": "Person",
              "name": "Dr. Rohan Mehta, MBBS (AIIMS)"
            }
          })
        }}
      />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-16">
        
        {/* Header */}
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-premium-gold/10 px-3 py-1 text-xs font-semibold tracking-wider text-premium-gold uppercase">
            <BookOpen size={12} /> Clinical Transparency
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light">Built on Hard Science</h1>
          <p className="text-sm text-matte-black/60 dark:text-dark-text/60 leading-relaxed">
            No proprietary blends. No hidden ingredients. We formulate using peer-reviewed medical research to provide real physiological outcomes.
          </p>
        </div>

        {/* Doctor Review Badge */}
        <div className="p-6 rounded-2xl border border-premium-gold/20 bg-premium-gold/5 flex flex-col md:flex-row items-center gap-4 text-xs">
          <div className="h-12 w-12 rounded-full bg-premium-gold/15 flex items-center justify-center text-premium-gold">
            <Stethoscope size={22} />
          </div>
          <div className="space-y-1 text-left">
            <h4 className="font-bold text-premium-gold uppercase tracking-wider text-[10px]">Medical E-E-A-T Review</h4>
            <p className="text-matte-black/75 dark:text-dark-text/75 leading-relaxed">
              This page and all formula details are written and reviewed by **Dr. Rohan Mehta, MBBS (AIIMS Nagpur)** and **Dr. Ananya Nair, MBBS (AIIMS)** to ensure clinical precision.
            </p>
          </div>
        </div>

        {/* Grid of Claims */}
        <div className="space-y-10">
          <h2 className="text-2xl font-serif text-center">Clinical Claim breakdowns</h2>
          
          <div className="grid gap-8">
            {clinicalClaims.map((claim, idx) => (
              <div
                key={idx}
                className="glass-panel p-8 rounded-2xl border border-premium-gold/15 dark:border-white/5 space-y-4 hover:scale-[1.01] transition-transform duration-300"
              >
                <h3 className="font-serif text-lg font-semibold text-premium-gold">{claim.title}</h3>
                <p className="text-xs leading-relaxed text-matte-black/70 dark:text-dark-text/75">
                  {claim.desc}
                </p>
                <div className="pt-2 border-t border-premium-gold/10 dark:border-white/10 flex justify-between items-center text-[10px] font-bold text-premium-gold uppercase tracking-wider">
                  <span className="flex items-center gap-1"><Award size={12} /> Peer Reviewed</span>
                  <a href={claim.pubmedLink} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                    {claim.pubmedId} <ArrowRight size={10} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Science Visual Section: delta waves */}
        <div className="glass-panel p-8 rounded-3xl border border-premium-gold/15 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-left">
            <h3 className="text-xl font-serif">Understanding Sleep Architecture</h3>
            <p className="text-xs text-matte-black/60 dark:text-dark-text/60 leading-relaxed">
              Sleep is not a binary state. Restorative healing happens during deep NREM (Non-Rapid Eye Movement) and REM cycles. Most cheap melatonin gummies use excessive doses (10mg) which trigger heavy fatigue but suppress REM stages. 
            </p>
            <p className="text-xs text-matte-black/60 dark:text-dark-text/60 leading-relaxed">
              Narva uses 3mg Melatonin with 100mg L-Theanine, allowing your brain waves to ease gently into deep alpha cycles, preserving complete NREM/REM ratios for metabolic cleanup.
            </p>
          </div>
          
          {/* Wave visualizer graph mock */}
          <div className="bg-warm-beige/25 border border-premium-gold/10 rounded-2xl p-6 space-y-4 dark:bg-dark-card/30">
            <span className="text-[10px] uppercase font-bold text-premium-gold tracking-widest block text-center">Brainwave Frequency (Delta vs Alpha)</span>
            <div className="h-28 flex items-end justify-between gap-1.5 px-4 pt-4 border-b border-premium-gold/10">
              {/* wave bars */}
              {[40, 60, 20, 80, 50, 90, 30, 75, 45, 100, 25, 60, 85].map((val, idx) => (
                <div
                  key={idx}
                  className="bg-premium-gold/50 rounded-t-sm w-full transition-all hover:bg-premium-gold"
                  style={{ height: `${val}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between text-[9px] text-matte-black/50 dark:text-dark-text/50">
              <span>Bedtime (Alpha)</span>
              <span>Deep REM (Delta cycles)</span>
            </div>
          </div>
        </div>

        {/* Consultation Prompt */}
        <div className="text-center space-y-4">
          <h3 className="text-lg font-serif">Have specific biochemical questions?</h3>
          <p className="text-xs text-matte-black/60 dark:text-dark-text/60 max-w-sm mx-auto">
            Book a private call with our founders or medical board to discuss sleep parameters.
          </p>
          <Link
            href="/consultation"
            className="inline-flex items-center gap-2 rounded-full bg-premium-gold px-8 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-premium-gold/90 transition-all"
          >
            Book Consultation <ArrowRight size={14} />
          </Link>
        </div>

      </main>

      <Footer />
    </>
  )
}
