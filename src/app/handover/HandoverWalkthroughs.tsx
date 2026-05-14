'use client'

import { useState } from 'react'
import {
  LogIn, ShieldCheck, LayoutDashboard, UserPlus, CalendarCheck,
  Search, Building2, Edit3, Eye, CreditCard, Banknote,
  CheckCircle2, FileText, BadgeCheck, AlertTriangle, Key,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Step = {
  icon: React.ReactNode
  title: string
  description: string
  note?: string
}

function StepList({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(0)
  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => {
        const isActive = i === active
        const isDone = i < active
        return (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="group flex items-start gap-4 text-left focus:outline-none"
          >
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-all',
                  isActive
                    ? 'border-brand-gold bg-brand-gold text-white shadow-md'
                    : isDone
                    ? 'border-green-500 bg-green-50 text-green-600'
                    : 'border-gray-200 bg-white text-gray-400 group-hover:border-gray-400'
                )}
              >
                {isDone ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    'mt-1 w-0.5 flex-1',
                    isDone ? 'bg-green-300' : 'bg-gray-200'
                  )}
                  style={{ minHeight: 32 }}
                />
              )}
            </div>

            <div
              className={cn(
                'mb-2 flex-1 rounded-xl border p-4 transition-all',
                isActive
                  ? 'border-brand-gold/30 bg-amber-50 shadow-sm'
                  : isDone
                  ? 'border-green-100 bg-green-50/50'
                  : 'border-gray-100 bg-white group-hover:border-gray-200 group-hover:bg-gray-50'
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-lg',
                    isActive ? 'text-amber-600' : isDone ? 'text-green-600' : 'text-gray-400'
                  )}
                >
                  {step.icon}
                </span>
                <p
                  className={cn(
                    'text-sm font-semibold',
                    isActive ? 'text-gray-900' : isDone ? 'text-green-800' : 'text-gray-600'
                  )}
                >
                  {step.title}
                </p>
              </div>
              {isActive && (
                <div className="mt-2 space-y-1 pl-9">
                  <p className="text-sm text-gray-700">{step.description}</p>
                  {step.note && (
                    <p className="mt-1 flex items-start gap-1 text-xs text-amber-700">
                      <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                      {step.note}
                    </p>
                  )}
                </div>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}

function Tabs({
  tabs,
  children,
}: {
  tabs: string[]
  children: (active: number) => React.ReactNode
}) {
  const [active, setActive] = useState(0)
  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200 pb-0">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActive(i)}
            className={cn(
              '-mb-px px-4 py-2.5 text-sm font-medium transition-all',
              active === i
                ? 'border-b-2 border-brand-gold text-amber-700'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {tab}
          </button>
        ))}
      </div>
      {children(active)}
    </div>
  )
}

const adminSteps: Step[] = [
  {
    icon: <LogIn className="h-4 w-4" />,
    title: 'Go to the login page',
    description:
      'Open your browser and visit https://www.melianeventcentre.com/auth/login. This is the only entry point for the admin account.',
  },
  {
    icon: <Key className="h-4 w-4" />,
    title: 'Enter your credentials',
    description:
      'Type the admin email address (info@melianeventcentre.com) and the password that was shared separately. Click Sign In.',
    note: 'Keep the password confidential — do not share it in chat or email.',
  },
  {
    icon: <ShieldCheck className="h-4 w-4" />,
    title: 'You\'re in the admin panel',
    description:
      'After signing in, you will be taken to the admin dashboard. The sidebar gives you access to Spaces, Bookings, Payments, and Coupons.',
  },
  {
    icon: <LayoutDashboard className="h-4 w-4" />,
    title: 'Manage the platform',
    description:
      'From here you can create or edit spaces, view and update booking statuses, confirm bank transfers, and generate coupon codes.',
  },
]

const customerSteps: Step[] = [
  {
    icon: <UserPlus className="h-4 w-4" />,
    title: 'Customer registers',
    description:
      'Each customer visits the website and clicks "Create one" on the login page. They enter their name, email, and a password of their choice.',
  },
  {
    icon: <LogIn className="h-4 w-4" />,
    title: 'Customer signs in',
    description:
      'Using their own email and password, the customer signs in. They are taken to their personal dashboard.',
  },
  {
    icon: <Search className="h-4 w-4" />,
    title: 'Customer browses spaces',
    description:
      'From the homepage or the Venues page, the customer can view all active spaces, check availability by date, and read descriptions.',
  },
  {
    icon: <CalendarCheck className="h-4 w-4" />,
    title: 'Customer makes a booking',
    description:
      'They select a space, choose a date and time, enter guest count, and submit the booking. The booking starts in a "pending" state.',
  },
  {
    icon: <CheckCircle2 className="h-4 w-4" />,
    title: 'Customer tracks their booking',
    description:
      'The customer can visit their dashboard at any time to view all bookings, see payment status, and cancel a booking while it is still pending.',
  },
]

