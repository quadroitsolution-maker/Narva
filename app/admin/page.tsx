'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import {
  TrendingUp, ShoppingBag, Users, Calendar, AlertTriangle, CheckCircle,
  XCircle, Tag, Star, LogOut, Edit2, Trash2, Search, Plus, X, Mail,
  Bell, Package, BarChart2, ChevronRight, Download, Eye, EyeOff,
  RefreshCw, ArrowUpRight, ArrowDownRight, Shield, Clock, MessageSquare,
  Stethoscope, BookOpen, Activity, ChevronDown, Check, Save, Hash
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts'
import { MOCK_PRODUCTS, MOCK_REVIEWS, MOCK_BLOGS, MOCK_SLOTS, MOCK_COUPONS } from '@/lib/db'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ADMIN_PIN = '1234'

const KPI = { revenue: 24780, orders: 62, subscriptions: 148, newCustomers: 28 }

const REVENUE_DATA = [
  { day: 'Mon', revenue: 4200, orders: 11 },
  { day: 'Tue', revenue: 3800, orders: 9 },
  { day: 'Wed', revenue: 5100, orders: 13 },
  { day: 'Thu', revenue: 4900, orders: 12 },
  { day: 'Fri', revenue: 6200, orders: 16 },
  { day: 'Sat', revenue: 7400, orders: 19 },
  { day: 'Sun', revenue: 6800, orders: 17 },
]

const WEEKLY_TREND = [
  { week: 'W1 Jun', revenue: 18200 },
  { week: 'W2 Jun', revenue: 21400 },
  { week: 'W3 Jun', revenue: 19800 },
  { week: 'W4 Jun', revenue: 24780 },
]

const ORDER_STATUS_PIE = [
  { name: 'Delivered', value: 38 },
  { name: 'Shipped', value: 12 },
  { name: 'Processing', value: 7 },
  { name: 'Pending', value: 5 },
]
const PIE_COLORS = ['#22c55e', '#C5A880', '#60a5fa', '#f59e0b']

const MOCK_CUSTOMERS = [
  { id: 'c1', name: 'Arya Sharma', email: 'arya@example.com', phone: '+91 98765 43210', city: 'Mumbai', totalOrders: 3, totalSpend: 1197, lastOrder: '2026-06-24', status: 'active', joined: '2026-04-10', plan: 'One-time' },
  { id: 'c2', name: 'Dr. Kabir Sen', email: 'kabir@example.com', phone: '+91 99887 76655', city: 'Delhi', totalOrders: 6, totalSpend: 1974, lastOrder: '2026-06-23', status: 'active', joined: '2026-02-15', plan: 'Subscribe' },
  { id: 'c3', name: 'Rohan Mehta', email: 'rohan@example.com', phone: '+91 91234 56789', city: 'Bangalore', totalOrders: 1, totalSpend: 399, lastOrder: '2026-06-24', status: 'active', joined: '2026-06-20', plan: 'One-time' },
  { id: 'c4', name: 'Priya Kapoor', email: 'priya@example.com', phone: '+91 90000 12345', city: 'Pune', totalOrders: 4, totalSpend: 1316, lastOrder: '2026-06-18', status: 'active', joined: '2026-03-01', plan: 'Subscribe' },
  { id: 'c5', name: 'Vikram Nair', email: 'vikram@example.com', phone: '+91 88888 99999', city: 'Chennai', totalOrders: 2, totalSpend: 798, lastOrder: '2026-06-10', status: 'inactive', joined: '2026-05-12', plan: 'One-time' },
]

const MOCK_SUBSCRIBERS = [
  { id: 'sub1', email: 'arya@example.com', name: 'Arya Sharma', joined: '2026-06-24', source: 'Homepage CTA' },
  { id: 'sub2', email: 'priya.k@gmail.com', name: 'Priya K.', joined: '2026-06-22', source: 'Footer' },
  { id: 'sub3', email: 'health@vikramnair.com', name: 'Vikram N.', joined: '2026-06-20', source: 'Blog Post' },
  { id: 'sub4', email: 'meena.s@outlook.com', name: 'Meena S.', joined: '2026-06-19', source: 'Homepage CTA' },
  { id: 'sub5', email: 'kabir.docs@gmail.com', name: 'Dr. Kabir Sen', joined: '2026-06-15', source: 'Science Page' },
  { id: 'sub6', email: 'aditi.rao@yahoo.com', name: 'Aditi Rao', joined: '2026-06-10', source: 'Blog Post' },
]

const MOCK_ACTIVITY = [
  { id: 'a1', type: 'order', icon: 'order', message: 'New order #ord_4 from Priya Kapoor — ₹399', time: '2 min ago', color: 'text-green-500' },
  { id: 'a2', type: 'review', icon: 'review', message: 'New review submitted by Vikram Nair (4★)', time: '14 min ago', color: 'text-yellow-500' },
  { id: 'a3', type: 'consultation', icon: 'consult', message: 'Consultation booked: Meena S. for Jun 28 @ 11AM', time: '31 min ago', color: 'text-blue-400' },
  { id: 'a4', type: 'subscriber', icon: 'mail', message: 'New email subscriber: aditi.rao@yahoo.com', time: '1 hr ago', color: 'text-purple-400' },
  { id: 'a5', type: 'order', icon: 'order', message: 'Order #ord_3 status updated to Shipped', time: '2 hr ago', color: 'text-green-500' },
  { id: 'a6', type: 'coupon', icon: 'coupon', message: 'Coupon WELCOME10 used — ₹39.90 discount applied', time: '3 hr ago', color: 'text-premium-gold' },
  { id: 'a7', type: 'order', icon: 'order', message: 'New order #ord_3 from Rohan Mehta — ₹399', time: '4 hr ago', color: 'text-green-500' },
  { id: 'a8', type: 'review', icon: 'review', message: 'Review by Dr. Kabir Sen approved', time: '5 hr ago', color: 'text-yellow-500' },
]

const MOCK_ORDERS_FULL = [
  { id: 'ord_1', customer: 'Arya Sharma', email: 'arya@example.com', product: 'Sleep Gummies (1-time)', amount: 399, status: 'confirmed', date: '2026-06-24', tracking: '', courier: '', address: '12 Marine Drive, Mumbai 400001' },
  { id: 'ord_2', customer: 'Dr. Kabir Sen', email: 'kabir@example.com', product: 'Sleep Gummies (Subscribe)', amount: 329, status: 'delivered', date: '2026-06-23', tracking: 'SF123456789IN', courier: 'Blue Dart', address: '45 Connaught Place, Delhi 110001' },
  { id: 'ord_3', customer: 'Rohan Mehta', email: 'rohan@example.com', product: 'Sleep Gummies (1-time)', amount: 399, status: 'pending', date: '2026-06-24', tracking: '', courier: '', address: '7 MG Road, Bangalore 560001' },
  { id: 'ord_4', customer: 'Priya Kapoor', email: 'priya@example.com', product: 'Sleep Gummies (Subscribe)', amount: 329, status: 'shipped', date: '2026-06-22', tracking: 'DL987654321IN', courier: 'Delhivery', address: '3 FC Road, Pune 411004' },
]

