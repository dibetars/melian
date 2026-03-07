import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = { title: 'Booking Confirmed' }

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 text-center">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h1>
        <p className="mt-2 text-gray-500">
          Your payment was successful and your booking is confirmed. You&apos;ll receive a
          confirmation shortly.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link href="/dashboard/bookings">
            <Button className="w-full">View My Bookings</Button>
          </Link>
          <Link href="/venues">
            <Button variant="outline" className="w-full">Browse More Venues</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
