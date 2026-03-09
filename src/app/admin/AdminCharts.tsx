'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'

interface MonthlyDatum { month: string; amount: number }
interface StatusDatum  { status: string; count: number; color: string }

export function AdminCharts({
  monthlyData,
  statusData,
}: {
  monthlyData: MonthlyDatum[]
  statusData: StatusDatum[]
}) {
  const maxRevenue = Math.max(...monthlyData.map((d) => d.amount), 1)

  return (
    <div className="grid gap-6 lg:grid-cols-3">

      {/* Revenue bar chart — spans 2 cols */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Revenue — Last 6 Months</h2>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barSize={32} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `₵${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                cursor={{ fill: '#f9fafb' }}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {monthlyData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.amount === maxRevenue ? '#ECC356' : '#1D2755'}
                    opacity={entry.amount === 0 ? 0.2 : 1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Status breakdown */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Booking Status</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {statusData.map(({ status, count, color }) => {
            const total = statusData.reduce((s, d) => s + d.count, 0) || 1
            const pct = Math.round((count / total) * 100)
            return (
              <div key={status}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{status}</span>
                  <span className="text-gray-500">{count} <span className="text-xs text-gray-400">({pct}%)</span></span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            )
          })}

          {statusData.every((d) => d.count === 0) && (
            <p className="text-center text-sm text-gray-400 py-6">No booking data yet.</p>
          )}
        </CardContent>
      </Card>

    </div>
  )
}
