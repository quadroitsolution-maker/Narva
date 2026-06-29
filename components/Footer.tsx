'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Instagram, Facebook, Youtube, ArrowRight, Check } from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 5000)
    }
  }

  const sitemap = [
    {
      title: 'Ecosystem',
      links: [
        { label: 'All Products', href: '/products' },
        { label: 'Sleep Gummies', href: '/products/melatonin-gummies' },
        { label: 'Doctor Consultation', href: '/consultation' },
        { label: 'Science & Research', href: '/science' },
        { label: 'Health Journal', href: '/journal' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'Our Story', href: '/about' },
        { label: 'Medical Board', href: '/about#team' },
        { label: 'Careers', href: '/about#careers' },
        { label: 'Quality Control', href: '/about#quality' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact Us', href: 'mailto:support@narva.in' },
        { label: 'FAQs', href: '/products/melatonin-gummies#faq' },
        { label: 'Shipping & Delivery', href: '/policies/shipping' },
        { label: 'Returns & Refunds', href: '/policies/refund' }
      ]
    }
  ]

  const policies = [
    { label: 'Privacy Policy', href: '/policies/privacy' },
    { label: 'Terms & Conditions', href: '/policies/terms' },
    { label: 'Refund Policy', href: '/policies/refund' },
    { label: 'Shipping Policy', href: '/policies/shipping' }
  ]

  return (
    <footer className="w-full border-t border-premium-gold/10 bg-warm-beige/30 transition-colors duration-300 dark:border-white/5 dark:bg-dark-card/20 py-16 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16">
          
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-6">
            <Link href="/" className="font-serif text-3xl font-light italic tracking-wider text-matte-black transition-colors dark:text-dark-text">
              narva<span className="text-premium-gold font-sans not-italic font-bold">.</span>
            </Link>
            <p className="text-sm leading-relaxed text-matte-black/60 dark:text-dark-text/60 max-w-sm">
              India's first premium doctor-led wellness ecosystem. We create medical-grade, science-backed wellness formulations for high performers who refuse to slow down.
            </p>
            <div className="flex items-center space-x-5 text-matte-black/55 dark:text-dark-text/55">
              <a href="https://www.instagram.com/narva.health" target="_blank" rel="noopener noreferrer" className="hover:text-premium-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://www.facebook.com/narvahealth" target="_blank" rel="noopener noreferrer" className="hover:text-premium-gold transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://youtube.com/@narvahealthofficial" target="_blank" rel="noopener noreferrer" className="hover:text-premium-gold transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Sitemap links */}
          <div className="md:col-span-5 grid grid-cols-3 gap-8">
            {sitemap.map((section) => (
              <div key={section.title} className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-premium-gold">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-matte-black/60 hover:text-premium-gold transition-colors dark:text-dark-text/60">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter Panel */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-premium-gold">Join the Narva Community</h4>
            <p className="text-xs leading-relaxed text-matte-black/60 dark:text-dark-text/60">
              Receive doctor-written sleep research, wellness guides, and early access to product launches.
            </p>
            
            <form onSubmit={handleSubmit} className="relative mt-4 flex items-center border-b border-premium-gold/30 dark:border-white/20 pb-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full bg-transparent text-sm text-matte-black placeholder-matte-black/35 focus:outline-none dark:text-dark-text dark:placeholder-white/30"
              />
              <button
                type="submit"
                disabled={subscribed}
                className="text-premium-gold hover:text-premium-gold/80 transition-colors p-1"
                aria-label="Subscribe"
              >
                {subscribed ? <Check size={18} className="text-green-500" /> : <ArrowRight size={18} />}
              </button>
            </form>
            
            {subscribed && (
              <p className="text-[11px] text-green-600 dark:text-green-400 mt-2">
                Thank you for subscribing! Check your inbox soon.
              </p>
            )}
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-premium-gold/10 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-matte-black/40 dark:text-dark-text/40">
          <div>
            &copy; {new Date().getFullYear()} Narva Health. All rights reserved. Manufactured by Sevenq Nutrition LLP.
          </div>
          <div className="flex flex-wrap items-center gap-6">
            {policies.map((p) => (
              <Link key={p.label} href={p.href} className="hover:text-premium-gold transition-colors">
                {p.label}
              </Link>
            ))}
          </div>
        </div>
        
      </div>
    </footer>
  )
}
