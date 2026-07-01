'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Sun, Moon, Menu, X, ChevronDown, User } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { useCart } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const { items, setCartOpen } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { name: 'Products', href: '/products' },
    { name: 'Science', href: '/science' },
    { name: 'About', href: '/about' },
    { name: 'Consultation', href: '/consultation' },
    { name: 'Journal', href: '/journal' },
  ]

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* ── ANNOUNCEMENT BAR ── */}
      <div className="w-full bg-[#1a1a1a] text-white text-[11px] font-medium tracking-[0.12em] uppercase py-2.5 text-center overflow-hidden relative">
        <div className="flex w-[200%] animate-scroll whitespace-nowrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex justify-around items-center w-full gap-12 px-8">
              <span>Free Doctor Consultation with every order</span>
              <span className="text-premium-gold">·</span>
              <span>Free shipping over ₹999</span>
              <span className="text-premium-gold">·</span>
              <span>AIIMS-formulated sleep gummies</span>
              <span className="text-premium-gold">·</span>
              <span>Subscribe &amp; save 18%</span>
              <span className="text-premium-gold">·</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN NAV ── */}
      <nav
        className={`sticky top-0 z-40 w-full bg-white transition-all duration-300 ${
          scrolled ? 'shadow-sm border-b border-neutral-100' : 'border-b border-neutral-100'
        }`}
      >
        {/* Grid: logo | links | icons */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 h-16 items-center">

            {/* LEFT — Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                className="font-serif text-2xl font-light italic tracking-wider text-[#1a1a1a] transition-opacity hover:opacity-70"
              >
                narva<span className="text-premium-gold font-sans not-italic font-bold">.</span>
              </Link>
            </div>

            {/* CENTER — Desktop Nav Links */}
            <div className="hidden md:flex items-center justify-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[11px] font-semibold tracking-[0.1em] uppercase transition-colors relative group ${
                    isLinkActive(link.href)
                      ? 'text-[#1a1a1a]'
                      : 'text-neutral-500 hover:text-[#1a1a1a]'
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-[#1a1a1a] transition-all duration-300 ${
                      isLinkActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              ))}
            </div>

            {/* RIGHT — Icons */}
            <div className="flex items-center justify-end gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-neutral-500 hover:text-[#1a1a1a] transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              {/* User Account */}
              <Link
                href="/account"
                className="p-2 text-neutral-500 hover:text-[#1a1a1a] transition-colors"
                aria-label="User Account"
              >
                <User size={18} />
              </Link>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-neutral-500 hover:text-[#1a1a1a] transition-colors"
                aria-label="Open cart"
              >
                <ShoppingBag size={18} />
                <AnimatePresence>
                  {cartItemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1a1a1a] text-[9px] font-bold text-white"
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Shop CTA — desktop only */}
              <Link
                href="/products/melatonin-gummies"
                className="hidden md:inline-flex items-center rounded-full bg-[#1a1a1a] text-white text-[11px] font-bold uppercase tracking-[0.1em] px-5 py-2.5 hover:bg-neutral-800 transition-colors"
              >
                Shop Now
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-neutral-600 transition-colors md:hidden"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="md:hidden fixed top-[calc(2.5rem+4rem)] inset-x-0 z-30 bg-white border-b border-neutral-100 shadow-lg"
          >
            <div className="px-6 py-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 text-sm font-semibold tracking-[0.08em] uppercase border-b border-neutral-50 last:border-0 transition-colors ${
                    isLinkActive(link.href)
                      ? 'text-[#1a1a1a]'
                      : 'text-neutral-500 hover:text-[#1a1a1a]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-3 text-sm font-semibold tracking-[0.08em] uppercase border-b border-neutral-50 transition-colors ${
                  isLinkActive('/account')
                    ? 'text-[#1a1a1a]'
                    : 'text-neutral-500 hover:text-[#1a1a1a]'
                }`}
              >
                Account
              </Link>
              <div className="pt-4">
                <Link
                  href="/products/melatonin-gummies"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center rounded-full bg-[#1a1a1a] text-white text-sm font-bold uppercase tracking-wider py-3 hover:bg-neutral-800 transition-colors"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
