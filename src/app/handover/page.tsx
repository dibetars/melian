import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import {
  AccountsWalkthrough,
  SpacesWalkthrough,
  PaymentsWalkthrough,
} from './HandoverWalkthroughs'

export const metadata: Metadata = { title: 'Handover Guide' }

export default async function HandoverPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?next=/handover')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  return (
    <>
      <Navbar user={user} isAdmin={true} />
      <main className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="info">Admin Only</Badge>
              <Badge variant="outline">Internal Guide</Badge>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Website Handover Guide</h1>
            <p className="mt-2 max-w-3xl text-sm text-gray-600">
              Step-by-step walkthroughs for managing accounts, spaces, and payments on
              Melian Event Center. Click any step to expand it.
            </p>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Back to Admin
          </Link>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-6">
          <h2 className="mb-1 text-base font-semibold text-gray-900">Admin Account</h2>
          <dl className="mt-3 grid gap-3 sm:grid-cols-3">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Login URL</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <a
                  href="https://www.melianeventcentre.com/auth/login"
                  className="text-brand-gold hover:underline"
                >
                  melianeventcentre.com/auth/login
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">info@melianeventcentre.com</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Password</dt>
              <dd className="mt-1 text-sm text-gray-600">Shared separately for security.</dd>
            </div>
          </dl>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Accounts</h2>
            <p className="mt-1 text-sm text-gray-500">
              How the admin and customer accounts work — switch tabs to see each flow.
            </p>
          </CardHeader>
          <CardContent>
            <AccountsWalkthrough />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Managing Spaces</h2>
            <p className="mt-1 text-sm text-gray-500">
              Follow the steps below to add or update a venue space. Click each step to read the detail.
            </p>
          </CardHeader>
          <CardContent>
            <SpacesWalkthrough />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Collecting Payments</h2>
            <p className="mt-1 text-sm text-gray-500">
              Two payment methods are supported. Use the Go-Live Checklist before launching.
            </p>
          </CardHeader>
          <CardContent>
            <PaymentsWalkthrough />
          </CardContent>
        </Card>
      </main>
    </>
  )
}
