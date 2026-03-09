'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markOfflinePaid(paymentId: string) {
  const supabase = await createAdminClient()

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
  // Use regular client to verify the booking belongs to the current user
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('total_amount, customer_id')
    .eq('id', bookingId)
    .eq('customer_id', user.id)   // explicit ownership check
    .single()

  if (bookingError || !booking) return { error: 'Booking not found' }

  // Use admin client for the insert — ownership already verified above
  const admin = await createAdminClient()

  const { data, error } = await admin
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
