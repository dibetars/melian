'use client'

import { useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { DayPicker } from 'react-day-picker'
import { parseISO, format } from 'date-fns'
import { createBooking } from '@/actions/bookings'
import { validateCoupon, type CouponResult } from '@/actions/coupons'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import type { Venue } from '@/types'
import { Tag, CheckCircle, XCircle } from 'lucide-react'
import 'react-day-picker/dist/style.css'

interface Props {
  venue: Venue
  bookedDates: string[]
}

export function BookingForm({ venue, bookedDates }: Props) {
  const searchParams = useSearchParams()
  const initialDate = searchParams.get('date')
    ? (() => { try { return parseISO(searchParams.get('date')!) } catch { return undefined } })()
    : undefined
  const initialGuests = searchParams.get('guests') ?? ''

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate)
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('17:00')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Coupon state
  const [couponInput, setCouponInput] = useState('')
  const [couponResult, setCouponResult] = useState<CouponResult | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [isCouponPending, startCouponTransition] = useTransition()

  const disabledDays = [
    { before: new Date() },
    ...bookedDates.map((d) => parseISO(d)),
  ]

  const hoursDiff = () => {
    const [sh, sm] = startTime.split(':').map(Number)
    const [eh, em] = endTime.split(':').map(Number)
    return Math.max(0, eh + em / 60 - (sh + sm / 60))
  }

  const subtotal = () => {
    const hours = hoursDiff()
    if (venue.price_per_hour) return hours * venue.price_per_hour
    if (venue.price_per_day) return venue.price_per_day
    return 0
  }

  const discount = couponResult?.discountAmount ?? 0
  const totalAmount = () => Math.max(0, subtotal() - discount)

  function handleApplyCoupon() {
    const code = couponInput.trim()
    if (!code) return
    setCouponError(null)
    setCouponResult(null)
    startCouponTransition(async () => {
      const res = await validateCoupon(code, subtotal())
      if ('error' in res) {
        setCouponError(res.error)
      } else {
        setCouponResult(res.coupon)
      }
    })
  }

  function handleRemoveCoupon() {
    setCouponResult(null)
    setCouponError(null)
    setCouponInput('')
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!selectedDate) {
      setError('Please select an event date.')
      return
    }
    if (startTime >= endTime) {
      setError('End time must be after start time.')
      return
    }

    const formData = new FormData(e.currentTarget)
    formData.set('event_date', format(selectedDate, 'yyyy-MM-dd'))
    formData.set('total_amount', totalAmount().toString())
    formData.set('discount_amount', discount.toString())
    if (couponResult) {
      formData.set('coupon_code', couponResult.code)
    }

    startTransition(async () => {
      const result = await createBooking(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <input type="hidden" name="venue_id" value={venue.id} />

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Event name */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Event Name</label>
        <input
          name="event_name"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
          placeholder="e.g. Jane & John Wedding"
        />
      </div>

      {/* Date picker */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Event Date
          {selectedDate && (
            <span className="ml-2 text-brand-green">{format(selectedDate, 'PPP')}</span>
          )}
        </label>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={disabledDays}
            className="p-3"
          />
        </div>
      </div>

      {/* Times */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Start Time</label>
          <input
            name="start_time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">End Time</label>
          <input
            name="end_time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
          />
        </div>
      </div>

      {/* Guest count */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Expected Guests
          {venue.capacity && (
            <span className="ml-1 text-gray-400">(max {venue.capacity})</span>
          )}
        </label>
        <input
          name="guest_count"
          type="number"
          min={1}
          max={venue.capacity ?? undefined}
          required
          defaultValue={initialGuests}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
          placeholder="50"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Special Requests <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          name="notes"
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
          placeholder="Catering needs, decorations, etc."
        />
      </div>

      {/* Coupon code */}
      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
          <Tag className="h-3.5 w-3.5 text-brand-gold" />
          Coupon Code <span className="text-gray-400">(optional)</span>
        </label>

        {couponResult ? (
          /* Applied coupon badge */
          <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5">
            <CheckCircle className="h-4 w-4 shrink-0 text-green-600" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-green-700">
                {couponResult.code} — {couponResult.discountLabel}
              </p>
              {couponResult.description && (
                <p className="text-xs text-green-600">{couponResult.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={handleRemoveCoupon}
              className="ml-auto shrink-0 text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Remove coupon"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              placeholder="e.g. MELIAN-ABC12"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm uppercase outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleApplyCoupon() } }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleApplyCoupon}
              loading={isCouponPending}
              disabled={!couponInput.trim()}
            >
              Apply
            </Button>
          </div>
        )}

        {couponError && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
            <XCircle className="h-3.5 w-3.5" /> {couponError}
          </p>
        )}
      </div>

      {/* Price summary */}
      {subtotal() > 0 && (
        <div className="rounded-lg bg-brand-green-light p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {venue.price_per_hour
                ? `${hoursDiff().toFixed(1)} hours × ${formatCurrency(venue.price_per_hour!)}`
                : 'Full day rate'}
            </span>
            <span className="font-medium text-gray-700">{formatCurrency(subtotal())}</span>
          </div>

          {couponResult && (
            <div className="flex justify-between text-sm">
              <span className="text-green-600">
                Coupon ({couponResult.discountLabel})
              </span>
              <span className="font-medium text-green-600">
                − {formatCurrency(couponResult.discountAmount)}
              </span>
            </div>
          )}

          {couponResult && (
            <div className="border-t border-brand-green/20 pt-2 flex justify-between text-sm">
              <span className="font-semibold text-brand-green">Total</span>
              <span className="font-bold text-brand-green">{formatCurrency(totalAmount())}</span>
            </div>
          )}

          {!couponResult && (
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-brand-green">Total</span>
              <span className="font-bold text-brand-green">{formatCurrency(totalAmount())}</span>
            </div>
          )}
        </div>
      )}

      <Button type="submit" loading={isPending} size="lg" className="w-full">
        Continue to Payment
      </Button>
    </form>
  )
}
