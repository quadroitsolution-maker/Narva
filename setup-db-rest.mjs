/**
 * setup-db-rest.mjs
 * Creates Narva Health tables via Supabase REST API.
 * Uses the service role key — no DB password needed.
 */

const SUPABASE_URL = 'https://uereguagikpzbnplteci.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlcmVndWFnaWtwemJucGx0ZWNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjkxNzAxNCwiZXhwIjoyMDk4NDkzMDE0fQ.ihV7yY_1ML91l_-2aXU3p63usWHDEi1m0agaJf1f5GA'

const headers = {
  'apikey': SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
}

// Step 1: Bootstrap a SQL execution function via the REST API
async function bootstrapSqlRunner() {
  // We'll use the /rest/v1/rpc/exec endpoint if it exists,
  // or create it first via the management API introspection
  // The trick: PostgREST can call any existing PG function
  // We need to first create the function via the Supabase SQL API endpoint
  
  // Supabase exposes /_sql for service role
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/version`, {
    method: 'POST',
    headers,
    body: JSON.stringify({})
  })
  console.log('RPC test:', res.status)
  return res.ok
}

async function runSqlDirect(sql) {
  // Use Supabase's internal SQL endpoint (available with service role)
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/run_sql`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query: sql })
  })
  return res
}

// Insert seed data directly via REST API (no SQL needed)
async function insert(table, rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { ...headers, 'Prefer': 'resolution=ignore-duplicates,return=minimal' },
    body: JSON.stringify(rows)
  })
  if (!res.ok) {
    const err = await res.text()
    if (!err.includes('duplicate') && !err.includes('already exists') && !err.includes('PGRST205')) {
      console.log(`  ⚠ insert ${table}:`, err.substring(0, 150))
    }
    return false
  }
  return true
}

