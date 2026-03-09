import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = { title: 'Booking Confirmed' }

interface Props {
  searchParams: Promise<{ method?: string; already?: string }>
}

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const { method } = await searchParams
  const isOffline = method === 'offline'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 text-center">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

        {/* Icon */}
        <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${isOffline ? 'bg-amber-100' : 'bg-green-100'}`}>
          {isOffline
            ? <Clock className="h-8 w-8 text-amber-600" />
            : <CheckCircle className="h-8 w-8 text-green-600" />
          }
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-900">
          {isOffline ? 'Booking Received!' : 'Booking Confirmed!'}
        </h1>

        {/* Body */}
        {isOffline ? (
          <div className="mt-3 space-y-3 text-sm text-gray-500">
            <p>
              Your booking is <strong className="text-gray-700">pending payment</strong>. 
              Please complete the bank transfer using the details provided.
            </p>
            <div className="rounded-lg bg-amber-50 border border-amber-100 px-4 py-3 text-left text-amber-800 text-xs leading-relaxed">
              <p className="font-semibold mb-1">What happens next?</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Make the transfer to the bank account provided</li>
                <li>Include your booking reference in the description</li>
                <li>Our team will verify and confirm your booking within 1 business day</li>
                <li>You'll see the status update in your dashboard</li>
              </ol>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-gray-500">
            Your payment was successful and your booking is confirmed. 
            You&apos;ll receive a confirmation shortly.
          </p>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3">
          <Link href="/dashboard/bookings">
            <Button className="w-full">View My Bookings</Button>
          </Link>
          <Link href="/venues">
            <Button variant="outline" className="w-full">Book Another Event</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
