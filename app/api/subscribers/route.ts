import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .order('joined_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()

  if (!body.email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  // Check if already subscribed
  const { data: existing } = await supabase
    .from('subscribers')
    .select('id')
    .eq('email', body.email.toLowerCase())
    .single()

  if (existing) {
    return NextResponse.json({ success: true, message: 'Already subscribed' })
  }

  const { data, error } = await supabase
    .from('subscribers')
    .insert([{
      email: body.email.toLowerCase(),
      name: body.name || body.email.split('@')[0],
      source: body.source || 'Website'
    }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

export async function DELETE(req: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')

  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const { error } = await supabase.from('subscribers').delete().eq('email', email.toLowerCase())
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
