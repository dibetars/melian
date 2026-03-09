import { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/server'
import { DemoWalkthrough } from './DemoWalkthrough'

export const metadata: Metadata = {
  title: 'Platform Demo — Melian Event Center',
  description: 'Investor walkthrough of the Melian Event Center booking platform.',
}

export default async function DemoPage() {
  let stats = { totalBookings: 0, confirmedBookings: 0, venueCount: 0, totalRevenue: 0 }

  try {
    const supabase = await createAdminClient()
    const [
      { count: totalBookings },
      { count: confirmedBookings },
      { count: venueCount },
      { data: revenue },
    ] = await Promise.all([
      supabase.from('bookings').select('*', { count: 'exact', head: true }),
      supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
      supabase.from('venues').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('payments').select('amount').eq('status', 'paid'),
    ])
    const totalRevenue = (revenue ?? []).reduce((sum, p) => sum + Number(p.amount), 0)
    stats = {
      totalBookings: totalBookings ?? 0,
      confirmedBookings: confirmedBookings ?? 0,
      venueCount: venueCount ?? 0,
      totalRevenue,
    }
  } catch {
    // Use defaults if DB unavailable
  }

  return <DemoWalkthrough stats={stats} />
}
