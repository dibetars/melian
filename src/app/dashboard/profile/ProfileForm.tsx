'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import type { Profile } from '@/types'

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [phone, setPhone] = useState(profile?.phone ?? '')
  const [isPending, startTransition] = useTransition()
  const supabase = createClient()

  function handleSave() {
    startTransition(async () => {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName, phone })
        .eq('id', profile!.id)

      if (error) toast.error(error.message)
      else toast.success('Profile updated.')
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Name</label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
        <input
          value={profile?.email ?? ''}
          disabled
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Phone</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
          placeholder="+233 XX XXX XXXX"
        />
      </div>
      <Button loading={isPending} onClick={handleSave}>Save Changes</Button>
    </div>
  )
}
