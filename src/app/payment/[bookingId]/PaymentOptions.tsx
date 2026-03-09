'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, Banknote, Copy, CheckCheck, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createOfflinePayment } from '@/actions/payments'
import { cn } from '@/lib/utils'

interface Props {
  bookingId: string
  amount: number
  email: string
  bookingRef: string
}

const BANK_DETAILS = [
  { label: 'Bank',           value: 'GCB Bank (Ghana Commercial Bank)' },
  { label: 'Account Name',  value: 'Melian Event Centre Ltd' },
  { label: 'Account Number',value: '1234567890123' },
  { label: 'Branch',        value: 'Accra Main' },
  { label: 'Sort Code',     value: '030100' },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="ml-2 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-brand-green hover:bg-brand-green-light transition-colors"
    >
      {copied ? <CheckCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

export function PaymentOptions({ bookingId, amount, email, bookingRef }: Props) {
  const router = useRouter()
  const [method, setMethod] = useState<'online' | 'offline' | null>(null)
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

  function handleConfirmOffline() {
    startOffline(async () => {
      const result = await createOfflinePayment(bookingId)
      if (result.error) {
        setError(result.error)
      } else {
        router.push('/payment/success?method=offline')
      }
    })
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Online option */}
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

      {method === 'online' && (
        <Button size="lg" className="w-full" loading={onlineLoading} onClick={handleOnline}>
          Proceed to Paystack
        </Button>
      )}

      {/* Offline option */}
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

      {/* Bank details — shown immediately when offline is selected */}
      {method === 'offline' && (
        <div className="rounded-xl border border-brand-gold/30 bg-amber-50 p-5 space-y-4">
          <div className="flex items-center gap-2 text-brand-green">
            <Building2 className="h-5 w-5 shrink-0" />
            <h3 className="font-semibold">Bank Transfer Details</h3>
          </div>

          <div className="divide-y divide-amber-100 rounded-lg bg-white border border-amber-100 overflow-hidden text-sm">
            {BANK_DETAILS.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-4 py-3">
                <span className="text-gray-500 shrink-0 w-36">{label}</span>
                <span className="font-medium text-gray-900 text-right">{value}</span>
                {(label === 'Account Number' || label === 'Sort Code') && (
                  <CopyButton text={value} />
                )}
              </div>
            ))}
            {/* Payment reference */}
            <div className="flex items-center justify-between bg-brand-green-light px-4 py-3">
              <span className="text-gray-600 shrink-0 w-36 font-medium">Your Reference</span>
              <span className="font-mono font-bold text-brand-green text-right">{bookingRef}</span>
              <CopyButton text={bookingRef} />
            </div>
          </div>

          <p className="text-xs text-amber-700 leading-relaxed">
            ⚠️ Please include your <strong>reference number</strong> in the transfer description. 
            Your booking will be held and confirmed once we verify receipt of payment — 
            usually within 1 business day.
          </p>

          <Button
            size="lg"
            variant="secondary"
            className="w-full"
            loading={offlineLoading}
            onClick={handleConfirmOffline}
          >
            I've Noted the Details — Confirm Booking
          </Button>
        </div>
      )}
    </div>
  )
}
