import { createClient as createBrowserClient } from './supabase/client'

// ─── Static fallback seed data (used when Supabase is unavailable in local dev) ───

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
]

export const MOCK_REVIEWS = [
  {
    id: 'v1',
    product_id: '88888888-8888-8888-8888-888888888888',
    customer_name: 'Priya Sharma',
    city: 'Mumbai',
    rating: 5,
    title: 'My night ritual!',
    body: 'I take 1 gummy every night and wake up feeling so refreshed. The science behind this is actual gold.',
    is_verified_purchase: true,
    created_at: '2026-06-25T10:00:00Z',
    status: 'approved',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-lying-in-bed-and-smiling-41855-large.mp4',
    admin_reply: null
  },
  {
    id: 'v2',
    product_id: '88888888-8888-8888-8888-888888888888',
    customer_name: 'Rohan Malhotra',
    city: 'Bangalore',
    rating: 5,
    title: 'Startup life saver',
    body: 'Shattered sleep is now a thing of the past. Absolute sanity saver.',
    is_verified_purchase: true,
    created_at: '2026-06-24T18:30:00Z',
    status: 'approved',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-sleeping-in-bed-41857-large.mp4',
    admin_reply: null
  },
  {
    id: '1',
    product_id: '88888888-8888-8888-8888-888888888888',
    customer_name: 'Arya Sharma',
    city: 'Mumbai',
    rating: 5,
    title: 'Absolutely life-changing!',
    body: 'As an early-stage startup founder, my sleep schedule was completely wrecked. Taking one Narva gummy 30 mins before bed has helped me fall asleep consistently.',
    is_verified_purchase: true,
    created_at: '2026-06-23T12:00:00Z',
    status: 'approved',
    video_url: '',
    admin_reply: 'Thanks for the kind words, Arya! Glad to know Narva helps you stay rested during your grind.'
  }
]

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
    body: '<h2>Understanding Your Internal Clock</h2><p>Your circadian rhythm is your body\'s natural 24-hour internal clock.</p>'
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
    body: '<h2>The Pineal Gland & Screen Light</h2><p>Our screens emit high-energy visible blue light that closely mimics daylight.</p>'
  }
]

const getFormattedDate = (daysAhead: number) => {
  const d = new Date()
  d.setDate(d.getDate() + daysAhead)
  return d.toISOString().split('T')[0]
}

export const MOCK_SLOTS = [
  { id: 's1', date: getFormattedDate(0), start_time: '10:00 AM', end_time: '10:30 AM', is_booked: true },
  { id: 's2', date: getFormattedDate(0), start_time: '11:00 AM', end_time: '11:30 AM', is_booked: false },
  { id: 's3', date: getFormattedDate(1), start_time: '02:00 PM', end_time: '02:30 PM', is_booked: false },
  { id: 's4', date: getFormattedDate(2), start_time: '10:00 AM', end_time: '10:30 AM', is_booked: false }
]

export const MOCK_COUPONS = [
  { code: 'WELCOME10', type: 'pct', value: 10, min_order_value: 299, max_discount: 100, is_active: true },
  { code: 'FREESHIP', type: 'free_shipping', value: 40, min_order_value: 350, max_discount: 40, is_active: true }
]

export const MOCK_SUBSCRIBERS = [
  { id: 'sub1', email: 'arya@example.com', name: 'Arya Sharma', joined_at: '2026-06-24', source: 'Homepage CTA' },
  { id: 'sub2', email: 'priya.k@gmail.com', name: 'Priya K.', joined_at: '2026-06-22', source: 'Footer' }
]

// ─── Products ──────────────────────────────────────────────────────────────────

export async function getProducts() {
  try {
    const supabase = createBrowserClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .is('deleted_at', null)
    if (!error && data && data.length > 0) return data
  } catch (e) {
    console.warn('getProducts fallback', e)
  }
  return MOCK_PRODUCTS.filter(p => p.is_active)
}

export async function getProductsAdmin() {
  try {
    const res = await fetch('/api/products')
    if (res.ok) return await res.json()
  } catch (e) {
    console.warn('getProductsAdmin fallback', e)
  }
  return MOCK_PRODUCTS
}

export async function getProductBySlug(slug: string) {
  try {
    const supabase = createBrowserClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()
    if (!error && data) return data
  } catch (e) {
    console.warn('getProductBySlug fallback', e)
  }
  return MOCK_PRODUCTS.find(p => p.slug === slug) || MOCK_PRODUCTS[0]
}

export async function addProduct(product: {
  name: string; slug?: string; price: number; compare_price: number;
  description: string; stock_qty: number; images: string[]
}) {
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    })
    if (res.ok) return await res.json()
  } catch (e) {
    console.error('addProduct error', e)
  }
  return { success: false, error: 'Failed to add product' }
}

