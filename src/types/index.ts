export type UserRole = 'customer' | 'admin'

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export type PaymentMethod = 'online' | 'offline'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface Profile {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Venue {
  id: string
  name: string
  slug: string
  description: string | null
  capacity: number | null
  price_per_day: number | null
  price_per_hour: number | null
  amenities: string[]
  images: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  venue_id: string
  customer_id: string
  event_name: string
  event_date: string
  start_time: string
  end_time: string
  guest_count: number | null
  total_amount: number
  status: BookingStatus
  notes: string | null
  admin_notes: string | null
  created_at: string
  updated_at: string
  // Joined fields
  venue?: Venue
  customer?: Profile
  payment?: Payment
}

export interface Payment {
  id: string
  booking_id: string
  amount: number
  currency: string
  method: PaymentMethod
  status: PaymentStatus
  paystack_ref: string | null
  paystack_data: Record<string, unknown> | null
  paid_at: string | null
  created_at: string
  updated_at: string
  booking?: Booking
}
