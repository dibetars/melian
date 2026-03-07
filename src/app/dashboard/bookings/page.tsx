import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/Card'
import { BookingStatusBadge } from '@/components/bookings/BookingStatusBadge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { CalendarDays } from 'lucide-react'

export const metadata: Metadata = { title: 'My Bookings' }

export default async function CustomerBookingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, venue:venues(name, slug)')
    .eq('customer_id', user!.id)
    .order('event_date', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>

      {!bookings || bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-20 text-center">
          <CalendarDays className="mb-3 h-10 w-10 text-gray-300" />
          <p className="text-gray-500">No bookings yet.</p>
          <Link href="/venues" className="mt-2 text-sm text-brand-gold hover:underline">Browse venues</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <Link key={b.id} href={`/dashboard/bookings/${b.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{b.event_name}</p>
                    <p className="text-sm text-gray-500">{b.venue?.name}</p>
                    <p className="text-sm text-gray-400">{formatDate(b.event_date)} · {b.start_time} – {b.end_time}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-700">{formatCurrency(b.total_amount)}</span>
                    <BookingStatusBadge status={b.status} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
