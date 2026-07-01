import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  // 1. Get authenticated user session
  const supabaseBrowser = createServerClient()
  const { data: { user }, error: authError } = await supabaseBrowser.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 })
  }

  // 2. Fetch orders matching user email or customer_id using admin client (bypassing RLS safely)
  const supabaseAdmin = createAdminClient()
  const { data: orders, error: dbError } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (name, images)
      ),
      addresses (line1, line2, city, state, pincode, country)
    `)
    .or(`customer_email.eq.${user.email},customer_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  return NextResponse.json(orders)
}
