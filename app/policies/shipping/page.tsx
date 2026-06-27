import React from 'react'

export default function ShippingPolicy() {
  return (
    <>
      <h1 className="font-serif text-3xl font-light text-matte-black dark:text-dark-text border-b border-premium-gold/10 pb-4">
        Shipping Policy
      </h1>
      <p className="text-[10px] text-premium-gold font-semibold uppercase tracking-wider">
        Last Updated: June 24, 2026
      </p>

      <section className="space-y-4">
        <h2 className="font-serif text-lg font-medium">1. Delivery Zones & Rates</h2>
        <p>
          We deliver to all pincodes across India. 
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Standard Shipping:</strong> ₹40 flat fee.</li>
          <li><strong>Free Shipping:</strong> Automatically applied to all orders with a subtotal of **₹350 or more** (after discount codes are applied).</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-lg font-medium">2. Dispatch & Shipping Timelines</h2>
        <p>
          Orders are processed and dispatched from our fulfillment hubs in Mumbai, Delhi, and Bangalore within **24 hours** of placement. 
        </p>
        <p>
          Typical delivery times:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Metro Cities:</strong> 2 to 3 business days.</li>
          <li><strong>Rest of India:</strong> 3 to 5 business days.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-lg font-medium">3. Order Tracking</h2>
        <p>
          As soon as your package is dispatched, we send you a tracking URL link via email and WhatsApp. We use reliable D2C courier partners including Delhivery, Blue Dart, and Shiprocket.
        </p>
      </section>
    </>
  )
}
