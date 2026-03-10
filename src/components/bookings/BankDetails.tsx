'use client'

import { useState } from 'react'
import { Building2, Copy, CheckCheck } from 'lucide-react'

const BANK_DETAILS = [
  { label: 'Bank',           value: 'GCB Bank (Ghana Commercial Bank)' },
  { label: 'Account Name',  value: 'Melian Event Centre Ltd' },
  { label: 'Account Number',value: '1234567890123' },
  { label: 'Branch',        value: 'Accra Main' },
  { label: 'Sort Code',     value: '030100' },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="ml-2 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-brand-green hover:bg-brand-green-light transition-colors"
    >
      {copied ? <CheckCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

export function BankDetails({ bookingRef }: { bookingRef: string }) {
  return (
    <div className="rounded-xl border border-brand-gold/30 bg-amber-50 p-5 space-y-4">
      <div className="flex items-center gap-2 text-brand-green">
        <Building2 className="h-5 w-5 shrink-0" />
        <h3 className="font-semibold">Bank Transfer Details</h3>
      </div>

      <div className="divide-y divide-amber-100 rounded-lg bg-white border border-amber-100 overflow-hidden text-sm">
        {BANK_DETAILS.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between px-4 py-3">
            <span className="text-gray-500 shrink-0 w-36">{label}</span>
            <span className="font-medium text-gray-900 text-right">{value}</span>
            {(label === 'Account Number' || label === 'Sort Code') && (
              <CopyButton text={value} />
            )}
          </div>
        ))}
        {/* Payment reference */}
        <div className="flex items-center justify-between bg-brand-green-light px-4 py-3">
          <span className="text-gray-600 shrink-0 w-36 font-medium">Your Reference</span>
          <span className="font-mono font-bold text-brand-green text-right">{bookingRef}</span>
          <CopyButton text={bookingRef} />
        </div>
      </div>

      <p className="text-xs text-amber-700 leading-relaxed">
        ⚠️ Please include your <strong>reference number</strong> in the transfer description. 
        Your booking will be held and confirmed once we verify receipt of payment — 
        usually within 1 business day.
      </p>
    </div>
  )
}