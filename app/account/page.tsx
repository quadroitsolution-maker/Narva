'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  User, ShoppingBag, LogOut, Mail, Lock, Key, ArrowRight, Loader2,
  CheckCircle2, MapPin, Calendar, CreditCard, ShieldAlert, X, Heart,
  Bell, Ticket, Settings, Grid
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'

// Import Tab Components
import DashboardTab from '@/components/account/DashboardTab'
import OrdersTab from '@/components/account/OrdersTab'
import WishlistTab from '@/components/account/WishlistTab'
import AddressesTab from '@/components/account/AddressesTab'
import PaymentTab from '@/components/account/PaymentTab'
import ProfileTab from '@/components/account/ProfileTab'
import NotificationsTab from '@/components/account/NotificationsTab'
import SupportTab from '@/components/account/SupportTab'
import SettingsTab from '@/components/account/SettingsTab'

type View = 'login' | 'signup' | 'magic-link' | 'dashboard'
type Tab = 'dashboard' | 'orders' | 'wishlist' | 'addresses' | 'payment' | 'profile' | 'notifications' | 'support' | 'settings'

export default function AccountPage() {
  const router = useRouter()
  const supabase = createClient()

  // Navigation / View states
  const [view, setView] = useState<View>('login')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  // Auth Form inputs
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Check user session on mount
  useEffect(() => {
    async function checkUser() {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (currentUser) {
        setUser(currentUser)
        setView('dashboard')
      } else {
        setView('login')
      }
      setLoading(false)
    }
    checkUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auth Actions
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

  const handleGoogleSignIn = async () => {
    setActionLoading(true)
    setMessage(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/account`,
      },
    })
    if (error) {
      setMessage({ type: 'error', text: error.message })
      setActionLoading(false)
    }
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
    setView('login')
    setActiveTab('dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-matte-white dark:bg-dark-bg flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-premium-gold" size={32} />
        <p className="text-xs uppercase tracking-wider text-premium-gold font-bold mt-4">Loading Portal...</p>
      </div>
    )
  }

  const sidebarItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Grid size={15} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={15} /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart size={15} /> },
    { id: 'addresses', label: 'Addresses', icon: <MapPin size={15} /> },
    { id: 'payment', label: 'Payment Methods', icon: <CreditCard size={15} /> },
    { id: 'profile', label: 'Profile details', icon: <User size={15} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={15} /> },
    { id: 'support', label: 'Support center', icon: <Ticket size={15} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={15} /> }
  ]

  return (
    <div className="min-h-screen bg-matte-white dark:bg-dark-bg transition-colors duration-300 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AnimatePresence mode="wait">
          
          {/* ── AUTH PAGES (LOGIN / SIGNUP / MAGIC LINK) ── */}
          {view !== 'dashboard' && (
            <motion.div
              key="auth-container"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-md mx-auto w-full py-10"
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
                    {view === 'login' && 'Access order history, tracking metrics, and custom addresses.'}
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
                      <label className="text-[10px] uppercase font-bold text-matte-black/50">Email Address</label>
                      <div className="relative">
                        <input
                          required type="email"
                          value={email} onChange={e => setEmail(e.target.value)}
                          className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs pl-9 pr-3 py-2.5 rounded-xl focus:outline-none"
                          placeholder="you@email.com"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-matte-black/35" size={13} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] uppercase font-bold text-matte-black/50">Password</label>
                        <button
                          type="button"
                          onClick={() => setView('magic-link')}
                          className="text-[10px] text-premium-gold hover:underline font-bold"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          required type="password"
                          value={password} onChange={e => setPassword(e.target.value)}
                          className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs pl-9 pr-3 py-2.5 rounded-xl focus:outline-none"
                        />
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-matte-black/35" size={13} />
                      </div>
                    </div>
                    <button
                      disabled={actionLoading}
                      type="submit"
                      className="w-full bg-premium-gold text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl hover:bg-premium-gold/90 transition-colors flex items-center justify-center gap-1 shadow-md"
                    >
                      {actionLoading ? 'Verifying...' : 'Sign In'} <ArrowRight size={13} />
                    </button>
                  </form>
                )}

                {/* SIGNUP VIEW */}
                {view === 'signup' && (
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-matte-black/50">Full Name</label>
                      <div className="relative">
                        <input
                          required type="text"
                          value={name} onChange={e => setName(e.target.value)}
                          className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs pl-9 pr-3 py-2.5 rounded-xl focus:outline-none"
                          placeholder="John Doe"
                        />
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-matte-black/35" size={13} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-matte-black/50">Email Address</label>
                      <div className="relative">
                        <input
                          required type="email"
                          value={email} onChange={e => setEmail(e.target.value)}
                          className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs pl-9 pr-3 py-2.5 rounded-xl focus:outline-none"
                          placeholder="you@email.com"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-matte-black/35" size={13} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-matte-black/50">Password</label>
                      <div className="relative">
                        <input
                          required type="password" minLength={6}
                          value={password} onChange={e => setPassword(e.target.value)}
                          className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs pl-9 pr-3 py-2.5 rounded-xl focus:outline-none"
                        />
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-matte-black/35" size={13} />
                      </div>
                    </div>
                    <button
                      disabled={actionLoading}
                      type="submit"
                      className="w-full bg-premium-gold text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl hover:bg-premium-gold/90 transition-colors flex items-center justify-center gap-1 shadow-md"
                    >
                      {actionLoading ? 'Creating...' : 'Register Account'} <ArrowRight size={13} />
                    </button>
                  </form>
                )}

                {/* MAGIC LINK VIEW */}
                {view === 'magic-link' && (
                  <form onSubmit={handleMagicLink} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-matte-black/50">Email Address</label>
                      <div className="relative">
                        <input
                          required type="email"
                          value={email} onChange={e => setEmail(e.target.value)}
                          className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs pl-9 pr-3 py-2.5 rounded-xl focus:outline-none"
                          placeholder="you@email.com"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-matte-black/35" size={13} />
                      </div>
                    </div>
                    <button
                      disabled={actionLoading}
                      type="submit"
                      className="w-full bg-premium-gold text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl hover:bg-premium-gold/90 transition-colors flex items-center justify-center gap-1 shadow-md"
                    >
                      {actionLoading ? 'Sending...' : 'Send Magic Link'} <ArrowRight size={13} />
                    </button>
                  </form>
                )}

                {/* Google OAuth Button */}
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-premium-gold/10"></div>
                  <span className="flex-shrink mx-4 text-[10px] text-matte-black/35 uppercase font-bold tracking-wider">or sign in with</span>
                  <div className="flex-grow border-t border-premium-gold/10"></div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full border border-premium-gold/25 hover:bg-premium-gold/5 text-matte-black dark:text-dark-text text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google Account
                </button>

                {/* Footer Switcher */}
                <div className="text-center pt-2">
                  {view === 'login' ? (
                    <p className="text-xs text-matte-black/55">
                      Don't have an account?{' '}
                      <button onClick={() => setView('signup')} className="text-premium-gold font-bold hover:underline">
                        Register here
                      </button>
                    </p>
                  ) : (
                    <p className="text-xs text-matte-black/55">
                      Already have an account?{' '}
                      <button onClick={() => setView('login')} className="text-premium-gold font-bold hover:underline">
                        Sign In
                      </button>
                    </p>
                  )}
                </div>

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
              className="flex flex-col lg:flex-row gap-8 py-5"
            >
              {/* Left Sidebar Navigation */}
              <aside className="w-full lg:w-64 flex-shrink-0">
                <div className="glass-panel p-5 rounded-2xl border border-premium-gold/10 lg:sticky lg:top-24 space-y-4">
                  
                  {/* Small Profile Summary in Sidebar */}
                  <div className="flex items-center gap-3 border-b border-premium-gold/10 pb-4">
                    <div className="w-10 h-10 rounded-full bg-premium-gold/10 border border-premium-gold/25 flex items-center justify-center text-premium-gold text-sm font-serif font-light">
                      {user.email[0].toUpperCase()}
                    </div>
                    <div className="truncate">
                      <span className="block text-[8px] uppercase tracking-widest text-premium-gold font-bold">Logged In</span>
                      <p className="text-xs font-medium truncate text-matte-black/75 dark:text-dark-text/75">{user.email}</p>
                    </div>
                  </div>

                  {/* Nav list */}
                  <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-1.5 scrollbar-thin">
                    {sidebarItems.map(item => {
                      const isActive = activeTab === item.id
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id)
                            setSelectedOrderId(null)
                          }}
                          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex-shrink-0 text-left ${
                            isActive
                              ? 'bg-premium-gold text-white shadow-md'
                              : 'text-matte-black/60 dark:text-dark-text/60 hover:bg-warm-beige/10 hover:text-premium-gold'
                          }`}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </button>
                      )
                    })}
                  </nav>

                </div>
              </aside>

              {/* Right Panel Main View */}
              <section className="flex-grow min-w-0">
                <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-premium-gold/10 bg-warm-beige/5 min-h-[50vh]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {activeTab === 'dashboard' && (
                        <DashboardTab
                          supabase={supabase}
                          user={user}
                          setActiveTab={setActiveTab}
                          setSelectedOrderId={setSelectedOrderId}
                        />
                      )}
                      {activeTab === 'orders' && (
                        <OrdersTab
                          supabase={supabase}
                          user={user}
                          selectedOrderId={selectedOrderId}
                          setSelectedOrderId={setSelectedOrderId}
                        />
                      )}
                      {activeTab === 'wishlist' && (
                        <WishlistTab
                          supabase={supabase}
                          user={user}
                        />
                      )}
                      {activeTab === 'addresses' && (
                        <AddressesTab
                          supabase={supabase}
                          user={user}
                        />
                      )}
                      {activeTab === 'payment' && (
                        <PaymentTab
                          supabase={supabase}
                          user={user}
                        />
                      )}
                      {activeTab === 'profile' && (
                        <ProfileTab
                          supabase={supabase}
                          user={user}
                        />
                      )}
                      {activeTab === 'notifications' && (
                        <NotificationsTab
                          supabase={supabase}
                          user={user}
                        />
                      )}
                      {activeTab === 'support' && (
                        <SupportTab
                          supabase={supabase}
                          user={user}
                        />
                      )}
                      {activeTab === 'settings' && (
                        <SettingsTab
                          supabase={supabase}
                          onLogout={handleLogout}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </section>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}
