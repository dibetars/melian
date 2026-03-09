'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface NavbarProps {
  user: { id: string; email?: string } | null
  isAdmin?: boolean
}

const leftLinks = [
  { href: '/venues', label: 'Our Spaces' },
]

export function Navbar({ user, isAdmin }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const linkCls = (href: string) =>
    cn(
      'text-xs font-semibold uppercase tracking-widest transition-colors',
      pathname.startsWith(href) ? 'text-brand-gold' : 'text-gray-500 hover:text-brand-green'
    )

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur shadow-sm">
      <nav className="mx-auto grid max-w-7xl grid-cols-3 items-center px-4 py-3 sm:px-6 lg:px-8">
        {/* Left — nav links */}
        <div className="hidden items-center gap-8 md:flex">
          {leftLinks.map(({ href, label }) => (
            <Link key={href} href={href} className={linkCls(href)}>{label}</Link>
          ))}
        </div>

        {/* Center — logo */}
        <Link href="/" className="flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Melian Event Center"
            width={140}
            height={56}
            className="h-12 w-auto object-contain"
            priority
            onError={(e) => {
              const img = e.target as HTMLImageElement
              img.style.display = 'none'
              const parent = img.parentElement!
              parent.innerHTML = `<span class="font-serif text-xl font-bold tracking-wide text-brand-green">Melian<span class="block text-xs font-sans font-normal tracking-[0.25em] text-brand-gold uppercase">Event Center</span></span>`
            }}
          />
        </Link>

        {/* Right — actions */}
        <div className="hidden items-center justify-end gap-4 md:flex">
          {user ? (
            <>
              {isAdmin && (
                <Link href="/admin" className={linkCls('/admin')}>Admin</Link>
              )}
              <Link href="/dashboard" className={linkCls('/dashboard')}>Dashboard</Link>
              <Button variant="outline" size="sm" className="text-xs uppercase tracking-widest" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-xs font-semibold uppercase tracking-widest text-gray-500 hover:text-brand-green transition-colors">
                Login
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="text-xs uppercase tracking-widest px-5">Book Now</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="flex justify-end md:hidden col-start-3">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-6 w-6 text-brand-green" /> : <Menu className="h-6 w-6 text-brand-green" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 pb-5 md:hidden">
          <div className="space-y-3 pt-3">
            {leftLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block text-xs font-semibold uppercase tracking-widest text-gray-600"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full text-xs uppercase tracking-widest">Dashboard</Button>
                </Link>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full text-xs uppercase tracking-widest">Admin</Button>
                  </Link>
                )}
                <Button variant="secondary" size="sm" className="text-xs uppercase tracking-widest" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full text-xs uppercase tracking-widest">Login</Button>
                </Link>
                <Link href="/auth/register" onClick={() => setMenuOpen(false)}>
                  <Button size="sm" className="w-full text-xs uppercase tracking-widest">Book Now</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
