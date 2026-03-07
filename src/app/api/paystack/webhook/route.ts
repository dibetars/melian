import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const rawBody = await req.text()

  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(rawBody)
    .digest('hex')

  if (hash !== req.headers.get('x-paystack-signature')) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(rawBody)

  if (event.event === 'charge.success') {
    const supabase = await createClient()
    const reference = event.data.reference as string

    const { data: payment } = await supabase
      .from('payments')
      .select('id, booking_id')
      .eq('paystack_ref', reference)
      .single()

    if (payment) {
      await supabase
        .from('payments')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString(),
          paystack_data: event.data,
        })
        .eq('id', payment.id)

      await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', payment.booking_id)
    }
  }

  return NextResponse.json({ received: true })
}
