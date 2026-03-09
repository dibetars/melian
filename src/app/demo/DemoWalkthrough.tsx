'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  ChevronLeft, ChevronRight, ExternalLink,
  CalendarCheck, CreditCard, Building2, Shield,
  BarChart3, Tag, Users, TrendingUp, ArrowRight,
  Ticket, Zap, Globe, CheckCircle,
} from 'lucide-react'

interface Stats {
  totalBookings: number
  confirmedBookings: number
  venueCount: number
  totalRevenue: number
}

// ── Helpers ───────────────────────────────────────────────────────
function fmt(n: number) {
  if (n >= 1_000_000) return `₵${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `₵${(n / 1_000).toFixed(1)}k`
  return `₵${n.toFixed(0)}`
}

// ── Browser chrome wrapper ────────────────────────────────────────
function Screen({ url, children }: { url?: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
      <div className="flex items-center gap-2 bg-[#1a2035] px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        <div className="ml-2 flex-1 rounded-md bg-[#0d1320] px-3 py-1 text-[10px] text-gray-500">
          🔒 {url ?? 'melianevents.com'}
        </div>
      </div>
      <div className="bg-[#f8fafc]">{children}</div>
    </div>
  )
}

// ── Mock screens ──────────────────────────────────────────────────
function BookingScreen() {
  return (
    <Screen url="melianevents.com/book/grand-ballroom">
      {/* Hero mini */}
      <div className="relative overflow-hidden bg-[#1D2755] px-5 py-6 text-white">
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full border border-[#ECC356]/20" />
        <p className="mb-0.5 text-[9px] uppercase tracking-[0.3em] text-[#ECC356]">Grand Ballroom · 500 guests</p>
        <h3 className="mb-4 text-base font-bold">Complete Your Booking</h3>
        {/* Booking widget */}
        <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-white/10 p-2.5">
          <div className="rounded-lg bg-white/15 px-2 py-1.5">
            <p className="text-[8px] text-white/50">SPACE</p>
            <p className="text-[11px] font-medium text-white">Grand Ballroom</p>
          </div>
          <div className="rounded-lg bg-white/15 px-2 py-1.5">
            <p className="text-[8px] text-white/50">DATE</p>
            <p className="text-[11px] font-medium text-white">15 Apr 2025</p>
          </div>
          <div className="rounded-lg bg-white/15 px-2 py-1.5">
            <p className="text-[8px] text-white/50">GUESTS</p>
            <p className="text-[11px] font-medium text-white">250</p>
          </div>
        </div>
      </div>
      {/* Form */}
      <div className="bg-white p-4 space-y-2">
        <input readOnly value="Kwame & Abena Wedding Reception"
          className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-[11px] text-gray-700" />
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-[11px] text-gray-600">9:00 AM</div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-[11px] text-gray-600">6:00 PM</div>
        </div>
        {/* Coupon applied */}
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5">
          <CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0" />
          <span className="font-mono text-[11px] font-semibold text-green-700">MELIAN-SAVE20</span>
          <span className="ml-auto text-[10px] text-green-600">−20% applied</span>
        </div>
        {/* Price summary */}
        <div className="rounded-lg bg-[#f0f7f0] p-3 space-y-1">
          <div className="flex justify-between text-[10px]">
            <span className="text-gray-500">9 hrs × GHS 600/hr</span>
            <span className="text-gray-600">GHS 5,400</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-green-600">Coupon (20% off)</span>
            <span className="text-green-600">− GHS 1,080</span>
          </div>
          <div className="flex justify-between border-t border-[#1D2755]/10 pt-1 text-[11px]">
            <span className="font-semibold text-[#1D2755]">Total</span>
            <span className="font-bold text-[#1D2755]">GHS 4,320</span>
          </div>
        </div>
        <button className="w-full rounded-lg bg-[#1D2755] py-2 text-[11px] font-bold uppercase tracking-widest text-white">
          Continue to Payment →
        </button>
      </div>
    </Screen>
  )
}

function PaymentScreen() {
  return (
    <Screen url="melianevents.com/payment/booking-id">
      <div className="bg-white p-5 space-y-3">
        <div>
          <p className="text-[11px] font-bold text-gray-800">Choose Payment Method</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Booking: Kwame & Abena Wedding · GHS 4,320</p>
        </div>

        {/* Online — highlighted */}
        <div className="rounded-xl border-2 border-[#1D2755] bg-[#1D2755]/[0.04] p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <CreditCard className="h-3.5 w-3.5 text-[#1D2755]" />
            <span className="text-[11px] font-bold text-[#1D2755]">Pay Online — Paystack</span>
            <span className="ml-auto rounded-full bg-green-100 px-2 py-0.5 text-[9px] font-semibold text-green-700">
              Instant Confirm
            </span>
          </div>
          <p className="text-[10px] text-gray-500 mb-2">Visa, MasterCard, mobile money accepted.</p>
          <button className="w-full rounded-lg bg-[#1D2755] py-1.5 text-[10px] font-bold text-white">
            Pay GHS 4,320.00 →
          </button>
        </div>

        {/* Offline */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-[11px] font-semibold text-gray-700">Bank Transfer (Offline)</span>
          </div>
          <div className="rounded-lg bg-white border border-gray-100 p-2 space-y-1">
            {[
              ['Bank', 'GCB Bank'],
              ['Account', 'Melian Event Centre Ltd'],
              ['Reference', 'BOOK-KW4A1B2C'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-[10px]">
                <span className="text-gray-400">{k}</span>
                <span className={`font-medium ${k === 'Reference' ? 'font-mono text-[#1D2755]' : 'text-gray-700'}`}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Screen>
  )
}

function DashboardScreen({ stats }: { stats: Stats }) {
  const bars = [32, 55, 40, 72, 48, 100]
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
  return (
    <Screen url="melianevents.com/admin">
      <div className="bg-gray-50 p-4 space-y-3">
        <p className="text-[11px] font-bold text-gray-800">Admin Dashboard</p>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { label: 'Bookings', value: stats.totalBookings || 12, color: 'text-[#1D2755]' },
            { label: 'Pending', value: 3, color: 'text-amber-600' },
            { label: 'Revenue', value: fmt(stats.totalRevenue || 28000), color: 'text-emerald-600' },
            { label: 'Upcoming', value: 5, color: 'text-[#ECC356]' },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl bg-white border border-gray-100 p-2 text-center shadow-sm">
              <p className={`text-sm font-bold ${color}`}>{value}</p>
              <p className="text-[8px] text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div className="rounded-xl bg-white border border-gray-100 p-3">
          <p className="text-[9px] font-medium text-gray-400 mb-2">Revenue — last 6 months</p>
          <div className="flex items-end gap-1.5 h-14">
            {bars.map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-sm"
                  style={{ height: `${h}%`, background: i === 5 ? '#ECC356' : '#1D2755', opacity: i === 5 ? 1 : 0.6 + i * 0.05 }}
                />
                <span className="text-[7px] text-gray-300">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent bookings */}
        <div className="rounded-xl bg-white border border-gray-100 overflow-hidden">
          {[
            { name: 'Kwame & Abena Wedding', venue: 'Grand Ballroom', status: 'confirmed', amt: 'GHS 4,320' },
            { name: 'Annual Board Meeting', venue: 'Executive Suite', status: 'pending', amt: 'GHS 2,000' },
            { name: 'Birthday Gala', venue: 'Garden Terrace', status: 'completed', amt: 'GHS 3,500' },
          ].map((b) => (
            <div key={b.name} className="flex items-center gap-2 border-b border-gray-50 px-3 py-2 last:border-0">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] font-medium text-gray-800">{b.name}</p>
                <p className="text-[9px] text-gray-400">{b.venue}</p>
              </div>
              <span className={`rounded px-1.5 py-0.5 text-[8px] font-semibold ${
                b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                b.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                'bg-amber-100 text-amber-700'
              }`}>{b.status}</span>
              <span className="text-[10px] font-semibold text-gray-700">{b.amt}</span>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  )
}

function CouponScreen() {
  return (
    <Screen url="melianevents.com/admin/coupons">
      <div className="bg-gray-50 p-4 space-y-3">
        <p className="text-[11px] font-bold text-gray-800">Coupon Generator</p>

        {/* Coupon card */}
        <div className="relative overflow-hidden rounded-xl" style={{ background: '#1D2755', aspectRatio: '900/420' }}>
          <div className="absolute inset-y-0 left-0 w-2 rounded-l-xl bg-[#ECC356]" />
          <div className="absolute inset-y-0 right-0 w-2 rounded-r-xl bg-[#ECC356]" />
          <div className="absolute inset-y-2 right-[35%] border-l border-dashed border-[#ECC356]/25" />
          <span className="absolute top-1.5 right-[35%] -translate-x-1/2 text-[10px] text-[#ECC356]/30">✂</span>
          {/* Left */}
          <div className="absolute inset-y-0 left-4 right-[38%] flex flex-col justify-center gap-0.5">
            <p className="font-serif text-sm font-bold text-[#ECC356] leading-none">MELIAN</p>
            <p className="text-[7px] uppercase tracking-[0.25em] text-white/40">Event Centre</p>
            <p className="mt-2 text-[9px] leading-relaxed text-white/65">20% off any space booking</p>
            <p className="mt-1 text-[7px] text-white/30">Valid until 30 Jun 2025</p>
          </div>
          {/* Right */}
          <div className="absolute inset-y-0 right-0 left-[65%] flex flex-col items-center justify-center gap-1 px-2">
            <p className="font-bold text-[#ECC356] text-lg leading-none">20% OFF</p>
            <p className="text-[7px] uppercase tracking-widest text-white/40">Use Code</p>
            <div className="rounded border border-[#ECC356]/50 bg-[#ECC356]/10 px-2 py-0.5 font-mono text-[9px] font-bold text-[#ECC356] tracking-wider">
              MELIAN-SAVE20
            </div>
          </div>
        </div>

        {/* Controls row */}
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { label: 'Discount', value: '20% off' },
            { label: 'Uses Left', value: '48 / 50' },
            { label: 'Expires', value: '30 Jun 2025' },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg border border-gray-200 bg-white p-2">
              <p className="text-[8px] text-gray-400">{label}</p>
              <p className="text-[10px] font-semibold text-gray-700 mt-0.5">{value}</p>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button className="rounded-lg bg-[#1D2755] py-1.5 text-[10px] font-bold text-white">↓ Download PNG</button>
          <button className="rounded-lg border border-green-300 bg-green-50 py-1.5 text-[10px] font-bold text-green-700">
            ✓ Live in System
          </button>
        </div>

        {/* Customer view hint */}
        <div className="rounded-lg border border-dashed border-gray-200 p-2.5">
          <p className="text-[9px] text-gray-400 mb-1.5">Customer sees at checkout:</p>
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-2.5 py-1.5">
            <CheckCircle className="h-3 w-3 text-green-600 shrink-0" />
            <span className="font-mono text-[10px] font-bold text-green-700">MELIAN-SAVE20</span>
            <span className="ml-auto text-[9px] text-green-600">20% off applied</span>
          </div>
        </div>
      </div>
    </Screen>
  )
}

// ── Slide layouts ─────────────────────────────────────────────────
function HeroSlide({ stats }: { stats: Stats }) {
  return (
    <div className="mx-auto max-w-3xl space-y-10 text-center">
      <div className="space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#ECC356]/30 bg-[#ECC356]/10 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ECC356] animate-pulse" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ECC356]">
            Investor Walkthrough
          </span>
        </div>
        <h1 className="text-6xl font-bold leading-none tracking-tight text-white sm:text-7xl">
          Melian<br />
          <span className="text-[#ECC356]">Event Center</span>
        </h1>
        <p className="mx-auto max-w-md text-lg leading-relaxed text-white/50">
          A complete digital booking &amp; management platform.
          <br />Customers book online. You run everything.
        </p>
      </div>

      {/* Live stats */}
      <div className="mx-auto grid max-w-xl grid-cols-4 gap-3">
        {[
          { label: 'Total Bookings', value: stats.totalBookings || '—' },
          { label: 'Confirmed',      value: stats.confirmedBookings || '—' },
          { label: 'Revenue',        value: stats.totalRevenue ? fmt(stats.totalRevenue) : '—' },
          { label: 'Spaces',         value: stats.venueCount || '—' },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 text-center">
            <p className="text-2xl font-bold text-[#ECC356]">{value}</p>
            <p className="mt-1 text-[10px] text-white/40">{label}</p>
          </div>
        ))}
      </div>

      {/* Stack */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {['Next.js 15', 'Supabase', 'Paystack', 'Tailwind CSS', 'TypeScript'].map((t) => (
          <span key={t} className="rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1 text-xs text-white/40">
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

type BulletDef = { icon: React.ElementType; text: string }

function SplitSlide({
  title, tagline, bullets, visual,
}: {
  title: string
  tagline: string
  bullets?: BulletDef[]
  visual: React.ReactNode
}) {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-[2fr_3fr]">
      {/* Text */}
      <div className="space-y-6">
        <h2 className="text-4xl font-bold leading-tight tracking-tight text-white">{title}</h2>
        <p className="text-[15px] leading-relaxed text-white/50">{tagline}</p>
        {bullets && (
          <ul className="space-y-4">
            {bullets.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ECC356]/15">
                  <Icon className="h-3 w-3 text-[#ECC356]" />
                </div>
                <span className="text-sm leading-relaxed text-white/60">{text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Visual */}
      <div>{visual}</div>
    </div>
  )
}

function CloseSlide({ stats }: { stats: Stats }) {
  const features = [
    'Homepage booking widget with live availability',
    'Paystack (online) + bank transfer (offline) payments',
    'Admin dashboard with revenue charts',
    'Confirm, cancel, or complete bookings in one click',
    'Coupon generator + customer redemption at checkout',
    'Role-based access: customer & admin portals',
    'Row-level security on all data (Supabase RLS)',
    'Mobile-responsive across every screen',
  ]
  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5">
          <CheckCircle className="h-3.5 w-3.5 text-green-400" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-green-400">Platform Live &amp; Operational</span>
        </div>
        <h2 className="text-5xl font-bold tracking-tight text-white">Built. Tested. Ready.</h2>
        <p className="text-white/40 text-lg">Everything needed to run a professional event booking business.</p>
      </div>

      {/* Capability grid */}
      <div className="grid gap-2 sm:grid-cols-2">
        {features.map((f) => (
          <div key={f} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
            <CheckCircle className="h-4 w-4 shrink-0 text-[#ECC356]" />
            <span className="text-sm text-white/60">{f}</span>
          </div>
        ))}
      </div>

      {/* CTA row */}
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
        <div className="flex items-center gap-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-8 py-4">
          {[
            { label: 'Bookings',  value: stats.totalBookings || 12 },
            { label: 'Revenue',   value: stats.totalRevenue ? fmt(stats.totalRevenue) : '₵28k' },
            { label: 'Spaces',    value: stats.venueCount || 5 },
          ].map(({ label, value }, i, arr) => (
            <div key={label} className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#ECC356]">{value}</p>
                <p className="text-[10px] text-white/35">{label}</p>
              </div>
              {i < arr.length - 1 && <div className="h-8 w-px bg-white/10" />}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Link href="/"
            className="flex items-center gap-2 rounded-xl bg-[#ECC356] px-6 py-3 text-sm font-bold text-[#1D2755] transition-opacity hover:opacity-90"
          >
            View Platform <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/admin"
            className="flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-sm text-white/60 transition-colors hover:border-white/30 hover:text-white"
          >
            Admin Panel
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── Main orchestrator ─────────────────────────────────────────────
export function DemoWalkthrough({ stats }: { stats: Stats }) {
  const [current, setCurrent] = useState(0)
  const [animKey, setAnimKey] = useState(0)

  type SlideData = {
    id: string
    label: string
    layout: 'hero' | 'split' | 'close'
    title?: string
    tagline?: string
    bullets?: BulletDef[]
    visual?: React.ReactNode
  }

  const slides: SlideData[] = [
    {
      id: 'overview',
      label: 'Overview',
      layout: 'hero',
    },
    {
      id: 'booking',
      label: 'Customer Booking',
      layout: 'split',
      title: 'Customers Book in Under 2 Minutes',
      tagline: 'From the homepage, customers select a space, pick a date, apply a coupon, and confirm — zero back-and-forth.',
      bullets: [
        { icon: Globe,         text: 'Homepage booking widget — space + date + guests in one step' },
        { icon: CalendarCheck, text: 'Live availability calendar with automatic conflict detection' },
        { icon: Tag,           text: 'Coupon field at checkout with instant discount preview' },
      ],
      visual: <BookingScreen />,
    },
    {
      id: 'payment',
      label: 'Payments',
      layout: 'split',
      title: 'Every Payment Tracked',
      tagline: 'Customers pay online via Paystack for instant confirmation, or offline via bank transfer — both fully tracked in the system.',
      bullets: [
        { icon: CreditCard, text: 'Paystack — auto-confirmed via secure webhook verification' },
        { icon: Building2,  text: 'Bank transfer with unique booking reference for easy matching' },
        { icon: Shield,     text: 'Payment status tracked: pending → paid → refunded' },
      ],
      visual: <PaymentScreen />,
    },
    {
      id: 'dashboard',
      label: 'Admin Dashboard',
      layout: 'split',
      title: 'Real-Time Command Center',
      tagline: 'One place to see all revenue, pending bookings, customer activity, and monthly trends.',
      bullets: [
        { icon: BarChart3,   text: 'Revenue bar chart — visualise monthly performance at a glance' },
        { icon: CheckCircle, text: 'Confirm, cancel, or complete any booking with one click' },
        { icon: Users,       text: 'Live recent bookings feed with customer names and amounts' },
      ],
      visual: <DashboardScreen stats={stats} />,
    },
    {
      id: 'coupons',
      label: 'Marketing',
      layout: 'split',
      title: 'Marketing Tools Built In',
      tagline: 'Generate branded discount coupons, save them to the system, and customers apply codes at checkout — discount is instant.',
      bullets: [
        { icon: Ticket,      text: 'Design coupon — % off or fixed GHS amount, with expiry + max uses' },
        { icon: Zap,         text: 'Download PNG image ready to share on WhatsApp, email, or social' },
        { icon: TrendingUp,  text: 'Saved to system — customers apply code at booking checkout' },
      ],
      visual: <CouponScreen />,
    },
    {
      id: 'close',
      label: 'Summary',
      layout: 'close',
    },
  ]

  const navigate = useCallback((to: number) => {
    if (to < 0 || to >= slides.length) return
    setCurrent(to)
    setAnimKey((k) => k + 1)
  }, [slides.length])

  const next = useCallback(() => navigate(current + 1), [current, navigate])
  const prev = useCallback(() => navigate(current - 1), [current, navigate])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next() }
      if (e.key === 'ArrowLeft')                   { e.preventDefault(); prev() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev])

  const slide = slides[current]

  return (
    <div className="flex min-h-screen flex-col bg-[#080e1e]">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-white/[0.06] px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ECC356]">
            <span className="text-xs font-black text-[#1D2755]">M</span>
          </div>
          <span className="text-sm font-medium text-white/70">Melian Event Center</span>
          <span className="rounded-full border border-[#ECC356]/30 bg-[#ECC356]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#ECC356]">
            Investor Demo
          </span>
        </div>

        {/* Progress pills */}
        <div className="flex items-center gap-1.5">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => navigate(i)}
              title={s.label}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'h-2 w-7 bg-[#ECC356]'
                  : i < current
                  ? 'h-2 w-2 bg-white/35 hover:bg-white/55'
                  : 'h-2 w-2 bg-white/12 hover:bg-white/25'
              }`}
            />
          ))}
        </div>

        <Link href="/"
          className="flex items-center gap-1.5 rounded-lg border border-white/12 px-3 py-1.5 text-xs text-white/50 transition-colors hover:border-white/25 hover:text-white/80"
        >
          <ExternalLink className="h-3 w-3" /> Live Platform
        </Link>
      </header>

      {/* Slide content */}
      <main className="flex flex-1 items-center justify-center px-6 py-10 lg:px-16">
        <div
          key={animKey}
          className="w-full max-w-6xl"
          style={{ animation: 'demoIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both' }}
        >
          {slide.layout === 'hero'  && <HeroSlide stats={stats} />}
          {slide.layout === 'split' && (
            <SplitSlide
              title={slide.title!}
              tagline={slide.tagline!}
              bullets={slide.bullets}
              visual={slide.visual}
            />
          )}
          {slide.layout === 'close' && <CloseSlide stats={stats} />}
        </div>
      </main>

      {/* Bottom nav */}
      <footer className="flex items-center justify-between border-t border-white/[0.06] px-6 py-4">
        <button
          onClick={prev}
          disabled={current === 0}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-white/35 transition-all hover:bg-white/5 hover:text-white/70 disabled:cursor-not-allowed disabled:opacity-20"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </button>

        <span className="font-mono text-[11px] text-white/25">
          {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          <span className="ml-2 text-white/15">—</span>
          <span className="ml-2 text-white/30">{slide.label}</span>
        </span>

        <button
          onClick={next}
          disabled={current === slides.length - 1}
          className="flex items-center gap-1.5 rounded-lg bg-white/[0.05] px-3 py-2 text-xs text-white/60 transition-all hover:bg-[#ECC356]/15 hover:text-[#ECC356] disabled:cursor-not-allowed disabled:opacity-20"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </footer>

      <style>{`
        @keyframes demoIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