export async function removeProduct(id: string) {
  try {
    const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' })
    if (res.ok) return await res.json()
  } catch (e) {
    console.error('removeProduct error', e)
  }
  return { success: false, error: 'Failed to remove product' }
}

export async function updateProduct(id: string, fields: any) {
  try {
    const res = await fetch('/api/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...fields })
    })
    if (res.ok) return await res.json()
  } catch (e) {
    console.error('updateProduct error', e)
  }
  return { success: false, error: 'Failed to update product' }
}

// ─── Reviews ───────────────────────────────────────────────────────────────────

export async function getReviews(productId: string) {
  try {
    const res = await fetch(`/api/reviews?product_id=${productId}`)
    if (res.ok) {
      const data = await res.json()
      if (data && data.length > 0) return data
    }
  } catch (e) {
    console.warn('getReviews fallback', e)
  }
  return MOCK_REVIEWS.filter(r => r.product_id === productId && r.status === 'approved')
}

export async function getReviewsAdmin() {
  try {
    const res = await fetch('/api/reviews?admin=true')
    if (res.ok) {
      const data = await res.json()
      if (data) return data
    }
  } catch (e) {
    console.warn('getReviewsAdmin fallback', e)
  }
  return MOCK_REVIEWS
}

export async function addReview(review: {
  product_id: string; customer_name: string; rating: number;
  title: string; body: string; city: string; video_url?: string
}) {
  try {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    })
    if (res.ok) return await res.json()
  } catch (e) {
    console.error('addReview error', e)
  }
  return { success: false, error: 'Failed to add review' }
}

export async function updateReviewStatus(reviewId: string, status: 'approved' | 'rejected') {
  try {
    const res = await fetch('/api/reviews', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: reviewId, status })
    })
    if (res.ok) return await res.json()
  } catch (e) {
    console.error('updateReviewStatus error', e)
  }
  return { success: false, error: 'Failed to update review status' }
}

// ─── Blogs ─────────────────────────────────────────────────────────────────────

export async function getBlogs() {
  try {
    const res = await fetch('/api/blogs')
    if (res.ok) {
      const data = await res.json()
      if (data && data.length > 0) return data
    }
  } catch (e) {
    console.warn('getBlogs fallback', e)
  }
  return MOCK_BLOGS
}

export async function getBlogBySlug(slug: string) {
  try {
    const res = await fetch(`/api/blogs?slug=${slug}`)
    if (res.ok) {
      const data = await res.json()
      if (data && !data.error) return data
    }
  } catch (e) {
    console.warn('getBlogBySlug fallback', e)
  }
  return MOCK_BLOGS.find(b => b.slug === slug) || MOCK_BLOGS[0]
}

export async function addBlog(blog: any) {
  try {
    const res = await fetch('/api/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blog)
    })
    if (res.ok) return await res.json()
  } catch (e) {
    console.error('addBlog error', e)
  }
  return { success: false, error: 'Failed to add blog' }
}

export async function removeBlog(id: string) {
  try {
    const res = await fetch(`/api/blogs?id=${id}`, { method: 'DELETE' })
    if (res.ok) return await res.json()
  } catch (e) {
    console.error('removeBlog error', e)
  }
  return { success: false, error: 'Failed to remove blog' }
}

export async function updateBlog(id: string, fields: any) {
  try {
    const res = await fetch('/api/blogs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...fields })
    })
    if (res.ok) return await res.json()
  } catch (e) {
    console.error('updateBlog error', e)
  }
  return { success: false, error: 'Failed to update blog' }
}

// ─── Consultation Slots ────────────────────────────────────────────────────────

export async function getSlots() {
  try {
    const res = await fetch('/api/slots')
    if (res.ok) {
      const data = await res.json()
      if (data && data.length > 0) return data
    }
  } catch (e) {
    console.warn('getSlots fallback', e)
  }
  return MOCK_SLOTS
}

export async function addSlot(slot: any) {
  try {
    const res = await fetch('/api/slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slot)
    })
    if (res.ok) return await res.json()
  } catch (e) {
    console.error('addSlot error', e)
  }
  return { success: false, error: 'Failed to add slot' }
}

export async function removeSlot(id: string) {
  try {
    const res = await fetch(`/api/slots?id=${id}`, { method: 'DELETE' })
    if (res.ok) return await res.json()
  } catch (e) {
    console.error('removeSlot error', e)
  }
  return { success: false, error: 'Failed to remove slot' }
}

// ─── Consultation Bookings ─────────────────────────────────────────────────────

export async function getBookings() {
  try {
    const res = await fetch('/api/consultations')
    if (res.ok) return await res.json()
  } catch (e) {
    console.warn('getBookings fallback', e)
  }
  return []
}

