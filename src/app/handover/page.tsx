import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'

export const metadata: Metadata = { title: 'Handover Guide' }

const loginUrl = 'https://www.melianeventcentre.com/auth/login'

const customerAccess = [
  'Create an account using their personal email address and password.',
  'Sign in to access their customer dashboard.',
  'View all their bookings and open each booking for full event and payment details.',
  'Update their profile details, including full name and phone number.',
  'Cancel a booking while it is still pending.',
]

const spaceFields = [
  'Space name',
  'Description',
  'Capacity',
  'Price per day',
  'Price per hour',
  'Amenities',
  'Images',
  'Active or inactive status',
]

const paymentNeeds = [
  'Bank name',
  'Account name',
  'Account number',
  'PAYSTACK_SECRET_KEY',
  'NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY',
]

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
              This page explains the main accounts, customer access, space updates, and payment
              collection workflow for Melian Event Center.
            </p>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Back to Admin
          </Link>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Accounts</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <h3 className="font-medium text-gray-900">Admin Account</h3>
              <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Login URL</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a href={loginUrl} className="text-brand-gold hover:underline">
                      {loginUrl}
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

            <div>
              <h3 className="font-medium text-gray-900">Regular Users</h3>
              <p className="mt-2 text-sm text-gray-600">
                Regular users do not use a shared account. Each customer creates an account with
                their own email address and password, then signs in to their personal dashboard.
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
                {customerAccess.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Parts Of The Application</h2>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="font-medium text-gray-900">Admin Area</h3>
              <p className="mt-2 text-sm text-gray-600">
                Used by the business to manage spaces, bookings, payments, and operational details.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="font-medium text-gray-900">Customer Area</h3>
              <p className="mt-2 text-sm text-gray-600">
                Used by customers to book spaces, review booking details, check payment status, and
                update profile information.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">How To Update Spaces</h2>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-700">
            <ol className="list-decimal space-y-2 pl-5">
              <li>Log in with the admin account.</li>
              <li>Go to the admin dashboard and open the Spaces section.</li>
              <li>Select an existing space to edit it, or create a new one.</li>
            </ol>
            <div>
              <p className="font-medium text-gray-900">You can update:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {spaceFields.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
              <p className="font-medium">Visibility note</p>
              <p className="mt-1 text-sm">
                Active spaces are visible to customers. Inactive spaces are hidden from the public
                booking pages.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Collecting Payments</h2>
          </CardHeader>
          <CardContent className="space-y-6 text-sm text-gray-700">
            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="font-medium text-gray-900">Online Payment</h3>
              <p className="mt-2">
                Customers can pay online using Paystack. Once the payment succeeds, the payment
                flow updates the booking accordingly.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="font-medium text-gray-900">Bank Transfer</h3>
              <p className="mt-2">
                Customers can request bank transfer details and receive a booking reference to use
                when making the transfer.
              </p>
              <ol className="mt-3 list-decimal space-y-2 pl-5">
                <li>The customer selects bank transfer at payment.</li>
                <li>The system shows the bank transfer instructions and a reference.</li>
                <li>The customer completes the transfer using that reference.</li>
                <li>The admin verifies the transfer and marks the payment as paid.</li>
                <li>The booking then moves to a confirmed state.</li>
              </ol>
            </div>
            <div className="rounded-xl border border-brand-green/20 bg-brand-green-light p-4">
              <h3 className="font-medium text-gray-900">Information Needed Before Go-Live</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {paymentNeeds.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-gray-700">
                Paystack should also be configured with the live webhook so successful online
                payments update the website automatically.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
