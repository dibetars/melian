'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { markOfflinePaid } from '@/actions/payments'

export function MarkPaidButton({ paymentId }: { paymentId: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleMark() {
    startTransition(async () => {
      const result = await markOfflinePaid(paymentId)
      if (result.error) toast.error(result.error)
      else { toast.success('Payment marked as paid.'); router.refresh() }
    })
  }

  return (
    <Button size="sm" loading={isPending} onClick={handleMark}>
      Mark Paid
    </Button>
  )
}