export async function bookSlot(booking: {
  slotId: string; name: string; email: string; phone: string; notes: string; specialty: string
}) {
  try {
    const res = await fetch('/api/consultations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    })
    if (res.ok) return await res.json()
  } catch (e) {
    console.error('bookSlot error', e)
  }
  return { success: false, error: 'Failed to book slot' }
}

// ─── Coupons ───────────────────────────────────────────────────────────────────

export async function getCoupons() {
  try {
    const res = await fetch('/api/coupons')
    if (res.ok) {
      const data = await res.json()
      if (data && data.length > 0) return data
    }
  } catch (e) {
    console.warn('getCoupons fallback', e)
  }
  return MOCK_COUPONS
}

export async function addCoupon(coupon: any) {
  try {
    const res = await fetch('/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(coupon)
    })
    if (res.ok) return await res.json()
  } catch (e) {
    console.error('addCoupon error', e)
  }
  return { success: false, error: 'Failed to add coupon' }
}

export async function removeCoupon(code: string) {
  try {
    const res = await fetch(`/api/coupons?code=${code}`, { method: 'DELETE' })
    if (res.ok) return await res.json()
  } catch (e) {
    console.error('removeCoupon error', e)
  }
  return { success: false, error: 'Failed to remove coupon' }
}

export async function validateCoupon(code: string, subtotal: number) {
  try {
    const res = await fetch(`/api/coupons?validate=${encodeURIComponent(code)}`)
    if (res.ok) {
      const result = await res.json()
      if (!result.valid) return result

      const coupon = result.coupon
      if (subtotal < coupon.min_order_value) {
        return { valid: false, message: `Minimum order value for this coupon is ₹${coupon.min_order_value}.` }
      }

      let discount = 0
      if (coupon.type === 'pct') {
        discount = (subtotal * coupon.value) / 100
        if (coupon.max_discount && discount > coupon.max_discount) discount = coupon.max_discount
      } else if (coupon.type === 'flat') {
        discount = coupon.value
      } else if (coupon.type === 'free_shipping') {
        discount = 40
      }

      return { valid: true, discount, type: coupon.type }
    }
  } catch (e) {
    console.warn('validateCoupon fallback', e)
  }

  // Fallback to local mock validation
  const coupon = MOCK_COUPONS.find(c => c.code.toUpperCase() === code.toUpperCase())
  if (!coupon) return { valid: false, message: 'Invalid coupon code.' }
  if (subtotal < coupon.min_order_value) {
    return { valid: false, message: `Minimum order value for this coupon is ₹${coupon.min_order_value}.` }
  }
  let discount = 0
  if (coupon.type === 'pct') {
    discount = (subtotal * coupon.value) / 100
    if (coupon.max_discount && discount > coupon.max_discount) discount = coupon.max_discount
  } else if (coupon.type === 'flat') {
    discount = coupon.value
  } else if (coupon.type === 'free_shipping') {
    discount = 40
  }
  return { valid: true, discount, type: coupon.type }
}

// ─── Subscribers ───────────────────────────────────────────────────────────────

export async function getSubscribers() {
  try {
    const res = await fetch('/api/subscribers')
    if (res.ok) return await res.json()
  } catch (e) {
    console.warn('getSubscribers fallback', e)
  }
  return MOCK_SUBSCRIBERS
}

export async function addSubscriber(sub: { email: string; name?: string; source?: string }) {
  try {
    const res = await fetch('/api/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sub)
    })
    if (res.ok) return await res.json()
  } catch (e) {
    console.error('addSubscriber error', e)
  }
  return { success: false, error: 'Failed to subscribe' }
}

// ─── Orders ────────────────────────────────────────────────────────────────────

export async function getOrders() {
  try {
    const res = await fetch('/api/orders')
    if (res.ok) return await res.json()
  } catch (e) {
    console.warn('getOrders fallback', e)
  }
  return []
}

export async function createOrder(orderData: {
  email: string; fullName: string; phone: string;
  line1: string; line2?: string; city: string; state: string; pincode: string;
  items: Array<{ productId: string; name: string; price: number; quantity: number }>;
  subtotal: number; discount: number; shipping: number; total: number;
  couponCode?: string; paymentId?: string; paymentMethod?: string;
}) {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    })
    if (res.ok) return await res.json()
  } catch (e) {
    console.error('createOrder error', e)
  }
  return { success: false, error: 'Failed to create order' }
}

export async function updateOrder(id: string, fields: any) {
  try {
    const res = await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...fields })
    })
    if (res.ok) return await res.json()
  } catch (e) {
    console.error('updateOrder error', e)
  }
  return { success: false, error: 'Failed to update order' }
}
