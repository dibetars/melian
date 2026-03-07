'use client'

import { useState, useTransition } from 'react'
import { DayPicker } from 'react-day-picker'
import { parseISO, format, isWeekend } from 'date-fns'
import { createBooking } from '@/actions/bookings'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import type { Venue } from '@/types'
import 'react-day-picker/dist/style.css'

interface Props {
  venue: Venue
  bookedDates: string[]
}

export function BookingForm({ venue, bookedDates }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('17:00')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const disabledDays = [
    { before: new Date() },
    ...bookedDates.map((d) => parseISO(d)),
  ]

  const hoursDiff = () => {
    const [sh, sm] = startTime.split(':').map(Number)
    const [eh, em] = endTime.split(':').map(Number)
    return Math.max(0, eh + em / 60 - (sh + sm / 60))
  }

  const totalAmount = () => {
    const hours = hoursDiff()
    if (venue.price_per_hour) return hours * venue.price_per_hour
    if (venue.price_per_day) return venue.price_per_day
    return 0
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

      {/* Price summary */}
      {totalAmount() > 0 && (
        <div className="rounded-lg bg-brand-green-light p-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {venue.price_per_hour
                ? `${hoursDiff().toFixed(1)} hours × ${formatCurrency(venue.price_per_hour!)}`
                : 'Full day rate'}
            </span>
            <span className="font-semibold text-brand-green">{formatCurrency(totalAmount())}</span>
          </div>
        </div>
      )}

      <Button type="submit" loading={isPending} size="lg" className="w-full">
        Continue to Payment
      </Button>
    </form>
  )
}
