import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { VenueForm } from '../VenueForm'
import { ToggleVenueButton } from './ToggleVenueButton'
import { VenueImageUpload } from './VenueImageUpload'

export const metadata: Metadata = { title: 'Edit Space' }

interface Props { params: Promise<{ id: string }> }

export default async function EditVenuePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: venue } = await supabase.from('venues').select('*').eq('id', id).single()
  if (!venue) notFound()

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/venues" className="text-sm text-brand-gold hover:underline">← Back</Link>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Edit: {venue.name}</h1>
        </div>
        <ToggleVenueButton id={venue.id} isActive={venue.is_active} />
      </div>
      <VenueForm venue={venue} />
      <VenueImageUpload venue={venue} />
    </div>
  )
}
