'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Award, ShieldCheck, Heart, User, Sparkles, Stethoscope, ArrowRight, Brain, Activity } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import AiAssistant from '@/components/AiAssistant'

export default function AboutPage() {
  const team = [
    {
      name: 'Dr. Rohan Mehta',
      role: 'Co-founder & Medical Director',
      bio: 'MBBS graduate from AIIMS Nagpur. Specializes in somnology and circadian biology.',
      icon: Stethoscope
    },
    {
      name: 'Dr. Ananya Nair',
      role: 'Co-founder & Research Head',
      bio: 'MBBS graduate from AIIMS. Focuses on botanical compounds and neuroscience.',
      icon: Brain
    },
    {
      name: 'Dr. Kabir Sen',
      role: 'Consultant physician',
      bio: 'MBBS, MD. Expert in sleep hygiene management and performance stress diagnostics.',
      icon: Activity
    },
    {
      name: 'Riya Chawla',
      role: 'Lead Nutritionist',
      bio: 'Certified clinical nutritionist focused on metabolic hormones and health recovery.',
      icon: Heart
    }
  ]

  return (
    <>
      <Navbar />
      <CartDrawer />
      <AiAssistant />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-20">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-premium-gold/10 px-3 py-1 text-xs font-semibold tracking-wider text-premium-gold uppercase">
              <Sparkles size={12} /> Our Purpose
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-light leading-tight">
              India's Doctor-Led Wellness Platform
            </h1>
            <p className="text-sm text-matte-black/60 dark:text-dark-text/60 leading-relaxed">
              We started Narva with a simple realization during our clinical rotations at AIIMS Nagpur: most modern health struggles—insomnia, brain fog, fatigue—are symptoms of dysregulated biological systems under chronic high performance.
            </p>
            <p className="text-sm text-matte-black/60 dark:text-dark-text/60 leading-relaxed">
              Supplements shouldn't be about marketing gimmicks. They should represent pure medical credibility, transparent clinical formulations, and personalized doctor guidance.
            </p>
          </div>

          <div className="relative h-[350px] rounded-3xl overflow-hidden shadow-xl bg-warm-beige/25 border border-premium-gold/10">
            <Image
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop"
              alt="Medical laboratory research"
              fill
              className="object-cover"
              sizes="(max-w-5xl) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Quality Control Specifications */}
        <section id="quality" className="py-12 border-y border-premium-gold/15 dark:border-white/5 space-y-8 text-center">
          <div className="space-y-3 max-w-xl mx-auto">
            <h2 className="text-2xl font-serif">Clinical Quality Control</h2>
            <p className="text-xs text-matte-black/60 dark:text-dark-text/60 leading-relaxed">
              How we guarantee absolute purity and safety across all production stages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              { icon: <ShieldCheck className="text-premium-gold" size={24} />, title: "1. Sourcing Bio-actives", desc: "We source premium standard extracts (such as L-Theanine and Chamomile) directly from verified global partners with clinical test certification." },
              { icon: <Award className="text-premium-gold" size={24} />, title: "2. Lab Testing Batch Purity", desc: "Every production batch undergoes strict third-party lab testing. We test for heavy metals, pesticides, and microbial counts before bottling." },
              { icon: <Heart className="text-premium-gold" size={24} />, title: "3. Clean Room Packaging", desc: "Our gummies are packed in WHO-GMP clean room facilities with zero manual contact, inside premium air-tight amber bottles." }
            ].map((item, idx) => (
              <div key={idx} className="space-y-4">
                <div className="h-10 w-10 bg-premium-gold/10 rounded-xl flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="font-serif text-sm font-semibold">{item.title}</h3>
                <p className="text-[11px] leading-relaxed text-matte-black/60 dark:text-dark-text/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Meet the Medical Board */}
        <section id="team" className="space-y-10 text-center">
          <div className="space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-bold tracking-widest uppercase text-premium-gold">Meet the Medical Board</span>
            <h2 className="text-3xl font-serif">Our Medicos & Advisors</h2>
            <p className="text-xs text-matte-black/60 dark:text-dark-text/60 leading-relaxed">
              Bringing academic rigor and clinical experience directly to your performance health.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
            {team.map((m, idx) => {
              const Icon = m.icon
              return (
                <div
                  key={idx}
                  className="glass-panel p-6 rounded-2xl border border-premium-gold/15 dark:border-white/5 space-y-4 shadow-sm flex gap-4 items-start"
                >
                  <div className="h-12 w-12 rounded-full bg-premium-gold/15 flex items-center justify-center text-premium-gold flex-shrink-0">
                    <Icon size={20} />
                  </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm">{m.name}</h4>
                  <span className="text-[10px] text-premium-gold font-bold uppercase tracking-widest block">{m.role}</span>
                  <p className="text-xs leading-relaxed text-matte-black/60 dark:text-dark-text/60 pt-2">{m.bio}</p>
                </div>
              </div>
            )
          })}
          </div>
        </section>

        {/* Call to Action */}
        <div className="glass-panel p-8 rounded-3xl border border-premium-gold/15 text-center space-y-6 max-w-xl mx-auto">
          <h3 className="text-xl font-serif">Start Your Recovery Journey</h3>
          <p className="text-xs text-matte-black/60 dark:text-dark-text/60 max-w-md mx-auto leading-relaxed">
            Experience the difference of doctor-formulated sleep gummies. Free clinical consultations included.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/products/melatonin-gummies"
              className="inline-flex items-center gap-2 rounded-full bg-premium-gold px-8 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-premium-gold/90 transition-all"
            >
              Order Gummies <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </>
  )
}
