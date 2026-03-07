import { Badge } from '@/components/ui/Badge'
import type { BookingStatus } from '@/types'

const variantMap: Record<BookingStatus, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'danger',
  completed: 'info',
}

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <Badge variant={variantMap[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}
