import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://uereguagikpzbnplteci.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlcmVndWFnaWtwemJucGx0ZWNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjkxNzAxNCwiZXhwIjoyMDk4NDkzMDE0fQ.ihV7yY_1ML91l_-2aXU3p63usWHDEi1m0agaJf1f5GA'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function testInsert() {
  console.log('Testing direct inserts using service role...')
  
  // 1. Insert address
  const { data: address, error: addrErr } = await supabase
    .from('addresses')
    .insert([{
      line1: 'Test Address Line 1',
      city: 'Test City',
      state: 'Test State',
      pincode: '123456',
      country: 'India'
    }])
    .select()
    .single()

  if (addrErr) {
    console.error('Address Insert Error:', addrErr)
    return
  }
  console.log('Address Inserted:', address)

  // 2. Insert order
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert([{
      status: 'confirmed',
      payment_method: 'razorpay_simulated',
      subtotal: 399.00,
      discount: 0.00,
      shipping: 0.00,
      total: 399.00,
      shipping_address_id: address.id,
      customer_email: 'test-buyer@narva.in',
      customer_name: 'Test Buyer',
      customer_phone: '+919999999999'
    }])
    .select()
    .single()

  if (orderErr) {
    console.error('Order Insert Error:', orderErr)
    return
  }
  console.log('Order Inserted:', order)
  
  // Clean up
  await supabase.from('orders').delete().eq('id', order.id)
  await supabase.from('addresses').delete().eq('id', address.id)
  console.log('Cleanup finished.')
}

testInsert().catch(console.error)