const spaceSteps: Step[] = [
  {
    icon: <LogIn className="h-4 w-4" />,
    title: 'Log in as admin',
    description: 'Visit the login page and sign in with the admin account credentials.',
  },
  {
    icon: <LayoutDashboard className="h-4 w-4" />,
    title: 'Open the admin dashboard',
    description: 'After signing in you will land on the admin dashboard. Click "Venues" in the sidebar.',
  },
  {
    icon: <Building2 className="h-4 w-4" />,
    title: 'Choose a space or create one',
    description:
      'Click on an existing space to edit it, or click "Add New Space" to create a brand new venue listing.',
  },
  {
    icon: <Edit3 className="h-4 w-4" />,
    title: 'Fill in the details',
    description:
      'Update the name, description, capacity, pricing (per day / per hour), amenities list, and upload photos for the space.',
    note: 'Images are stored in Supabase Storage. Make sure photos are high quality — they appear on the public booking pages.',
  },
  {
    icon: <Eye className="h-4 w-4" />,
    title: 'Set visibility and save',
    description:
      'Toggle the space to "Active" to make it visible to customers, or "Inactive" to hide it. Click Save to publish your changes.',
  },
]

const onlinePaymentSteps: Step[] = [
  {
    icon: <CreditCard className="h-4 w-4" />,
    title: 'Customer selects "Pay Online"',
    description:
      'At the payment page, the customer sees two options. They click "Pay Online" to proceed with Paystack.',
  },
  {
    icon: <BadgeCheck className="h-4 w-4" />,
    title: 'Paystack popup opens',
    description:
      'A secure Paystack payment modal appears. The customer enters their card details or chooses a Paystack payment method.',
  },
  {
    icon: <CheckCircle2 className="h-4 w-4" />,
    title: 'Payment is confirmed',
    description:
      'Paystack processes the payment and sends a webhook to the website. The booking is automatically updated to "paid".',
    note: 'The live Paystack webhook must be configured before go-live for this to work automatically.',
  },
  {
    icon: <CalendarCheck className="h-4 w-4" />,
    title: 'Booking moves to confirmed',
    description:
      "The customer's dashboard shows the booking as confirmed. No manual action is needed from the admin.",
  },
]

const bankTransferSteps: Step[] = [
  {
    icon: <Banknote className="h-4 w-4" />,
    title: 'Customer selects "Bank Transfer"',
    description:
      'At the payment page, the customer clicks "Pay via Bank Transfer" to see the bank details.',
  },
  {
    icon: <FileText className="h-4 w-4" />,
    title: 'System shows bank details and reference',
    description:
      'The website displays the bank account name, number, and a unique booking reference. The customer is instructed to use this reference.',
  },
  {
    icon: <Building2 className="h-4 w-4" />,
    title: 'Customer makes the transfer',
    description:
      'The customer visits their bank or uses their banking app to transfer the correct amount using the provided reference.',
  },
  {
    icon: <ShieldCheck className="h-4 w-4" />,
    title: 'Admin verifies the transfer',
    description:
      'You log in to the admin dashboard, find the booking, and confirm the transfer was received. Mark the payment as "Paid".',
  },
  {
    icon: <CheckCircle2 className="h-4 w-4" />,
    title: 'Booking is confirmed',
    description:
      'Once you mark the payment as paid, the booking status moves to "confirmed" and the customer can see this on their dashboard.',
  },
]

const goLiveItems = [
  { label: 'Bank name', done: false },
  { label: 'Account name', done: false },
  { label: 'Account number', done: false },
  { label: 'PAYSTACK_SECRET_KEY (live key)', done: false },
  { label: 'NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY (live key)', done: false },
  { label: 'Paystack live webhook URL configured', done: false },
]

function GoLiveChecklist() {
  const [checked, setChecked] = useState<boolean[]>(goLiveItems.map(() => false))
  const toggle = (i: number) =>
    setChecked((prev) => prev.map((v, j) => (j === i ? !v : v)))
  const done = checked.filter(Boolean).length
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">Check off each item as you complete it.</p>
        <span className="text-sm font-semibold text-gray-700">
          {done}/{goLiveItems.length} complete
        </span>
      </div>
      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-green-500 transition-all duration-500"
          style={{ width: `${(done / goLiveItems.length) * 100}%` }}
        />
      </div>
      <ul className="space-y-2">
        {goLiveItems.map((item, i) => (
          <li key={item.label}>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-transparent p-2 hover:bg-gray-50">
              <input
                type="checkbox"
                checked={checked[i]}
                onChange={() => toggle(i)}
                className="h-4 w-4 rounded border-gray-300 accent-green-600"
              />
              <span
                className={cn(
                  'text-sm',
                  checked[i] ? 'text-gray-400 line-through' : 'text-gray-800'
                )}
              >
                {item.label}
              </span>
            </label>
          </li>
        ))}
      </ul>
      {done === goLiveItems.length && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-center text-sm font-medium text-green-700">
          All items completed — you are ready to go live!
        </div>
      )}
    </div>
  )
}

export function AccountsWalkthrough() {
  return (
    <Tabs tabs={['Admin Login', 'Customer Journey']}>
      {(active) =>
        active === 0 ? (
          <StepList steps={adminSteps} />
        ) : (
          <StepList steps={customerSteps} />
        )
      }
    </Tabs>
  )
}

export function SpacesWalkthrough() {
  return <StepList steps={spaceSteps} />
}

export function PaymentsWalkthrough() {
  return (
    <Tabs tabs={['Online Payment', 'Bank Transfer', 'Go-Live Checklist']}>
      {(active) =>
        active === 0 ? (
          <StepList steps={onlinePaymentSteps} />
        ) : active === 1 ? (
          <StepList steps={bankTransferSteps} />
        ) : (
          <GoLiveChecklist />
        )
      }
    </Tabs>
  )
}
