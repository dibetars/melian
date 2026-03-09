import { Metadata } from 'next'
import Link from 'next/link'
import { VenueForm } from '../VenueForm'

export const metadata: Metadata = { title: 'New Space' }

export default function NewVenuePage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/admin/venues" className="text-sm text-brand-gold hover:underline">← Back to Spaces</Link>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">Create New Space</h1>
      </div>
      <VenueForm />
    </div>
  )
}
