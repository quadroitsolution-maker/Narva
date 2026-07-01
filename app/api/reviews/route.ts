import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('product_id')
  const adminAll = searchParams.get('admin') === 'true'

  let query = supabase.from('reviews').select('*').order('created_at', { ascending: false })

  if (!adminAll) {
    query = query.eq('status', 'approved')
  }
  if (productId) {
    query = query.eq('product_id', productId)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()

  const { data, error } = await supabase
    .from('reviews')
    .insert([{
      product_id: body.product_id,
      customer_name: body.customer_name,
      city: body.city || 'India',
      rating: body.rating,
      title: body.title,
      body: body.body,
      is_verified_purchase: body.is_verified_purchase ?? false,
      status: 'pending',
      video_url: body.video_url || null
    }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

export async function PATCH(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()
  const { id, status, admin_reply } = body

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const updates: Record<string, any> = {
    updated_at: new Date().toISOString()
  }
  if (status) updates.status = status
  if (admin_reply !== undefined) {
    updates.admin_reply = admin_reply
    updates.reply_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('reviews')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

export async function DELETE(req: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { error } = await supabase.from('reviews').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
