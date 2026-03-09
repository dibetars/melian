'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { toggleVenueActive } from '@/actions/venues'

export function ToggleVenueButton({ id, isActive }: { id: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleVenueActive(id, isActive)
      if (result.error) toast.error(result.error)
      else { toast.success(isActive ? 'Space deactivated.' : 'Space activated.'); router.refresh() }
    })
  }

  return (
    <Button
      variant={isActive ? 'danger' : 'secondary'}
      size="sm"
      loading={isPending}
      onClick={handleToggle}
    >
      {isActive ? 'Deactivate' : 'Activate'}
    </Button>
  )
}
