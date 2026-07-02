'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { ShoppingBag, Heart, CheckCircle2, Clock, User, ArrowRight, Ticket, Plus } from 'lucide-react'

interface DashboardTabProps {
  supabase: any
  user: any
  setActiveTab: (tab: any) => void
  setSelectedOrderId: (orderId: string | null) => void
}

export default function DashboardTab({ supabase, user, setActiveTab, setSelectedOrderId }: DashboardTabProps) {
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({
    activeOrders: 0,
    completedOrders: 0,
    wishlistCount: 0
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true)
        // 1. Fetch Profile
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(prof)

        // 2. Fetch Wishlist Count
        const { count: wishCount } = await supabase
          .from('wishlist')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)

        // 3. Fetch Orders (active & completed)
        const { data: userOrders } = await supabase
          .from('orders')
          .select('*, order_items(*, products(*))')
          .eq('customer_id', user.id)
          .order('created_at', { ascending: false })

        const orders = userOrders || []
        const active = orders.filter((o: any) => 
          ['pending', 'confirmed', 'processing', 'shipped'].includes(o.status)
        ).length
        const completed = orders.filter((o: any) => o.status === 'delivered').length

        setStats({
          activeOrders: active,
          completedOrders: completed,
          wishlistCount: wishCount || 0
        })

        // Format recent orders with product previews
        setRecentOrders(orders.slice(0, 3))
      } catch (err) {
        console.error('Error loading dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadDashboardData()
    }
  }, [supabase, user])

  const welcomeName = profile?.full_name || user.email?.split('@')[0] || 'Customer'

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-premium-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-warm-beige/35 to-premium-gold/5 border border-premium-gold/15 p-6 rounded-3xl backdrop-blur-sm">
        <h2 className="font-serif text-2xl sm:text-3xl font-light leading-snug">
          Welcome back, <span className="text-premium-gold font-normal">{welcomeName}</span>
        </h2>
        <p className="text-xs text-matte-black/50 dark:text-dark-text/50 mt-1">
          Access your personal panel to track ship status, update addresses, and modify saved formulations.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-premium-gold/10 flex items-center gap-4 bg-warm-beige/10">
          <div className="w-12 h-12 bg-premium-gold/10 rounded-full flex items-center justify-center text-premium-gold">
            <ShoppingBag size={20} />
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-widest text-matte-black/40 dark:text-dark-text/40 font-bold">Active Orders</span>
            <span className="text-2xl font-serif font-light text-matte-black dark:text-dark-text">{stats.activeOrders}</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-premium-gold/10 flex items-center gap-4 bg-warm-beige/10">
          <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-widest text-matte-black/40 dark:text-dark-text/40 font-bold">Completed Orders</span>
            <span className="text-2xl font-serif font-light text-matte-black dark:text-dark-text">{stats.completedOrders}</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-premium-gold/10 flex items-center gap-4 bg-warm-beige/10">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
            <Heart size={20} className="fill-current" />
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-widest text-matte-black/40 dark:text-dark-text/40 font-bold">Wishlisted</span>
            <span className="text-2xl font-serif font-light text-matte-black dark:text-dark-text">{stats.wishlistCount}</span>
          </div>
        </div>
      </div>

      {/* Quick Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-2 border border-premium-gold/25 text-premium-gold hover:bg-premium-gold/5 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <User size={13} /> Edit Profile
        </button>
        <button
          onClick={() => setActiveTab('wishlist')}
          className="flex items-center gap-2 border border-premium-gold/25 text-premium-gold hover:bg-premium-gold/5 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <Heart size={13} /> View Wishlist
        </button>
        <button
          onClick={() => setActiveTab('support')}
          className="flex items-center gap-2 bg-premium-gold text-white hover:bg-premium-gold/90 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <Ticket size={13} /> New Support Ticket
        </button>
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-light">Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <div className="glass-panel text-center py-12 rounded-2xl border border-premium-gold/10">
            <p className="text-xs text-matte-black/40 dark:text-dark-text/40">You haven't placed any orders yet.</p>
            <button
              onClick={() => window.location.href = '/products'}
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-premium-gold hover:underline font-bold uppercase tracking-wider"
            >
              Shop formulations <ArrowRight size={13} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {recentOrders.map((order) => {
              const firstItem = order.order_items?.[0]
              const prodName = firstItem?.products?.name || firstItem?.name || 'Supplement'
              const prodImage = firstItem?.products?.images?.[0] || '/images/melatonin.png'
              const dateStr = new Date(order.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })

              return (
                <div
                  key={order.id}
                  className="glass-panel p-5 rounded-2xl border border-premium-gold/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-warm-beige/5 hover:bg-warm-beige/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 bg-warm-beige/35 dark:bg-dark-bg rounded-xl overflow-hidden border border-premium-gold/10 p-2 flex items-center justify-center flex-shrink-0">
                      <Image
                        src={prodImage}
                        alt={prodName}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif text-md text-matte-black dark:text-dark-text">
                        {prodName} {order.order_items?.length > 1 && `+ ${order.order_items.length - 1} more`}
                      </h4>
                      <p className="text-[10px] text-matte-black/40 dark:text-dark-text/40">
                        Placed on {dateStr} · Order #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-start w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-premium-gold/10 gap-3">
                    <div className="text-left sm:text-right">
                      <span className="block text-[8px] uppercase tracking-widest text-matte-black/35 font-bold">Total</span>
                      <span className="text-md font-bold text-premium-gold">₹{order.total}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold ${
                        order.status === 'delivered' ? 'bg-green-500/10 text-green-500' :
                        order.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {order.status}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedOrderId(order.id)
                          setActiveTab('orders')
                        }}
                        className="p-2 border border-premium-gold/20 hover:border-premium-gold rounded-full text-premium-gold transition-colors"
                        title="View Details"
                      >
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
