import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { MarkPaidButton } from './MarkPaidButton'

export const metadata: Metadata = { title: 'Admin — Payments' }

export default async function AdminPaymentsPage() {
  const supabase = await createClient()

  const { data: payments } = await supabase
    .from('payments')
    .select('*, booking:bookings(event_name, event_date, customer:profiles(full_name, email))')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Payments</h1>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Booking', 'Customer', 'Amount', 'Method', 'Status', 'Date', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {!payments || payments.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-400">No payments yet.</td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.booking?.event_name}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {p.booking?.customer?.full_name ?? p.booking?.customer?.email}
                  </td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(p.amount)}</td>
                  <td className="px-4 py-3 capitalize text-gray-500">{p.method}</td>
                  <td className="px-4 py-3">
                    <Badge variant={p.status === 'paid' ? 'success' : p.status === 'failed' ? 'danger' : 'warning'}>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {p.paid_at ? formatDate(p.paid_at, 'PP') : p.booking?.event_date ? formatDate(p.booking.event_date, 'PP') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {p.method === 'offline' && p.status === 'pending' && (
                      <MarkPaidButton paymentId={p.id} />
                    )}
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
