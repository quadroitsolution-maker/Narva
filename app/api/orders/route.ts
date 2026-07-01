import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (name, images)
      ),
      addresses (line1, line2, city, state, pincode, country)
    `)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()
  /*
    body: {
      email, fullName, phone, line1, line2, city, state, pincode,
      items: [{ productId, name, price, quantity }],
      subtotal, discount, shipping, total,
      couponCode, paymentId, paymentMethod
    }
  */

  // 1. Upsert address
  const { data: addressData, error: addrErr } = await supabase
    .from('addresses')
    .insert([{
      line1: body.line1,
      line2: body.line2 || null,
      city: body.city,
      state: body.state,
      pincode: body.pincode,
      country: 'India'
    }])
    .select()
    .single()

  if (addrErr) return NextResponse.json({ error: addrErr.message }, { status: 500 })

  // 2. Create order
  const { data: orderData, error: orderErr } = await supabase
    .from('orders')
    .insert([{
      status: 'confirmed',
      payment_id: body.paymentId || null,
      payment_method: body.paymentMethod || 'razorpay',
      subtotal: body.subtotal,
      discount: body.discount || 0,
      shipping: body.shipping || 0,
      total: body.total,
      shipping_address_id: addressData.id,
      notes: body.couponCode ? `Coupon: ${body.couponCode}` : null,
      customer_email: body.email,
      customer_name: body.fullName,
      customer_phone: body.phone
    }])
    .select()
    .single()

  if (orderErr) return NextResponse.json({ error: orderErr.message }, { status: 500 })

  // 3. Create order items
  if (body.items && body.items.length > 0) {
    const orderItems = body.items.map((item: any) => ({
      order_id: orderData.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity
    }))

    const { error: itemsErr } = await supabase.from('order_items').insert(orderItems)
    if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 500 })

    // 4. Decrement stock for each product
    for (const item of body.items) {
      await supabase.rpc('decrement_stock', {
        p_product_id: item.productId,
        p_quantity: item.quantity
      }).then(({ error }) => {
        if (error) console.warn('Stock decrement failed for', item.productId, error.message)
      })
    }
  }

  return NextResponse.json({ success: true, orderId: orderData.id, data: orderData })
}

export async function PATCH(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()
  const { id, ...fields } = body

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { data, error } = await supabase
    .from('orders')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}
