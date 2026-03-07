import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import { Plus } from 'lucide-react'

export const metadata: Metadata = { title: 'Admin — Venues' }

export default async function AdminVenuesPage() {
  const supabase = await createClient()

  const { data: venues } = await supabase
    .from('venues')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Venues</h1>
        <Link href="/admin/venues/new">
          <Button size="sm"><Plus className="h-4 w-4" /> New Venue</Button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Name', 'Capacity', 'Per Day', 'Per Hour', 'Status', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {!venues || venues.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-400">No venues yet. Create one!</td>
              </tr>
            ) : (
              venues.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{v.name}</td>
                  <td className="px-4 py-3 text-gray-500">{v.capacity ?? '—'}</td>
                  <td className="px-4 py-3">{v.price_per_day ? formatCurrency(v.price_per_day) : '—'}</td>
                  <td className="px-4 py-3">{v.price_per_hour ? formatCurrency(v.price_per_hour) : '—'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={v.is_active ? 'success' : 'default'}>
                      {v.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/venues/${v.id}`} className="text-brand-gold hover:underline">Edit</Link>
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
