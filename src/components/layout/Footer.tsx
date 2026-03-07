import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-brand-green py-12 text-white/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <Link href="/" className="text-center sm:text-left">
            <span className="font-serif text-xl font-bold tracking-wide text-white">Melian</span>
            <span className="block text-xs tracking-[0.3em] text-brand-gold uppercase">Event Center</span>
          </Link>
          <p className="text-xs tracking-wide text-white/50">
            © {new Date().getFullYear()} Melian Event Center. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs font-semibold uppercase tracking-widest text-white/60">
            <Link href="/venues" className="hover:text-brand-gold transition-colors">Venues</Link>
            <Link href="/auth/login" className="hover:text-brand-gold transition-colors">Login</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
