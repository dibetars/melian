import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { HeroBookingWidget } from '@/components/venues/HeroBookingWidget'
import { GallerySection } from '@/components/home/GallerySection'
import { CalendarCheck, Users, Star, Shield } from 'lucide-react'

const features = [
  {
    icon: CalendarCheck,
    title: 'Easy Online Booking',
    desc: 'Reserve your venue in minutes with real-time availability and instant confirmation.',
  },
  {
    icon: Users,
    title: 'Events of Any Size',
    desc: 'From intimate gatherings to grand celebrations — we have a venue for every occasion.',
  },
  {
    icon: Star,
    title: 'Premium Facilities',
    desc: 'Modern amenities, professional setup, and dedicated support for your event.',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    desc: 'Pay online via Paystack or offline via bank transfer — fully secured and tracked.',
  },
]

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user.id).single()
    isAdmin = profile?.role === 'admin'
  }

  const { data: venues } = await supabase
    .from('venues')
    .select('id, name, capacity')
    .eq('is_active', true)
    .order('name')

  return (
    <>
      <Navbar user={user} isAdmin={isAdmin} />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-brand-green py-28 text-white">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/hero-image.mp4" type="video/mp4" />
          </video>

          {/* Overlay — keeps text readable over any video */}
          <div className="absolute inset-0 bg-brand-green/80" />

          {/* Decorative corner elements */}
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full border border-brand-gold" />
            <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full border border-brand-gold" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full border border-brand-gold/40" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-brand-gold">
              Welcome to Melian Event Center
            </p>
            <h1 className="font-serif text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Your Perfect<br />
              <span className="text-brand-gold">Event Venue</span>
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-base text-white/70 leading-relaxed">
              Discover and book stunning venues for weddings, conferences, parties and more.
              Elegance and excellence, every event.
            </p>
            <HeroBookingWidget venues={venues ?? []} />
          </div>
        </section>

        {/* Divider ornament */}
        <div className="flex items-center justify-center bg-white py-8">
          <div className="h-px w-24 bg-brand-gold/40" />
          <div className="mx-4 h-2 w-2 rotate-45 bg-brand-gold/60" />
          <div className="h-px w-24 bg-brand-gold/40" />
        </div>

        {/* Features */}
        <section className="pb-20 pt-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-14 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-gold">Why Choose Us</p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-brand-green sm:text-4xl">
                The Melian Difference
              </h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold-light text-brand-gold">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-serif font-semibold text-brand-green">{title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery */}
        <GallerySection />

        {/* CTA band */}
        <section className="bg-brand-gold py-16 text-white">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">Reserve Your Date</p>
            <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Ready to Host Your Event?</h2>
            <p className="mt-4 text-white/80">
              Browse our venues and secure your date today.
            </p>
            <Link href="/auth/login" className="mt-8 inline-block">
              <Button
                size="lg"
                className="bg-brand-green hover:bg-brand-green-dark px-10 text-sm uppercase tracking-widest"
              >
                View All Venues
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
