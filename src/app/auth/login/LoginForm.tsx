'use client'

import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import { signIn } from '@/actions/auth'
import { Button } from '@/components/ui/Button'

export function LoginForm() {
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/dashboard'
  const [state, action, pending] = useActionState(signIn, null)

  return (
    <form action={action} className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <input type="hidden" name="next" value={next} />

      {state?.error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
          placeholder="••••••••"
        />
      </div>

      <Button type="submit" loading={pending} className="w-full" size="lg">
        Sign In
      </Button>
    </form>
  )
}
