import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { BookingStatusBadge } from '@/components/bookings/BookingStatusBadge'
import { CancelBookingButton } from './CancelBookingButton'
import { BankDetails } from '@/components/bookings/BankDetails'
import { formatCurrency, formatDate, formatTime, generateBookingRef } from '@/lib/utils'

export const metadata: Metadata = { title: 'Booking Details' }

interface Props { params: Promise<{ id: string }> }

export default async function BookingDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: booking } = await supabase
    .from('bookings')
    .select('*, venue:venues(*), payment:payments(*)')
    .eq('id', id)
    .eq('customer_id', user!.id)
    .single()

  if (!booking) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard/bookings" className="text-sm text-brand-gold hover:underline">
            ← Back to Bookings
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">{booking.event_name}</h1>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Event Details</h2>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Space', value: booking.venue?.name },
              { label: 'Date', value: formatDate(booking.event_date) },
              { label: 'Start Time', value: formatTime(booking.start_time) },
              { label: 'End Time', value: formatTime(booking.end_time) },
              { label: 'Guests', value: booking.guest_count ?? '—' },
              { label: 'Total Amount', value: formatCurrency(booking.total_amount) },
            ].map(({ label, value }) => (
              <div key={label}>
                <dt className="text-sm text-gray-500">{label}</dt>
                <dd className="mt-0.5 font-medium text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>
          {booking.notes && (
            <div className="mt-4 border-t pt-4">
              <p className="text-sm text-gray-500">Notes</p>
              <p className="mt-1 text-gray-700">{booking.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment info */}
      {booking.payment && (
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900">Payment</h2>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-gray-500">Method</dt>
                <dd className="mt-0.5 font-medium capitalize text-gray-900">{booking.payment.method}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Status</dt>
                <dd className="mt-0.5 font-medium capitalize text-gray-900">{booking.payment.status}</dd>
              </div>
              {booking.payment.method === 'offline' && booking.payment.status === 'pending' && (
                <div className="col-span-2">
                  <dt className="text-sm text-gray-500">Payment Reference</dt>
                  <dd className="mt-0.5 font-mono font-medium text-brand-green">
                    {generateBookingRef(booking.id)}
                  </dd>
                  <p className="mt-1 text-xs text-gray-400">
                    Use this reference when making your bank transfer.
                  </p>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      )}

      {booking.status === 'pending' && (
        <CancelBookingButton bookingId={booking.id} />
      )}

      {/* Bank Transfer Details for Offline Payments */}
      {booking.payment?.method === 'offline' && booking.payment?.status === 'pending' && (
        <BankDetails bookingRef={generateBookingRef(booking.id)} />
      )}
    </div>
  )
}