type Panel = 'home' | 'orders' | 'products' | 'customers' | 'subscriptions' | 'coupons' | 'reviews' | 'blogs' | 'consultations' | 'subscribers' | 'activity'

// ─── Activity Icon Helper ─────────────────────────────────────────────────────
function ActivityIcon({ type }: { type: string }) {
  const cls = 'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0'
  if (type === 'order') return <div className={`${cls} bg-green-500/15`}><ShoppingBag size={13} className="text-green-500" /></div>
  if (type === 'review') return <div className={`${cls} bg-yellow-500/15`}><Star size={13} className="text-yellow-500" /></div>
  if (type === 'consultation') return <div className={`${cls} bg-blue-400/15`}><Stethoscope size={13} className="text-blue-400" /></div>
  if (type === 'subscriber') return <div className={`${cls} bg-purple-400/15`}><Mail size={13} className="text-purple-400" /></div>
  return <div className={`${cls} bg-premium-gold/15`}><Tag size={13} className="text-premium-gold" /></div>
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-indigo-100 text-indigo-700',
    shipped: 'bg-orange-100 text-orange-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-neutral-100 text-neutral-500',
  }
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${map[status] || 'bg-neutral-100 text-neutral-500'}`}>
      {status}
    </span>
  )
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pin, setPin] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const attempt = () => {
    if (pin === ADMIN_PIN) {
      onLogin()
    } else {
      setError(true)
      setShake(true)
      setPin('')
      setTimeout(() => { setError(false); setShake(false) }, 800)
    }
  }

  return (
    <div className="min-h-screen bg-[#0e0e18] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-premium-gold/5 rounded-full blur-[120px]" />
      </div>
      <motion.div
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-sm"
      >
        <div className="bg-[#1a1a2e] border border-premium-gold/15 rounded-3xl p-10 shadow-2xl space-y-8 text-center">
          <div className="space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-premium-gold/10 border border-premium-gold/20 flex items-center justify-center mx-auto">
              <Shield size={24} className="text-premium-gold" />
            </div>
            <h1 className="font-serif text-2xl font-light text-white">narva<span className="text-premium-gold font-sans not-italic font-bold">.</span></h1>
            <p className="text-[10px] uppercase tracking-widest text-premium-gold font-bold">Admin Console</p>
          </div>

          <div className="space-y-3 text-left">
            <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest block">Admin PIN</label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={e => { setPin(e.target.value); setError(false) }}
                onKeyDown={e => e.key === 'Enter' && attempt()}
                placeholder="• • • •"
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-center text-lg tracking-[0.4em] focus:outline-none transition-colors ${error ? 'border-red-500/70' : 'border-white/10 focus:border-premium-gold/50'}`}
              />
              <button
                type="button"
                onClick={() => setShowPin(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && <p className="text-[11px] text-red-400 text-center">Incorrect PIN. Try again.</p>}
          </div>

          <button
            onClick={attempt}
            className="w-full bg-premium-gold text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl hover:bg-premium-gold/90 transition-colors flex items-center justify-center gap-2"
          >
            Enter Console <ChevronRight size={14} />
          </button>

          <p className="text-[10px] text-white/20">Hint: try 1234</p>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Main Admin Component ─────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false)
  const [activePanel, setActivePanel] = useState<Panel>('home')

  const [orders, setOrders] = useState(MOCK_ORDERS_FULL)
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [reviews, setReviews] = useState(MOCK_REVIEWS)
  const [blogs, setBlogs] = useState(MOCK_BLOGS)
  const [slots, setSlots] = useState(MOCK_SLOTS)
  const [coupons, setCoupons] = useState(MOCK_COUPONS)
  const [customers] = useState(MOCK_CUSTOMERS)
  const [subscribers, setSubscribers] = useState(MOCK_SUBSCRIBERS)

  // Order panel
  const [orderSearch, setOrderSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [trackingId, setTrackingId] = useState('')
  const [courierVal, setCourierVal] = useState('Blue Dart')

  // Product edit
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [editProductForm, setEditProductForm] = useState({ name: '', price: '', compare_price: '', stock_qty: '' })

  // Blog edit
  const [editingBlog, setEditingBlog] = useState<any>(null)
  const [editBlogForm, setEditBlogForm] = useState({ title: '', category: '', excerpt: '' })

  // Blog create
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogCategory, setNewBlogCategory] = useState('Sleep Health')
  const [newBlogExcerpt, setNewBlogExcerpt] = useState('')

  // Coupon create
  const [newCouponCode, setNewCouponCode] = useState('')
  const [newCouponType, setNewCouponType] = useState('pct')
  const [newCouponVal, setNewCouponVal] = useState('')

  // Slot create
  const [newSlotDate, setNewSlotDate] = useState('')
  const [newSlotTime, setNewSlotTime] = useState('10:00 AM')

  // Customer detail
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [customerSearch, setCustomerSearch] = useState('')

  // Subscriber search
  const [subSearch, setSubSearch] = useState('')

  // Handlers
  const updateOrderStatus = (id: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    setSelectedOrder((prev: any) => prev?.id === id ? { ...prev, status } : prev)
  }

  const addTracking = () => {
    if (!selectedOrder) return
    setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, tracking: trackingId, courier: courierVal, status: 'shipped' } : o))
    setSelectedOrder(null)
    setTrackingId('')
  }

  const openProductEdit = (p: any) => {
    setEditingProduct(p)
    setEditProductForm({ name: p.name, price: String(p.price), compare_price: String(p.compare_price), stock_qty: String(p.stock_qty) })
  }

  const saveProductEdit = () => {
    setProducts(prev => prev.map(p => p.id === editingProduct.id ? {
      ...p,
      name: editProductForm.name,
      price: parseFloat(editProductForm.price) || p.price,
      compare_price: parseFloat(editProductForm.compare_price) || p.compare_price,
      stock_qty: parseInt(editProductForm.stock_qty) || p.stock_qty,
    } : p))
    setEditingProduct(null)
  }

  const openBlogEdit = (b: any) => {
    setEditingBlog(b)
    setEditBlogForm({ title: b.title, category: b.category, excerpt: b.excerpt })
  }

  const saveBlogEdit = () => {
    setBlogs(prev => prev.map(b => b.id === editingBlog.id ? { ...b, ...editBlogForm } : b))
    setEditingBlog(null)
  }

  const createBlog = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBlogTitle) return
    setBlogs(prev => [{
      id: 'b_' + Date.now(),
      slug: newBlogTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: newBlogTitle,
      excerpt: newBlogExcerpt,
      category: newBlogCategory,
      cover_image_url: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=600',
      author_name: 'Dr. Rohan Mehta, MBBS (AIIMS)',
      author_image_url: '',
      published_at: new Date().toISOString().split('T')[0],
      read_time: '3 min read',
      body: '<p>Blog body...</p>',
    }, ...prev])
    setNewBlogTitle('')
    setNewBlogExcerpt('')
  }

  const createCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCouponCode) return
    setCoupons(prev => [...prev, { code: newCouponCode.toUpperCase(), type: newCouponType, value: parseFloat(newCouponVal) || 10, min_order_value: 299, max_discount: 100 }])
    setNewCouponCode(''); setNewCouponVal('')
  }

  const createSlot = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSlotDate) return
    setSlots(prev => [...prev, { id: 's_' + Date.now(), date: newSlotDate, start_time: newSlotTime, end_time: '', is_booked: false }])
    setNewSlotDate('')
  }

  const exportSubscribersCsv = () => {
    const csv = ['Email,Name,Joined,Source', ...subscribers.map(s => `${s.email},${s.name},${s.joined},${s.source}`)].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'narva_subscribers.csv'; a.click()
  }

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />

  const navItems: { id: Panel; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Analytics', icon: <BarChart2 size={15} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={15} />, badge: orders.filter(o => o.status === 'pending').length },
    { id: 'products', label: 'Products', icon: <Package size={15} /> },
    { id: 'customers', label: 'Customers', icon: <Users size={15} /> },
    { id: 'subscriptions', label: 'Subscriptions', icon: <RefreshCw size={15} /> },
    { id: 'reviews', label: 'Reviews', icon: <Star size={15} />, badge: reviews.length },
    { id: 'blogs', label: 'Blog Manager', icon: <BookOpen size={15} /> },
    { id: 'consultations', label: 'Consultations', icon: <Calendar size={15} /> },
    { id: 'subscribers', label: 'Email Subscribers', icon: <Mail size={15} /> },
    { id: 'coupons', label: 'Coupons', icon: <Tag size={15} /> },
    { id: 'activity', label: 'Activity Log', icon: <Activity size={15} /> },
  ]

  return (
    <div className="min-h-screen bg-matte-white dark:bg-dark-bg text-matte-black dark:text-dark-text flex transition-colors duration-300 font-sans">

      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <aside className="w-60 border-r border-premium-gold/10 bg-warm-beige/20 dark:bg-dark-card/20 dark:border-white/5 flex flex-col flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="p-5 pb-4 border-b border-premium-gold/10 dark:border-white/5">
          <Link href="/" className="font-serif text-2xl font-light italic tracking-wider text-matte-black dark:text-dark-text">
            narva<span className="text-premium-gold font-sans not-italic font-bold">.</span>
          </Link>
          <span className="block text-[8px] uppercase tracking-widest text-premium-gold font-bold mt-0.5">Admin Console</span>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActivePanel(item.id); setSelectedOrder(null); setSelectedCustomer(null) }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-[11px] font-semibold transition-all ${
                activePanel === item.id
                  ? 'bg-premium-gold text-white shadow-sm'
                  : 'text-matte-black/55 hover:bg-warm-beige/60 hover:text-premium-gold dark:text-dark-text/55 dark:hover:bg-dark-card'
              }`}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">{item.badge}</span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-premium-gold/10 dark:border-white/5">
          <button
            onClick={() => setAuthed(false)}
            className="w-full flex items-center gap-2 text-[11px] font-semibold text-red-500 hover:text-red-600 transition-colors py-2"
          >
            <LogOut size={14} /> Exit Console
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        <div className="p-8 max-w-7xl mx-auto space-y-8">

          {/* ── ANALYTICS ──────────────────────────────────────────────────────── */}
          {activePanel === 'home' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-3xl font-light">Analytics Dashboard</h2>
                  <p className="text-xs text-matte-black/40 dark:text-dark-text/40 mt-1">Last updated: Today, 10:00 PM IST</p>
                </div>
                <div className="flex gap-2">
                  {['7D', '30D', 'All'].map(p => (
                    <button key={p} className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-colors ${p === '7D' ? 'bg-premium-gold text-white border-premium-gold' : 'border-premium-gold/20 text-matte-black/50 dark:text-dark-text/50 hover:border-premium-gold/40'}`}>{p}</button>
                  ))}
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Revenue (7d)", val: `₹${KPI.revenue.toLocaleString()}`, change: '+12.4%', up: true, sub: 'vs prev week' },
                  { title: "Total Orders", val: KPI.orders, change: '+8%', up: true, sub: 'vs prev week' },
                  { title: "Subscriptions", val: KPI.subscriptions, change: '+5 new', up: true, sub: 'active plans' },
                  { title: "New Customers", val: KPI.newCustomers, change: '-2%', up: false, sub: 'vs prev week' },
                ].map((kpi, i) => (
                  <div key={i} className="glass-panel p-5 rounded-2xl border border-premium-gold/10">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-matte-black/40 dark:text-dark-text/40">{kpi.title}</p>
                    <p className="text-2xl font-bold text-matte-black dark:text-dark-text mt-1.5">{kpi.val}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {kpi.up ? <ArrowUpRight size={12} className="text-green-500" /> : <ArrowDownRight size={12} className="text-red-400" />}
                      <span className={`text-[10px] font-bold ${kpi.up ? 'text-green-500' : 'text-red-400'}`}>{kpi.change}</span>
                      <span className="text-[10px] text-matte-black/30 dark:text-dark-text/30">{kpi.sub}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bar Chart */}
                <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-premium-gold/10">
                  <h3 className="font-serif text-base font-medium mb-4">Daily Revenue & Orders (7d)</h3>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={REVENUE_DATA} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.08} />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                        <Tooltip contentStyle={{ background: '#FAF9F5', borderRadius: '12px', border: '1px solid #C5A88033', fontSize: 11 }} />
                        <Bar dataKey="revenue" name="Revenue (₹)" fill="#C5A880" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Pie Chart */}
                <div className="glass-panel p-6 rounded-2xl border border-premium-gold/10">
                  <h3 className="font-serif text-base font-medium mb-4">Orders by Status</h3>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={ORDER_STATUS_PIE} cx="50%" cy="45%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                          {ORDER_STATUS_PIE.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                        </Pie>
                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                        <Tooltip contentStyle={{ borderRadius: '10px', fontSize: 11 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Trend Line + Quick Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Monthly trend */}
                <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-premium-gold/10">
                  <h3 className="font-serif text-base font-medium mb-4">Monthly Revenue Trend</h3>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={WEEKLY_TREND}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.08} />
                        <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                        <Tooltip contentStyle={{ background: '#FAF9F5', borderRadius: '12px', border: '1px solid #C5A88033', fontSize: 11 }} />
                        <Line type="monotone" dataKey="revenue" stroke="#C5A880" strokeWidth={2.5} dot={{ r: 4, fill: '#C5A880' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Quick alerts */}
                <div className="glass-panel p-5 rounded-2xl border border-premium-gold/10 space-y-4">
                  <h3 className="font-serif text-base font-medium flex items-center gap-2">
                    <AlertTriangle size={15} className="text-yellow-500" /> Quick Alerts
                  </h3>
                  <div className="space-y-3 text-xs">
                    {products.map(p => (
                      <div key={p.id} className="flex items-center justify-between py-2 border-b border-premium-gold/8 last:border-0">
                        <div>
                          <p className="font-medium text-[11px] truncate max-w-[120px]">{p.name}</p>
                          <p className="text-[10px] text-red-500 font-semibold">Stock: {p.stock_qty}</p>
                        </div>
                        <button
                          onClick={() => setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, stock_qty: 150 } : prod))}
                          className="text-[9px] font-bold bg-premium-gold/10 text-premium-gold hover:bg-premium-gold hover:text-white px-2.5 py-1 rounded-full transition-colors"
                        >Restock</button>
                      </div>
                    ))}
                    <div className="pt-1 border-t border-premium-gold/8">
                      <p className="text-[10px] text-matte-black/40 dark:text-dark-text/40">
                        {orders.filter(o => o.status === 'pending').length} orders awaiting confirmation
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity Snapshot */}
              <div className="glass-panel p-6 rounded-2xl border border-premium-gold/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-base font-medium">Recent Activity</h3>
                  <button onClick={() => setActivePanel('activity')} className="text-[10px] font-bold text-premium-gold hover:underline flex items-center gap-1">
                    View all <ChevronRight size={12} />
                  </button>
                </div>
                <div className="space-y-3">
                  {MOCK_ACTIVITY.slice(0, 4).map(a => (
                    <div key={a.id} className="flex items-start gap-3">
                      <ActivityIcon type={a.type} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-matte-black/80 dark:text-dark-text/80 leading-relaxed">{a.message}</p>
                        <p className="text-[10px] text-matte-black/35 dark:text-dark-text/35 mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ORDERS ─────────────────────────────────────────────────────────── */}
          {activePanel === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-3xl font-light">Orders</h2>
                  <p className="text-xs text-matte-black/40 mt-1">{orders.length} total orders</p>
                </div>
                <div className="flex items-center gap-2 border border-premium-gold/20 rounded-full bg-matte-white dark:bg-dark-bg px-3 py-2 w-60">
                  <Search size={13} className="text-premium-gold" />
                  <input
                    type="text"
                    placeholder="Search by ID or customer…"
                    value={orderSearch}
                    onChange={e => setOrderSearch(e.target.value)}
                    className="w-full bg-transparent text-[11px] focus:outline-none"
                  />
                </div>
              </div>

              <div className="glass-panel rounded-2xl border border-premium-gold/10 overflow-hidden">
                <div className="grid grid-cols-7 gap-4 bg-warm-beige/30 dark:bg-dark-card/50 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-matte-black/50 dark:text-dark-text/50 border-b border-premium-gold/10">
                  <span>Order ID</span>
                  <span className="col-span-2">Customer</span>
                  <span>Date</span>
                  <span>Amount</span>
                  <span>Status</span>
                  <span>Action</span>
                </div>
                <div className="divide-y divide-premium-gold/8">
                  {orders.filter(o => o.id.includes(orderSearch) || o.customer.toLowerCase().includes(orderSearch.toLowerCase())).map(o => (
                    <div key={o.id} className="grid grid-cols-7 gap-4 px-5 py-4 items-center text-xs hover:bg-warm-beige/10 dark:hover:bg-dark-card/20 transition-colors">
                      <span className="font-mono text-premium-gold text-[11px]">{o.id}</span>
                      <div className="col-span-2">
                        <p className="font-medium">{o.customer}</p>
                        <p className="text-[10px] text-matte-black/40 dark:text-dark-text/40">{o.email}</p>
                      </div>
                      <span className="text-[11px]">{o.date}</span>
                      <span className="font-semibold">₹{o.amount}</span>
                      <StatusBadge status={o.status} />
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="text-[10px] font-bold text-premium-gold hover:underline flex items-center gap-1"
                      >
                        <Eye size={11} /> View
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Detail Modal */}
              <AnimatePresence>
                {selectedOrder && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                      className="glass-panel w-full max-w-md rounded-3xl p-7 shadow-2xl border border-premium-gold/15 space-y-5 relative"
                    >
                      <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-warm-beige/50 transition-colors">
                        <X size={15} />
                      </button>

                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-premium-gold font-bold">Order Details</p>
                        <h3 className="font-serif text-lg mt-0.5">{selectedOrder.id}</h3>
                      </div>

                      <div className="space-y-2 text-xs border border-premium-gold/10 rounded-xl p-4 bg-warm-beige/20 dark:bg-dark-card/30">
                        {[
                          ['Customer', `${selectedOrder.customer} (${selectedOrder.email})`],
                          ['Product', selectedOrder.product],
                          ['Amount', `₹${selectedOrder.amount}`],
                          ['Date', selectedOrder.date],
                          ['Address', selectedOrder.address],
                          ['Status', <StatusBadge key="s" status={selectedOrder.status} />],
                          selectedOrder.tracking ? ['Tracking', selectedOrder.tracking] : null,
                        ].filter(Boolean).map(([label, val]: any) => (
                          <div key={label} className="flex gap-2">
                            <span className="font-bold w-20 flex-shrink-0 text-matte-black/50 dark:text-dark-text/50">{label}</span>
                            <span className="flex-1">{val}</span>
                          </div>
                        ))}
                      </div>

                      {/* Status Actions */}
                      {selectedOrder.status === 'pending' && (
                        <button onClick={() => updateOrderStatus(selectedOrder.id, 'confirmed')} className="w-full bg-blue-600 text-white text-[11px] font-bold py-2.5 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                          <Check size={13} /> Confirm Order
                        </button>
                      )}
                      {selectedOrder.status === 'confirmed' && (
                        <button onClick={() => updateOrderStatus(selectedOrder.id, 'processing')} className="w-full bg-indigo-600 text-white text-[11px] font-bold py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
                          Mark as Processing
                        </button>
                      )}
                      {selectedOrder.status === 'processing' && (
                        <div className="space-y-3">
                          <p className="text-[11px] font-bold">Add Tracking</p>
                          <div className="grid grid-cols-2 gap-2">
                            <input type="text" value={trackingId} onChange={e => setTrackingId(e.target.value)} placeholder="Tracking ID" className="bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs px-3 py-2 rounded-xl" />
                            <select value={courierVal} onChange={e => setCourierVal(e.target.value)} className="bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs px-2 py-2 rounded-xl">
                              {['Blue Dart', 'Delhivery', 'Shiprocket', 'DTDC'].map(c => <option key={c}>{c}</option>)}
                            </select>
                          </div>
                          <button onClick={addTracking} className="w-full bg-orange-500 text-white text-[11px] font-bold py-2.5 rounded-xl hover:bg-orange-600 transition-colors">
                            Mark Shipped
                          </button>
                        </div>
                      )}
                      {selectedOrder.status === 'shipped' && (
                        <button onClick={() => { updateOrderStatus(selectedOrder.id, 'delivered'); setSelectedOrder(null) }} className="w-full bg-green-600 text-white text-[11px] font-bold py-2.5 rounded-xl hover:bg-green-700 transition-colors">
                          Mark Delivered
                        </button>
                      )}
                      {['confirmed', 'pending', 'processing'].includes(selectedOrder.status) && (
                        <button onClick={() => { updateOrderStatus(selectedOrder.id, 'cancelled'); setSelectedOrder(null) }} className="w-full text-[11px] font-bold text-red-500 hover:text-red-600 transition-colors py-1">
                          Cancel Order
                        </button>
                      )}
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* ── PRODUCTS ───────────────────────────────────────────────────────── */}
          {activePanel === 'products' && (
            <div className="space-y-6">
              <h2 className="font-serif text-3xl font-light">Products & Inventory</h2>

              <div className="glass-panel rounded-2xl border border-premium-gold/10 overflow-hidden">
                <div className="grid grid-cols-6 gap-4 bg-warm-beige/30 dark:bg-dark-card/50 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-matte-black/50 dark:text-dark-text/50 border-b border-premium-gold/10">
                  <span className="col-span-2">Product</span>
                  <span>Price</span>
                  <span>Stock</span>
                  <span>Status</span>
                  <span>Actions</span>
                </div>
                <div className="divide-y divide-premium-gold/8">
                  {products.map(p => (
                    <div key={p.id} className="grid grid-cols-6 gap-4 px-5 py-4 items-center text-xs">
                      <div className="col-span-2">
                        <p className="font-medium text-[11px]">{p.name}</p>
                        <p className="text-[10px] text-matte-black/40 dark:text-dark-text/40 mt-0.5">{p.slug}</p>
                      </div>
                      <div>
                        <p className="font-semibold">₹{p.price}</p>
                        <p className="text-[10px] line-through text-matte-black/30">₹{p.compare_price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={p.stock_qty <= p.low_stock_threshold ? 'text-red-500 font-bold' : ''}>{p.stock_qty}</span>
                        <button
                          onClick={() => setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, stock_qty: prod.stock_qty + 10 } : prod))}
                          className="text-[9px] font-bold border border-premium-gold/25 text-premium-gold px-1.5 py-0.5 rounded hover:bg-premium-gold/10 transition-colors"
                        >+10</button>
                      </div>
                      <StatusBadge status={p.is_active ? 'active' : 'inactive'} />
                      <button
                        onClick={() => openProductEdit(p)}
                        className="flex items-center gap-1 text-[10px] font-bold text-premium-gold hover:underline"
                      >
                        <Edit2 size={11} /> Edit
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Edit Modal */}
              <AnimatePresence>
                {editingProduct && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                      className="glass-panel w-full max-w-sm rounded-3xl p-7 shadow-2xl border border-premium-gold/15 space-y-5 relative"
                    >
                      <button onClick={() => setEditingProduct(null)} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-warm-beige/50 transition-colors">
                        <X size={15} />
                      </button>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-premium-gold font-bold">Edit Product</p>
                        <h3 className="font-serif text-lg mt-0.5">Update Details</h3>
                      </div>
                      <div className="space-y-3">
                        {[
                          { label: 'Product Name', key: 'name', type: 'text' },
                          { label: 'Price (₹)', key: 'price', type: 'number' },
                          { label: 'Compare Price (₹)', key: 'compare_price', type: 'number' },
                          { label: 'Stock Quantity', key: 'stock_qty', type: 'number' },
                        ].map(field => (
                          <div key={field.key} className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-matte-black/50 dark:text-dark-text/50">{field.label}</label>
                            <input
                              type={field.type}
                              value={(editProductForm as any)[field.key]}
                              onChange={e => setEditProductForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                              className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-premium-gold/40"
                            />
                          </div>
                        ))}
                      </div>
                      <button onClick={saveProductEdit} className="w-full bg-premium-gold text-white text-[11px] font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-premium-gold/90 transition-colors">
                        <Save size={13} /> Save Changes
                      </button>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* ── CUSTOMERS ──────────────────────────────────────────────────────── */}
          {activePanel === 'customers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-3xl font-light">Customers</h2>
                  <p className="text-xs text-matte-black/40 mt-1">{customers.length} registered customers</p>
                </div>
                <div className="flex items-center gap-2 border border-premium-gold/20 rounded-full bg-matte-white dark:bg-dark-bg px-3 py-2 w-60">
                  <Search size={13} className="text-premium-gold" />
                  <input
                    type="text"
                    placeholder="Search customers…"
                    value={customerSearch}
                    onChange={e => setCustomerSearch(e.target.value)}
                    className="w-full bg-transparent text-[11px] focus:outline-none"
                  />
                </div>
              </div>

              <div className="glass-panel rounded-2xl border border-premium-gold/10 overflow-hidden">
                <div className="grid grid-cols-8 gap-3 bg-warm-beige/30 dark:bg-dark-card/50 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-matte-black/50 dark:text-dark-text/50 border-b border-premium-gold/10">
                  <span className="col-span-2">Customer</span>
                  <span>City</span>
                  <span>Plan</span>
                  <span>Orders</span>
                  <span>Total Spend</span>
                  <span>Status</span>
                  <span>Action</span>
                </div>
                <div className="divide-y divide-premium-gold/8">
                  {customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.email.toLowerCase().includes(customerSearch.toLowerCase())).map(c => (
                    <div key={c.id} className="grid grid-cols-8 gap-3 px-5 py-4 items-center text-xs hover:bg-warm-beige/10 dark:hover:bg-dark-card/20 transition-colors">
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-premium-gold/15 flex items-center justify-center text-premium-gold text-[10px] font-bold flex-shrink-0">{c.name[0]}</div>
                          <div>
                            <p className="font-medium text-[11px]">{c.name}</p>
                            <p className="text-[10px] text-matte-black/40 dark:text-dark-text/40">{c.email}</p>
                          </div>
                        </div>
                      </div>
                      <span>{c.city}</span>
                      <span className={`font-semibold text-[10px] ${c.plan === 'Subscribe' ? 'text-premium-gold' : ''}`}>{c.plan}</span>
                      <span>{c.totalOrders}</span>
                      <span className="font-semibold">₹{c.totalSpend.toLocaleString()}</span>
                      <StatusBadge status={c.status} />
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="text-[10px] font-bold text-premium-gold hover:underline flex items-center gap-1"
                      >
                        <Eye size={11} /> View
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Detail Modal */}
              <AnimatePresence>
                {selectedCustomer && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                      className="glass-panel w-full max-w-sm rounded-3xl p-7 shadow-2xl border border-premium-gold/15 space-y-5 relative"
                    >
                      <button onClick={() => setSelectedCustomer(null)} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-warm-beige/50 transition-colors">
                        <X size={15} />
                      </button>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-premium-gold/15 flex items-center justify-center text-premium-gold text-lg font-bold">{selectedCustomer.name[0]}</div>
                        <div>
                          <h3 className="font-serif text-lg">{selectedCustomer.name}</h3>
                          <p className="text-[11px] text-matte-black/50 dark:text-dark-text/50">{selectedCustomer.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: 'Total Orders', val: selectedCustomer.totalOrders },
                          { label: 'Total Spend', val: `₹${selectedCustomer.totalSpend.toLocaleString()}` },
                          { label: 'City', val: selectedCustomer.city },
                          { label: 'Plan', val: selectedCustomer.plan },
                          { label: 'Joined', val: selectedCustomer.joined },
                          { label: 'Last Order', val: selectedCustomer.lastOrder },
                        ].map(({ label, val }) => (
                          <div key={label} className="bg-warm-beige/30 dark:bg-dark-card/30 rounded-xl p-3">
                            <p className="text-[9px] uppercase tracking-wider font-bold text-matte-black/40 dark:text-dark-text/40">{label}</p>
                            <p className="text-sm font-semibold mt-0.5">{val}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 pt-1">
                        <a href={`mailto:${selectedCustomer.email}`} className="flex-1 text-center text-[10px] font-bold border border-premium-gold/25 text-premium-gold rounded-xl py-2.5 hover:bg-premium-gold/10 transition-colors">
                          Email Customer
                        </a>
                        <button className="flex-1 text-[10px] font-bold text-red-500 border border-red-200 rounded-xl py-2.5 hover:bg-red-50 transition-colors">
                          Flag Account
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* ── SUBSCRIPTIONS ──────────────────────────────────────────────────── */}
          {activePanel === 'subscriptions' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-3xl font-light">Subscriptions</h2>
                <p className="text-xs text-matte-black/40 mt-1">148 active plans · ₹48,692 MRR</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Active', val: 142, color: 'text-green-500', bg: 'bg-green-500/10' },
                  { label: 'Paused', val: 4, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                  { label: 'Cancelled (30d)', val: 2, color: 'text-red-400', bg: 'bg-red-400/10' },
                ].map(s => (
                  <div key={s.label} className={`glass-panel p-5 rounded-2xl border border-premium-gold/10 flex items-center gap-4`}>
                    <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                      <RefreshCw size={16} className={s.color} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-matte-black/40 dark:text-dark-text/40">{s.label}</p>
                      <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass-panel rounded-2xl border border-premium-gold/10 overflow-hidden">
                <div className="grid grid-cols-6 gap-4 bg-warm-beige/30 dark:bg-dark-card/50 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-matte-black/50 dark:text-dark-text/50 border-b border-premium-gold/10">
                  <span className="col-span-2">Customer</span>
                  <span>Plan</span>
                  <span>Razorpay ID</span>
                  <span>Status</span>
                  <span>Actions</span>
                </div>
                <div className="divide-y divide-premium-gold/8">
                  {[
                    { customer: 'Dr. Kabir Sen', email: 'kabir@example.com', plan: 'Sleep Gummies ₹329/mo', rzpId: 'sub_P987654321', status: 'Active', since: '2026-02-15' },
                    { customer: 'Priya Kapoor', email: 'priya@example.com', plan: 'Sleep Gummies ₹329/mo', rzpId: 'sub_P123456789', status: 'Paused', since: '2026-03-01' },
                  ].map((sub, i) => (
                    <div key={i} className="grid grid-cols-6 gap-4 px-5 py-4 items-center text-xs">
                      <div className="col-span-2">
                        <p className="font-medium">{sub.customer}</p>
                        <p className="text-[10px] text-matte-black/40 dark:text-dark-text/40">{sub.email}</p>
                      </div>
                      <span>{sub.plan}</span>
                      <span className="font-mono text-premium-gold text-[10px]">{sub.rzpId}</span>
                      <StatusBadge status={sub.status.toLowerCase()} />
                      <div className="flex gap-3">
                        <button className="text-[10px] font-bold text-premium-gold hover:underline">Pause</button>
                        <button className="text-[10px] font-bold text-red-500 hover:underline">Cancel</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── REVIEWS ────────────────────────────────────────────────────────── */}
          {activePanel === 'reviews' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-3xl font-light">Reviews Moderation</h2>
                <p className="text-xs text-matte-black/40 mt-1">{reviews.length} pending review{reviews.length !== 1 ? 's' : ''}</p>
              </div>

              {reviews.length === 0 ? (
                <div className="glass-panel p-16 rounded-2xl border border-premium-gold/10 text-center">
                  <CheckCircle size={32} className="text-green-500 mx-auto mb-3" />
                  <p className="font-serif text-lg text-matte-black/50 dark:text-dark-text/50">All reviews moderated</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {reviews.map((r, i) => (
                    <div key={i} className="glass-panel p-6 rounded-2xl border border-premium-gold/10 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-0.5">
                          <h4 className="font-serif font-semibold text-sm">{r.title || 'Review'}</h4>
                          <div className="flex items-center gap-2 text-[11px] text-matte-black/50 dark:text-dark-text/50">
                            <span className="font-semibold text-premium-gold">{r.customer_name}</span>
                            <span>·</span>
                            <span>{r.city}</span>
                            <span>·</span>
                            <span>{new Date(r.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, idx) => (
                            <Star key={idx} size={12} className={idx < r.rating ? 'fill-premium-gold text-premium-gold' : 'text-neutral-200'} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-matte-black/65 dark:text-dark-text/65 leading-relaxed">{r.body}</p>
                      <div className="flex gap-3 pt-1 border-t border-premium-gold/8">
                        <button
                          onClick={() => setReviews(prev => prev.filter(rev => rev.id !== r.id))}
                          className="flex items-center gap-1.5 bg-green-600 text-white text-[10px] font-bold px-4 py-2 rounded-full hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle size={11} /> Approve & Publish
                        </button>
                        <button
                          onClick={() => setReviews(prev => prev.filter(rev => rev.id !== r.id))}
                          className="flex items-center gap-1.5 bg-red-500 text-white text-[10px] font-bold px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <XCircle size={11} /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── BLOG ───────────────────────────────────────────────────────────── */}
          {activePanel === 'blogs' && (
            <div className="space-y-6">
              <h2 className="font-serif text-3xl font-light">Blog Manager</h2>

              {/* Create form */}
              <form onSubmit={createBlog} className="glass-panel p-6 rounded-2xl border border-premium-gold/10 space-y-4 max-w-xl">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-premium-gold">New Post</h3>
                <input
                  required type="text" placeholder="Article title…" value={newBlogTitle}
                  onChange={e => setNewBlogTitle(e.target.value)}
                  className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-premium-gold/40"
                />
                <div className="grid grid-cols-2 gap-3">
                  <select value={newBlogCategory} onChange={e => setNewBlogCategory(e.target.value)} className="bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs p-2.5 rounded-xl">
                    {['Sleep Health', 'Science & Research', 'Performance Nutrition', 'Mental Wellness'].map(c => <option key={c}>{c}</option>)}
                  </select>
                  <input type="text" placeholder="Author name" className="bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs px-3 py-2.5 rounded-xl focus:outline-none" />
                </div>
                <textarea
                  rows={2} placeholder="Short excerpt…" value={newBlogExcerpt}
                  onChange={e => setNewBlogExcerpt(e.target.value)}
                  className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs p-3 rounded-xl resize-none focus:outline-none focus:border-premium-gold/40"
                />
                <button type="submit" className="bg-premium-gold text-white text-[11px] font-bold px-6 py-2.5 rounded-xl hover:bg-premium-gold/90 transition-colors">
                  Publish Post
                </button>
              </form>

              {/* Blog list */}
              <div className="space-y-3">
                {blogs.map((b, i) => (
                  <div key={i} className="glass-panel px-5 py-4 rounded-xl border border-premium-gold/10 flex items-center gap-4 text-xs">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-semibold text-sm truncate">{b.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-matte-black/40 dark:text-dark-text/40">
                        <span className="font-bold text-premium-gold uppercase tracking-wider">{b.category}</span>
                        <span>·</span>
                        <span>{b.read_time}</span>
                        <span>·</span>
                        <span>{b.author_name?.split(',')[0]}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openBlogEdit(b)} className="flex items-center gap-1 text-[10px] font-bold text-premium-gold hover:underline">
                        <Edit2 size={11} /> Edit
                      </button>
                      <button onClick={() => setBlogs(prev => prev.filter(bl => bl.id !== b.id))} className="flex items-center gap-1 text-[10px] font-bold text-red-500 hover:underline">
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Blog Edit Modal */}
              <AnimatePresence>
                {editingBlog && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                      className="glass-panel w-full max-w-sm rounded-3xl p-7 shadow-2xl border border-premium-gold/15 space-y-5 relative"
                    >
                      <button onClick={() => setEditingBlog(null)} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-warm-beige/50 transition-colors"><X size={15} /></button>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-premium-gold font-bold">Edit Post</p>
                        <h3 className="font-serif text-lg mt-0.5">Update Article</h3>
                      </div>
                      <div className="space-y-3">
                        <input
                          type="text" value={editBlogForm.title}
                          onChange={e => setEditBlogForm(p => ({ ...p, title: e.target.value }))}
                          placeholder="Title"
                          className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs px-3 py-2.5 rounded-xl focus:outline-none"
                        />
                        <select
                          value={editBlogForm.category}
                          onChange={e => setEditBlogForm(p => ({ ...p, category: e.target.value }))}
                          className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs p-2.5 rounded-xl"
                        >
                          {['Sleep Health', 'Science & Research', 'Performance Nutrition', 'Mental Wellness'].map(c => <option key={c}>{c}</option>)}
                        </select>
                        <textarea
                          rows={3} value={editBlogForm.excerpt}
                          onChange={e => setEditBlogForm(p => ({ ...p, excerpt: e.target.value }))}
                          placeholder="Excerpt"
                          className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs p-3 rounded-xl resize-none focus:outline-none"
                        />
                      </div>
                      <button onClick={saveBlogEdit} className="w-full bg-premium-gold text-white text-[11px] font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-premium-gold/90 transition-colors">
                        <Save size={13} /> Save Changes
                      </button>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* ── CONSULTATIONS ──────────────────────────────────────────────────── */}
          {activePanel === 'consultations' && (
            <div className="space-y-6">
              <h2 className="font-serif text-3xl font-light">Consultation Slots</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Create Slot */}
                <form onSubmit={createSlot} className="glass-panel p-6 rounded-2xl border border-premium-gold/10 space-y-4">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-premium-gold">Add Availability Slot</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-matte-black/40 dark:text-dark-text/40">Date</label>
                      <input type="date" required value={newSlotDate} onChange={e => setNewSlotDate(e.target.value)} className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs p-2.5 rounded-xl focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-matte-black/40 dark:text-dark-text/40">Time</label>
                      <select value={newSlotTime} onChange={e => setNewSlotTime(e.target.value)} className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs p-2.5 rounded-xl">
                        {['10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-premium-gold text-white text-[11px] font-bold py-2.5 rounded-xl hover:bg-premium-gold/90 transition-colors">
                    Add Slot
                  </button>
                </form>

                {/* Today's Bookings */}
                <div className="glass-panel p-6 rounded-2xl border border-premium-gold/10 space-y-4">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-premium-gold">Today's Bookings</h3>
                  {[
                    { patient: 'Arya Sharma', time: '10:00 AM', topic: 'Sleep Cycle Assessment' },
                    { patient: 'Rohan Mehta', time: '02:00 PM', topic: 'Performance Supplements' },
                  ].map((b, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-premium-gold/8 last:border-0">
                      <div>
                        <p className="text-xs font-semibold">{b.patient}</p>
                        <p className="text-[10px] text-matte-black/40 dark:text-dark-text/40">{b.topic}</p>
                      </div>
                      <span className="text-[11px] font-bold text-premium-gold">{b.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slots Table */}
              <div className="glass-panel rounded-2xl border border-premium-gold/10 overflow-hidden">
                <div className="grid grid-cols-4 gap-4 bg-warm-beige/30 dark:bg-dark-card/50 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-matte-black/50 dark:text-dark-text/50 border-b border-premium-gold/10">
                  <span>Date</span>
                  <span>Time</span>
                  <span>Status</span>
                  <span>Action</span>
                </div>
                <div className="divide-y divide-premium-gold/8">
                  {slots.map((s, i) => (
                    <div key={i} className="grid grid-cols-4 gap-4 px-5 py-3.5 items-center text-xs">
                      <span>{s.date}</span>
                      <span className="font-semibold">{s.start_time}</span>
                      <StatusBadge status={s.is_booked ? 'confirmed' : 'active'} />
                      <button
                        onClick={() => setSlots(prev => prev.filter(sl => sl.id !== s.id))}
                        className="text-[10px] font-bold text-red-500 hover:underline flex items-center gap-1"
                      >
                        <Trash2 size={11} /> Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── EMAIL SUBSCRIBERS ──────────────────────────────────────────────── */}
          {activePanel === 'subscribers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-3xl font-light">Email Subscribers</h2>
                  <p className="text-xs text-matte-black/40 mt-1">{subscribers.length} active subscribers</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 border border-premium-gold/20 rounded-full bg-matte-white dark:bg-dark-bg px-3 py-2 w-52">
                    <Search size={13} className="text-premium-gold" />
                    <input type="text" placeholder="Search…" value={subSearch} onChange={e => setSubSearch(e.target.value)} className="w-full bg-transparent text-[11px] focus:outline-none" />
                  </div>
                  <button onClick={exportSubscribersCsv} className="flex items-center gap-2 text-[11px] font-bold border border-premium-gold/25 text-premium-gold rounded-full px-4 py-2 hover:bg-premium-gold/10 transition-colors">
                    <Download size={13} /> Export CSV
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total', val: subscribers.length, icon: <Mail size={16} className="text-premium-gold" /> },
                  { label: 'This Week', val: 3, icon: <ArrowUpRight size={16} className="text-green-500" /> },
                  { label: 'Sources', val: 4, icon: <Hash size={16} className="text-blue-400" /> },
                ].map(s => (
                  <div key={s.label} className="glass-panel p-5 rounded-2xl border border-premium-gold/10 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-warm-beige/50 dark:bg-dark-card/50 flex items-center justify-center">{s.icon}</div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-matte-black/40 dark:text-dark-text/40">{s.label}</p>
                      <p className="text-xl font-bold">{s.val}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass-panel rounded-2xl border border-premium-gold/10 overflow-hidden">
                <div className="grid grid-cols-5 gap-4 bg-warm-beige/30 dark:bg-dark-card/50 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-matte-black/50 dark:text-dark-text/50 border-b border-premium-gold/10">
                  <span className="col-span-2">Email</span>
                  <span>Name</span>
                  <span>Source</span>
                  <span>Action</span>
                </div>
                <div className="divide-y divide-premium-gold/8">
                  {subscribers.filter(s => s.email.toLowerCase().includes(subSearch.toLowerCase()) || s.name.toLowerCase().includes(subSearch.toLowerCase())).map((s, i) => (
                    <div key={i} className="grid grid-cols-5 gap-4 px-5 py-3.5 items-center text-xs hover:bg-warm-beige/10 dark:hover:bg-dark-card/20 transition-colors">
                      <span className="col-span-2 font-medium">{s.email}</span>
                      <span>{s.name}</span>
                      <span className="text-[10px] bg-premium-gold/10 text-premium-gold font-bold px-2 py-0.5 rounded-full w-fit">{s.source}</span>
                      <button
                        onClick={() => setSubscribers(prev => prev.filter(sub => sub.id !== s.id))}
                        className="text-[10px] font-bold text-red-500 hover:underline flex items-center gap-1"
                      >
                        <XCircle size={11} /> Unsubscribe
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── COUPONS ────────────────────────────────────────────────────────── */}
          {activePanel === 'coupons' && (
            <div className="space-y-6">
              <h2 className="font-serif text-3xl font-light">Coupons Manager</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Create */}
                <form onSubmit={createCoupon} className="glass-panel p-6 rounded-2xl border border-premium-gold/10 space-y-4">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-premium-gold">Create Coupon</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      required type="text" placeholder="Code (e.g. SAVE20)" value={newCouponCode}
                      onChange={e => setNewCouponCode(e.target.value)}
                      className="col-span-2 bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs px-3 py-2.5 rounded-xl focus:outline-none uppercase"
                    />
                    <select value={newCouponType} onChange={e => setNewCouponType(e.target.value)} className="bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs px-2 py-2.5 rounded-xl">
                      <option value="pct">% Off</option>
                      <option value="flat">Flat ₹</option>
                      <option value="free_shipping">Free Ship</option>
                    </select>
                  </div>
                  <input
                    required type="number" placeholder="Discount value" value={newCouponVal}
                    onChange={e => setNewCouponVal(e.target.value)}
                    className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs px-3 py-2.5 rounded-xl focus:outline-none"
                  />
                  <button type="submit" className="w-full bg-premium-gold text-white text-[11px] font-bold py-2.5 rounded-xl hover:bg-premium-gold/90 transition-colors">
                    Create Coupon
                  </button>
                </form>

                {/* Stats */}
                <div className="glass-panel p-6 rounded-2xl border border-premium-gold/10 space-y-4">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-premium-gold">Coupon Usage (30d)</h3>
                  {[
                    { code: 'WELCOME10', uses: 34, savings: '₹1,326' },
                    { code: 'FREESHIP', uses: 12, savings: '₹480' },
                  ].map(c => (
                    <div key={c.code} className="flex items-center justify-between py-3 border-b border-premium-gold/8 last:border-0">
                      <div>
                        <p className="text-xs font-mono font-bold text-premium-gold">{c.code}</p>
                        <p className="text-[10px] text-matte-black/40 dark:text-dark-text/40">{c.uses} uses · {c.savings} saved</p>
                      </div>
                      <div className="w-20 bg-premium-gold/10 rounded-full h-1.5">
                        <div className="bg-premium-gold h-1.5 rounded-full" style={{ width: `${(c.uses / 40) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coupon list */}
              <div className="glass-panel rounded-2xl border border-premium-gold/10 overflow-hidden">
                <div className="grid grid-cols-5 gap-4 bg-warm-beige/30 dark:bg-dark-card/50 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-matte-black/50 dark:text-dark-text/50 border-b border-premium-gold/10">
                  <span>Code</span>
                  <span>Type</span>
                  <span>Value</span>
                  <span>Min Order</span>
                  <span>Action</span>
                </div>
                <div className="divide-y divide-premium-gold/8">
                  {coupons.map((c, i) => (
                    <div key={i} className="grid grid-cols-5 gap-4 px-5 py-3.5 items-center text-xs">
                      <span className="font-mono font-bold text-premium-gold">{c.code}</span>
                      <span className="capitalize">{c.type === 'pct' ? 'Percentage' : c.type === 'flat' ? 'Flat' : 'Free Shipping'}</span>
                      <span className="font-semibold">{c.type === 'pct' ? `${c.value}%` : `₹${c.value}`}</span>
                      <span>₹{c.min_order_value}</span>
                      <button onClick={() => setCoupons(prev => prev.filter(coup => coup.code !== c.code))} className="flex items-center gap-1 text-[10px] font-bold text-red-500 hover:underline">
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ACTIVITY LOG ───────────────────────────────────────────────────── */}
          {activePanel === 'activity' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-3xl font-light">Activity Log</h2>
                  <p className="text-xs text-matte-black/40 mt-1">Real-time event stream</p>
                </div>
                <button className="flex items-center gap-2 text-[11px] font-bold border border-premium-gold/20 rounded-full px-4 py-2 text-matte-black/50 hover:text-premium-gold hover:border-premium-gold/40 transition-colors">
                  <RefreshCw size={13} /> Refresh
                </button>
              </div>

              {/* Filter pills */}
              <div className="flex gap-2 flex-wrap">
                {['All', 'Orders', 'Reviews', 'Consultations', 'Subscribers', 'Coupons'].map(f => (
                  <button key={f} className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-colors ${f === 'All' ? 'bg-premium-gold text-white border-premium-gold' : 'border-premium-gold/20 text-matte-black/50 dark:text-dark-text/50 hover:border-premium-gold/40'}`}>
                    {f}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {MOCK_ACTIVITY.map(a => (
                  <div key={a.id} className="glass-panel p-4 rounded-2xl border border-premium-gold/8 flex items-start gap-4 hover:border-premium-gold/20 transition-colors">
                    <ActivityIcon type={a.type} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-matte-black/80 dark:text-dark-text/80 leading-relaxed">{a.message}</p>
                      <p className="text-[10px] text-matte-black/35 dark:text-dark-text/35 mt-0.5 flex items-center gap-1">
                        <Clock size={10} /> {a.time}
                      </p>
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-warm-beige/50 dark:bg-dark-card/50 text-matte-black/40 dark:text-dark-text/40`}>
                      {a.type}
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-center py-4">
                <button className="text-[11px] font-bold text-matte-black/30 hover:text-premium-gold transition-colors flex items-center gap-1 mx-auto">
                  <ChevronDown size={14} /> Load older events
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
