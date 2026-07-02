'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Search, ChevronRight, ArrowLeft, Download, Ban, Truck, Calendar, MapPin, CreditCard } from 'lucide-react'

interface OrdersTabProps {
  supabase: any
  user: any
  selectedOrderId: string | null
  setSelectedOrderId: (id: string | null) => void
}

export default function OrdersTab({ supabase, user, selectedOrderId, setSelectedOrderId }: OrdersTabProps) {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [cancelling, setCancelling] = useState(false)

  // Fetch orders on load
  const loadOrders = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setOrders(data)
      }
    } catch (err) {
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadOrders()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  // Monitor selected order changes
  useEffect(() => {
    if (selectedOrderId) {
      const found = orders.find(o => o.id === selectedOrderId)
      setSelectedOrder(found || null)
    } else {
      setSelectedOrder(null)
    }
  }, [selectedOrderId, orders])

  // Filter logic
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) || 
                          (o.order_items?.[0]?.products?.name || '').toLowerCase().includes(search.toLowerCase())
    const matchesFilter = activeFilter === 'all' || o.status === activeFilter
    return matchesSearch && matchesFilter
  })

  // Cancel order handler
  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return
    try {
      setCancelling(true)
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId)

      if (error) throw error
      alert('Order cancelled successfully.')
      await loadOrders()
    } catch (err) {
      console.error('Failed to cancel order:', err)
      alert('Failed to cancel order. Please contact support.')
    } finally {
      setCancelling(false)
    }
  }

  // Invoice downloader
  const handleDownloadInvoice = (order: any) => {
    const header = 'Invoice details for Order #' + order.id.toUpperCase() + '\n' +
                   'Date: ' + new Date(order.created_at).toLocaleDateString() + '\n' +
                   'Customer: ' + (order.customer_name || user.email) + '\n' +
                   'Payment Method: ' + (order.payment_method || 'Online') + '\n\n' +
                   'Product,Qty,Price,Total\n' +
                   order.order_items.map((i: any) => 
                     `"${i.products?.name || i.name || 'Supplement'}",${i.quantity},₹${i.unit_price},₹${i.total_price}`
                   ).join('\n') + `\n\nSubtotal: ₹${order.subtotal}\nDiscount: ₹${order.discount}\nShipping: ₹${order.shipping}\nTotal: ₹${order.total}`

    const blob = new Blob([header], { type: 'text/plain;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `invoice_${order.id.slice(0, 8)}.txt`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-premium-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Detailed view
  if (selectedOrder) {
    const order = selectedOrder
    const dateStr = new Date(order.created_at).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    const isEligibleForCancel = ['pending', 'confirmed'].includes(order.status)

    // Status Timeline
    const steps = [
      { key: 'ordered', label: 'Ordered', active: true },
      { key: 'processing', label: 'Processing', active: ['processing', 'shipped', 'delivered'].includes(order.status) },
      { key: 'shipped', label: 'Shipped', active: ['shipped', 'delivered'].includes(order.status) },
      { key: 'delivered', label: 'Delivered', active: order.status === 'delivered' }
    ]

    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedOrderId(null)}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-matte-black/55 hover:text-premium-gold transition-colors"
        >
          <ArrowLeft size={14} /> Back to orders
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-premium-gold/10 pb-5">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-premium-gold font-bold">Order Details</span>
            <h2 className="font-serif text-2xl font-light">#{order.id.toUpperCase()}</h2>
            <p className="text-xs text-matte-black/40 mt-1">Placed on {dateStr}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleDownloadInvoice(order)}
              className="flex items-center gap-2 border border-premium-gold/25 text-premium-gold hover:bg-premium-gold/5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <Download size={13} /> Invoice
            </button>
            {isEligibleForCancel && (
              <button
                disabled={cancelling}
                onClick={() => handleCancelOrder(order.id)}
                className="flex items-center gap-2 border border-red-500/25 text-red-500 hover:bg-red-500/5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <Ban size={13} /> Cancel Order
              </button>
            )}
          </div>
        </div>

        {/* Timeline Tracker */}
        {order.status !== 'cancelled' ? (
          <div className="glass-panel p-6 rounded-2xl border border-premium-gold/10 bg-warm-beige/5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-premium-gold flex items-center gap-1.5">
              <Truck size={14} /> Shipping Timeline
            </h3>
            <div className="grid grid-cols-4 gap-2 relative pt-2">
              <div className="absolute top-5 left-[12%] right-[12%] h-[2px] bg-premium-gold/10 -z-10" />
              <div
                className="absolute top-5 left-[12%] h-[2px] bg-premium-gold -z-10 transition-all duration-500"
                style={{
                  width: order.status === 'delivered' ? '76%' :
                         order.status === 'shipped' ? '50%' :
                         order.status === 'processing' ? '25%' : '0%'
                }}
              />
              {steps.map((s, idx) => (
                <div key={s.key} className="text-center space-y-2 flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    s.active ? 'bg-premium-gold text-white' : 'bg-matte-white border border-premium-gold/15 text-matte-black/35'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    s.active ? 'text-premium-gold' : 'text-matte-black/45'
                  }`}>{s.label}</span>
                </div>
              ))}
            </div>
            {order.tracking_number && (
              <div className="border-t border-premium-gold/10 pt-4 text-xs flex justify-between">
                <span>Courier Service: <span className="font-semibold text-premium-gold">{order.courier || 'Delhivery'}</span></span>
                <span>Tracking AWB: <span className="font-mono font-semibold text-premium-gold">{order.tracking_number}</span></span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-red-500/5 border border-red-500/20 p-5 rounded-2xl text-xs text-red-500 flex items-center gap-2">
            <Ban size={15} /> This order was cancelled.
          </div>
        )}

        {/* Addresses & Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Shipping Address */}
          <div className="glass-panel p-5 rounded-2xl border border-premium-gold/10 space-y-3 md:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-premium-gold flex items-center gap-1.5">
              <MapPin size={13} /> Shipping Address
            </h3>
            <div className="text-xs space-y-1 text-matte-black/75 dark:text-dark-text/75 leading-relaxed">
              <p className="font-semibold">{order.customer_name || 'Customer Profile'}</p>
              <p>{order.shipping_address?.line1 || 'Address details in files'}</p>
              {order.shipping_address?.line2 && <p>{order.shipping_address.line2}</p>}
              <p>
                {order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.pincode}
              </p>
              <p>{order.shipping_address?.country || 'India'}</p>
              {order.customer_phone && <p className="mt-2 text-matte-black/45">Phone: {order.customer_phone}</p>}
            </div>
          </div>

          {/* Billing Info */}
          <div className="glass-panel p-5 rounded-2xl border border-premium-gold/10 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-premium-gold flex items-center gap-1.5">
              <CreditCard size={13} /> Payment Info
            </h3>
            <div className="text-xs space-y-1 text-matte-black/75 dark:text-dark-text/75">
              <p>Method: <span className="font-semibold capitalize">{order.payment_method || 'Razorpay Card'}</span></p>
              {order.payment_id && <p className="text-[10px] text-matte-black/45 font-mono">ID: {order.payment_id}</p>}
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="glass-panel rounded-2xl border border-premium-gold/10 overflow-hidden">
          <div className="bg-warm-beige/35 dark:bg-dark-card/50 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-matte-black/40 border-b border-premium-gold/10 grid grid-cols-4">
            <span className="col-span-2">Product</span>
            <span className="text-center">Quantity</span>
            <span className="text-right font-semibold">Price</span>
          </div>
          <div className="divide-y divide-premium-gold/8">
            {order.order_items?.map((item: any) => {
              const pName = item.products?.name || item.name || 'Supplement'
              const pImg = item.products?.images?.[0] || '/images/melatonin.png'
              return (
                <div key={item.id} className="grid grid-cols-4 px-5 py-4 items-center text-xs">
                  <div className="col-span-2 flex items-center gap-3">
                    <div className="relative w-12 h-12 bg-warm-beige/25 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                      <Image src={pImg} alt={pName} fill className="object-contain p-0.5" />
                    </div>
                    <div>
                      <p className="font-medium text-[11px]">{pName}</p>
                    </div>
                  </div>
                  <div className="text-center font-semibold text-matte-black/60">{item.quantity}</div>
                  <div className="text-right font-bold text-premium-gold">₹{item.total_price || (item.unit_price * item.quantity)}</div>
                </div>
              )
            })}
          </div>
          <div className="bg-warm-beige/10 p-5 border-t border-premium-gold/10 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-matte-black/45">Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-500">
                <span>Discount Code Applied</span>
                <span>-₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-matte-black/45">Shipping</span>
              <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
            </div>
            <div className="flex justify-between border-t border-premium-gold/10 pt-2 font-bold text-md text-premium-gold">
              <span>Total Price</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter widgets */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search orders (ID, Product name)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-matte-black/40" size={13} />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
          {['all', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-full text-[9px] uppercase font-bold tracking-wider transition-colors ${
                activeFilter === f
                  ? 'bg-premium-gold text-white'
                  : 'bg-warm-beige/25 hover:bg-warm-beige/50 text-matte-black/50 border border-premium-gold/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      {filteredOrders.length === 0 ? (
        <div className="glass-panel text-center py-16 rounded-2xl border border-premium-gold/10">
          <Calendar className="text-premium-gold/30 mx-auto mb-3" size={32} />
          <p className="text-xs text-matte-black/45">No matching orders found.</p>
        </div>
      ) : (
        <div className="divide-y divide-premium-gold/10 border border-premium-gold/10 rounded-2xl overflow-hidden glass-panel">
          {filteredOrders.map(order => {
            const firstItem = order.order_items?.[0]
            const pName = firstItem?.products?.name || firstItem?.name || 'Supplement'
            const pImg = firstItem?.products?.images?.[0] || '/images/melatonin.png'
            const dateStr = new Date(order.created_at).toLocaleDateString()

            return (
              <div
                key={order.id}
                onClick={() => setSelectedOrderId(order.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-warm-beige/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 bg-warm-beige/25 rounded-lg overflow-hidden border border-premium-gold/10 p-1 flex items-center justify-center">
                    <Image src={pImg} alt={pName} fill className="object-contain p-0.5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm text-matte-black dark:text-dark-text">
                      {pName} {order.order_items?.length > 1 && `+ ${order.order_items.length - 1} more`}
                    </h4>
                    <p className="text-[10px] text-matte-black/40 mt-0.5">
                      Order #{order.id.slice(0, 8).toUpperCase()} · Placed on {dateStr}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-t-0 pt-3 sm:pt-0 border-premium-gold/8">
                  <div className="text-left sm:text-right">
                    <span className="block text-[8px] uppercase tracking-widest text-matte-black/35 font-bold">Total</span>
                    <span className="text-sm font-bold text-premium-gold">₹{order.total}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold ${
                      order.status === 'delivered' ? 'bg-green-500/10 text-green-500' :
                      order.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                      'bg-amber-500/10 text-amber-500'
                    }`}>
                      {order.status}
                    </span>
                    <ChevronRight size={14} className="text-premium-gold" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
