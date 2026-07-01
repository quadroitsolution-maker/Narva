import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('consultation_bookings')
    .select('*, consultation_slots(*)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()

  // Insert booking
  const { data: booking, error: bookingError } = await supabase
    .from('consultation_bookings')
    .insert([{
      slot_id: body.slotId,
      customer_name: body.name,
      customer_email: body.email,
      customer_phone: body.phone,
      notes: body.specialty ? `${body.specialty} - ${body.notes || ''}` : (body.notes || ''),
      status: 'confirmed',
      meeting_link: 'https://meet.google.com/narva-consult'
    }])
    .select()
    .single()

  if (bookingError) return NextResponse.json({ error: bookingError.message }, { status: 500 })

  // Mark slot as booked
  const { error: slotError } = await supabase
    .from('consultation_slots')
    .update({ is_booked: true, booking_id: booking.id })
    .eq('id', body.slotId)

  if (slotError) {
    // Rollback booking if slot update fails
    await supabase.from('consultation_bookings').delete().eq('id', booking.id)
    return NextResponse.json({ error: slotError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, meetingLink: booking.meeting_link, data: booking })
}

export async function PATCH(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()
  const { id, type, ...fields } = body

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const table = type === 'slot' ? 'consultation_slots' : 'consultation_bookings'
  const { data, error } = await supabase
    .from(table)
    .update(fields)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}
