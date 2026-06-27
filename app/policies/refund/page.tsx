import React from 'react'

export default function RefundPolicy() {
  return (
    <>
      <h1 className="font-serif text-3xl font-light text-matte-black dark:text-dark-text border-b border-premium-gold/10 pb-4">
        Return & Refund Policy
      </h1>
      <p className="text-[10px] text-premium-gold font-semibold uppercase tracking-wider">
        Last Updated: June 24, 2026
      </p>

      <section className="space-y-4">
        <h2 className="font-serif text-lg font-medium">1. Return Window</h2>
        <p>
          We offer a **15-day return window** from the date of delivery. Because our sleep gummies are ingestible food products, we can only accept returns for bottles that are **unopened, with the seal intact**, to ensure safety.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-lg font-medium">2. Refund Process</h2>
        <p>
          To initiate a return, please send an email to <a href="mailto:support@narva.in" className="text-premium-gold hover:underline">support@narva.in</a> with your order ID. Once we receive the returned package at our fulfillment center and verify its seal status, we will process your refund.
        </p>
        <p>
          Refunds will be credited to your original payment method (bank account, UPI, or card) within **5-7 business days** via Razorpay.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-lg font-medium">3. Subscription Cancellation</h2>
        <p>
          You can pause, reschedule, or cancel your monthly sleep gummies subscription at any time without any fees. Go to your customer profile dashboard and click "Cancel Subscription". To avoid being charged for your next cycle, please cancel at least **24 hours** before your scheduled renewal charge date.
        </p>
      </section>
    </>
  )
}