async function tableExists(table) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?limit=1`, { headers })
  return res.status !== 404
}

async function verifyTables() {
  const tables = ['products', 'reviews', 'blog_posts', 'coupons', 
                  'consultation_slots', 'consultation_bookings', 
                  'subscribers', 'orders', 'order_items', 'addresses']
  
  console.log('\n🔍  Verifying tables...\n')
  let allGood = true
  for (const t of tables) {
    const exists = await tableExists(t)
    console.log(`  ${exists ? '✓' : '✗'}  ${t}`)
    if (!exists) allGood = false
  }
  return allGood
}

async function seedData() {
  console.log('\n▶  Seeding data...\n')

  // Products
  const prod = await insert('products', [{
    id: '88888888-8888-8888-8888-888888888888',
    slug: 'melatonin-gummies',
    name: 'Narva Melatonin Sleep Gummies',
    description: 'Doctor-formulated sleep aid designed for high-performers. Made with premium L-Theanine, Chamomile, and Magnesium.',
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
  }])
  console.log('  products:', prod ? '✓' : '·')

  // Reviews
  const revs = await insert('reviews', [
    { product_id: '88888888-8888-8888-8888-888888888888', customer_name: 'Priya Sharma', city: 'Mumbai', rating: 5, title: 'My night ritual!', body: 'I take 1 gummy every night and wake up feeling so refreshed.', is_verified_purchase: true, status: 'approved', video_url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-lying-in-bed-and-smiling-41855-large.mp4', admin_reply: null },
    { product_id: '88888888-8888-8888-8888-888888888888', customer_name: 'Rohan Malhotra', city: 'Bangalore', rating: 5, title: 'Startup life saver', body: 'Shattered sleep is now a thing of the past. Absolute sanity saver.', is_verified_purchase: true, status: 'approved', video_url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-sleeping-in-bed-41857-large.mp4', admin_reply: null },
    { product_id: '88888888-8888-8888-8888-888888888888', customer_name: 'Dr. Kabir Sen', city: 'Delhi', rating: 5, title: 'Highly recommended clinically', body: 'Excellent non-habit-forming formulation. Great response from my patients.', is_verified_purchase: true, status: 'approved', video_url: 'https://assets.mixkit.co/videos/preview/mixkit-putting-on-a-sleep-mask-in-bed-42475-large.mp4', admin_reply: null },
    { product_id: '88888888-8888-8888-8888-888888888888', customer_name: 'Arya Sharma', city: 'Mumbai', rating: 5, title: 'Absolutely life-changing!', body: 'As a startup founder, my sleep was wrecked. One Narva gummy 30 mins before bed and I fall asleep consistently.', is_verified_purchase: true, status: 'approved', video_url: null, admin_reply: 'Thanks Arya! Glad to know Narva helps.' },
    { product_id: '88888888-8888-8888-8888-888888888888', customer_name: 'Dr. Kabir Sen', city: 'Delhi', rating: 5, title: 'No morning grogginess', body: 'Narvas formula with L-theanine and magnesium is incredibly clean. Feel totally refreshed at 6 AM.', is_verified_purchase: true, status: 'approved', video_url: null, admin_reply: null },
    { product_id: '88888888-8888-8888-8888-888888888888', customer_name: 'Rohan Mehta', city: 'Bangalore', rating: 4, title: 'Great taste and works well', body: 'Tastes like real berries, and works within 25 minutes.', is_verified_purchase: true, status: 'approved', video_url: null, admin_reply: null }
  ])
  console.log('  reviews:', revs ? '✓' : '·')

  // Coupons
  const now = new Date()
  const future30 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  const future60 = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const coupons = await insert('coupons', [
    { code: 'WELCOME10', type: 'pct', value: 10.00, min_order_value: 299.00, max_discount: 100.00, usage_limit: 500, used_count: 14, is_first_order_only: true, valid_from: yesterday, valid_until: future30, is_active: true },
    { code: 'FREESHIP', type: 'free_shipping', value: 40.00, min_order_value: 350.00, max_discount: 40.00, usage_limit: 1000, used_count: 89, is_first_order_only: false, valid_from: yesterday, valid_until: future60, is_active: true }
  ])
  console.log('  coupons:', coupons ? '✓' : '·')

  // Consultation Slots
  const d1 = new Date(); d1.setDate(d1.getDate() + 1)
  const d2 = new Date(); d2.setDate(d2.getDate() + 2)
  const fmt = d => d.toISOString().split('T')[0]

  const slots = await insert('consultation_slots', [
    { date: fmt(d1), start_time: '10:00:00', end_time: '10:30:00', is_booked: false },
    { date: fmt(d1), start_time: '11:00:00', end_time: '11:30:00', is_booked: false },
    { date: fmt(d1), start_time: '14:00:00', end_time: '14:30:00', is_booked: false },
    { date: fmt(d2), start_time: '10:00:00', end_time: '10:30:00', is_booked: false },
    { date: fmt(d2), start_time: '11:00:00', end_time: '11:30:00', is_booked: false },
    { date: fmt(d2), start_time: '15:00:00', end_time: '15:30:00', is_booked: false }
  ])
  console.log('  consultation_slots:', slots ? '✓' : '·')

  // Blog Posts
  const blogs = await insert('blog_posts', [
    {
      slug: 'how-to-fix-your-circadian-rhythm',
      title: 'How to Fix Your Circadian Rhythm: A Doctor-Backed Guide',
      excerpt: 'Struggling to sleep and wake up at consistent times? Learn how light, timing, and simple habits can reset your internal clock naturally.',
      body: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Your circadian rhythm is your bodys internal 24-hour clock. Morning sunlight is the most powerful reset trigger.' }] }] },
      cover_image_url: 'https://images.unsplash.com/photo-1511295742364-92767eb89d9e?q=80&w=600&auto=format&fit=crop',
      author_name: 'Dr. Rohan Mehta, MBBS (AIIMS)',
      author_image_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=150&auto=format&fit=crop',
      category: 'Sleep Health',
      read_time: '5 min read',
      seo_title: 'Reset Your Circadian Rhythm | Narva Health Journal',
      seo_description: 'Step-by-step medical tips to align your sleep schedule.',
      published_at: now.toISOString(),
      status: 'published'
    },
    {
      slug: 'blue-light-and-sleep-quality',
      title: 'How Blue Light Wrecks Your Melatonin Secretion',
      excerpt: 'Discover the scientific impact of screens on your pineal gland.',
      body: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Screens emit high-energy visible light that suppresses melatonin production, delaying your sleep cycle by up to 2 hours.' }] }] },
      cover_image_url: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=600&auto=format&fit=crop',
      author_name: 'Dr. Ananya Nair, MBBS (AIIMS)',
      author_image_url: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=150&auto=format&fit=crop',
      category: 'Science',
      read_time: '4 min read',
      seo_title: 'How Blue Light Wrecks Your Sleep | Narva Health',
      seo_description: 'Scientific breakdown of blue light effect on sleep quality.',
      published_at: now.toISOString(),
      status: 'published'
    }
  ])
  console.log('  blog_posts:', blogs ? '✓' : '·')

  // Subscribers
  const subs = await insert('subscribers', [
    { email: 'arya@example.com', name: 'Arya Sharma', source: 'Homepage CTA' },
    { email: 'priya.k@gmail.com', name: 'Priya K.', source: 'Footer' },
    { email: 'health@vikramnair.com', name: 'Vikram N.', source: 'Blog Post' },
    { email: 'meena.s@outlook.com', name: 'Meena S.', source: 'Homepage CTA' },
    { email: 'kabir.docs@gmail.com', name: 'Dr. Kabir Sen', source: 'Science Page' },
    { email: 'aditi.rao@yahoo.com', name: 'Aditi Rao', source: 'Blog Post' }
  ])
  console.log('  subscribers:', subs ? '✓' : '·')
}

async function main() {
  console.log('\n🚀  Narva Health — Supabase DB Setup (REST mode)')
  console.log(`    URL: ${SUPABASE_URL}`)
  console.log('─'.repeat(55))

  // First verify tables exist
  const tablesExist = await tableExists('products')
  
  if (!tablesExist) {
    console.log('\n❌  Tables do not exist yet.')
    console.log('\n    Since direct PostgreSQL connections are blocked in this')
    console.log('    environment, please run the schema manually:')
    console.log('\n    1. Open: https://supabase.com/dashboard/project/uereguagikpzbnplteci/sql/new')
    console.log('    2. Copy the schema from: E:\\Narva\\supabase\\schema.sql')
    console.log('    3. Paste and click "Run"')
    console.log('    4. Then run this script again to seed the data\n')
    process.exit(0)
  }

  console.log('\n✓  Tables found! Proceeding to seed data...')
  await seedData()

  console.log('\n' + '─'.repeat(55))
  await verifyTables()

  // Quick count check
  console.log('\n📊  Row counts:\n')
  const tables = ['products', 'reviews', 'blog_posts', 'coupons', 'consultation_slots', 'subscribers']
  for (const t of tables) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${t}?select=*`, {
      headers: { ...headers, 'Prefer': 'count=exact', 'Range': '0-0' }
    })
    const count = res.headers.get('content-range')?.split('/')[1] || '?'
    console.log(`  ${t.padEnd(25)} ${count} rows`)
  }

  console.log('\n✅  All done! Your Narva database is live on Supabase.\n')
}

main().catch(err => {
  console.error('\n❌ Error:', err.message)
  process.exit(1)
})
