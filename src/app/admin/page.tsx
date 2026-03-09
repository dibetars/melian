import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { BookingStatusBadge } from '@/components/bookings/BookingStatusBadge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { AdminCharts } from './AdminCharts'
import {
  CalendarDays, Clock, DollarSign, TrendingUp,
  Users, ArrowRight, Ticket
} from 'lucide-react'

export const metadata: Metadata = { title: 'Admin Dashboard' }

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const today = new Date().toISOString().split('T')[0]

  // Core stats
  const [
    { count: totalBookings },
    { count: pendingCount },
    { count: confirmedCount },
    { count: upcomingCount },
    { data: revenue },
  ] = await Promise.all([
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
    supabase.from('bookings').select('*', { count: 'exact', head: true })
      .gte('event_date', today).neq('status', 'cancelled'),
    supabase.from('payments').select('amount').eq('status', 'paid'),
  ])

  const totalRevenue = (revenue ?? []).reduce((sum, p) => sum + Number(p.amount), 0)

  const formatRevenue = (n: number) => {
    if (n >= 1_000_000) return `₵${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `₵${(n / 1_000).toFixed(1)}k`
    return `₵${n.toFixed(0)}`
  }

  // Recent bookings (last 7)
  const { data: recentBookings } = await supabase
    .from('bookings')
    .select('*, venue:venues(name), customer:profiles(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(7)

  // Recent customers (last 6)
  const { data: recentCustomers } = await supabase
    .from('profiles')
    .select('id, full_name, email, created_at')
    .eq('role', 'customer')
    .order('created_at', { ascending: false })
    .limit(6)

  // Monthly revenue — last 6 months
  const { data: monthlyPayments } = await supabase
    .from('payments')
    .select('amount, paid_at')
    .eq('status', 'paid')
    .gte('paid_at', new Date(Date.now() - 180 * 86400000).toISOString())

  // Build monthly buckets
  const monthMap: Record<string, number> = {}
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const key = d.toLocaleString('default', { month: 'short', year: '2-digit' })
    monthMap[key] = 0
  }
  ;(monthlyPayments ?? []).forEach((p) => {
    if (!p.paid_at) return
    const d = new Date(p.paid_at)
    const key = d.toLocaleString('default', { month: 'short', year: '2-digit' })
    if (key in monthMap) monthMap[key] += Number(p.amount)
  })
  const monthlyData = Object.entries(monthMap).map(([month, amount]) => ({ month, amount }))

  // Bookings by status
  const statusData = [
    { status: 'Pending',   count: pendingCount ?? 0,   color: '#F59E0B' },
    { status: 'Confirmed', count: confirmedCount ?? 0,  color: '#1D2755' },
    { status: 'Upcoming',  count: upcomingCount ?? 0,   color: '#ECC356' },
  ]

  const stats = [
    { label: 'Total Bookings',   value: totalBookings ?? 0,           icon: CalendarDays, color: 'text-brand-green',  bg: 'bg-brand-green-light' },
    { label: 'Pending Review',   value: pendingCount ?? 0,             icon: Clock,        color: 'text-amber-600',    bg: 'bg-amber-50' },
    { label: 'Total Revenue',    value: formatRevenue(totalRevenue),   icon: DollarSign,   color: 'text-emerald-600',  bg: 'bg-emerald-50' },
    { label: 'Upcoming Events',  value: upcomingCount ?? 0,            icon: TrendingUp,   color: 'text-brand-gold',   bg: 'bg-brand-gold-light' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <Link
          href="/admin/coupons"
          className="flex items-center gap-2 rounded-lg bg-brand-gold px-4 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-brand-gold-dark transition-colors"
        >
          <Ticket className="h-4 w-4" /> Coupon Generator
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <AdminCharts monthlyData={monthlyData} statusData={statusData} />

      {/* Recent bookings + customers */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Recent bookings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Recent Bookings</h2>
              <Link href="/admin/bookings" className="flex items-center gap-1 text-xs text-brand-gold hover:underline">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {!recentBookings || recentBookings.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-gray-400">No bookings yet.</p>
              ) : (
                recentBookings.map((b) => (
                  <Link
                    key={b.id}
                    href={`/admin/bookings/${b.id}`}
                    className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">{b.event_name}</p>
                      <p className="text-xs text-gray-500">
                        {b.customer?.full_name ?? b.customer?.email} · {b.venue?.name}
                      </p>
                      <p className="text-xs text-gray-400">{formatDate(b.event_date)}</p>
                    </div>
                    <div className="ml-3 flex shrink-0 flex-col items-end gap-1">
                      <span className="text-sm font-semibold text-gray-700">{formatCurrency(b.total_amount)}</span>
                      <BookingStatusBadge status={b.status} />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent customers */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Recent Customers</h2>
              <Users className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {!recentCustomers || recentCustomers.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-gray-400">No customers yet.</p>
              ) : (
                recentCustomers.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-green-light text-sm font-bold text-brand-green">
                      {(c.full_name ?? c.email ?? '?')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {c.full_name ?? '—'}
                      </p>
                      <p className="truncate text-xs text-gray-400">{c.email}</p>
                    </div>
                    <span className="ml-auto text-xs text-gray-400 shrink-0">
                      {new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
