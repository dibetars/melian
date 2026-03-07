import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { PaymentOptions } from './PaymentOptions'
import { formatCurrency, generateBookingRef } from '@/lib/utils'

export const metadata: Metadata = { title: 'Choose Payment' }

interface Props {
  params: Promise<{ bookingId: string }>
}

export default async function PaymentPage({ params }: Props) {
  const { bookingId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/auth/login?next=/payment/${bookingId}`)

  const { data: booking } = await supabase
    .from('bookings')
    .select('*, venue:venues(*)')
    .eq('id', bookingId)
    .eq('customer_id', user.id)
    .single()

  if (!booking) notFound()

  // Check if already paid
  const { data: payment } = await supabase
    .from('payments')
    .select('status')
    .eq('booking_id', bookingId)
    .single()

  if (payment?.status === 'paid') {
    redirect('/payment/success?already=true')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .single()

  return (
    <>
      <Navbar user={user} isAdmin={profile?.role === 'admin'} />
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Complete Your Booking</h1>
          <p className="mb-6 text-sm text-gray-500">
            Choose how you would like to pay for your reservation.
          </p>

          {/* Summary */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-semibold text-gray-900">Booking Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Venue</span>
                <span className="font-medium">{booking.venue?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Event</span>
                <span className="font-medium">{booking.event_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="font-medium">{booking.event_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time</span>
                <span className="font-medium">{booking.start_time} – {booking.end_time}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2">
                <span className="font-semibold text-gray-700">Total</span>
                <span className="font-bold text-brand-green">{formatCurrency(booking.total_amount)}</span>
              </div>
            </div>
          </div>

          <PaymentOptions
            bookingId={bookingId}
            amount={booking.total_amount}
            email={profile?.email ?? user.email ?? ''}
            bookingRef={generateBookingRef(bookingId)}
          />
        </div>
      </main>
    </>
  )
}
