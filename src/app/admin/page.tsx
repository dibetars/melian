import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'

export const metadata: Metadata = { title: 'Admin Dashboard' }

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [
    { count: totalBookings },
    { count: pendingCount },
    { data: revenue },
    { count: upcomingCount },
  ] = await Promise.all([
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase.from('payments').select('amount').eq('status', 'paid'),
    supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .gte('event_date', new Date().toISOString().split('T')[0])
      .neq('status', 'cancelled'),
  ])

  const totalRevenue = (revenue ?? []).reduce((sum, p) => sum + Number(p.amount), 0)

  const stats = [
    { label: 'Total Bookings', value: totalBookings ?? 0 },
    { label: 'Pending Bookings', value: pendingCount ?? 0 },
    { label: 'Total Revenue', value: formatCurrency(totalRevenue) },
    { label: 'Upcoming Events', value: upcomingCount ?? 0 },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="pt-6">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
