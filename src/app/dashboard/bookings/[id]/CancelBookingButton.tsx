'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { cancelBooking } from '@/actions/bookings'

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleCancel() {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    startTransition(async () => {
      const result = await cancelBooking(bookingId)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Booking cancelled.')
        router.refresh()
      }
    })
  }

  return (
    <Button variant="danger" loading={isPending} onClick={handleCancel}>
      Cancel Booking
    </Button>
  )
}
