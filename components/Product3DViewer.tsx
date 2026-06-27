'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

export default function Product3DViewer() {
  const [rotation, setRotation] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Rotate slightly on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const angle = (x / rect.width) * 45 // max 45 deg rotation
      setRotation(angle)
    }

    // Auto rotate on scroll
    const handleScroll = () => {
      const scrolled = window.scrollY
      setRotation(scrolled * 0.1) // 0.1 deg per px scrolled
    }

    window.addEventListener('scroll', handleScroll)
    const container = containerRef.current
    if (container) {
      container.addEventListener('mousemove', handleMouseMove)
      container.addEventListener('mouseleave', () => setRotation(0))
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="relative flex h-[350px] w-full items-center justify-center cursor-pointer select-none perspective-[1000px] overflow-visible"
    >
      {/* 3D Container */}
      <motion.div
        animate={{ rotateY: rotation }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="relative h-[240px] w-[140px] transform-style-3d shadow-2xl rounded-[30px]"
        style={{
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Soft Lighting Backglow */}
        <div className="absolute inset-0 bg-premium-gold/20 blur-3xl -z-10 rounded-full scale-150 animate-pulse" />

        {/* Bottle Body Front */}
        <div 
          className="absolute inset-0 rounded-[30px] border border-premium-gold/30 flex flex-col justify-between p-6 shadow-inner text-white"
          style={{
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #1e130c 0%, #9a683a 50%, #1e130c 100%)',
            transform: 'translateZ(10px)',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.5)'
          }}
        >
          {/* Cap connector */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-3 bg-premium-gold/80 rounded-t-md" />
          
          {/* Logo */}
          <span className="font-serif text-lg font-light italic tracking-wider block text-center border-b border-white/10 pb-2">
            narva
          </span>
          
          {/* Product Label Detail */}
          <div className="space-y-1 text-center py-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-premium-gold block">Sleep</span>
            <span className="text-[9px] font-medium text-white/70 block">Melatonin Gummies</span>
          </div>

          <span className="text-[8px] uppercase tracking-widest font-bold text-center block text-white/50">
            30 Gummies
          </span>
        </div>

        {/* Bottle Body Back */}
        <div 
          className="absolute inset-0 rounded-[30px] border border-premium-gold/30 flex flex-col justify-between p-6 shadow-inner text-white/80 text-left"
          style={{
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #1e130c 0%, #9a683a 50%, #1e130c 100%)',
            transform: 'rotateY(180deg) translateZ(10px)',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
          }}
        >
          <div className="space-y-2 text-[8px] pt-4 leading-tight font-sans">
            <span className="text-[10px] uppercase font-bold text-premium-gold block">Supplement Facts</span>
            <p>Serving Size: 1 Gummy</p>
            <p>Melatonin: 3mg</p>
            <p>L-Theanine: 100mg</p>
            <p>Magnesium: 50mg</p>
          </div>

          <span className="text-[7px] text-center block opacity-50 border-t border-white/10 pt-2">
            Doctor-Formulated
          </span>
        </div>

        {/* Matte Gold Bottle Cap */}
        <div 
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-7 rounded-lg border border-premium-gold/40 shadow-md"
          style={{
            background: 'linear-gradient(to right, #9a763a, #e6c587, #9a763a)',
            transform: 'translateZ(15px)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
          }}
        />
      </motion.div>

      {/* Shadow */}
      <div 
        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[110px] h-[15px] bg-black/30 rounded-full blur-md"
        style={{
          transform: `scale(${1 + Math.abs(rotation) * 0.005})`
        }}
      />
    </div>
  )
}
