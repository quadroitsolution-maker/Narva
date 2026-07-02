'use client'

import React, { useState, useEffect } from 'react'
import { Ticket, Plus, MessageSquare, Clock, ShieldCheck } from 'lucide-react'

interface SupportTabProps {
  supabase: any
  user: any
}

export default function SupportTab({ supabase, user }: SupportTabProps) {
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  // Ticket form state
  const [form, setForm] = useState({
    subject: '',
    message: ''
  })

  const loadTickets = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setTickets(data)
      }
    } catch (err) {
      console.error('Error fetching tickets:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadTickets()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.subject.trim() || !form.message.trim()) return

    try {
      setSubmitting(true)
      const { error } = await supabase
        .from('support_tickets')
        .insert([{
          user_id: user.id,
          subject: form.subject.trim(),
          message: form.message.trim(),
          status: 'open'
        }])

      if (error) throw error

      setForm({ subject: '', message: '' })
      setIsAdding(false)
      await loadTickets()
      alert('Support ticket created successfully. Our team will review it soon.')
    } catch (err) {
      console.error('Failed to create ticket:', err)
      alert('Failed to submit ticket details.')
    } finally {
      setSubmitting(false)
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
        <h2 className="font-serif text-2xl font-light">Support Tickets</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-premium-gold text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-premium-gold/90 transition-colors flex items-center gap-1.5 shadow-md"
          >
            <Plus size={12} /> Raise Ticket
          </button>
        )}
      </div>

      {isAdding ? (
        <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-premium-gold/15 space-y-4 max-w-lg">
          <h3 className="text-xs font-bold uppercase tracking-wider text-premium-gold">Open Support Ticket</h3>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-matte-black/50">Subject</label>
            <input
              required type="text" placeholder="e.g. Shipment Delay, Wrong Formulation Item..."
              value={form.subject}
              onChange={e => setForm(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs px-3 py-2.5 rounded-xl focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-matte-black/50">Describe Message</label>
            <textarea
              required rows={4} placeholder="Please provide specific details..."
              value={form.message}
              onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
              className="w-full bg-matte-white dark:bg-dark-bg border border-premium-gold/15 text-xs p-3 rounded-xl focus:outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end pt-3">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="border border-premium-gold/25 text-premium-gold text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl hover:bg-premium-gold/5"
            >
              Cancel
            </button>
            <button
              disabled={submitting}
              type="submit"
              className="bg-premium-gold text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl hover:bg-premium-gold/90 shadow-md"
            >
              {submitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>
        </form>
      ) : tickets.length === 0 ? (
        <div className="glass-panel text-center py-16 rounded-2xl border border-premium-gold/10">
          <Ticket className="text-premium-gold/25 mx-auto mb-3" size={32} />
          <p className="text-xs text-matte-black/45">You have no active support tickets.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map(t => {
            const dateStr = new Date(t.created_at).toLocaleDateString()

            return (
              <div
                key={t.id}
                className="glass-panel p-5 rounded-2xl border border-premium-gold/10 bg-warm-beige/5 space-y-3"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-matte-black/45">Ticket #{t.id.slice(0, 8).toUpperCase()}</span>
                    <h3 className="font-serif text-sm font-medium text-matte-black dark:text-dark-text">
                      {t.subject}
                    </h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold ${
                    t.status === 'resolved' || t.status === 'closed'
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {t.status}
                  </span>
                </div>

                <p className="text-xs text-matte-black/60 leading-relaxed border-t border-premium-gold/5 pt-3">
                  {t.message}
                </p>

                <div className="border-t border-premium-gold/5 pt-3 text-[10px] text-matte-black/40 flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> Created {dateStr}
                  </span>
                  {t.status === 'resolved' && (
                    <span className="flex items-center gap-1 text-green-600">
                      <ShieldCheck size={11} /> Verified Resolution
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
