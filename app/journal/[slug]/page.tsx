'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, BookOpen, Share2, Link2, MessageSquare, Twitter } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import AiAssistant from '@/components/AiAssistant'
import { getBlogBySlug, getBlogs } from '@/lib/db'

export default function BlogArticle() {
  const { slug } = useParams()
  const [blog, setBlog] = useState<any>(null)
  const [related, setRelated] = useState<any[]>([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function loadBlogData() {
      if (!slug) return
      const data = await getBlogBySlug(slug as string)
      setBlog(data)

      const allBlogs = await getBlogs()
      const filtered = allBlogs.filter((b: any) => b.slug !== slug && b.category === data?.category).slice(0, 2)
      setRelated(filtered)
    }
    loadBlogData()
  }, [slug])

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!blog) {
    return (
      <div className="flex h-screen items-center justify-center bg-matte-white dark:bg-dark-bg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-premium-gold" />
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <CartDrawer />
      <AiAssistant />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Back and Category */}
        <div className="flex justify-between items-center text-xs">
          <Link href="/journal" className="text-matte-black/50 hover:text-premium-gold flex items-center gap-1.5 dark:text-dark-text/50">
            <ArrowLeft size={14} /> Back to Journal
          </Link>
          <span className="bg-premium-gold/10 text-premium-gold font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            {blog.category}
          </span>
        </div>

        {/* Title and Author Header */}
        <div className="space-y-6 text-left">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light leading-tight tracking-tight text-matte-black dark:text-dark-text">
            {blog.title}
          </h1>

          <div className="flex justify-between items-center border-y border-premium-gold/10 dark:border-white/5 py-4">
            <div className="flex items-center space-x-3">
              <div className="relative h-10 w-10 rounded-full overflow-hidden border border-premium-gold/20 bg-warm-beige/20">
                <Image src={blog.author_image_url} alt={blog.author_name} fill className="object-cover" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-semibold">{blog.author_name}</span>
                <span className="block text-[9px] text-matte-black/40 dark:text-dark-text/40 font-bold uppercase tracking-widest">Medical Board Reviewer</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-matte-black/50 dark:text-dark-text/50">
              <button
                onClick={copyLink}
                className="hover:text-premium-gold transition-colors flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider"
                title="Copy Article Link"
              >
                <Link2 size={15} /> {copied ? 'Copied!' : 'Copy'}
              </button>
              <a
                href={`https://wa.me/?text=Check%20out%20this%20medical%20article%20by%20Narva:%20${encodeURIComponent(blog.title)}%20${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-premium-gold transition-colors"
                title="Share on WhatsApp"
              >
                <MessageSquare size={15} />
              </a>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative h-64 sm:h-[400px] w-full rounded-3xl overflow-hidden border border-premium-gold/10 shadow-lg bg-warm-beige/25">
          <Image src={blog.cover_image_url} alt={blog.title} fill className="object-cover" sizes="100vw" priority />
        </div>

        {/* Article Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
          
          {/* Table of contents (desktop only) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-28 space-y-4 text-left border-l border-premium-gold/10 pl-4 py-1 text-xs">
            <h4 className="font-bold text-premium-gold uppercase tracking-wider text-[10px]">Table of Contents</h4>
            <div className="space-y-2.5 text-matte-black/50 dark:text-dark-text/50">
              <a href="#section-1" className="block hover:text-premium-gold transition-colors">1. Restorative Physiology</a>
              <a href="#section-2" className="block hover:text-premium-gold transition-colors">2. Melatonin & Screening</a>
              <a href="#section-3" className="block hover:text-premium-gold transition-colors">3. Clinical Sleep Protocol</a>
            </div>
          </div>

          {/* Article Text Content */}
          <div 
            className="lg:col-span-9 prose prose-stone dark:prose-invert max-w-none text-left space-y-6 text-sm leading-relaxed text-matte-black/75 dark:text-dark-text/75"
            dangerouslySetInnerHTML={{ __html: blog.body }}
          />

        </div>

        {/* Related Posts Section */}
        {related.length > 0 && (
          <section className="border-t border-premium-gold/10 dark:border-white/5 pt-12 space-y-6 text-left">
            <h3 className="font-serif text-lg font-medium">Keep Reading</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((post) => (
                <Link
                  key={post.id}
                  href={`/journal/${post.slug}`}
                  className="glass-panel p-5 rounded-2xl border border-premium-gold/10 hover:border-premium-gold/30 flex gap-4 items-center group transition-colors"
                >
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-warm-beige/25 flex-shrink-0">
                    <Image src={post.cover_image_url} alt={post.title} fill className="object-cover" />
                  </div>
                  <div>
                    <span className="text-[8px] uppercase font-bold tracking-widest text-premium-gold">{post.category}</span>
                    <h4 className="font-serif text-xs font-semibold group-hover:text-premium-gold transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />
    </>
  )
}
