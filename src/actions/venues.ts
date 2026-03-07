'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'
import type { Venue } from '@/types'

export async function createVenue(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const capacity = Number(formData.get('capacity'))
  const price_per_day = Number(formData.get('price_per_day'))
  const price_per_hour = Number(formData.get('price_per_hour'))
  const amenitiesRaw = formData.get('amenities') as string
  const amenities = amenitiesRaw
    ? amenitiesRaw.split(',').map((a) => a.trim()).filter(Boolean)
    : []

  const slug = slugify(name)

  const { data, error } = await supabase
    .from('venues')
    .insert({ name, slug, description, capacity, price_per_day, price_per_hour, amenities })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/venues')
  revalidatePath('/admin/venues')
  return { data }
}

export async function updateVenue(id: string, formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const capacity = Number(formData.get('capacity'))
  const price_per_day = Number(formData.get('price_per_day'))
  const price_per_hour = Number(formData.get('price_per_hour'))
  const amenitiesRaw = formData.get('amenities') as string
  const amenities = amenitiesRaw
    ? amenitiesRaw.split(',').map((a) => a.trim()).filter(Boolean)
    : []
  const slug = slugify(name)

  const { data, error } = await supabase
    .from('venues')
    .update({ name, slug, description, capacity, price_per_day, price_per_hour, amenities })
    .eq('id', id)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/venues')
  revalidatePath(`/venues/${slug}`)
  revalidatePath('/admin/venues')
  return { data }
}

export async function toggleVenueActive(id: string, isActive: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('venues')
    .update({ is_active: !isActive })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/venues')
  revalidatePath('/admin/venues')
  return { success: true }
}

export async function getBookedDates(venueId: string): Promise<string[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('bookings')
    .select('event_date')
    .eq('venue_id', venueId)
    .neq('status', 'cancelled')

  return (data || []).map((b) => b.event_date)
}

export async function uploadVenueImage(venueId: string, file: File): Promise<string | null> {
  const supabase = await createClient()

  const ext = file.name.split('.').pop()
  const path = `${venueId}/${Date.now()}.${ext}`

  const { error } = await supabase.storage.from('venue-images').upload(path, file)
  if (error) return null

  const { data } = supabase.storage.from('venue-images').getPublicUrl(path)
  return data.publicUrl
}

export async function addVenueImage(venue: Venue, imageUrl: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('venues')
    .update({ images: [...venue.images, imageUrl] })
    .eq('id', venue.id)

  if (error) return { error: error.message }

  revalidatePath('/admin/venues')
  revalidatePath(`/venues/${venue.slug}`)
  return { success: true }
}
