import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('validate')

  if (code) {
    // Validate a coupon
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .lte('valid_from', new Date().toISOString())
      .gte('valid_until', new Date().toISOString())
      .single()

    if (error || !data) {
      return NextResponse.json({ valid: false, message: 'Invalid or expired coupon code.' })
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: data.code,
        type: data.type,
        value: data.value,
        min_order_value: data.min_order_value,
        max_discount: data.max_discount
      }
    })
  }

  // List all coupons (admin)
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()

  const { data, error } = await supabase
    .from('coupons')
    .insert([{
      code: body.code.toUpperCase(),
      type: body.type,
      value: body.value,
      min_order_value: body.min_order_value || 0,
      max_discount: body.max_discount || null,
      usage_limit: body.usage_limit || null,
      used_count: 0,
      is_first_order_only: body.is_first_order_only || false,
      valid_from: body.valid_from || new Date().toISOString(),
      valid_until: body.valid_until || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true
    }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

export async function DELETE(req: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')

  if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 })

  const { error } = await supabase
    .from('coupons')
    .update({ is_active: false })
    .eq('code', code.toUpperCase())

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
