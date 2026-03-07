import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BookingStatusBadge } from '@/components/bookings/BookingStatusBadge'
import { formatCurrency, formatDate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Admin — Bookings' }

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('bookings')
    .select('*, venue:venues(name), customer:profiles(full_name, email)')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data: bookings } = await query

  const statusFilters = ['', 'pending', 'confirmed', 'cancelled', 'completed']

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((s) => (
          <Link
            key={s || 'all'}
            href={s ? `/admin/bookings?status=${s}` : '/admin/bookings'}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              status === s || (!status && !s)
                ? 'bg-brand-green text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Event', 'Venue', 'Customer', 'Date', 'Amount', 'Status', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {!bookings || bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-400">No bookings found.</td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{b.event_name}</td>
                  <td className="px-4 py-3 text-gray-500">{b.venue?.name}</td>
                  <td className="px-4 py-3 text-gray-500">{b.customer?.full_name ?? b.customer?.email}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(b.event_date, 'PP')}</td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(b.total_amount)}</td>
                  <td className="px-4 py-3"><BookingStatusBadge status={b.status} /></td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/bookings/${b.id}`} className="text-brand-gold hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
