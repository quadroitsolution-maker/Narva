'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Clock, Video, FileText, CheckCircle, ArrowRight, ShieldCheck, Heart } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import AiAssistant from '@/components/AiAssistant'
import { getSlots, bookSlot } from '@/lib/db'
import { motion, AnimatePresence } from 'framer-motion'

export default function ConsultationPage() {
  const [slots, setSlots] = useState<any[]>([])
  const [selectedSlot, setSelectedSlot] = useState<any>(null)
  
  // Form inputs
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [specialty, setSpecialty] = useState('Sleep Hygiene')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [bookingResult, setBookingResult] = useState<{ success: boolean; meetingLink: string } | null>(null)

  useEffect(() => {
    async function loadSlots() {
      const data = await getSlots()
      setSlots(data)
    }
    loadSlots()
  }, [bookingResult])

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSlot || !name || !email || !phone) return

    setSubmitting(true)
    const result = await bookSlot({
      slotId: selectedSlot.id,
      name,
      email,
      phone,
      notes,
      specialty
    })
    setSubmitting(false)
    
    if (result.success) {
      setBookingResult({
        success: true,
        meetingLink: result.meetingLink
      })
    }
  }

  return (
    <>
      <Navbar />
      <CartDrawer />
      <AiAssistant />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        
        <AnimatePresence mode="wait">
          {!bookingResult ? (
            <motion.div
              key="booking-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
            >
              {/* Left Column: Info & Clinical context */}
              <div className="lg:col-span-5 space-y-6 text-left">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-premium-gold/10 px-3 py-1 text-xs font-semibold tracking-wider text-premium-gold uppercase">
                  <Video size={12} /> Live Consultations
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl font-light leading-tight">
                  Talk to Real Doctors, Not AI
                </h1>
                <p className="text-sm text-matte-black/60 dark:text-dark-text/60 leading-relaxed">
                  Have questions about sleep cycle disruption, daytime fatigue, or daily anxiety? Secure a private 30-minute video call with a certified medical practitioner (MBBS) to map your personalized recovery plan.
                </p>

                <div className="space-y-4 pt-4 border-t border-premium-gold/15">
                  <div className="flex gap-3 text-xs leading-relaxed">
                    <ShieldCheck className="text-premium-gold flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <strong>Free & Confidential:</strong> Fully complimentary with zero sales obligations. Your health data remains completely secure.
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs leading-relaxed">
                    <Heart className="text-premium-gold flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <strong>Holistic Plan:</strong> Receive custom advice on caffeine curves, screen boundaries, and supplement dosages.
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Scheduler */}
              <div className="lg:col-span-7">
                <div className="glass-panel p-8 rounded-3xl shadow-xl space-y-6">
                  <h3 className="font-serif text-lg font-medium text-center">Schedule Virtual Appointment</h3>

                  {/* Steps container */}
                  <form onSubmit={handleBooking} className="space-y-6">
                    {/* Step 1: Slot selection */}
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-premium-gold block">
                        1. Select Available Date & Time
                      </label>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-48 overflow-y-auto p-1 border border-premium-gold/15 dark:border-white/5 rounded-xl">
                        {slots.filter(s => !s.is_booked).length === 0 ? (
                          <div className="col-span-3 text-center py-6 text-xs text-matte-black/40 dark:text-dark-text/40 italic">
                            No available slots left. Check back soon!
                          </div>
                        ) : (
                          slots.filter(s => !s.is_booked).map((slot) => (
                            <button
                              key={slot.id}
                              type="button"
                              onClick={() => setSelectedSlot(slot)}
                              className={`p-3 rounded-lg border text-center text-xs transition-all flex flex-col items-center justify-center gap-1 ${
                                selectedSlot?.id === slot.id
                                  ? 'border-premium-gold bg-premium-gold text-white font-semibold'
                                  : 'border-premium-gold/10 hover:border-premium-gold bg-warm-beige/10 dark:bg-dark-card/30'
                              }`}
                            >
                              <span className="flex items-center gap-1"><Calendar size={10} /> {slot.date}</span>
                              <span className="flex items-center gap-1 font-bold"><Clock size={10} /> {slot.start_time}</span>
                            </button>
                          ))
                        )}
                      </div>
                      
                      {selectedSlot && (
                        <p className="text-[10px] text-green-600 dark:text-green-400 font-semibold">
                          Selected Slot: {selectedSlot.date} at {selectedSlot.start_time}
                        </p>
                      )}
                    </div>

                    {/* Step 2: Contact Form */}
                    <div className="space-y-4 border-t border-premium-gold/10 dark:border-white/5 pt-6">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-premium-gold block">
                        2. Patient Details
                      </label>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-semibold text-matte-black/60 dark:text-dark-text/60">Full Name</label>
                          <input
                            type="text"
                            required
                            placeholder="Arya Sharma"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-matte-white border border-premium-gold/15 dark:border-white/10 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-premium-gold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-semibold text-matte-black/60 dark:text-dark-text/60">Email Address</label>
                          <input
                            type="email"
                            required
                            placeholder="arya@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-matte-white border border-premium-gold/15 dark:border-white/10 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-premium-gold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-semibold text-matte-black/60 dark:text-dark-text/60">WhatsApp Phone</label>
                          <input
                            type="tel"
                            required
                            placeholder="+91-98765-43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-matte-white border border-premium-gold/15 dark:border-white/10 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-premium-gold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-semibold text-matte-black/60 dark:text-dark-text/60">Core Objective</label>
                          <select
                            value={specialty}
                            onChange={(e) => setSpecialty(e.target.value)}
                            className="w-full bg-matte-white border border-premium-gold/15 dark:border-white/10 dark:bg-dark-bg text-xs p-2.5 rounded-xl focus:outline-none focus:border-premium-gold"
                          >
                            <option value="Sleep Hygiene">Sleep Cycle Improvement</option>
                            <option value="Stress Management">Bedtime Stress / Racing Thoughts</option>
                            <option value="Performance Nutrition">Workout Recovery & Supps</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-semibold text-matte-black/60 dark:text-dark-text/60">Medical notes (Optional)</label>
                        <textarea
                          placeholder="Tell the doctor about any current symptoms, routines, or goals..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                          className="w-full bg-matte-white border border-premium-gold/15 dark:border-white/10 dark:bg-dark-bg text-xs p-3 rounded-xl focus:outline-none resize-none focus:border-premium-gold"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!selectedSlot || submitting}
                      className="w-full rounded-full bg-premium-gold py-4 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-premium-gold/90 transition-all disabled:opacity-50"
                    >
                      {submitting ? 'Confirming Appointment...' : 'Confirm Free Reservation'}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="booking-success"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-panel p-10 rounded-3xl border border-premium-gold/15 shadow-xl text-center space-y-6 max-w-xl mx-auto"
            >
              <div className="mx-auto h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 shadow-sm">
                <CheckCircle size={36} />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase font-bold tracking-widest text-premium-gold">Appointment Confirmed</span>
                <h2 className="text-3xl font-serif">You're All Set!</h2>
                <p className="text-xs text-matte-black/60 dark:text-dark-text/60 leading-relaxed max-w-md mx-auto">
                  Your reservation is confirmed. A meeting invitation link has been dispatched to your email address and WhatsApp number.
                </p>
              </div>

              {/* Meeting info box */}
              <div className="p-5 rounded-2xl border border-premium-gold/15 bg-warm-beige/25 dark:bg-dark-card/20 space-y-3 text-left text-xs max-w-sm mx-auto">
                <p><strong>Patient Name:</strong> {name}</p>
                <p><strong>Appointment Time:</strong> {selectedSlot.date} at {selectedSlot.start_time}</p>
              </div>

              {/* Prep notes advice */}
              <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl text-left text-[11px] text-yellow-800 dark:text-yellow-400 max-w-sm mx-auto leading-relaxed flex gap-2 items-start">
                <FileText size={16} className="flex-shrink-0 mt-0.5 text-premium-gold" />
                <span>
                  <strong>Preparation Tip:</strong> Please ensure your camera and microphone work correctly prior to the call. Have any recent blood test reports or supplement labels handy.
                </span>
              </div>

              <button
                onClick={() => setBookingResult(null)}
                className="text-xs font-bold text-premium-gold hover:underline"
              >
                Schedule Another Call
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      <Footer />
    </>
  )
}
