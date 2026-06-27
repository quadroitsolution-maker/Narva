'use client'

import React, { useState } from 'react'
import { Calculator, Moon, Heart, Info } from 'lucide-react'

export default function HealthCalculators() {
  const [activeTab, setActiveTab] = useState<'sleep' | 'bmi'>('sleep')

  // Sleep Calculator States
  const [wakeHour, setWakeHour] = useState('07')
  const [wakeMinute, setWakeMinute] = useState('00')
  const [wakePeriod, setWakePeriod] = useState('AM')
  const [sleepCycles, setSleepCycles] = useState<string[]>([])

  // BMI States
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [bmiResult, setBmiResult] = useState<{ bmi: number; category: string; color: string } | null>(null)

  // Sleep logic: 1 cycle = 90 mins. Average human needs 5-6 cycles.
  // We calculate backward from wake time. It takes 15 mins to fall asleep.
  const calculateSleepTimes = () => {
    let hour = parseInt(wakeHour)
    const minute = parseInt(wakeMinute)
    
    if (wakePeriod === 'PM' && hour !== 12) hour += 12
    if (wakePeriod === 'AM' && hour === 12) hour = 0

    const targetDate = new Date()
    targetDate.setHours(hour, minute, 0, 0)

    const times: string[] = []
    // Calculate for 6, 5, and 4 cycles back (9, 7.5, 6 hours)
    const cycles = [6, 5, 4]
    
    cycles.forEach(c => {
      // 90 minutes * c + 15 mins to fall asleep
      const sleepTime = new Date(targetDate.getTime() - (c * 90 * 60 * 1000) - (15 * 60 * 1000))
      let h = sleepTime.getHours()
      const m = sleepTime.getMinutes()
      const p = h >= 12 ? 'PM' : 'AM'
      h = h % 12
      h = h ? h : 12 // 0 hour should be 12
      const formattedM = m < 10 ? `0${m}` : m
      times.push(`${h}:${formattedM} ${p} (${c} cycles - ${c * 1.5} hrs sleep)`)
    })

    setSleepCycles(times)
  }

  // BMI Logic
  const calculateBmi = (e: React.FormEvent) => {
    e.preventDefault()
    const w = parseFloat(weight)
    const h = parseFloat(height) / 100 // cm to meters
    
    if (w > 0 && h > 0) {
      const bmi = parseFloat((w / (h * h)).toFixed(1))
      let category = 'Normal Weight'
      let color = 'text-green-600 dark:text-green-400'

      if (bmi < 18.5) {
        category = 'Underweight'
        color = 'text-blue-500'
      } else if (bmi >= 25 && bmi < 29.9) {
        category = 'Overweight'
        color = 'text-orange-500'
      } else if (bmi >= 30) {
        category = 'Obese'
        color = 'text-red-500'
      }

      setBmiResult({ bmi, category, color })
    }
  }

  const resetBmi = () => {
    setWeight('')
    setHeight('')
    setBmiResult(null)
  }

  return (
    <div className="bg-matte-white dark:bg-dark-bg p-6 rounded-2xl border border-premium-gold/15 dark:border-white/5 max-w-xl mx-auto shadow-xl">
      {/* Tabs */}
      <div className="flex border-b border-premium-gold/10 dark:border-white/5 mb-6">
        <button
          onClick={() => setActiveTab('sleep')}
          className={`flex-1 pb-3 text-sm font-semibold tracking-wide border-b-2 transition-all flex items-center justify-center gap-2 ${
            activeTab === 'sleep'
              ? 'border-premium-gold text-premium-gold'
              : 'border-transparent text-matte-black/50 dark:text-dark-text/50'
          }`}
        >
          <Moon size={16} /> Sleep Cycle Calculator
        </button>
        <button
          onClick={() => setActiveTab('bmi')}
          className={`flex-1 pb-3 text-sm font-semibold tracking-wide border-b-2 transition-all flex items-center justify-center gap-2 ${
            activeTab === 'bmi'
              ? 'border-premium-gold text-premium-gold'
              : 'border-transparent text-matte-black/50 dark:text-dark-text/50'
          }`}
        >
          <Calculator size={16} /> BMI Calculator
        </button>
      </div>

      {/* Sleep Cycle Panel */}
      {activeTab === 'sleep' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-serif">Plan Your Sleep Cycles</h3>
            <p className="text-xs text-matte-black/60 dark:text-dark-text/60 leading-relaxed">
              Waking up in the middle of a 90-minute sleep cycle causes morning fatigue and grogginess. Use this calculator to identify when you should sleep to wake up refreshed.
            </p>
          </div>

          <div className="flex gap-3 justify-center items-center py-2">
            <span className="text-xs font-semibold">I want to wake up at:</span>
            
            {/* Hour select */}
            <select
              value={wakeHour}
              onChange={(e) => setWakeHour(e.target.value)}
              className="bg-warm-beige/30 dark:bg-dark-card border border-premium-gold/10 rounded-lg p-2 text-xs focus:outline-none focus:border-premium-gold"
            >
              {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>

            <span className="font-bold">:</span>

            {/* Minute select */}
            <select
              value={wakeMinute}
              onChange={(e) => setWakeMinute(e.target.value)}
              className="bg-warm-beige/30 dark:bg-dark-card border border-premium-gold/10 rounded-lg p-2 text-xs focus:outline-none focus:border-premium-gold"
            >
              {['00', '15', '30', '45'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            {/* AM/PM select */}
            <select
              value={wakePeriod}
              onChange={(e) => setWakePeriod(e.target.value)}
              className="bg-warm-beige/30 dark:bg-dark-card border border-premium-gold/10 rounded-lg p-2 text-xs focus:outline-none focus:border-premium-gold"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>

          <button
            onClick={calculateSleepTimes}
            className="w-full rounded-full bg-premium-gold py-2.5 text-xs font-bold text-white shadow-md hover:bg-premium-gold/90 transition-all uppercase"
          >
            Calculate Bedtimes
          </button>

          {sleepCycles.length > 0 && (
            <div className="space-y-3 pt-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-premium-gold text-center">Recommended Bedtimes</h4>
              <div className="grid gap-2">
                {sleepCycles.map((time, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs font-medium text-center ${
                      idx === 1
                        ? 'border-premium-gold bg-premium-gold/5 text-premium-gold font-semibold'
                        : 'border-premium-gold/10 bg-warm-beige/10 dark:bg-dark-card/30'
                    }`}
                  >
                    {idx === 1 && <span className="block text-[9px] uppercase tracking-widest font-bold mb-1">Recommended (5 Cycles)</span>}
                    {time}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-center text-matte-black/40 dark:text-dark-text/40 flex items-center justify-center gap-1">
                <Info size={10} /> Includes 15 minutes of average latency to fall asleep.
              </p>
            </div>
          )}
        </div>
      )}

      {/* BMI Panel */}
      {activeTab === 'bmi' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-serif">Body Mass Index Calculator</h3>
            <p className="text-xs text-matte-black/60 dark:text-dark-text/60 leading-relaxed">
              Your BMI is a quick indicator of general weight categories. Keep in mind that muscle mass can impact this score.
            </p>
          </div>

          {!bmiResult ? (
            <form onSubmit={calculateBmi} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-matte-black/60 dark:text-dark-text/60">Height (cm)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-warm-beige/30 dark:bg-dark-card border border-premium-gold/10 rounded-xl p-3 text-xs focus:outline-none focus:border-premium-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-matte-black/60 dark:text-dark-text/60">Weight (kg)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-warm-beige/30 dark:bg-dark-card border border-premium-gold/10 rounded-xl p-3 text-xs focus:outline-none focus:border-premium-gold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-premium-gold py-2.5 text-xs font-bold text-white shadow-md hover:bg-premium-gold/90 transition-all uppercase"
              >
                Compute BMI
              </button>
            </form>
          ) : (
            <div className="space-y-6 text-center">
              <div className="mx-auto h-24 w-24 rounded-full border-4 border-premium-gold flex items-center justify-center flex-col">
                <span className="text-2xl font-serif font-bold text-premium-gold">{bmiResult.bmi}</span>
                <span className="text-[9px] uppercase tracking-wider text-matte-black/50 dark:text-dark-text/50 font-bold">BMI</span>
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase font-bold tracking-widest text-premium-gold">Category</span>
                <h3 className={`text-lg font-serif ${bmiResult.color}`}>{bmiResult.category}</h3>
                <p className="text-xs text-matte-black/60 dark:text-dark-text/60 leading-relaxed max-w-sm mx-auto">
                  {bmiResult.category === 'Normal Weight' 
                    ? 'Great job! Your weight is in a healthy range. Ensure you maintain dynamic sleep cycles and general nutrient support.'
                    : 'Consider consulting a dietitian or physician. A balanced sleep cycle helps regulate metabolic health and appetite hormones.'}
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={resetBmi}
                  className="text-xs font-semibold text-matte-black/60 hover:text-premium-gold transition-colors dark:text-dark-text/60"
                >
                  Recalculate
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
