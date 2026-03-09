'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { createVenue, updateVenue } from '@/actions/venues'
import type { Venue } from '@/types'

export function VenueForm({ venue }: { venue?: Venue }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = venue
        ? await updateVenue(venue.id, formData)
        : await createVenue(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(venue ? 'Space updated.' : 'Space created.')
        if (!venue) router.push('/admin/venues')
      }
    })
  }

  const field = (
    name: string,
    label: string,
    opts?: { type?: string; placeholder?: string; defaultValue?: string | number; required?: boolean }
  ) => (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      <input
        name={name}
        type={opts?.type ?? 'text'}
        placeholder={opts?.placeholder}
        defaultValue={opts?.defaultValue}
        required={opts?.required}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
      />
    </div>
  )

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {field('name', 'Space Name', { required: true, defaultValue: venue?.name, placeholder: 'Grand Ballroom' })}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              rows={4}
              defaultValue={venue?.description ?? ''}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
            />
          </div>

          {field('capacity', 'Capacity (guests)', { type: 'number', defaultValue: venue?.capacity ?? '' })}

          <div className="grid grid-cols-2 gap-4">
            {field('price_per_day', 'Price Per Day (GHS)', { type: 'number', defaultValue: venue?.price_per_day ?? '' })}
            {field('price_per_hour', 'Price Per Hour (GHS)', { type: 'number', defaultValue: venue?.price_per_hour ?? '' })}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Amenities <span className="text-gray-400">(comma-separated)</span>
            </label>
            <input
              name="amenities"
              defaultValue={venue?.amenities?.join(', ') ?? ''}
              placeholder="WiFi, Projector, AC, Parking"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
            />
          </div>

          <Button type="submit" loading={isPending}>
            {venue ? 'Save Changes' : 'Create Space'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
