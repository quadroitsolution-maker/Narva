import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import AiAssistant from '@/components/AiAssistant'

export default function PoliciesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <AiAssistant />
      
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <article className="prose prose-stone dark:prose-invert max-w-none text-left space-y-8 text-xs leading-relaxed text-matte-black/75 dark:text-dark-text/75">
          {children}
        </article>
      </main>

      <Footer />
    </>
  )
}
