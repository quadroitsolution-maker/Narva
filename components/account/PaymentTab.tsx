'use client'

import React, { useState, useEffect } from 'react'
import { CreditCard, Plus, Trash2, CheckCircle2 } from 'lucide-react'

interface PaymentTabProps {
  supabase: any
  user: any
}

export default function PaymentTab({ supabase, user }: PaymentTabProps) {
  const [methods, setMethods] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)

  // Card form states
  const [form, setForm] = useState({
    provider: 'Visa',
    cardNumber: '',
    expiry: '',
    is_default: false
  })

  const loadPaymentMethods = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })

      if (!error && data) {
        setMethods(data)
      }
    } catch (err) {
      console.error('Error fetching payments:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadPaymentMethods()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Basic validation
      const cleanNum = form.cardNumber.replace(/\s+/g, '')
      if (cleanNum.length < 12) {
        alert('Please enter a valid card number.')
        return
      }

      const lastFour = cleanNum.slice(-4)

      if (form.is_default) {
        await supabase
          .from('payment_methods')
          .update({ is_default: false })
          .eq('user_id', user.id)
      }

      const { error } = await supabase
        .from('payment_methods')
        .insert([{
          user_id: user.id,
          provider: form.provider,
          last_four: lastFour,
          expiry: form.expiry,
          is_default: form.is_default
        }])

      if (error) throw error
      setIsAdding(false)
      setForm({ provider: 'Visa', cardNumber: '', expiry: '', is_default: false })
      await loadPaymentMethods()
    } catch (err) {
      console.error('Failed to save card:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadPaymentMethods()
    } catch (err) {
      console.error('Failed to delete card:', err)
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', user.id)

      const { error } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', id)

      if (error) throw error
      await loadPaymentMethods()
    } catch (err) {
      console.error('Failed to set default card:', err)
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
        <h2 className="font-serif text-2xl font-light">Payment Methods</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-premium-gold text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-premium-gold/90 transition-colors flex items-center gap-1.5 shadow-md"
          >
            <Plus size={12} /> Add Card
          </button>
        )}
      </div>

      {isAdding ? (
        <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-premium-gold/15 space-y-4 max-w-md">
          <h3 className="text-xs font-bold uppercase tracking-wider text-premium-gold">Add Credit/Debit Card</h3>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-matte-black/50">Provider</label>
            <select
              value={form.provider}
              onChange={e => setForm(prev => ({ ...prev, provider: e.target.value }))}
              className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs px-3 py-2.5 rounded-xl focus:outline-none"
            >
              <option value="Visa">Visa</option>
              <option value="Mastercard">Mastercard</option>
              <option value="Rupay">Rupay</option>
              <option value="Amex">American Express</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-matte-black/50">Card Number</label>
            <input
              required type="text" maxLength={19} placeholder="4111 2222 3333 4444"
              value={form.cardNumber}
              onChange={e => setForm(prev => ({ ...prev, cardNumber: e.target.value.replace(/[^0-9]/g, '').replace(/(.{4})/g, '$1 ').trim() }))}
              className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs px-3 py-2.5 rounded-xl focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-matte-black/50">Expiry Date</label>
              <input
                required type="text" maxLength={5} placeholder="MM/YY"
                value={form.expiry}
                onChange={e => {
                  let val = e.target.value.replace(/[^0-9]/g, '')
                  if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2, 4)
                  setForm(prev => ({ ...prev, expiry: val }))
                }}
                className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs px-3 py-2.5 rounded-xl focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-matte-black/50">CVV (Mock)</label>
              <input
                required type="password" maxLength={3} placeholder="•••"
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
            Make this my default payment card
          </label>

          <div className="flex gap-3 justify-end pt-3">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="border border-premium-gold/25 text-premium-gold text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl hover:bg-premium-gold/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-premium-gold text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl hover:bg-premium-gold/90"
            >
              Link Card
            </button>
          </div>
        </form>
      ) : methods.length === 0 ? (
        <div className="glass-panel text-center py-16 rounded-2xl border border-premium-gold/10">
          <CreditCard className="text-premium-gold/25 mx-auto mb-3" size={32} />
          <p className="text-xs text-matte-black/45">No linked payment cards found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {methods.map(card => (
            <div
              key={card.id}
              className={`glass-panel p-5 rounded-2xl border flex flex-col justify-between gap-5 bg-warm-beige/5 relative overflow-hidden transition-all ${
                card.is_default ? 'border-premium-gold/60 shadow-lg' : 'border-premium-gold/10'
              }`}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-premium-gold border border-premium-gold/25 px-2.5 py-0.5 rounded-md">
                    {card.provider}
                  </span>
                  {card.is_default && (
                    <span className="text-[8px] font-bold uppercase tracking-widest text-white bg-premium-gold px-2 py-0.5 rounded-full">
                      Primary
                    </span>
                  )}
                </div>

                <div className="pt-2">
                  <p className="font-serif text-lg font-light tracking-widest">
                    •••• •••• •••• {card.last_four}
                  </p>
                  <p className="text-[10px] text-matte-black/45 mt-1">
                    Expires {card.expiry}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-premium-gold/10 pt-4">
                <button
                  onClick={() => handleDelete(card.id)}
                  className="flex items-center gap-1 text-[10px] font-bold text-red-500 hover:underline"
                >
                  <Trash2 size={11} /> Unlink Card
                </button>

                {!card.is_default && (
                  <button
                    onClick={() => handleSetDefault(card.id)}
                    className="text-[9px] font-bold uppercase tracking-wider border border-premium-gold/25 text-premium-gold px-2.5 py-1 rounded-lg hover:bg-premium-gold/5"
                  >
                    Set Primary
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
