'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays, Users, ChevronDown } from 'lucide-react'

interface VenueOption {
  id: string
  name: string
  capacity: number
}

interface Props {
  venues: VenueOption[]
}

export function HeroBookingWidget({ venues }: Props) {
  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]

  const [venueId, setVenueId] = useState('')
  const [date, setDate] = useState('')
  const [guests, setGuests] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (venueId) {
      const params = new URLSearchParams()
      if (date) params.set('date', date)
      if (guests) params.set('guests', guests)
      const qs = params.toString()
      router.push(`/book/${venueId}${qs ? `?${qs}` : ''}`)
    } else {
      const params = new URLSearchParams()
      if (date) params.set('date', date)
      router.push(`/venues${date ? `?${params.toString()}` : ''}`)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 w-full rounded-2xl border border-white/20 bg-white/10 p-1 backdrop-blur-md sm:rounded-full"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-stretch">
        {/* Space */}
        <div className="group relative flex flex-1 flex-col rounded-xl bg-white/90 px-4 py-3 transition hover:bg-white sm:rounded-l-full sm:rounded-r-none">
          <label className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-brand-green">
            Space
          </label>
          <div className="relative flex items-center">
            <select
              value={venueId}
              onChange={e => setVenueId(e.target.value)}
              className="w-full appearance-none bg-transparent pr-6 text-sm font-medium text-gray-800 focus:outline-none"
            >
              <option value="">Any space</option>
              {venues.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} (up to {v.capacity})
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="hidden w-px bg-white/20 sm:block" />

        {/* Date */}
        <div className="group relative flex flex-1 flex-col rounded-xl bg-white/90 px-4 py-3 transition hover:bg-white sm:rounded-none">
          <label className="mb-0.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-brand-green">
            <CalendarDays className="h-3 w-3" /> Date
          </label>
          <input
            type="date"
            value={date}
            min={today}
            onChange={e => setDate(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-gray-800 focus:outline-none"
          />
        </div>

        <div className="hidden w-px bg-white/20 sm:block" />

        {/* Guests */}
        <div className="group relative flex flex-1 flex-col rounded-xl bg-white/90 px-4 py-3 transition hover:bg-white sm:rounded-none">
          <label className="mb-0.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-brand-green">
            <Users className="h-3 w-3" /> Guests
          </label>
          <input
            type="number"
            value={guests}
            min={1}
            placeholder="How many?"
            onChange={e => setGuests(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-brand-gold px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-brand-gold-dark sm:rounded-r-full sm:rounded-l-none"
        >
          Check Availability
        </button>
      </div>
    </form>
  )
}
