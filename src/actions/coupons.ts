'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type CouponResult = {
  code: string
  discount_type: 'percent' | 'fixed'
  discount_value: number
  description: string | null
  discountAmount: number
  discountLabel: string
}

/**
 * Validate a coupon code against a booking subtotal.
 * Returns the discount info on success, or an error string.
 */
export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<{ coupon: CouponResult } | { error: string }> {
  const supabase = await createClient()

  const { data: coupon, error } = await supabase
    .from('coupons')
    .select('code, discount_type, discount_value, description, expiry_date, max_uses, uses_count')
    .eq('code', code.trim().toUpperCase())
    .eq('is_active', true)
    .single()

  if (!coupon || error) return { error: 'Invalid or inactive coupon code.' }

  if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
    return { error: 'This coupon has expired.' }
  }

  if (coupon.max_uses !== null && coupon.uses_count >= coupon.max_uses) {
    return { error: 'This coupon has reached its usage limit.' }
  }

  const rawDiscount =
    coupon.discount_type === 'percent'
      ? (subtotal * Number(coupon.discount_value)) / 100
      : Number(coupon.discount_value)

  const discountAmount = Math.min(rawDiscount, subtotal)

  const discountLabel =
    coupon.discount_type === 'percent'
      ? `${coupon.discount_value}% off`
      : `GHS ${Number(coupon.discount_value).toFixed(2)} off`

  return {
    coupon: {
      code: coupon.code,
      discount_type: coupon.discount_type as 'percent' | 'fixed',
      discount_value: Number(coupon.discount_value),
      description: coupon.description,
      discountAmount,
      discountLabel,
    },
  }
}

/**
 * Save a coupon to the database (admin only).
 */
export async function saveCoupon(data: {
  code: string
  discount_type: 'percent' | 'fixed'
  discount_value: number
  description?: string
  expiry_date?: string
  max_uses?: number | null
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Forbidden' }

  const admin = await createAdminClient()
  const { error } = await admin.from('coupons').upsert(
    {
      code: data.code.trim().toUpperCase(),
      discount_type: data.discount_type,
      discount_value: data.discount_value,
      description: data.description || null,
      expiry_date: data.expiry_date || null,
      max_uses: data.max_uses || null,
      is_active: true,
    },
    { onConflict: 'code' }
  )

  if (error) return { error: error.message }

  revalidatePath('/admin/coupons')
  return { success: true }
}
