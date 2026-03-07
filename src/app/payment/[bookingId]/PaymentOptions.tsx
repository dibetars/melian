'use client'

import { useState, useTransition } from 'react'
import { CreditCard, Banknote } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createOfflinePayment } from '@/actions/payments'
import { cn } from '@/lib/utils'

interface Props {
  bookingId: string
  amount: number
  email: string
  bookingRef: string
}

export function PaymentOptions({ bookingId, amount, email, bookingRef }: Props) {
  const [method, setMethod] = useState<'online' | 'offline' | null>(null)
  const [offlineDone, setOfflineDone] = useState(false)
  const [onlineLoading, startOnline] = useTransition()
  const [offlineLoading, startOffline] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleOnline() {
    startOnline(async () => {
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, email, amount }),
      })
      const data = await res.json()
      if (data.authorization_url) {
        window.location.href = data.authorization_url
      } else {
        setError(data.error || 'Failed to initialize payment.')
      }
    })
  }

  function handleOffline() {
    startOffline(async () => {
      const result = await createOfflinePayment(bookingId)
      if (result.error) {
        setError(result.error)
      } else {
        setOfflineDone(true)
      }
    })
  }

  if (offlineDone) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-sm text-green-800">
        <h3 className="mb-3 font-semibold text-green-900">Bank Transfer Instructions</h3>
        <div className="space-y-1">
          <p><span className="font-medium">Bank:</span> Example Bank</p>
          <p><span className="font-medium">Account Name:</span> Melian Event Center</p>
          <p><span className="font-medium">Account Number:</span> 0123456789</p>
          <p className="mt-3 font-medium">
            Reference:{' '}
            <span className="rounded bg-green-100 px-2 py-0.5 font-mono text-green-900">
              {bookingRef}
            </span>
          </p>
        </div>
        <p className="mt-4 text-xs text-green-700">
          Include the reference in your transfer. Your booking will be confirmed once we verify payment.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Online */}
      <button
        type="button"
        onClick={() => setMethod('online')}
        className={cn(
          'w-full rounded-xl border-2 p-4 text-left transition-colors',
          method === 'online'
            ? 'border-brand-gold bg-brand-green-light'
            : 'border-gray-200 bg-white hover:border-gray-300'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green-light text-brand-green">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Pay Online (Paystack)</p>
            <p className="text-sm text-gray-500">Card, mobile money, or bank transfer via Paystack</p>
          </div>
        </div>
      </button>

      {/* Offline */}
      <button
        type="button"
        onClick={() => setMethod('offline')}
        className={cn(
          'w-full rounded-xl border-2 p-4 text-left transition-colors',
          method === 'offline'
            ? 'border-brand-gold bg-brand-green-light'
            : 'border-gray-200 bg-white hover:border-gray-300'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green-light text-brand-green">
            <Banknote className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Pay Offline (Bank Transfer)</p>
            <p className="text-sm text-gray-500">Transfer to our bank account and notify us</p>
          </div>
        </div>
      </button>

      {method === 'online' && (
        <Button
          size="lg"
          className="w-full"
          loading={onlineLoading}
          onClick={handleOnline}
        >
          Proceed to Paystack
        </Button>
      )}

      {method === 'offline' && (
        <Button
          size="lg"
          variant="secondary"
          className="w-full"
          loading={offlineLoading}
          onClick={handleOffline}
        >
          Get Bank Details
        </Button>
      )}
    </div>
  )
}
