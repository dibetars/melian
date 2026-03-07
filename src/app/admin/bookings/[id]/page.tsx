import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { BookingStatusBadge } from '@/components/bookings/BookingStatusBadge'
import { AdminBookingActions } from './AdminBookingActions'
import { formatCurrency, formatDate, formatTime } from '@/lib/utils'

export const metadata: Metadata = { title: 'Booking — Admin' }

interface Props { params: Promise<{ id: string }> }

export default async function AdminBookingDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: booking } = await supabase
    .from('bookings')
    .select('*, venue:venues(*), customer:profiles(full_name, email, phone), payment:payments(*)')
    .eq('id', id)
    .single()

  if (!booking) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/bookings" className="text-sm text-brand-gold hover:underline">← Back</Link>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">{booking.event_name}</h1>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><h2 className="font-semibold">Event Details</h2></CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
              {[
                ['Venue', booking.venue?.name],
                ['Date', formatDate(booking.event_date)],
                ['Time', `${formatTime(booking.start_time)} – ${formatTime(booking.end_time)}`],
                ['Guests', booking.guest_count ?? '—'],
                ['Amount', formatCurrency(booking.total_amount)],
              ].map(([k, v]) => (
                <div key={String(k)} className="flex justify-between">
                  <dt className="text-gray-500">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
              {booking.notes && (
                <div className="border-t pt-2">
                  <dt className="text-gray-500">Customer Notes</dt>
                  <dd className="mt-1 text-gray-700">{booking.notes}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><h2 className="font-semibold">Customer</h2></CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
              {[
                ['Name', booking.customer?.full_name],
                ['Email', booking.customer?.email],
                ['Phone', booking.customer?.phone ?? '—'],
              ].map(([k, v]) => (
                <div key={String(k)} className="flex justify-between">
                  <dt className="text-gray-500">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </div>

      <AdminBookingActions booking={booking} />
    </div>
  )
}
