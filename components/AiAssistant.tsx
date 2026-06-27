'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Sparkles, User, ShieldAlert, Stethoscope } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const FAQ_PROMPTS = [
  { label: 'Are gummies addictive?', text: 'Are Narva Melatonin sleep gummies addictive?' },
  { label: 'What is L-Theanine?', text: 'What is the role of L-Theanine in sleep support?' },
  { label: 'How to consult a doctor?', text: 'How can I book a consultation with a Narva doctor?' },
  { label: 'Tell me about ingredients', text: 'What ingredients are in the sleep gummies?' }
];

const BOT_KNOWLEDGE: Record<string, string> = {
  addictive: "No. Narva Melatonin Gummies are 100% non-habit forming. We use a low dose (3mg) of melatonin combined with calming amino acids like L-Theanine and Magnesium, which support your body's natural sleep rhythm rather than overriding it. You can safely stop taking them anytime.",
  theanine: "L-Theanine is an amino acid naturally found in green tea leaves. It increases levels of GABA, serotonin, and dopamine in the brain. This promotes deep relaxation, calms racing thoughts, and helps you ease into sleep without causing next-day grogginess.",
  consultation: "Narva provides free, unlimited virtual consultations with qualified medical practitioners (MBBS). You can schedule a 30-minute private video call directly on our booking page (/consultation) to discuss sleep hygiene, stress, or nutrition.",
  ingredients: "Each serving of Narva Sleep Gummies contains: \n• Melatonin (3mg) for sleep cycle regulation\n• L-Theanine (100mg) for relaxation & anxiety relief\n• Magnesium (50mg) for muscle recovery\n• Chamomile extract for nervous system support. \nOur formula is doctor-approved, gluten-free, and contains no artificial coloring.",
  default: "Thank you for reaching out to Narva Medical Support. I am an AI trained on Narva's doctor-led clinical research database. \n\nFor specific diagnostic advice or custom prescriptions, we highly recommend booking a free video call with our certified doctors via our Consultation Portal."
};

export default function AiAssistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I am Dr. Narva's AI Research Assistant. Ask me anything about our ingredients, sleep science, or booking doctor consultations."
    }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = (text: string) => {
    if (!text.trim()) return
    
    const userMessage: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate doctor-led scientific response latency
    setTimeout(() => {
      let replyText = BOT_KNOWLEDGE.default;
      const lower = text.toLowerCase();
      
      if (lower.includes('addict') || lower.includes('habit')) {
        replyText = BOT_KNOWLEDGE.addictive;
      } else if (lower.includes('theanine') || lower.includes('l-theanine')) {
        replyText = BOT_KNOWLEDGE.theanine;
      } else if (lower.includes('consult') || lower.includes('book') || lower.includes('doctor')) {
        replyText = BOT_KNOWLEDGE.consultation;
      } else if (lower.includes('ingredient') || lower.includes('formula') || lower.includes('magnesium') || lower.includes('melatonin')) {
        replyText = BOT_KNOWLEDGE.ingredients;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: replyText }])
      setIsTyping(false)
    }, 1000)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.85 }}
            className="mb-4 h-[500px] w-[350px] sm:w-[400px] rounded-2xl border border-premium-gold/15 bg-matte-white shadow-2xl overflow-hidden flex flex-col dark:bg-dark-bg dark:border-white/5"
          >
            {/* Header */}
            <div className="bg-premium-gold p-4 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <Stethoscope size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-wide flex items-center gap-1">
                    Narva Medical AI <Sparkles size={12} className="text-white fill-white" />
                  </h3>
                  <span className="text-[10px] text-white/80 font-medium">Doctor-backed knowledge base</span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1 hover:bg-white/20 transition-colors"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-500/10 border-b border-yellow-500/15 p-2 px-3 flex items-center gap-2 text-[10px] text-yellow-700 dark:text-yellow-400">
              <ShieldAlert size={14} className="flex-shrink-0" />
              <span>AI advice only. Consult our certified doctors for medical prescriptions.</span>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-premium-gold text-white rounded-br-none'
                        : 'bg-warm-beige/50 text-matte-black rounded-bl-none dark:bg-dark-card dark:text-dark-text'
                    } whitespace-pre-line`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-warm-beige/30 text-matte-black rounded-2xl rounded-bl-none px-4 py-2.5 dark:bg-dark-card/50">
                    <span className="flex gap-1 items-center">
                      <span className="h-1.5 w-1.5 bg-premium-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-1.5 w-1.5 bg-premium-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-1.5 w-1.5 bg-premium-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length === 1 && (
              <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-premium-gold/15 dark:border-white/5 pt-3">
                {FAQ_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.label}
                    onClick={() => handleSend(prompt.text)}
                    className="text-[10px] bg-warm-beige/40 border border-premium-gold/10 hover:border-premium-gold hover:text-premium-gold rounded-full px-2.5 py-1 text-matte-black/70 transition-all dark:bg-dark-card/30 dark:text-dark-text/70"
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 border-t border-premium-gold/10 flex gap-2 items-center bg-warm-beige/10 dark:border-white/5 dark:bg-dark-card/20"
            >
              <input
                type="text"
                placeholder="Ask about sleep cycles, ingredients..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-matte-white border border-premium-gold/15 dark:border-white/10 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-full focus:outline-none focus:border-premium-gold"
              />
              <button
                type="submit"
                className="bg-premium-gold text-white p-2.5 rounded-full hover:bg-premium-gold/90 transition-colors shadow-md flex items-center justify-center"
                aria-label="Send message"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="bg-premium-gold text-white p-4 rounded-full shadow-2xl flex items-center justify-center relative hover:bg-premium-gold/90 transition-colors"
        aria-label="Open assistant"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
        {!open && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-green-500 border-2 border-matte-white dark:border-dark-bg" />
        )}
      </motion.button>
    </div>
  )
}
