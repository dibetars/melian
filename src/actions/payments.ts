'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markOfflinePaid(paymentId: string) {
  const supabase = await createClient()

  const { data: payment, error: fetchError } = await supabase
    .from('payments')
    .select('booking_id')
    .eq('id', paymentId)
    .single()

  if (fetchError || !payment) return { error: 'Payment not found' }

  const { error: payError } = await supabase
    .from('payments')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .eq('id', paymentId)

  if (payError) return { error: payError.message }

  const { error: bookingError } = await supabase
    .from('bookings')
    .update({ status: 'confirmed' })
    .eq('id', payment.booking_id)

  if (bookingError) return { error: bookingError.message }

  revalidatePath('/admin/payments')
  revalidatePath('/admin/bookings')
  return { success: true }
}

export async function createOfflinePayment(bookingId: string) {
  const supabase = await createClient()

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('total_amount, customer_id')
    .eq('id', bookingId)
    .single()

  if (bookingError || !booking) return { error: 'Booking not found' }

  const { data, error } = await supabase
    .from('payments')
    .insert({
      booking_id: bookingId,
      amount: booking.total_amount,
      method: 'offline',
      status: 'pending',
    })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath(`/payment/${bookingId}`)
  return { data }
}
