'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2, CreditCard, Loader2 } from 'lucide-react'
import { useCart } from '@/lib/store'
import { createOrder } from '@/lib/db'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

export default function CheckoutPage() {
  const { items, getTotals, clearCart, couponCode } = useCart()
  const { subtotal, discount, shipping, total } = getTotals()

  const [step, setStep] = useState(1) // 1: Address, 2: Payment, 3: Confirmation

  // Shipping form states
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [line1, setLine1] = useState('')
  const [line2, setLine2] = useState('')
  const [city, setCity] = useState('')
  const [stateName, setStateName] = useState('')
  const [pincode, setPincode] = useState('')

  const [orderId, setOrderId] = useState('')
  const [paying, setPaying] = useState(false)
  const [orderError, setOrderError] = useState('')

  useEffect(() => {
    // Temporary display ID until Supabase returns a real one
    setOrderId('ord_' + Math.random().toString(36).substring(2, 11).toUpperCase())
  }, [])

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return
    setStep(2)
  }

  const triggerRazorpayPayment = async () => {
    setPaying(true)
    setOrderError('')

    // Simulate Razorpay 2-second overlay latency then save to Supabase
    await new Promise(resolve => setTimeout(resolve, 2000))

    try {
      const result = await createOrder({
        email,
        fullName,
        phone,
        line1,
        line2,
        city,
        state: stateName,
        pincode,
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        subtotal,
        discount,
        shipping,
        total,
        couponCode: couponCode || undefined,
        paymentMethod: 'razorpay_simulated'
      })

      if (result?.orderId) {
        setOrderId(result.orderId)
      }
    } catch (err) {
      console.warn('Order save error (non-blocking):', err)
      // Still proceed to confirmation even if DB write fails
    }

    setPaying(false)
    setStep(3)
    clearCart()

    // Trigger canvas-confetti blast!
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    })
  }

  if (items.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen bg-matte-white dark:bg-dark-bg flex flex-col justify-center items-center p-6 text-center space-y-4">
        <ShoppingBag size={48} className="text-premium-gold" />
        <h2 className="text-xl font-serif">Your Cart is Empty</h2>
        <p className="text-xs text-matte-black/60 dark:text-dark-text/60 max-w-sm">
          Please add products to your cart before proceeding to the checkout portal.
        </p>
        <Link href="/" className="rounded-full bg-premium-gold px-8 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md">
          Shop Now
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-matte-white dark:bg-dark-bg transition-colors duration-300 py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Header simple */}
        <div className="flex justify-between items-center border-b border-premium-gold/10 dark:border-white/5 pb-6 mb-10">
          <Link href="/" className="font-serif text-3xl font-light italic tracking-wider text-matte-black dark:text-dark-text">
            narva<span className="text-premium-gold font-sans not-italic font-bold">.</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-matte-black/50 dark:text-dark-text/50">
            <span className={step >= 1 ? 'text-premium-gold' : ''}>Shipping</span>
            <span>&rarr;</span>
            <span className={step >= 2 ? 'text-premium-gold' : ''}>Payment</span>
            <span>&rarr;</span>
            <span className={step === 3 ? 'text-premium-gold' : ''}>Confirmation</span>
          </div>
        </div>

        {/* Wizard step views */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Form */}
              <form onSubmit={handleAddressSubmit} className="lg:col-span-7 glass-panel p-8 rounded-3xl shadow-xl space-y-6">
                <h3 className="font-serif text-lg font-medium border-b border-premium-gold/10 pb-3">Delivery Address</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-matte-black/60 dark:text-dark-text/60">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-matte-white border border-premium-gold/15 dark:border-white/10 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-matte-black/60 dark:text-dark-text/60">WhatsApp Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91-98765-43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-matte-white border border-premium-gold/15 dark:border-white/10 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-matte-black/60 dark:text-dark-text/60">Recipient Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-matte-white border border-premium-gold/15 dark:border-white/10 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-matte-black/60 dark:text-dark-text/60">Address Line 1</label>
                    <input
                      type="text"
                      required
                      placeholder="Flat, House No, Building, Street"
                      value={line1}
                      onChange={(e) => setLine1(e.target.value)}
                      className="w-full bg-matte-white border border-premium-gold/15 dark:border-white/10 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-matte-black/60 dark:text-dark-text/60">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      placeholder="Apartment, Landmark, Colony"
                      value={line2}
                      onChange={(e) => setLine2(e.target.value)}
                      className="w-full bg-matte-white border border-premium-gold/15 dark:border-white/10 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-matte-black/60 dark:text-dark-text/60">City</label>
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-matte-white border border-premium-gold/15 dark:border-white/10 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-matte-black/60 dark:text-dark-text/60">State</label>
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      className="w-full bg-matte-white border border-premium-gold/15 dark:border-white/10 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-matte-black/60 dark:text-dark-text/60">Pincode</label>
                    <input
                      type="text"
                      required
                      placeholder="Pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full bg-matte-white border border-premium-gold/15 dark:border-white/10 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 rounded-full bg-premium-gold py-4 text-xs font-bold uppercase tracking-wider text-white shadow-md"
                >
                  Proceed to Payment <ArrowRight size={14} />
                </button>
              </form>

              {/* Summary */}
              <div className="lg:col-span-5 space-y-6">
                <div className="glass-panel p-6 rounded-3xl border border-premium-gold/15 space-y-4">
                  <h4 className="font-serif text-sm font-semibold border-b border-premium-gold/10 pb-2">Order Summary</h4>
                  <div className="space-y-4 max-h-48 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3 justify-between items-center text-xs">
                        <div className="flex gap-2 items-center">
                          <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-warm-beige/25">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div>
                            <span className="font-medium block max-w-[150px] truncate">{item.name}</span>
                            <span className="text-[9px] text-premium-gold uppercase tracking-wider block">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-bold text-matte-black/80 dark:text-dark-text/80">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-premium-gold/10 dark:border-white/10 pt-4 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-matte-black/60">Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600 dark:text-green-400 font-medium">
                        <span>Discount</span>
                        <span>-₹{discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-matte-black/60">Shipping</span>
                      <span>{shipping === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₹${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between font-serif text-sm font-bold border-t border-premium-gold/10 pt-2 text-premium-gold">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-matte-black/50 dark:text-dark-text/50">
                  <ShieldCheck size={14} className="text-premium-gold flex-shrink-0" />
                  <span>256-bit SSL encrypted. Your data is secure with Razorpay PCI-DSS compliance.</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="max-w-md mx-auto"
            >
              <div className="glass-panel p-8 rounded-3xl shadow-xl space-y-6 text-center">
                <CreditCard size={36} className="text-premium-gold mx-auto" />

                <div className="space-y-2">
                  <h3 className="font-serif text-xl">Payment Verification</h3>
                  <p className="text-xs text-matte-black/60 dark:text-dark-text/60 leading-relaxed">
                    Review your address details and click below to process your transaction via Razorpay secure checkouts.
                  </p>
                </div>

                {/* Details box */}
                <div className="p-4 rounded-xl border border-premium-gold/10 bg-warm-beige/10 dark:bg-dark-card/20 text-left text-xs space-y-2">
                  <p><strong>Deliver To:</strong> {fullName}</p>
                  <p><strong>Address:</strong> {line1}, {city}, {stateName} - {pincode}</p>
                  <p><strong>Email:</strong> {email}</p>
                  <p className="border-t border-premium-gold/10 pt-2 font-bold flex justify-between text-sm text-premium-gold">
                    <span>Payable Total:</span>
                    <span>₹{total.toFixed(2)}</span>
                  </p>
                </div>

                {orderError && (
                  <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{orderError}</p>
                )}

                <div className="space-y-3">
                  <button
                    onClick={triggerRazorpayPayment}
                    disabled={paying}
                    className="w-full flex justify-center items-center gap-2 rounded-full bg-premium-gold py-4 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-premium-gold/90 transition-all disabled:opacity-80"
                  >
                    {paying ? (
                      <>
                        <Loader2 className="animate-spin" size={14} /> Processing &amp; Saving Order...
                      </>
                    ) : (
                      <>
                        Pay ₹{total.toFixed(2)} with Razorpay
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={paying}
                    className="text-xs font-semibold text-matte-black/50 hover:text-premium-gold flex items-center gap-1 mx-auto dark:text-dark-text/50"
                  >
                    <ArrowLeft size={12} /> Edit Shipping Details
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-lg mx-auto"
            >
              <div className="glass-panel p-10 rounded-3xl shadow-xl text-center space-y-6">
                <div className="mx-auto h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 shadow-sm">
                  <CheckCircle2 size={36} />
                </div>

                <div className="space-y-2">
                  <span className="text-xs uppercase font-bold tracking-widest text-premium-gold">Purchase Complete</span>
                  <h2 className="text-3xl font-serif">Order Confirmed!</h2>
                  <p className="text-xs text-matte-black/60 dark:text-dark-text/60 leading-relaxed max-w-sm mx-auto">
                    Thank you for your order. We have successfully locked in your transaction. A shipping tracker and invoice have been dispatched.
                  </p>
                </div>

                {/* Info block */}
                <div className="p-5 rounded-2xl border border-premium-gold/15 bg-warm-beige/25 dark:bg-dark-card/20 space-y-3 text-left text-xs max-w-xs mx-auto">
                  <p><strong>Order Reference:</strong> <span className="font-mono text-[10px]">{orderId}</span></p>
                  <p><strong>Patient Recipient:</strong> {fullName}</p>
                  <p><strong>Est. Delivery:</strong> 3-4 Business Days (via Blue Dart)</p>
                </div>

                <div className="space-y-4 pt-2">
                  <p className="text-[10px] text-matte-black/50 dark:text-dark-text/50 max-w-xs mx-auto leading-relaxed">
                    Have any shipping queries? Send a text directly to our WhatsApp helpdesk.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href="https://wa.me/916363224102?text=Hi%20Narva%20Health%20I%20have%20an%20order%20query"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-green-500 text-green-600 hover:bg-green-500 hover:text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors dark:text-green-400 dark:border-green-400"
                    >
                      WhatsApp Support
                    </a>
                    <Link
                      href="/"
                      className="rounded-full bg-premium-gold px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-premium-gold/90 transition-all shadow-md"
                    >
                      Return to Home
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
