import { createClient as createBrowserClient } from './supabase/client'

// Fallback mock data matching seed.sql
export const MOCK_PRODUCTS = [
  {
    id: '88888888-8888-8888-8888-888888888888',
    slug: 'melatonin-gummies',
    name: 'Narva Melatonin Sleep Gummies',
    description: 'Doctor-formulated sleep aid designed for high-performers. Made with premium L-Theanine, Chamomile, and Magnesium. Helps you fall asleep faster, wake up refreshed, and feel fully recovered without any morning grogginess.',
    price: 399.00,
    compare_price: 499.00,
    stock_qty: 150,
    low_stock_threshold: 10,
    is_subscription_eligible: true,
    is_active: true,
    images: ['https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=600&auto=format&fit=crop'],
    ingredients: [
      { name: 'Melatonin (3mg)', desc: 'Naturally regulates your sleep-wake cycle.' },
      { name: 'L-Theanine (100mg)', desc: 'Promotes relaxation and reduces bedtime anxiety.' },
      { name: 'Magnesium (50mg)', desc: 'Supports muscle relaxation and sleep depth.' },
      { name: 'Chamomile Extract', desc: 'Soothes the nervous system for gentle rest.' }
    ]
  }
];

export const MOCK_REVIEWS = [
  {
    id: '1',
    product_id: '88888888-8888-8888-8888-888888888888',
    customer_name: 'Arya Sharma',
    city: 'Mumbai',
    rating: 5,
    title: 'Absolutely life-changing!',
    body: 'As an early-stage startup founder, my sleep schedule was completely wrecked. Taking one Narva gummy 30 mins before bed has helped me fall asleep consistently. Highly recommend to anyone struggling with stress.',
    is_verified_purchase: true,
    created_at: '2026-06-23T12:00:00Z',
    admin_reply: 'Thanks for the kind words, Arya! Glad to know Narva helps you stay rested during your grind.'
  },
  {
    id: '2',
    product_id: '88888888-8888-8888-8888-888888888888',
    customer_name: 'Dr. Kabir Sen',
    city: 'Delhi',
    rating: 5,
    title: 'No morning grogginess',
    body: 'I have tried other melatonin pills before and they always made me feel like a zombie in the morning. Narvas formula with L-theanine and magnesium is incredibly clean. Feel totally refreshed at 6 AM.',
    is_verified_purchase: true,
    created_at: '2026-06-22T09:15:00Z',
    admin_reply: null
  },
  {
    id: '3',
    product_id: '88888888-8888-8888-8888-888888888888',
    customer_name: 'Rohan Mehta',
    city: 'Bangalore',
    rating: 4,
    title: 'Great taste and works well',
    body: 'Tastes like real berries, and works within 25 minutes. Docked 1 star because shipping took 4 days to Bangalore, but the product itself is top-tier.',
    is_verified_purchase: true,
    created_at: '2026-06-20T16:30:00Z',
    admin_reply: null
  }
];

export const MOCK_BLOGS = [
  {
    id: 'b1',
    slug: 'how-to-fix-your-circadian-rhythm',
    title: 'How to Fix Your Circadian Rhythm: A Doctor-Backed Guide',
    excerpt: 'Struggling to sleep and wake up at consistent times? Learn how light, timing, and simple habits can reset your internal clock naturally.',
    cover_image_url: 'https://images.unsplash.com/photo-1511295742364-92767eb89d9e?q=80&w=600&auto=format&fit=crop',
    author_name: 'Dr. Rohan Mehta, MBBS (AIIMS)',
    author_image_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=150&auto=format&fit=crop',
    published_at: '2026-06-23T08:00:00Z',
    category: 'Sleep Health',
    read_time: '5 min read',
    body: `<h2>Understanding Your Internal Clock</h2><p>Your circadian rhythm is your body's natural 24-hour internal clock that cycles between sleepiness and alertness. Resetting this clock requires consistent environmental triggers, the most powerful of which is morning sunlight.</p><h3>Key Steps to Reset:</h3><ul><li><strong>Morning Sun:</strong> View 10-15 minutes of bright morning light within 1 hour of waking.</li><li><strong>Consistent Wake Times:</strong> Go to bed and wake up at the exact same time every day, even on weekends.</li><li><strong>Dim the Screen:</strong> Turn off bright screens 1-2 hours before bed or wear blue-light blocking glasses.</li></ul>`
  },
  {
    id: 'b2',
    slug: 'blue-light-and-sleep-quality',
    title: 'How Blue Light Wrecks Your Melatonin Secretion',
    excerpt: 'Discover the scientific impact of screens on your pineal gland and how to protect your sleep score from evening blue light exposure.',
    cover_image_url: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=600&auto=format&fit=crop',
    author_name: 'Dr. Ananya Nair, MBBS (AIIMS)',
    author_image_url: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=150&auto=format&fit=crop',
    published_at: '2026-06-21T10:00:00Z',
    category: 'Science',
    read_time: '4 min read',
    body: `<h2>The Pineal Gland & Screen Light</h2><p>Our screens emit high-energy visible blue light that closely mimics daylight. When this light hits the melanopsin receptors in our eyes, it sends signals to the suprachiasmatic nucleus (SCN) to halt melatonin production, telling your body it's daytime.</p><h3>Why it Matters:</h3><p>Suppressed melatonin delays your sleep cycle by up to 2 hours, resulting in shallower REM cycles and poor morning recovery. Minimizing screen time at night is not a wellness trend—it is a physiological necessity for restorative sleep.</p>`
  }
];

