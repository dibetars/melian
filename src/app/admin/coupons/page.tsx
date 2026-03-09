import { Metadata } from 'next'
import { CouponGenerator } from './CouponGenerator'

export const metadata: Metadata = { title: 'Coupon Generator' }

export default function CouponsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Coupon Generator</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a discount coupon and download the image to share with customers.
        </p>
      </div>
      <CouponGenerator />
    </div>
  )
}
