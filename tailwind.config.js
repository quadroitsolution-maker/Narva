/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light theme brand colors
        'matte-white': '#FAF9F5',
        'warm-beige': '#F4EFE6',
        'matte-black': '#1A1A1A',
        'premium-gold': '#C5A880',
        'soft-blue': '#E3ECF5',
        
        // Dark theme brand colors
        'dark-bg': '#121212',
        'dark-card': '#1E1E1E',
        'dark-text': '#F5F5F5',
        'dark-blue': '#2A3845',
      },
      fontFamily: {
        serif: ['var(--font-heading)', 'Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'Plus Jakarta Sans', 'Inter', 'SF Pro', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(20px)',
      },
    },
  },
  plugins: [],
}
