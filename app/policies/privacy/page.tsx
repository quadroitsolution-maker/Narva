import React from 'react'

export default function PrivacyPolicy() {
  return (
    <>
      <h1 className="font-serif text-3xl font-light text-matte-black dark:text-dark-text border-b border-premium-gold/10 pb-4">
        Privacy Policy
      </h1>
      <p className="text-[10px] text-premium-gold font-semibold uppercase tracking-wider">
        Last Updated: June 24, 2026
      </p>

      <section className="space-y-4">
        <h2 className="font-serif text-lg font-medium">1. Introduction</h2>
        <p>
          At Narva Health, we respect your privacy and are committed to protecting your personal data. This privacy policy informs you about how we handle your personal data when you visit our website, purchase our products, or schedule a doctor consultation, and outlines your privacy rights under Indian law.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-lg font-medium">2. Data We Collect</h2>
        <p>
          We may collect, use, store, and transfer different kinds of personal data about you, including:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Identity Data:</strong> Full name, gender, date of birth, and health objectives.</li>
          <li><strong>Contact Data:</strong> Shipping address, email address, and mobile phone number.</li>
          <li><strong>Transaction Data:</strong> Details about payments to and from you, and products purchased (processed securely via Razorpay).</li>
          <li><strong>Medical Data:</strong> Consultation booking slots, pre-consultation notes, and medical query logs shared with our MBBS doctors. We enforce strict internal doctor-patient confidentiality.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-lg font-medium">3. Data Security</h2>
        <p>
          We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. In addition, we limit access to your medical consultation logs to doctors and certified medical board personnel who have a clinical need to know.
        </p>
      </section>
    </>
  )
}
