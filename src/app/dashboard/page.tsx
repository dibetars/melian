import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/Card'
import { BookingStatusBadge } from '@/components/bookings/BookingStatusBadge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user!.id)
    .single()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, venue:venues(name)')
    .eq('customer_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const total = bookings?.length ?? 0
  const confirmed = bookings?.filter((b) => b.status === 'confirmed').length ?? 0
  const pending = bookings?.filter((b) => b.status === 'pending').length ?? 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {profile?.full_name?.split(' ')[0] ?? 'there'}!
        </h1>
        <p className="mt-1 text-gray-500">Here&apos;s an overview of your bookings.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Bookings', value: total },
          { label: 'Confirmed', value: confirmed },
          { label: 'Pending', value: pending },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="pt-6">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent bookings */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Bookings</h2>
          <Link href="/dashboard/bookings">
            <Button variant="ghost" size="sm">View all →</Button>
          </Link>
        </div>
        {!bookings || bookings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center text-sm text-gray-500">
            No bookings yet.{' '}
            <Link href="/venues" className="text-brand-gold hover:underline">Browse venues</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <Link key={b.id} href={`/dashboard/bookings/${b.id}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium text-gray-900">{b.event_name}</p>
                      <p className="text-sm text-gray-500">{b.venue?.name} · {formatDate(b.event_date)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-700">{formatCurrency(b.total_amount)}</span>
                      <BookingStatusBadge status={b.status} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
