'use client'

import { useActionState } from 'react'
import { signUp } from '@/actions/auth'
import { Button } from '@/components/ui/Button'

export function RegisterForm() {
  const [state, action, pending] = useActionState(signUp, null)

  return (
    <form action={action} className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {state?.error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>
      )}
      {state?.success && (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{state.success}</div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Name</label>
        <input
          name="full_name"
          type="text"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
          placeholder="Jane Doe"
        />
      </div>

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
          minLength={6}
          autoComplete="new-password"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
          placeholder="Min 6 characters"
        />
      </div>

      <Button type="submit" loading={pending} className="w-full" size="lg">
        Create Account
      </Button>
    </form>
  )
}
