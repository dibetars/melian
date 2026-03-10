import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { formatCurrency, getVenueImage } from '@/lib/utils'
import { Users, Clock, CheckCircle } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('venues').select('name').eq('slug', slug).single()
  return { title: data?.name ?? 'Space' }
}

export default async function VenueDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    isAdmin = profile?.role === 'admin'
  }

  const { data: venue } = await supabase
    .from('venues')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .returns<import('@/types').Venue[]>()
    .single()

  if (!venue) notFound()

  const bookHref = user ? `/book/${venue.id}` : `/auth/login?next=/book/${venue.id}`

  const mainImage = getVenueImage(venue)
  const otherImages = venue.images.slice(1, 4)

  return (
    <>
      <Navbar user={user} isAdmin={isAdmin} />
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Gallery */}
          <div className="mb-8 grid gap-2 overflow-hidden rounded-xl">
            <div className="relative h-80 w-full">
              <Image
                src={mainImage}
                alt={venue.name}
                fill
                className="object-cover rounded-xl"
                priority
              />
            </div>
            {otherImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {(otherImages as string[]).map((img, i) => (
                  <div key={i} className="relative h-32 overflow-hidden rounded-lg">
                    <Image src={img} alt={`${venue.name} ${i + 2}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Details */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900">{venue.name}</h1>
              {venue.description && (
                <p className="mt-4 text-gray-600 leading-relaxed">{venue.description}</p>
              )}

              {/* Stats */}
              <div className="mt-6 flex flex-wrap gap-4">
                {venue.capacity && (
                  <div className="flex items-center gap-2 rounded-lg bg-white border border-gray-200 px-4 py-3">
                    <Users className="h-5 w-5 text-brand-green" />
                    <div>
                      <p className="text-xs text-gray-500">Capacity</p>
                      <p className="font-semibold text-gray-900">Up to {venue.capacity} guests</p>
                    </div>
                  </div>
                )}
                {venue.price_per_hour && (
                  <div className="flex items-center gap-2 rounded-lg bg-white border border-gray-200 px-4 py-3">
                    <Clock className="h-5 w-5 text-brand-green" />
                    <div>
                      <p className="text-xs text-gray-500">Per Hour</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(venue.price_per_hour)}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Amenities */}
              {venue.amenities.length > 0 && (
                <div className="mt-8">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">Amenities</h2>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {venue.amenities.map((a) => (
                      <li key={a} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Booking card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>
                <div className="mt-4 space-y-2">
                  {venue.price_per_day && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Per Day</span>
                      <span className="font-semibold">{formatCurrency(venue.price_per_day)}</span>
                    </div>
                  )}
                  {venue.price_per_hour && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Per Hour</span>
                      <span className="font-semibold">{formatCurrency(venue.price_per_hour)}</span>
                    </div>
                  )}
                </div>
                <Link href={bookHref} className="mt-6 block">
                  <Button size="lg" className="w-full">
                    Book This Space
                  </Button>
                </Link>
                <p className="mt-3 text-center text-xs text-gray-400">
                  No payment until you confirm
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
