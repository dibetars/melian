import Link from 'next/link'
import Image from 'next/image'
import { Users, Clock } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Venue } from '@/types'

export function VenueCard({ venue }: { venue: Venue }) {
  const thumb = venue.images[0]

  return (
    <Link href={`/venues/${venue.slug}`} className="group block">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        {/* Image */}
        <div className="relative h-48 w-full bg-brand-green-light">
          {thumb ? (
            <Image
              src={thumb}
              alt={venue.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-brand-green/30">
              <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-brand-green">{venue.name}</h3>
          {venue.description && (
            <p className="mt-1 line-clamp-2 text-sm text-gray-500">{venue.description}</p>
          )}

          <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
            {venue.capacity && (
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> Up to {venue.capacity} guests
              </span>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
            <div className="text-sm">
              {venue.price_per_day && (
                <span className="font-semibold text-brand-green">
                  {formatCurrency(venue.price_per_day)}
                </span>
              )}
              {venue.price_per_day && (
                <span className="text-gray-400"> / day</span>
              )}
            </div>
            <span className="text-xs font-medium text-brand-green group-hover:underline">
              View details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
