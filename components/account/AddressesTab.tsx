'use client'

import React, { useState, useEffect } from 'react'
import { MapPin, Plus, Edit2, Trash2, CheckCircle2, Home } from 'lucide-react'

interface AddressesTabProps {
  supabase: any
  user: any
}

export default function AddressesTab({ supabase, user }: AddressesTabProps) {
  const [addresses, setAddresses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAddress, setEditingAddress] = useState<any>(null)
  const [isAdding, setIsAdding] = useState(false)

  // Form states
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    is_default: false
  })

  const loadAddresses = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .or(`customer_id.eq.${user.id},user_id.eq.${user.id}`)
        .order('is_default', { ascending: false })

      if (!error && data) {
        setAddresses(data)
      }
    } catch (err) {
      console.error('Error fetching addresses:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadAddresses()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const resetForm = () => {
    setForm({
      full_name: '',
      phone: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      is_default: false
    })
    setEditingAddress(null)
    setIsAdding(false)
  }

  const handleEditClick = (addr: any) => {
    setEditingAddress(addr)
    setForm({
      full_name: addr.full_name || '',
      phone: addr.phone || '',
      line1: addr.line1 || '',
      line2: addr.line2 || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
      country: addr.country || 'India',
      is_default: addr.is_default || false
    })
    setIsAdding(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (form.is_default) {
        // If set to default, clear default status for other addresses first
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .or(`customer_id.eq.${user.id},user_id.eq.${user.id}`)
      }

      if (editingAddress) {
        // Update
        const { error } = await supabase
          .from('addresses')
          .update({
            full_name: form.full_name,
            phone: form.phone,
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
            country: form.country,
            is_default: form.is_default
          })
          .eq('id', editingAddress.id)

        if (error) throw error
      } else {
        // Insert
        const { error } = await supabase
          .from('addresses')
          .insert([{
            customer_id: user.id,
            user_id: user.id,
            full_name: form.full_name,
            phone: form.phone,
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
            country: form.country,
            is_default: form.is_default
          }])

        if (error) throw error
      }

      resetForm()
      await loadAddresses()
    } catch (err) {
      console.error('Failed to save address:', err)
      alert('Failed to save address details.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadAddresses()
    } catch (err) {
      console.error('Failed to delete address:', err)
    }
  }

  const handleSetDefault = async (addrId: string) => {
    try {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .or(`customer_id.eq.${user.id},user_id.eq.${user.id}`)

      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', addrId)

      if (error) throw error
      await loadAddresses()
    } catch (err) {
      console.error('Failed to update default address:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-premium-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-premium-gold/10 pb-4">
        <h2 className="font-serif text-2xl font-light">Addresses</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-premium-gold text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-premium-gold/90 transition-colors flex items-center gap-1.5 shadow-md"
          >
            <Plus size={12} /> Add Address
          </button>
        )}
      </div>

      {isAdding ? (
        <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-premium-gold/15 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-premium-gold">
            {editingAddress ? 'Edit Address Details' : 'Add New Shipping Location'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-matte-black/50">Full Name</label>
              <input
                required type="text" value={form.full_name}
                onChange={e => setForm(prev => ({ ...prev, full_name: e.target.value }))}
                className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs px-3 py-2.5 rounded-xl focus:outline-none"
                placeholder="Arya Sharma"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-matte-black/50">Phone Number</label>
              <input
                required type="tel" value={form.phone}
                onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs px-3 py-2.5 rounded-xl focus:outline-none"
                placeholder="+91 99999 88888"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-matte-black/50">Address Line 1</label>
            <input
              required type="text" value={form.line1}
              onChange={e => setForm(prev => ({ ...prev, line1: e.target.value }))}
              className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs px-3 py-2.5 rounded-xl focus:outline-none"
              placeholder="House, Flat No, Street name..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-matte-black/50">Address Line 2 (Optional)</label>
            <input
              type="text" value={form.line2}
              onChange={e => setForm(prev => ({ ...prev, line2: e.target.value }))}
              className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs px-3 py-2.5 rounded-xl focus:outline-none"
              placeholder="Landmark, Apartment name..."
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-matte-black/50">City</label>
              <input
                required type="text" value={form.city}
                onChange={e => setForm(prev => ({ ...prev, city: e.target.value }))}
                className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs px-3 py-2.5 rounded-xl focus:outline-none"
                placeholder="Mumbai"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-matte-black/50">State</label>
              <input
                required type="text" value={form.state}
                onChange={e => setForm(prev => ({ ...prev, state: e.target.value }))}
                className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs px-3 py-2.5 rounded-xl focus:outline-none"
                placeholder="Maharashtra"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-matte-black/50">Pincode</label>
              <input
                required type="text" value={form.pincode}
                onChange={e => setForm(prev => ({ ...prev, pincode: e.target.value }))}
                className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs px-3 py-2.5 rounded-xl focus:outline-none"
                placeholder="400001"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-matte-black/50">Country</label>
              <input
                required type="text" value={form.country}
                onChange={e => setForm(prev => ({ ...prev, country: e.target.value }))}
                className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs px-3 py-2.5 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-matte-black/60 select-none py-1">
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={e => setForm(prev => ({ ...prev, is_default: e.target.checked }))}
              className="accent-premium-gold h-4 w-4 rounded"
            />
            Make this my default shipping address
          </label>

          <div className="flex gap-3 justify-end pt-3">
            <button
              type="button"
              onClick={resetForm}
              className="border border-premium-gold/25 text-premium-gold text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl hover:bg-premium-gold/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-premium-gold text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl hover:bg-premium-gold/90"
            >
              Save Address
            </button>
          </div>
        </form>
      ) : addresses.length === 0 ? (
        <div className="glass-panel text-center py-16 rounded-2xl border border-premium-gold/10">
          <MapPin className="text-premium-gold/25 mx-auto mb-3" size={32} />
          <p className="text-xs text-matte-black/45">No shipping addresses added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map(addr => (
            <div
              key={addr.id}
              className={`glass-panel p-5 rounded-2xl border flex flex-col justify-between gap-5 bg-warm-beige/5 relative overflow-hidden transition-all ${
                addr.is_default ? 'border-premium-gold/60 shadow-lg' : 'border-premium-gold/10'
              }`}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5 text-premium-gold">
                    <Home size={15} />
                    <span className="font-semibold text-xs uppercase tracking-wider">Address</span>
                  </div>
                  {addr.is_default && (
                    <span className="text-[8px] font-bold uppercase tracking-widest text-white bg-premium-gold px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>

                <div className="text-xs space-y-1 leading-relaxed text-matte-black/85 dark:text-dark-text/85">
                  <p className="font-semibold">{addr.full_name || 'Customer Address'}</p>
                  <p>{addr.line1}</p>
                  {addr.line2 && <p>{addr.line2}</p>}
                  <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p>{addr.country}</p>
                  {addr.phone && <p className="text-[10px] text-matte-black/45 mt-2">Phone: {addr.phone}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-premium-gold/10 pt-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditClick(addr)}
                    className="flex items-center gap-1 text-[10px] font-bold text-premium-gold hover:underline"
                  >
                    <Edit2 size={11} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="flex items-center gap-1 text-[10px] font-bold text-red-500 hover:underline"
                  >
                    <Trash2 size={11} /> Delete
                  </button>
                </div>

                {!addr.is_default && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-[9px] font-bold uppercase tracking-wider border border-premium-gold/25 text-premium-gold px-2.5 py-1 rounded-lg hover:bg-premium-gold/5"
                  >
                    Set default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
