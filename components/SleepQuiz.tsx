'use client'

import React, { useState } from 'react'
import { Check, ArrowRight, RotateCcw, ShoppingCart, Stethoscope } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/lib/store'

interface Question {
  id: number;
  question: string;
  options: { label: string; score: number }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What is your primary sleep obstacle?",
    options: [
      { label: "Can't shut my brain down / racing thoughts", score: 20 },
      { label: "Waking up in the middle of the night", score: 15 },
      { label: "Feeling exhausted despite sleeping 8 hours", score: 10 },
      { label: "Irregular sleep schedule due to night shift/travel", score: 5 }
    ]
  },
  {
    id: 2,
    question: "What is your screen habit 1 hour before bed?",
    options: [
      { label: "Active scrolling on phone / laptop in bed", score: 5 },
      { label: "Watching TV / streaming shows", score: 15 },
      { label: "Wearing blue-light blocking glasses while reading", score: 30 },
      { label: "No screens at all - book or meditation", score: 40 }
    ]
  },
  {
    id: 3,
    question: "How do you feel 30 minutes after waking up?",
    options: [
      { label: "Groggy, need caffeine immediately to function", score: 10 },
      { label: "A bit slow, takes an hour to fully wake up", score: 20 },
      { label: "Reasonably alert and ready for the day", score: 35 },
      { label: "Energized and awake instantly", score: 40 }
    ]
  }
];

export default function SleepQuiz({ onClose }: { onClose?: () => void }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAnswer = (score: number) => {
    const nextAnswers = [...answers, score]
    setAnswers(nextAnswers)
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1)
    } else {
      setStep(QUESTIONS.length)
    }
  }

  const resetQuiz = () => {
    setStep(0)
    setAnswers([])
    setAdded(false)
  }

  // Calculate results
  const totalScore = answers.reduce((acc, val) => acc + val, 0)
  const maxScore = QUESTIONS.reduce((acc, q) => acc + Math.max(...q.options.map(o => o.score)), 0)
  const sleepPercentage = Math.round((totalScore / maxScore) * 100)

  let title = "Restless Sleeper"
  let description = "Your circadian rhythm is out of sync. Racing thoughts and screens before bed are likely suppressing your natural melatonin production. We recommend a strict 10 PM screen boundary."
  
  if (sleepPercentage >= 50 && sleepPercentage < 80) {
    title = "Stressed High-Performer"
    description = "You have decent sleep hygiene, but daytime stress and caffeine timing are causing micro-arousals at night, affecting your deep sleep score. Consider adding magnesium to your evening routine."
  } else if (sleepPercentage >= 80) {
    title = "Sleek Deep-Sleeper"
    description = "Fantastic work! Your sleep hygiene is excellent. You manage evening light well. Narva gummies can be used occasionally as a recovery tool after heavy grinds or travel."
  }

  const handleAddToCart = () => {
    // Add melatonin gummies product (mock product id from seed)
    addItem({
      productId: '88888888-8888-8888-8888-888888888888',
      name: 'Narva Melatonin Sleep Gummies',
      price: 399.00,
      image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=600&auto=format&fit=crop',
      isSubscription: false,
      quantity: 1
    })
    setAdded(true)
  }

  return (
    <div className="bg-matte-white dark:bg-dark-bg p-6 rounded-2xl border border-premium-gold/15 dark:border-white/5 max-w-xl mx-auto shadow-xl">
      <AnimatePresence mode="wait">
        {step < QUESTIONS.length ? (
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Progress bar */}
            <div className="w-full bg-warm-beige/30 dark:bg-dark-card rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-premium-gold h-full transition-all duration-300"
                style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>

            <span className="text-[10px] uppercase font-bold tracking-widest text-premium-gold">
              Question {step + 1} of {QUESTIONS.length}
            </span>

            <h3 className="text-xl font-serif font-light text-matte-black dark:text-dark-text leading-snug">
              {QUESTIONS[step].question}
            </h3>

            <div className="space-y-3">
              {QUESTIONS[step].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option.score)}
                  className="w-full text-left p-4 rounded-xl border border-premium-gold/10 hover:border-premium-gold bg-warm-beige/10 hover:bg-warm-beige/30 dark:bg-dark-card/30 dark:hover:bg-dark-card/50 transition-all text-xs font-medium flex justify-between items-center"
                >
                  <span>{option.label}</span>
                  <ArrowRight size={14} className="text-premium-gold opacity-0 hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-center"
          >
            <div className="mx-auto h-24 w-24 rounded-full border-4 border-premium-gold flex items-center justify-center flex-col shadow-inner">
              <span className="text-2xl font-serif font-bold text-premium-gold">{sleepPercentage}%</span>
              <span className="text-[9px] uppercase tracking-wider text-matte-black/50 dark:text-dark-text/55 font-bold">Sleep Score</span>
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-premium-gold">Your Profile</span>
              <h3 className="text-xl font-serif">{title}</h3>
              <p className="text-xs text-matte-black/60 dark:text-dark-text/60 leading-relaxed max-w-md mx-auto">
                {description}
              </p>
            </div>

            {/* Recommendation box */}
            <div className="p-4 rounded-xl border border-premium-gold/15 bg-warm-beige/25 dark:bg-dark-card/20 space-y-4 max-w-sm mx-auto text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-premium-gold flex items-center gap-1.5">
                <Stethoscope size={13} className="text-premium-gold" /> Doctor-Prescribed Routine
              </h4>
              <ul className="text-xs space-y-2 text-matte-black/75 dark:text-dark-text/75">
                <li className="flex gap-2 items-start">
                  <Check size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Take 1 Narva Melatonin Gummy 30 mins before bed.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <Check size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Expose eyes to bright sun before 9 AM (10 mins).</span>
                </li>
                <li className="flex gap-2 items-start">
                  <Check size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Perform 4-7-8 breathing cycles at bedtime.</span>
                </li>
              </ul>
              
              <button
                onClick={handleAddToCart}
                disabled={added}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-premium-gold py-2.5 text-xs font-semibold text-white hover:bg-premium-gold/90 transition-all disabled:bg-green-600 shadow-md"
              >
                {added ? (
                  <>
                    <Check size={14} /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart size={14} /> Add Prescribed Gummies (₹399)
                  </>
                )}
              </button>
            </div>

            <div className="flex justify-center gap-4 pt-2">
              <button
                onClick={resetQuiz}
                className="text-xs font-bold text-matte-black/60 hover:text-premium-gold flex items-center gap-1.5 transition-colors dark:text-dark-text/60"
              >
                <RotateCcw size={14} /> Retake Quiz
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-xs font-bold text-premium-gold hover:underline"
                >
                  Done
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
