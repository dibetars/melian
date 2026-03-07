'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createBooking(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const venue_id = formData.get('venue_id') as string
  const event_name = formData.get('event_name') as string
  const event_date = formData.get('event_date') as string
  const start_time = formData.get('start_time') as string
  const end_time = formData.get('end_time') as string
  const guest_count = Number(formData.get('guest_count'))
  const notes = formData.get('notes') as string
  const total_amount = Number(formData.get('total_amount'))

  // Conflict detection
  const { count } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('venue_id', venue_id)
    .eq('event_date', event_date)
    .neq('status', 'cancelled')
    .lt('start_time', end_time)
    .gt('end_time', start_time)

  if (count && count > 0) {
    return { error: 'This venue is already booked for the selected date and time. Please choose a different slot.' }
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      venue_id,
      customer_id: user.id,
      event_name,
      event_date,
      start_time,
      end_time,
      guest_count,
      notes,
      total_amount,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  redirect(`/payment/${data.id}`)
}

export async function cancelBooking(bookingId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)
    .eq('customer_id', user.id)
    .eq('status', 'pending') // can only cancel pending

  if (error) return { error: error.message }

  revalidatePath('/dashboard/bookings')
  return { success: true }
}

export async function adminUpdateBooking(
  bookingId: string,
  updates: { status?: string; admin_notes?: string }
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', bookingId)

  if (error) return { error: error.message }

  revalidatePath('/admin/bookings')
  revalidatePath(`/admin/bookings/${bookingId}`)
  return { success: true }
}
