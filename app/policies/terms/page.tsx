import React from 'react'

export default function TermsAndConditions() {
  return (
    <>
      <h1 className="font-serif text-3xl font-light text-matte-black dark:text-dark-text border-b border-premium-gold/10 pb-4">
        Terms & Conditions
      </h1>
      <p className="text-[10px] text-premium-gold font-semibold uppercase tracking-wider">
        Last Updated: June 24, 2026
      </p>

      <section className="space-y-4">
        <h2 className="font-serif text-lg font-medium">1. Agreement to Terms</h2>
        <p>
          These Terms & Conditions constitute a legally binding agreement made between you and Narva Health concerning your access to and use of the website, including online store transactions and doctor consultation scheduling.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-lg font-medium">2. Medical Disclaimer</h2>
        <p>
          All information on this site, including ingredient breakdowns, sleep calculator outputs, and blog articles, is intended for educational purposes only. It is not a substitute for professional medical diagnosis or prescription. 
        </p>
        <p>
          Our melatonin gummies are dietary supplements formulated to support healthy sleep cycles. They are not intended to cure chronic clinical insomnia or replace custom medications prescribed by your psychiatrist.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-lg font-medium">3. Online Store Terms</h2>
        <p>
          All prices listed are in Indian Rupees (INR) and are inclusive of GST. We reserve the right to limit the order quantities of any products we provide. Payment validation is managed securely via Razorpay APIs. Subscription plans renew automatically every 30 days unless paused or cancelled.
        </p>
      </section>
    </>
  )
}
