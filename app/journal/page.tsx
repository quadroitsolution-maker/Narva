'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Search, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import AiAssistant from '@/components/AiAssistant'
import { getBlogs } from '@/lib/db'

export default function JournalHub() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    async function loadBlogs() {
      const data = await getBlogs()
      setBlogs(data)
    }
    loadBlogs()
  }, [])

  const categories = ['All', 'Sleep Health', 'Science', 'Nutrition']

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(search.toLowerCase()) || 
                          blog.excerpt.toLowerCase().includes(search.toLowerCase())
    const matchesCat = selectedCategory === 'All' || blog.category === selectedCategory
    return matchesSearch && matchesCat
  })

  return (
    <>
      <Navbar />
      <CartDrawer />
      <AiAssistant />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-12">
        
        {/* Header */}
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-premium-gold/10 px-3 py-1 text-xs font-semibold tracking-wider text-premium-gold uppercase">
            <BookOpen size={12} /> Narva Journal
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light">Doctor-Led Health Insights</h1>
          <p className="text-sm text-matte-black/60 dark:text-dark-text/60 leading-relaxed">
            Science-backed articles, sleep research breakdowns, and metabolic performance guides written by clinical medicos.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center border-b border-premium-gold/10 dark:border-white/5 pb-6">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide border transition-all ${
                  selectedCategory === cat
                    ? 'bg-premium-gold text-white border-premium-gold shadow-sm'
                    : 'border-premium-gold/10 text-matte-black/60 hover:border-premium-gold hover:text-premium-gold dark:text-dark-text/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-2 border border-premium-gold/20 dark:border-white/10 rounded-full bg-matte-white px-3 py-2 w-full sm:w-64 dark:bg-dark-bg">
            <Search size={14} className="text-premium-gold" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-xs text-matte-black focus:outline-none dark:text-dark-text"
            />
          </div>
        </div>

        {/* Article Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-20 text-xs text-matte-black/50 dark:text-dark-text/50">
            No articles found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {filteredBlogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/journal/${blog.slug}`}
                className="glass-panel text-left rounded-3xl overflow-hidden shadow-md hover:scale-[1.01] transition-transform flex flex-col group border border-premium-gold/10 hover:border-premium-gold/30"
              >
                <div className="relative h-48 w-full bg-warm-beige/25 overflow-hidden">
                  <Image
                    src={blog.cover_image_url}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-w-4xl) 100vw, 50vw"
                  />
                </div>
                
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-premium-gold">{blog.category}</span>
                    <h3 className="font-serif text-base font-semibold leading-snug group-hover:text-premium-gold transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-[11px] text-matte-black/60 dark:text-dark-text/65 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-premium-gold/10 dark:border-white/10 text-[10px] text-matte-black/50 dark:text-dark-text/50 font-medium">
                    <span>{blog.author_name}</span>
                    <span className="flex items-center gap-1">Read Article <ArrowRight size={10} /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </>
  )
}
