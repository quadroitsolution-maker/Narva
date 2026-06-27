'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Plus, Minus, Trash2, Tag, Percent } from 'lucide-react'
import { useCart } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'

export default function CartDrawer() {
  const {
    items,
    cartOpen,
    setCartOpen,
    removeItem,
    updateQuantity,
    couponCode,
    couponError,
    applyCoupon,
    removeCoupon,
    getTotals
  } = useCart()

  const [inputCoupon, setInputCoupon] = useState('')
  const [validating, setValidating] = useState(false)

  const { subtotal, discount, shipping, total } = getTotals()

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputCoupon.trim()) return
    setValidating(true)
    await applyCoupon(inputCoupon)
    setValidating(false)
    setInputCoupon('')
  }

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-matte-white shadow-2xl transition-colors duration-300 dark:bg-dark-bg border-l border-premium-gold/10 dark:border-white/5"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-premium-gold/10 px-6 py-5 dark:border-white/5">
              <h2 className="font-serif text-xl font-medium tracking-wide">Your Cart</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="rounded-full p-1.5 text-matte-black/60 hover:bg-warm-beige/50 dark:text-dark-text/60 dark:hover:bg-dark-card"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {items.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center space-y-4 text-center">
                  <p className="text-matte-black/50 dark:text-dark-text/50 text-sm">Your cart is currently empty.</p>
                  <Link
                    href="/products/melatonin-gummies"
                    onClick={() => setCartOpen(false)}
                    className="inline-flex rounded-full bg-premium-gold px-6 py-2.5 text-xs font-semibold tracking-wider text-white shadow-md hover:bg-premium-gold/90 transition-all uppercase"
                  >
                    Shop Gummies
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 border-b border-premium-gold/10 pb-6 dark:border-white/5 last:border-0"
                  >
                    {/* Image */}
                    <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-premium-gold/15 bg-warm-beige/20 dark:border-white/10 dark:bg-dark-card/50">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-medium tracking-wide leading-tight max-w-[200px]">{item.name}</h3>
                        <span className="text-sm font-semibold text-premium-gold">₹{item.price * item.quantity}</span>
                      </div>
                      
                      <p className="text-[11px] text-premium-gold font-medium uppercase tracking-wider">
                        {item.isSubscription ? 'Subscribe & Save (Monthly)' : 'One-time Purchase'}
                      </p>

                      <div className="flex items-center justify-between pt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-premium-gold/25 dark:border-white/10 rounded-full">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 px-2.5 text-matte-black/60 hover:text-premium-gold transition-colors dark:text-dark-text/60"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-semibold px-1 min-w-[16px] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 px-2.5 text-matte-black/60 hover:text-premium-gold transition-colors dark:text-dark-text/60"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-matte-black/40 hover:text-red-500 transition-colors dark:text-dark-text/40 dark:hover:text-red-400 p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Pricing Summary */}
            {items.length > 0 && (
              <div className="border-t border-premium-gold/10 bg-warm-beige/20 p-6 dark:border-white/5 dark:bg-dark-card/40 space-y-4">
                {/* Coupon Code Input */}
                <form onSubmit={handleCouponSubmit} className="space-y-2">
                  <div className="flex items-center gap-2 border border-premium-gold/20 dark:border-white/10 rounded-full bg-matte-white px-3 py-1.5 dark:bg-dark-bg">
                    <Tag size={16} className="text-premium-gold" />
                    <input
                      type="text"
                      placeholder="Promo code (WELCOME10)"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      className="w-full bg-transparent text-xs text-matte-black placeholder-matte-black/40 focus:outline-none dark:text-dark-text dark:placeholder-white/30"
                    />
                    <button
                      type="submit"
                      disabled={validating}
                      className="text-xs font-bold text-premium-gold hover:text-premium-gold/80 transition-colors disabled:opacity-50"
                    >
                      {validating ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                  
                  {couponCode && (
                    <div className="flex items-center justify-between text-xs text-green-600 dark:text-green-400 font-semibold px-2">
                      <span className="flex items-center gap-1">
                        <Percent size={12} /> Code {couponCode} Applied!
                      </span>
                      <button type="button" onClick={removeCoupon} className="underline text-red-500 hover:text-red-600 text-[10px]">
                        Remove
                      </button>
                    </div>
                  )}

                  {couponError && (
                    <p className="text-[11px] text-red-500 px-2 font-medium">
                      {couponError}
                    </p>
                  )}
                </form>

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm pt-2">
                  <div className="flex justify-between text-matte-black/70 dark:text-dark-text/75">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400 font-medium">
                      <span>Discount</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-matte-black/70 dark:text-dark-text/75">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-green-600 dark:text-green-400 font-medium">FREE</span> : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                  
                  <div className="border-t border-premium-gold/10 dark:border-white/10 pt-2 flex justify-between font-serif text-base font-bold">
                    <span>Total</span>
                    <span className="text-premium-gold">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="w-full flex justify-center items-center rounded-full bg-premium-gold py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-premium-gold/90 transition-all text-center"
                >
                  Proceed to Checkout
                </Link>
                
                <p className="text-[10px] text-center text-matte-black/40 dark:text-dark-text/40">
                  Payments secured via Razorpay. Free consultations included.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
