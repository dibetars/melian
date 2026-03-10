import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'GHS') {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string | Date, fmt = 'PPP') {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, fmt)
}

export function formatTime(time: string) {
  // time is HH:MM:SS or HH:MM
  const [hours, minutes] = time.split(':')
  const h = parseInt(hours)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const displayH = h % 12 === 0 ? 12 : h % 12
  return `${displayH}:${minutes} ${ampm}`
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateBookingRef(bookingId: string) {
  return `BOOK-${bookingId.slice(0, 8).toUpperCase()}`
}

export function getVenueImage(venue: { images: string[]; slug: string }): string {
  if (venue.images && venue.images.length > 0) {
    return venue.images[0]
  }

  // Fallback to local images based on slug
  const localImages = [
    '/gallery-ballroom.png',
    '/gallery-corridor.png',
    '/gallery-lounge.png',
    '/gallery-reception.png',
  ]

  // Simple hash to consistently pick an image for a slug
  let hash = 0
  for (let i = 0; i < venue.slug.length; i++) {
    hash = venue.slug.charCodeAt(i) + ((hash << 5) - hash)
  }

  const index = Math.abs(hash) % localImages.length
  return localImages[index]
}
