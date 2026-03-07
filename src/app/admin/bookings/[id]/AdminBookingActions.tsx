'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { adminUpdateBooking } from '@/actions/bookings'
import type { Booking } from '@/types'

export function AdminBookingActions({ booking }: { booking: Booking }) {
  const [notes, setNotes] = useState(booking.admin_notes ?? '')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function update(updates: Parameters<typeof adminUpdateBooking>[1]) {
    startTransition(async () => {
      const result = await adminUpdateBooking(booking.id, updates)
      if (result.error) toast.error(result.error)
      else { toast.success('Booking updated.'); router.refresh() }
    })
  }

  return (
    <Card>
      <CardHeader><h2 className="font-semibold">Actions</h2></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {booking.status === 'pending' && (
            <Button size="sm" onClick={() => update({ status: 'confirmed' })} loading={isPending}>
              Confirm
            </Button>
          )}
          {booking.status === 'confirmed' && (
            <Button size="sm" variant="secondary" onClick={() => update({ status: 'completed' })} loading={isPending}>
              Mark Completed
            </Button>
          )}
          {(booking.status === 'pending' || booking.status === 'confirmed') && (
            <Button size="sm" variant="danger" onClick={() => update({ status: 'cancelled' })} loading={isPending}>
              Cancel
            </Button>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Admin Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
          />
          <Button
            size="sm"
            variant="outline"
            className="mt-2"
            onClick={() => update({ admin_notes: notes })}
            loading={isPending}
          >
            Save Notes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