export const MOCK_SLOTS = [
  { id: 's1', date: '2026-06-25', start_time: '10:00 AM', end_time: '10:30 AM', is_booked: false },
  { id: 's2', date: '2026-06-25', start_time: '11:00 AM', end_time: '11:30 AM', is_booked: false },
  { id: 's3', date: '2026-06-25', start_time: '02:00 PM', end_time: '02:30 PM', is_booked: false },
  { id: 's4', date: '2026-06-25', start_time: '03:00 PM', end_time: '03:30 PM', is_booked: false },
  { id: 's5', date: '2026-06-26', start_time: '10:00 AM', end_time: '10:30 AM', is_booked: false },
  { id: 's6', date: '2026-06-26', start_time: '01:00 PM', end_time: '01:30 PM', is_booked: false }
];

export const MOCK_COUPONS = [
  { code: 'WELCOME10', type: 'pct', value: 10, min_order_value: 299, max_discount: 100 },
  { code: 'FREESHIP', type: 'free_shipping', value: 40, min_order_value: 350, max_discount: 40 }
];

// Helper to determine if we have a real Supabase configuration
const isSupabaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://mock-supabase-url.supabase.co' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};

export async function getProducts() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createBrowserClient()
      const { data, error } = await supabase.from('products').select('*').eq('is_active', true)
      if (!error && data && data.length > 0) return data
    } catch (e) {
      console.warn("Supabase fetch products error, using mock data", e)
    }
  }
  return MOCK_PRODUCTS;
}

export async function getProductBySlug(slug: string) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createBrowserClient()
      const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single()
      if (!error && data) return data
    } catch (e) {
      console.warn("Supabase fetch product by slug error, using mock data", e)
    }
  }
  return MOCK_PRODUCTS.find(p => p.slug === slug) || MOCK_PRODUCTS[0];
}

export async function getReviews(productId: string) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createBrowserClient()
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('status', 'approved')
      if (!error && data) return data
    } catch (e) {
      console.warn("Supabase fetch reviews error, using mock data", e)
    }
  }
  return MOCK_REVIEWS.filter(r => r.product_id === productId);
}

export async function addReview(review: { product_id: string; customer_name: string; rating: number; title: string; body: string; city: string }) {
  // Save locally in mock state (client-side runtime) or send to Supabase
  if (isSupabaseConfigured()) {
    try {
      const supabase = createBrowserClient()
      const { data, error } = await supabase.from('reviews').insert([{
        product_id: review.product_id,
        rating: review.rating,
        title: review.title,
        body: review.body,
        status: 'approved', // Auto approve for testing ease
        is_verified_purchase: true
      }])
      if (!error) return { success: true, data }
    } catch (e) {
      console.error(e)
    }
  }
  
  // Local state update placeholder
  const newReview = {
    id: String(MOCK_REVIEWS.length + 1),
    product_id: review.product_id,
    customer_name: review.customer_name,
    city: review.city || 'India',
    rating: review.rating,
    title: review.title,
    body: review.body,
    is_verified_purchase: true,
    created_at: new Date().toISOString(),
    admin_reply: null
  };
  MOCK_REVIEWS.unshift(newReview);
  return { success: true, data: newReview };
}

export async function getBlogs() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createBrowserClient()
      const { data, error } = await supabase.from('blog_posts').select('*').eq('status', 'published')
      if (!error && data && data.length > 0) return data
    } catch (e) {
      console.warn(e)
    }
  }
  return MOCK_BLOGS;
}

export async function getBlogBySlug(slug: string) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createBrowserClient()
      const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).single()
      if (!error && data) return data
    } catch (e) {
      console.warn(e)
    }
  }
  return MOCK_BLOGS.find(b => b.slug === slug) || MOCK_BLOGS[0];
}

export async function getSlots() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createBrowserClient()
      const { data, error } = await supabase.from('consultation_slots').select('*').eq('is_booked', false)
      if (!error && data && data.length > 0) return data
    } catch (e) {
      console.warn(e)
    }
  }
  return MOCK_SLOTS;
}

export async function bookSlot(booking: { slotId: string; name: string; email: string; phone: string; notes: string; specialty: string }) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createBrowserClient()
      const { data, error } = await supabase.from('consultation_bookings').insert([{
        slot_id: booking.slotId,
        customer_name: booking.name,
        customer_email: booking.email,
        customer_phone: booking.phone,
        notes: `${booking.specialty} - ${booking.notes}`,
        status: 'confirmed',
        meeting_link: 'https://meet.google.com/abc-defg-hij'
      }])
      
      if (!error) {
        await supabase.from('consultation_slots').update({ is_booked: true, booking_id: (data as any)?.[0]?.id }).eq('id', booking.slotId)
        return { success: true, meetingLink: 'https://meet.google.com/abc-defg-hij' }
      }
    } catch (e) {
      console.error(e)
    }
  }

  // Fallback locally
  const slot = MOCK_SLOTS.find(s => s.id === booking.slotId);
  if (slot) {
    slot.is_booked = true;
  }
  return { success: true, meetingLink: 'https://meet.google.com/abc-defg-hij' };
}

export async function validateCoupon(code: string, subtotal: number) {
  const coupon = MOCK_COUPONS.find(c => c.code.toUpperCase() === code.toUpperCase());
  if (!coupon) return { valid: false, message: 'Invalid coupon code.' };
  if (subtotal < coupon.min_order_value) return { valid: false, message: `Minimum order value for this coupon is ₹${coupon.min_order_value}.` };
  
  let discount = 0;
  if (coupon.type === 'pct') {
    discount = (subtotal * coupon.value) / 100;
    if (coupon.max_discount && discount > coupon.max_discount) {
      discount = coupon.max_discount;
    }
  } else if (coupon.type === 'flat') {
    discount = coupon.value;
  } else if (coupon.type === 'free_shipping') {
    discount = 40; // Shipping charge threshold discount
  }

  return { valid: true, discount, type: coupon.type };
}
