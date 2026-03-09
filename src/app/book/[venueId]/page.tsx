import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { BookingForm } from './BookingForm'
import { formatCurrency } from '@/lib/utils'
import { Users } from 'lucide-react'

export const metadata: Metadata = { title: 'Book a Space' }

// Fallback images for spaces that don't yet have uploaded photos
const FALLBACK_IMAGES: Record<string, string> = {
  'grand-ballroom':  '/gallery-ballroom.png',
  'dining-hall':     '/gallery-reception.png',
  'garden-terrace':  'https://images.pexels.com/photos/3951652/pexels-photo-3951652.jpeg?auto=compress&cs=tinysrgb&w=1200&h=500&dpr=1',
  'executive-suite': 'https://images.pexels.com/photos/5103610/pexels-photo-5103610.jpeg?auto=compress&cs=tinysrgb&w=1200&h=500&dpr=1',
  'atrium':          '/gallery-lounge.png',
}

interface Props {
  params: Promise<{ venueId: string }>
}

export default async function BookPage({ params }: Props) {
  const { venueId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
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

  // Only block dates that are confirmed (paid/accepted) — pending bookings
  // don't permanently hold a date until admin confirms
  const { data: bookedRows } = await supabase
    .from('bookings')
    .select('event_date')
    .eq('venue_id', venueId)
    .eq('status', 'confirmed')

  const bookedDates = (bookedRows || []).map((b) => b.event_date)

  // Resolve image: uploaded photo → fallback by slug → generic fallback
  const heroImage =
    venue.images?.[0] ??
    FALLBACK_IMAGES[venue.slug] ??
    '/gallery-ballroom.png'

  return (
    <>
      <Navbar user={user} isAdmin={profile?.role === 'admin'} />
      <main className="min-h-screen bg-gray-50">

        {/* Space hero banner */}
        <div className="relative h-56 w-full overflow-hidden sm:h-72 bg-brand-green">
          <img
            src={heroImage}
            alt={venue.name}
            className="h-full w-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-green/90 via-brand-green/40 to-transparent" />
          {/* Space info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">
              Now Booking
            </p>
            <h1 className="mt-1 font-serif text-2xl font-bold text-white sm:text-3xl">
              {venue.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-white/70">
              {venue.capacity && (
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  Up to {venue.capacity} guests
                </span>
              )}
              {venue.price_per_day && (
                <span>{formatCurrency(venue.price_per_day)} / day</span>
              )}
              {venue.price_per_hour && (
                <span>{formatCurrency(venue.price_per_hour)} / hour</span>
              )}
            </div>
          </div>
        </div>

        {/* Booking form */}
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
          <p className="mb-6 text-sm text-gray-500">
            Fill in your event details below. Greyed-out dates are already confirmed.
          </p>
          <BookingForm venue={venue} bookedDates={bookedDates} />
        </div>
      </main>
    </>
  )
}
