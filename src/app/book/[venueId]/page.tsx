import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { BookingForm } from './BookingForm'

export const metadata: Metadata = { title: 'Book Venue' }

interface Props {
  params: Promise<{ venueId: string }>
}

export default async function BookPage({ params }: Props) {
  const { venueId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/auth/login?next=/book/${venueId}`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const { data: venue } = await supabase
    .from('venues')
    .select('*')
    .eq('id', venueId)
    .eq('is_active', true)
    .single()

  if (!venue) notFound()

  // Get already-booked dates
  const { data: bookedRows } = await supabase
    .from('bookings')
    .select('event_date')
    .eq('venue_id', venueId)
    .neq('status', 'cancelled')

  const bookedDates = (bookedRows || []).map((b) => b.event_date)

  return (
    <>
      <Navbar user={user} isAdmin={profile?.role === 'admin'} />
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Book: {venue.name}</h1>
            <p className="mt-1 text-sm text-gray-500">Fill in your event details below.</p>
          </div>
          <BookingForm venue={venue} bookedDates={bookedDates} />
        </div>
      </main>
    </>
  )
}
