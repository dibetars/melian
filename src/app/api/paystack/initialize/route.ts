import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { initializeTransaction, generatePaystackRef } from '@/lib/paystack'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { bookingId, email, amount } = await req.json()

  // Verify booking ownership
  const { data: booking } = await supabase
    .from('bookings')
    .select('id, total_amount')
    .eq('id', bookingId)
    .eq('customer_id', user.id)
    .single()

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  const reference = generatePaystackRef(bookingId)
  const callback_url = `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`

  try {
    const result = await initializeTransaction({
      email,
      amount: Math.round(booking.total_amount * 100), // pesewas
      reference,
      callback_url,
      metadata: { booking_id: bookingId },
    })

    // Store payment record
    await supabase.from('payments').upsert({
      booking_id: bookingId,
      amount: booking.total_amount,
      method: 'online',
      status: 'pending',
      paystack_ref: reference,
    })

    return NextResponse.json({ authorization_url: result.authorization_url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
