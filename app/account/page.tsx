'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  User, ShoppingBag, LogOut, Mail, Lock, Key, ArrowRight, Loader2,
  CheckCircle2, MapPin, Calendar, CreditCard, ShieldAlert, ArrowLeft, X
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'

type View = 'login' | 'signup' | 'magic-link' | 'dashboard'

export default function AccountPage() {
  const router = useRouter()
  const supabase = createClient()

  // Navigation / View states
  const [view, setView] = useState<View>('login')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  // Auth Form inputs
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Dashboard Data
  const [orders, setOrders] = useState<any[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  // 1. Check user session on mount
  useEffect(() => {
    async function checkUser() {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (currentUser) {
        setUser(currentUser)
        setView('dashboard')
        fetchOrders()
      } else {
        setView('login')
      }
      setLoading(false)
    }
    checkUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 2. Fetch User Orders
  async function fetchOrders() {
    setOrdersLoading(true)
    try {
      const res = await fetch('/api/user/orders')
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    } finally {
      setOrdersLoading(false)
    }
  }

  // 3. Auth Actions
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)
    setMessage(null)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
      setActionLoading(false)
    } else {
      setUser(data.user)
      setView('dashboard')
      setActionLoading(false)
      fetchOrders()
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)
    setMessage(null)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Account created! Please check your email to confirm registration.' })
      setView('login')
    }
    setActionLoading(false)
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/account`,
      },
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Magic link sent! Check your inbox to sign in instantly.' })
    }
    setActionLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setOrders([])
    setView('login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-matte-white dark:bg-dark-bg flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-premium-gold" size={32} />
        <p className="text-xs uppercase tracking-wider text-premium-gold font-bold mt-4">Loading Portal...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-matte-white dark:bg-dark-bg transition-colors duration-300 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          
          {/* ── AUTH PAGES (LOGIN / SIGNUP / MAGIC LINK) ── */}
          {view !== 'dashboard' && (
            <motion.div
              key="auth-container"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-md mx-auto w-full"
            >
              <div className="glass-panel p-8 sm:p-10 rounded-3xl shadow-xl space-y-6">
                
                {/* Header info */}
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-premium-gold/10 border border-premium-gold/20 flex items-center justify-center mx-auto">
                    <User className="text-premium-gold animate-pulse" size={20} />
                  </div>
                  <h2 className="font-serif text-2xl font-light">
                    {view === 'login' && 'Welcome Back'}
                    {view === 'signup' && 'Create Customer Account'}
                    {view === 'magic-link' && 'Passwordless Login'}
                  </h2>
                  <p className="text-xs text-matte-black/60 dark:text-dark-text/60 max-w-xs mx-auto">
                    {view === 'login' && 'Access order history, tracking metrics, and subscriptions.'}
                    {view === 'signup' && 'Sign up to register and automatically track past and future orders.'}
                    {view === 'magic-link' && 'Enter your email to receive a secure one-click sign-in link.'}
                  </p>
                </div>

                {/* Notifications */}
                {message && (
                  <div className={`p-4 rounded-xl text-xs flex gap-2 items-start ${
                    message.type === 'success' 
                      ? 'bg-green-500/10 text-green-600 border border-green-500/20' 
                      : 'bg-red-500/10 text-red-500 border border-red-500/20'
                  }`}>
                    {message.type === 'success' ? <CheckCircle2 size={15} className="flex-shrink-0" /> : <ShieldAlert size={15} className="flex-shrink-0" />}
                    <span>{message.text}</span>
                  </div>
                )}

                {/* LOGIN VIEW */}
                {view === 'login' && (
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-matte-black/50 dark:text-dark-text/50">Email Address</label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          placeholder="email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-transparent border border-premium-gold/15 dark:border-white/10 text-xs pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-premium-gold/50 transition-colors"
                        />
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-matte-black/40 dark:text-dark-text/40" size={14} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] uppercase font-bold text-matte-black/50 dark:text-dark-text/50">Password</label>
                        <button
                          type="button"
                          onClick={() => setView('magic-link')}
                          className="text-[9px] font-bold text-premium-gold hover:underline"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-transparent border border-premium-gold/15 dark:border-white/10 text-xs pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-premium-gold/50 transition-colors"
                        />
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-matte-black/40 dark:text-dark-text/40" size={14} />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="w-full flex justify-center items-center gap-2 rounded-xl bg-premium-gold py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-premium-gold/90 transition-all disabled:opacity-85"
                    >
                      {actionLoading ? <Loader2 className="animate-spin" size={14} /> : <>Sign In <ArrowRight size={14} /></>}
                    </button>
                  </form>
                )}

                {/* SIGNUP VIEW */}
                {view === 'signup' && (
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-matte-black/50 dark:text-dark-text/50">Full Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-transparent border border-premium-gold/15 dark:border-white/10 text-xs pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-premium-gold/50 transition-colors"
                        />
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-matte-black/40 dark:text-dark-text/40" size={14} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-matte-black/50 dark:text-dark-text/50">Email Address</label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          placeholder="email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-transparent border border-premium-gold/15 dark:border-white/10 text-xs pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-premium-gold/50 transition-colors"
                        />
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-matte-black/40 dark:text-dark-text/40" size={14} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-matte-black/50 dark:text-dark-text/50">Password</label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          placeholder="At least 6 characters"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-transparent border border-premium-gold/15 dark:border-white/10 text-xs pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-premium-gold/50 transition-colors"
                        />
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-matte-black/40 dark:text-dark-text/40" size={14} />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="w-full flex justify-center items-center gap-2 rounded-xl bg-premium-gold py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-premium-gold/90 transition-all disabled:opacity-85"
                    >
                      {actionLoading ? <Loader2 className="animate-spin" size={14} /> : <>Create Account <ArrowRight size={14} /></>}
                    </button>
                  </form>
                )}

                {/* MAGIC LINK VIEW */}
                {view === 'magic-link' && (
                  <form onSubmit={handleMagicLink} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-matte-black/50 dark:text-dark-text/50">Email Address</label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          placeholder="email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-transparent border border-premium-gold/15 dark:border-white/10 text-xs pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-premium-gold/50 transition-colors"
                        />
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-matte-black/40 dark:text-dark-text/40" size={14} />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="w-full flex justify-center items-center gap-2 rounded-xl bg-premium-gold py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-premium-gold/90 transition-all disabled:opacity-85"
                    >
                      {actionLoading ? <Loader2 className="animate-spin" size={14} /> : <>Send Magic Link <Key size={14} /></>}
                    </button>

                    <button
                      type="button"
                      onClick={() => setView('login')}
                      className="text-xs font-semibold text-matte-black/50 dark:text-dark-text/50 hover:text-premium-gold flex items-center gap-1.5 mx-auto"
                    >
                      <ArrowLeft size={12} /> Back to Sign In
                    </button>
                  </form>
                )}

                {/* View switcher links */}
                {view !== 'magic-link' && (
                  <div className="text-center pt-2 border-t border-premium-gold/10 text-xs space-y-1">
                    {view === 'login' ? (
                      <>
                        <span className="text-matte-black/50 dark:text-dark-text/50">Don't have an account? </span>
                        <button onClick={() => setView('signup')} className="font-bold text-premium-gold hover:underline">Sign Up</button>
                      </>
                    ) : (
                      <>
                        <span className="text-matte-black/50 dark:text-dark-text/50">Already registered? </span>
                        <button onClick={() => setView('login')} className="font-bold text-premium-gold hover:underline">Sign In</button>
                      </>
                    )}
                  </div>
                )}

              </div>
            </motion.div>
          )}

          {/* ── AUTHENTICATED CUSTOMER PORTAL (DASHBOARD) ── */}
          {view === 'dashboard' && (
            <motion.div
              key="dashboard-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-warm-beige/10 dark:bg-dark-card/25 border border-premium-gold/15 p-6 sm:p-8 rounded-3xl">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-premium-gold">Customer Portal</span>
                  <h2 className="font-serif text-3xl font-light">Hello, <span className="italic">{user?.user_metadata?.full_name || user?.email.split('@')[0]}</span></h2>
                  <p className="text-xs text-matte-black/60 dark:text-dark-text/60">Registered email: <span className="font-mono text-premium-gold">{user?.email}</span></p>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 self-start md:self-center border border-red-500/30 hover:bg-red-500 hover:text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-red-500 transition-colors"
                >
                  <LogOut size={13} /> Sign Out
                </button>
              </div>

              {/* Order History Panel */}
              <div className="space-y-4">
                <h3 className="font-serif text-xl border-b border-premium-gold/10 pb-2">Order History</h3>

                {ordersLoading ? (
                  <div className="py-12 text-center flex flex-col items-center">
                    <Loader2 className="animate-spin text-premium-gold" size={24} />
                    <p className="text-[10px] uppercase tracking-wider font-bold text-premium-gold mt-2">Retrieving orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="glass-panel p-10 rounded-3xl text-center space-y-4 border border-premium-gold/10">
                    <ShoppingBag className="text-premium-gold mx-auto" size={32} />
                    <h4 className="font-serif text-lg">No Orders Registered</h4>
                    <p className="text-xs text-matte-black/50 dark:text-dark-text/50 max-w-sm mx-auto leading-relaxed">
                      We couldn't find any orders placed under this email. Go checkout sleep aids to track your sleep scores!
                    </p>
                    <Link
                      href="/products"
                      className="inline-block rounded-full bg-[#1a1a1a] text-white text-[10px] font-bold uppercase tracking-[0.1em] px-6 py-3 hover:bg-neutral-800 transition-colors"
                    >
                      Shop Supplement
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {orders.map((o) => (
                      <div
                        key={o.id}
                        className="glass-panel p-6 rounded-3xl border border-premium-gold/10 space-y-4 hover:border-premium-gold/30 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-[10px] uppercase tracking-wider">
                            <span className="font-mono text-premium-gold">{o.id.substring(0, 8)}...</span>
                            <span className="font-semibold text-matte-black/60 dark:text-dark-text/60">
                              {new Date(o.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                            </span>
                          </div>

                          <div className="border-t border-premium-gold/5 pt-3">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-matte-black/40 dark:text-dark-text/40">Product</p>
                            <p className="text-xs font-semibold mt-0.5">
                              {o.order_items?.[0]?.products?.name || 'Narva Health Supplement'}
                              {o.order_items && o.order_items.length > 1 && ` (+${o.order_items.length - 1} items)`}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 border-t border-premium-gold/5 pt-3">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-matte-black/40 dark:text-dark-text/40">Status</p>
                              <span className="inline-block bg-premium-gold/10 text-premium-gold px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest mt-1">
                                {o.status}
                              </span>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-matte-black/40 dark:text-dark-text/40">Amount Paid</p>
                              <p className="text-sm font-serif font-semibold mt-0.5">₹{o.total}</p>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="w-full text-center border border-premium-gold/15 hover:border-premium-gold/50 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-premium-gold transition-colors mt-4"
                        >
                          View Details &amp; Tracking
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Order Detail Modal */}
              <AnimatePresence>
                {selectedOrder && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="glass-panel w-full max-w-md rounded-3xl p-7 shadow-2xl border border-premium-gold/15 space-y-5 relative"
                    >
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-warm-beige/50 transition-colors"
                      >
                        <X size={15} />
                      </button>

                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-premium-gold">Order Details</span>
                        <h3 className="font-mono text-sm mt-0.5 text-matte-black/60 dark:text-dark-text/60">{selectedOrder.id}</h3>
                      </div>

                      <div className="space-y-2.5 text-xs border border-premium-gold/10 rounded-xl p-4 bg-warm-beige/20 dark:bg-dark-card/30">
                        <div className="flex gap-2">
                          <span className="font-bold w-20 flex-shrink-0 text-matte-black/50 dark:text-dark-text/50">Status:</span>
                          <span className="uppercase font-bold tracking-wide text-premium-gold">{selectedOrder.status}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-bold w-20 flex-shrink-0 text-matte-black/50 dark:text-dark-text/50">Date:</span>
                          <span>{new Date(selectedOrder.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-bold w-20 flex-shrink-0 text-matte-black/50 dark:text-dark-text/50">Total Paid:</span>
                          <span className="font-semibold">₹{selectedOrder.total}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-bold w-20 flex-shrink-0 text-matte-black/50 dark:text-dark-text/50">Delivery:</span>
                          <span>{selectedOrder.addresses?.line1}, {selectedOrder.addresses?.city} - {selectedOrder.addresses?.pincode}</span>
                        </div>
                        {selectedOrder.tracking_number && (
                          <div className="flex gap-2 border-t border-premium-gold/10 pt-2.5 mt-2.5">
                            <span className="font-bold w-20 flex-shrink-0 text-matte-black/50 dark:text-dark-text/50">Tracking:</span>
                            <div>
                              <p className="font-semibold text-premium-gold">{selectedOrder.tracking_number}</p>
                              <p className="text-[9px] text-matte-black/40 dark:text-dark-text/40 uppercase mt-0.5">Carrier: {selectedOrder.courier || 'Blue Dart'}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Items List */}
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-matte-black/40 dark:text-dark-text/40">Items</p>
                        <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                          {selectedOrder.order_items?.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-center text-xs">
                              <span className="font-medium text-matte-black/80 dark:text-dark-text/80">{item.products?.name || 'Supplement'} × {item.quantity}</span>
                              <span className="font-bold">₹{item.total_price}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}
