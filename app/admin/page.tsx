'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Tag,
  Star,
  Settings,
  LogOut,
  Edit2,
  Trash2,
  Search,
  Plus
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { MOCK_PRODUCTS, MOCK_REVIEWS, MOCK_BLOGS, MOCK_SLOTS, MOCK_COUPONS } from '@/lib/db'
import { motion, AnimatePresence } from 'framer-motion'

// Admin Mock KPI Metrics
const KPI_METRICS = {
  revenue: 24780,
  orders: 62,
  subscriptions: 148,
  newCustomers: 28
};

// Recharts Sales revenue data
const REVENUE_DATA = [
  { day: 'Mon', sales: 4200 },
  { day: 'Tue', sales: 3800 },
  { day: 'Wed', sales: 5100 },
  { day: 'Thu', sales: 4900 },
  { day: 'Fri', sales: 6200 },
  { day: 'Sat', sales: 7400 },
  { day: 'Sun', sales: 6800 },
];

export default function AdminDashboard() {
  const [activePanel, setActivePanel] = useState<'home' | 'orders' | 'products' | 'subscriptions' | 'coupons' | 'reviews' | 'blogs' | 'consultations'>('home')
  
  // Local admin states mimicking real DB
  const [orders, setOrders] = useState([
    { id: 'ord_1', customer: 'Arya Sharma', email: 'arya@example.com', product: 'Sleep Gummies (1-time)', amount: 399, status: 'confirmed', date: '2026-06-24', tracking: '', courier: '' },
    { id: 'ord_2', customer: 'Dr. Kabir Sen', email: 'kabir@example.com', product: 'Sleep Gummies (Subscribe)', amount: 329, status: 'delivered', date: '2026-06-23', tracking: 'SF123456789IN', courier: 'Blue Dart' },
    { id: 'ord_3', customer: 'Rohan Mehta', email: 'rohan@example.com', product: 'Sleep Gummies (1-time)', amount: 399, status: 'pending', date: '2026-06-24', tracking: '', courier: '' }
  ])

  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [reviews, setReviews] = useState(MOCK_REVIEWS)
  const [blogs, setBlogs] = useState(MOCK_BLOGS)
  const [slots, setSlots] = useState(MOCK_SLOTS)
  const [coupons, setCoupons] = useState(MOCK_COUPONS)

  // Orders Filter
  const [orderSearch, setOrderSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  
  // Coupon Creator Form
  const [newCouponCode, setNewCouponCode] = useState('')
  const [newCouponType, setNewCouponType] = useState('pct')
  const [newCouponVal, setNewCouponVal] = useState('')

  // Slot Creator Form
  const [newSlotDate, setNewSlotDate] = useState('')
  const [newSlotTime, setNewSlotTime] = useState('10:00 AM')

  // Blog Creator Form
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogCategory, setNewBlogCategory] = useState('Sleep Health')
  const [newBlogExcerpt, setNewBlogExcerpt] = useState('')

  // Update Order Status
  const handleUpdateOrderStatus = (orderId: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status })
    }
  }

  // Update Order Tracking Details
  const handleAddTracking = (orderId: string, tracking: string, courier: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, tracking, courier, status: 'shipped' } : o))
    setSelectedOrder(null)
  }

  // Review Moderation
  const handleReviewStatus = (reviewId: string, status: 'approved' | 'rejected') => {
    setReviews(prev => prev.filter(r => r.id !== reviewId))
  }

  // Coupon Creation
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCouponCode) return
    const newCoupon = {
      code: newCouponCode.toUpperCase(),
      type: newCouponType,
      value: parseFloat(newCouponVal) || 10,
      min_order_value: 299,
      max_discount: 100
    }
    setCoupons(prev => [...prev, newCoupon])
    setNewCouponCode('')
    setNewCouponVal('')
  }

  // Consultation Slot Creation
  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSlotDate) return
    const newSlot = {
      id: 's_' + Date.now(),
      date: newSlotDate,
      start_time: newSlotTime,
      end_time: 'slot end time',
      is_booked: false
    }
    setSlots(prev => [...prev, newSlot])
    setNewSlotDate('')
  }

  // Blog post addition
  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBlogTitle) return
    const newPost = {
      id: 'b_' + Date.now(),
      slug: newBlogTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: newBlogTitle,
      excerpt: newBlogExcerpt,
      category: newBlogCategory,
      cover_image_url: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=600&auto=format&fit=crop',
      author_name: 'Dr. Rohan Mehta, MBBS (AIIMS)',
      author_image_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=150&auto=format&fit=crop',
      published_at: new Date().toISOString().split('T')[0],
      read_time: '3 min read',
      body: '<p>Blog draft text...</p>'
    }
    setBlogs(prev => [...prev, newPost])
    setNewBlogTitle('')
    setNewBlogExcerpt('')
  }

  return (
    <div className="min-h-screen bg-matte-white dark:bg-dark-bg text-matte-black dark:text-dark-text flex transition-colors duration-300">
      
      {/* Sidebar Panel Navigation */}
      <aside className="w-64 border-r border-premium-gold/15 bg-warm-beige/25 p-6 space-y-8 flex flex-col dark:border-white/5 dark:bg-dark-card/30">
        
        {/* Title logo */}
        <div>
          <Link href="/" className="font-serif text-3xl font-light italic tracking-wider text-matte-black transition-colors dark:text-dark-text">
            narva<span className="text-premium-gold font-sans not-italic font-bold">.</span>
          </Link>
          <span className="block text-[8px] uppercase tracking-widest text-premium-gold font-bold mt-1">Admin Panel Console</span>
        </div>

        {/* Panel links */}
        <nav className="space-y-1.5 flex-1 text-left text-xs font-semibold">
          {[
            { id: 'home', label: 'Analytics Panel', icon: <TrendingUp size={15} /> },
            { id: 'orders', label: 'Orders Panel', icon: <ShoppingBag size={15} /> },
            { id: 'products', label: 'Products & Inventory', icon: <Settings size={15} /> },
            { id: 'subscriptions', label: 'Active Subscriptions', icon: <Users size={15} /> },
            { id: 'coupons', label: 'Coupons Manager', icon: <Tag size={15} /> },
            { id: 'reviews', label: 'Reviews Moderation', icon: <Star size={15} /> },
            { id: 'blogs', label: 'Blog Manager', icon: <Edit2 size={15} /> },
            { id: 'consultations', label: 'Consultations Slots', icon: <Calendar size={15} /> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActivePanel(item.id as any)
                setSelectedOrder(null)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activePanel === item.id
                  ? 'bg-premium-gold text-white shadow-sm'
                  : 'text-matte-black/60 hover:bg-warm-beige/50 hover:text-premium-gold dark:text-dark-text/60 dark:hover:bg-dark-card'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Log out footer */}
        <Link href="/" className="text-left text-xs font-semibold text-red-500 hover:text-red-600 flex items-center gap-2 pt-4 border-t border-premium-gold/10">
          <LogOut size={15} /> Exit Console
        </Link>

      </aside>

      {/* Main Console Body */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        
        {/* PANEL: HOME / ANALYTICS */}
        {activePanel === 'home' && (
          <div className="space-y-8">
            <h2 className="font-serif text-3xl text-left font-light">Analytics Dashboard</h2>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Today's Revenue", val: `₹${KPI_METRICS.revenue.toLocaleString()}`, change: "+12.4% vs yesterday" },
                { title: "Orders Today", val: KPI_METRICS.orders, change: "+8% vs yesterday" },
                { title: "Active Subscriptions", val: KPI_METRICS.subscriptions, change: "+5 new today" },
                { title: "New Customers Today", val: KPI_METRICS.newCustomers, change: "+14.2% week-on-week" }
              ].map((kpi, idx) => (
                <div key={idx} className="glass-panel p-6 rounded-2xl text-left border border-premium-gold/10 shadow-sm">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-matte-black/50 dark:text-dark-text/50">{kpi.title}</span>
                  <div className="text-2xl font-bold text-premium-gold mt-2">{kpi.val}</div>
                  <span className="text-[10px] text-green-600 dark:text-green-400 font-semibold block mt-1">{kpi.change}</span>
                </div>
              ))}
            </div>

            {/* Sales Chart */}
            <div className="glass-panel p-6 rounded-3xl border border-premium-gold/10 shadow-md">
              <h3 className="font-serif text-lg text-left mb-6">Revenue Chart (7-Day Trend)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: '#FAF9F5', borderRadius: '12px', border: '1px solid #C5A880' }} />
                    <Bar dataKey="sales" fill="#C5A880" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Action Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left text-xs">
              {/* Low stock alerts */}
              <div className="glass-panel p-6 rounded-2xl border border-premium-gold/10 space-y-4">
                <h4 className="font-serif text-sm font-semibold text-premium-gold flex items-center gap-1.5">
                  <AlertTriangle size={16} /> Low Stock Alerts
                </h4>
                <div className="space-y-3">
                  {products.map(p => (
                    <div key={p.id} className="flex justify-between items-center py-2 border-b border-premium-gold/10 last:border-0">
                      <div>
                        <span className="font-medium block">{p.name}</span>
                        <span className="text-[10px] text-red-500 font-semibold">Stock: {p.stock_qty} (Threshold: {p.low_stock_threshold})</span>
                      </div>
                      <button
                        onClick={() => setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, stock_qty: 150 } : prod))}
                        className="rounded-full bg-premium-gold/10 text-premium-gold hover:bg-premium-gold hover:text-white px-3 py-1 font-bold text-[10px] transition-colors"
                      >
                        Restock
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consultation List preview */}
              <div className="glass-panel p-6 rounded-2xl border border-premium-gold/10 space-y-4">
                <h4 className="font-serif text-sm font-semibold text-premium-gold flex items-center gap-1.5">
                  <Calendar size={16} /> Today's Booked Slots
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-premium-gold/10">
                    <div>
                      <span className="font-medium block">Patient: Arya Sharma</span>
                      <span className="text-[10px] opacity-60">Objective: Sleep Cycle Assessment</span>
                    </div>
                    <span className="text-[10px] font-bold text-premium-gold">10:00 AM</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-premium-gold/10 last:border-0">
                    <div>
                      <span className="font-medium block">Patient: Rohan Mehta</span>
                      <span className="text-[10px] opacity-60">Objective: Performance Supplements</span>
                    </div>
                    <span className="text-[10px] font-bold text-premium-gold">02:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PANEL: ORDERS */}
        {activePanel === 'orders' && (
          <div className="space-y-8 text-left">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-3xl font-light">Orders Management</h2>
              
              {/* Search */}
              <div className="flex items-center gap-2 border border-premium-gold/25 rounded-full bg-matte-white px-3 py-1.5 w-64 dark:bg-dark-bg">
                <Search size={14} className="text-premium-gold" />
                <input
                  type="text"
                  placeholder="Search by ID or customer..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-transparent text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* List */}
            <div className="glass-panel rounded-2xl border border-premium-gold/10 overflow-hidden text-xs">
              <div className="grid grid-cols-6 gap-4 bg-warm-beige/20 p-4 font-bold border-b border-premium-gold/10 dark:bg-dark-card/50">
                <span>Order ID</span>
                <span>Customer</span>
                <span>Date</span>
                <span>Product</span>
                <span>Amount</span>
                <span>Status</span>
              </div>
              <div className="divide-y divide-premium-gold/10">
                {orders
                  .filter(o => o.id.includes(orderSearch) || o.customer.toLowerCase().includes(orderSearch.toLowerCase()))
                  .map(o => (
                    <div
                      key={o.id}
                      onClick={() => setSelectedOrder(o)}
                      className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-warm-beige/10 cursor-pointer transition-colors"
                    >
                      <span className="font-mono text-premium-gold">{o.id}</span>
                      <span>{o.customer}</span>
                      <span>{o.date}</span>
                      <span className="truncate">{o.product}</span>
                      <span className="font-semibold">₹{o.amount}</span>
                      <div>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          o.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          o.status === 'delivered' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {o.status}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Details Modal overlay */}
            <AnimatePresence>
              {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.95 }}
                    className="glass-panel p-8 rounded-3xl w-full max-w-md shadow-2xl relative space-y-6"
                  >
                    <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 p-1 hover:text-premium-gold">
                      ✕
                    </button>
                    
                    <h3 className="font-serif text-lg border-b border-premium-gold/10 pb-2">
                      Order Details: <span className="font-mono text-premium-gold">{selectedOrder.id}</span>
                    </h3>
                    
                    <div className="space-y-2 text-xs">
                      <p><strong>Customer:</strong> {selectedOrder.customer} ({selectedOrder.email})</p>
                      <p><strong>Item:</strong> {selectedOrder.product}</p>
                      <p><strong>Amount:</strong> ₹{selectedOrder.amount}</p>
                      <p><strong>Current Status:</strong> <span className="uppercase font-bold text-premium-gold">{selectedOrder.status}</span></p>
                    </div>

                    {/* Tracker inputs */}
                    {selectedOrder.status === 'confirmed' && (
                      <div className="space-y-4 border-t border-premium-gold/10 pt-4">
                        <h4 className="font-semibold text-xs">Dispatch Shipments details</h4>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'processing')}
                            className="bg-premium-gold text-white text-[10px] font-bold px-4 py-2 rounded-full hover:bg-premium-gold/90"
                          >
                            Mark Processing
                          </button>
                        </div>
                      </div>
                    )}

                    {selectedOrder.status === 'processing' && (
                      <div className="space-y-3 border-t border-premium-gold/10 pt-4 text-xs">
                        <h4 className="font-semibold">Add Tracking Information</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Tracking ID"
                            id="tracking-id"
                            className="bg-matte-white border border-premium-gold/15 p-2 rounded-xl text-xs"
                          />
                          <select
                            id="courier"
                            className="bg-matte-white border border-premium-gold/15 p-2 rounded-xl text-xs"
                          >
                            <option value="Blue Dart">Blue Dart</option>
                            <option value="Delhivery">Delhivery</option>
                            <option value="Shiprocket">Shiprocket</option>
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const track = (document.getElementById('tracking-id') as HTMLInputElement)?.value || 'SF987654IN'
                            const cour = (document.getElementById('courier') as HTMLSelectElement)?.value || 'Blue Dart'
                            handleAddTracking(selectedOrder.id, track, cour)
                          }}
                          className="w-full bg-premium-gold text-white text-[10px] font-bold py-2 rounded-full"
                        >
                          Mark Shipped & Send WhatsApp
                        </button>
                      </div>
                    )}

                    {selectedOrder.status === 'shipped' && (
                      <div className="space-y-2 border-t border-premium-gold/10 pt-4 text-center">
                        <button
                          onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'delivered')}
                          className="w-full bg-green-600 text-white text-[10px] font-bold py-2 rounded-full hover:bg-green-700"
                        >
                          Mark as Delivered
                        </button>
                      </div>
                    )}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* PANEL: PRODUCTS & INVENTORY */}
        {activePanel === 'products' && (
          <div className="space-y-8 text-left">
            <h2 className="font-serif text-3xl font-light">Products & Inventory Manager</h2>
            <div className="glass-panel rounded-2xl border border-premium-gold/10 overflow-hidden text-xs">
              <div className="grid grid-cols-5 gap-4 bg-warm-beige/20 p-4 font-bold border-b border-premium-gold/10 dark:bg-dark-card/50">
                <span>Product Name</span>
                <span>Price</span>
                <span>Stock Quantity</span>
                <span>Low stock Alert</span>
                <span>Status</span>
              </div>
              <div className="divide-y divide-premium-gold/10">
                {products.map(p => (
                  <div key={p.id} className="grid grid-cols-5 gap-4 p-4 items-center">
                    <span className="font-medium">{p.name}</span>
                    <span>₹{p.price}</span>
                    <div className="flex items-center gap-2">
                      <span>{p.stock_qty}</span>
                      <button
                        onClick={() => setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, stock_qty: prod.stock_qty + 10 } : prod))}
                        className="text-premium-gold font-bold px-2 py-0.5 border border-premium-gold/20 rounded-md hover:bg-premium-gold/10"
                      >
                        +10
                      </button>
                    </div>
                    <span className="text-red-500 font-semibold">{p.low_stock_threshold} units</span>
                    <span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 font-bold rounded-full text-[9px] uppercase">
                        Active
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PANEL: SUBSCRIPTIONS */}
        {activePanel === 'subscriptions' && (
          <div className="space-y-8 text-left">
            <h2 className="font-serif text-3xl font-light">Subscription Portal</h2>
            <div className="glass-panel rounded-2xl border border-premium-gold/10 overflow-hidden text-xs">
              <div className="grid grid-cols-5 gap-4 bg-warm-beige/20 p-4 font-bold border-b border-premium-gold/10 dark:bg-dark-card/50">
                <span>Customer</span>
                <span>Product Plan</span>
                <span>Razorpay Sub ID</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
              <div className="divide-y divide-premium-gold/10">
                {[
                  { customer: 'Dr. Kabir Sen', plan: 'Sleep Gummies (Subscribe)', rzpId: 'sub_P987654321', status: 'Active' },
                  { customer: 'Arya Sharma', plan: 'Sleep Gummies (Subscribe)', rzpId: 'sub_P123456789', status: 'Paused' }
                ].map((sub, idx) => (
                  <div key={idx} className="grid grid-cols-5 gap-4 p-4 items-center">
                    <span className="font-medium">{sub.customer}</span>
                    <span>{sub.plan}</span>
                    <span className="font-mono text-premium-gold">{sub.rzpId}</span>
                    <span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        sub.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-750'
                      }`}>
                        {sub.status}
                      </span>
                    </span>
                    <div className="flex gap-2">
                      <button className="text-[10px] font-bold text-premium-gold hover:underline">
                        Pause
                      </button>
                      <button className="text-[10px] font-bold text-red-500 hover:underline">
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PANEL: COUPONS */}
        {activePanel === 'coupons' && (
          <div className="space-y-8 text-left">
            <h2 className="font-serif text-3xl font-light">Coupons Manager</h2>
            
            {/* Create form */}
            <form onSubmit={handleCreateCoupon} className="glass-panel p-6 rounded-2xl border border-premium-gold/15 space-y-4 max-w-md">
              <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-premium-gold">Create New Coupon</h3>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Code (e.g. SAVE20)"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="col-span-2 bg-matte-white border border-premium-gold/15 text-xs px-3 py-2 rounded-xl"
                />
                <select
                  value={newCouponType}
                  onChange={(e) => setNewCouponType(e.target.value)}
                  className="bg-matte-white border border-premium-gold/15 text-xs px-2 py-2 rounded-xl"
                >
                  <option value="pct">% Off</option>
                  <option value="flat">Flat ₹</option>
                </select>
              </div>
              <input
                type="number"
                required
                placeholder="Discount Value"
                value={newCouponVal}
                onChange={(e) => setNewCouponVal(e.target.value)}
                className="w-full bg-matte-white border border-premium-gold/15 text-xs px-3 py-2 rounded-xl"
              />
              <button type="submit" className="w-full bg-premium-gold text-white text-xs font-bold py-2.5 rounded-full hover:bg-premium-gold/90">
                Create Coupon
              </button>
            </form>

            {/* List */}
            <div className="glass-panel rounded-2xl border border-premium-gold/10 overflow-hidden text-xs max-w-2xl">
              <div className="grid grid-cols-4 gap-4 bg-warm-beige/20 p-4 font-bold border-b border-premium-gold/10 dark:bg-dark-card/50">
                <span>Code</span>
                <span>Type</span>
                <span>Value</span>
                <span>Action</span>
              </div>
              <div className="divide-y divide-premium-gold/10">
                {coupons.map((c, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-4 p-4 items-center">
                    <span className="font-mono text-premium-gold font-bold">{c.code}</span>
                    <span className="uppercase">{c.type === 'pct' ? 'Percentage' : 'Free Shipping'}</span>
                    <span>{c.type === 'pct' ? `${c.value}%` : `₹${c.value}`}</span>
                    <button
                      onClick={() => setCoupons(prev => prev.filter(coup => coup.code !== c.code))}
                      className="text-red-500 hover:text-red-600 font-semibold p-1"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PANEL: REVIEWS MODERATION */}
        {activePanel === 'reviews' && (
          <div className="space-y-8 text-left">
            <h2 className="font-serif text-3xl font-light">Reviews Moderation Queue</h2>
            
            {reviews.length === 0 ? (
              <p className="text-xs text-matte-black/50 dark:text-dark-text/50">All reviews moderated.</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((r, idx) => (
                  <div key={idx} className="glass-panel p-6 rounded-2xl border border-premium-gold/15 space-y-4">
                    <div className="flex justify-between items-start text-xs">
                      <div>
                        <h4 className="font-serif text-sm font-semibold">{r.title || 'Verified review'}</h4>
                        <span className="opacity-60 font-semibold text-premium-gold">{r.customer_name}</span> &middot; <span className="opacity-60">{r.city}</span>
                      </div>
                      <span className="text-premium-gold font-bold">{r.rating} ★</span>
                    </div>
                    <p className="text-xs text-matte-black/75 dark:text-dark-text/75 leading-relaxed">{r.body}</p>
                    
                    <div className="flex gap-3 text-xs pt-2 border-t border-premium-gold/10">
                      <button
                        onClick={() => handleReviewStatus(r.id, 'approved')}
                        className="bg-green-600 text-white font-bold px-4 py-1.5 rounded-full hover:bg-green-700 flex items-center gap-1 text-[10px]"
                      >
                        <CheckCircle size={12} /> Approve Review
                      </button>
                      <button
                        onClick={() => handleReviewStatus(r.id, 'rejected')}
                        className="bg-red-500 text-white font-bold px-4 py-1.5 rounded-full hover:bg-red-650 flex items-center gap-1 text-[10px]"
                      >
                        <XCircle size={12} /> Reject Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PANEL: BLOG MANAGER */}
        {activePanel === 'blogs' && (
          <div className="space-y-8 text-left">
            <h2 className="font-serif text-3xl font-light">Blog Manager Hub</h2>
            
            {/* Create Form */}
            <form onSubmit={handleCreateBlog} className="glass-panel p-6 rounded-2xl border border-premium-gold/15 space-y-4 max-w-xl">
              <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-premium-gold">Add New Health Post</h3>
              <input
                type="text"
                required
                placeholder="Article title"
                value={newBlogTitle}
                onChange={(e) => setNewBlogTitle(e.target.value)}
                className="w-full bg-matte-white border border-premium-gold/15 text-xs px-3 py-2.5 rounded-xl"
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={newBlogCategory}
                  onChange={(e) => setNewBlogCategory(e.target.value)}
                  className="bg-matte-white border border-premium-gold/15 text-xs p-2.5 rounded-xl"
                >
                  <option value="Sleep Health">Sleep Health</option>
                  <option value="Science">Science & Research</option>
                  <option value="Nutrition">Performance Nutrition</option>
                </select>
                <input
                  type="text"
                  placeholder="Author (e.g. Dr. Sen)"
                  className="bg-matte-white border border-premium-gold/15 text-xs px-3 py-2 rounded-xl"
                />
              </div>
              <textarea
                placeholder="Short excerpt summary..."
                value={newBlogExcerpt}
                onChange={(e) => setNewBlogExcerpt(e.target.value)}
                rows={2}
                className="w-full bg-matte-white border border-premium-gold/15 text-xs p-3 rounded-xl resize-none"
              />
              <button type="submit" className="w-full bg-premium-gold text-white text-xs font-bold py-2.5 rounded-full hover:bg-premium-gold/90">
                Publish Post
              </button>
            </form>

            {/* List */}
            <div className="grid gap-4 max-w-2xl">
              {blogs.map((b, idx) => (
                <div key={idx} className="glass-panel p-4 rounded-xl border border-premium-gold/10 flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-serif font-semibold">{b.title}</h4>
                    <span className="text-[10px] text-premium-gold font-bold uppercase tracking-wider">{b.category} &middot; {b.read_time}</span>
                  </div>
                  <button
                    onClick={() => setBlogs(prev => prev.filter(bl => bl.id !== b.id))}
                    className="text-red-500 hover:text-red-650"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANEL: CONSULTATION SLOTS */}
        {activePanel === 'consultations' && (
          <div className="space-y-8 text-left">
            <h2 className="font-serif text-3xl font-light">Consultations Slot Creator</h2>
            
            {/* Create form */}
            <form onSubmit={handleCreateSlot} className="glass-panel p-6 rounded-2xl border border-premium-gold/15 space-y-4 max-w-sm">
              <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-premium-gold text-center">Add Availability Slot</h3>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  required
                  value={newSlotDate}
                  onChange={(e) => setNewSlotDate(e.target.value)}
                  className="bg-matte-white border border-premium-gold/15 text-xs p-2 rounded-xl"
                />
                <select
                  value={newSlotTime}
                  onChange={(e) => setNewSlotTime(e.target.value)}
                  className="bg-matte-white border border-premium-gold/15 text-xs p-2 rounded-xl"
                >
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-premium-gold text-white text-xs font-bold py-2.5 rounded-full hover:bg-premium-gold/90">
                Add Slot
              </button>
            </form>

            {/* List */}
            <div className="glass-panel rounded-2xl border border-premium-gold/10 overflow-hidden text-xs max-w-xl">
              <div className="grid grid-cols-3 gap-4 bg-warm-beige/20 p-4 font-bold border-b border-premium-gold/10 dark:bg-dark-card/50">
                <span>Date</span>
                <span>Time Slot</span>
                <span>Status</span>
              </div>
              <div className="divide-y divide-premium-gold/10">
                {slots.map((s, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-4 p-4 items-center">
                    <span>{s.date}</span>
                    <span className="font-bold">{s.start_time}</span>
                    <span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        s.is_booked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {s.is_booked ? 'Booked' : 'Available'}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
