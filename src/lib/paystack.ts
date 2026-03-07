const PAYSTACK_BASE = 'https://api.paystack.co'

export interface PaystackInitializeParams {
  email: string
  amount: number // in kobo/pesewas (multiply by 100)
  reference: string
  callback_url: string
  metadata?: Record<string, unknown>
}

export interface PaystackInitializeResponse {
  authorization_url: string
  access_code: string
  reference: string
}

export async function initializeTransaction(
  params: PaystackInitializeParams
): Promise<PaystackInitializeResponse> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  const data = await res.json()

  if (!res.ok || !data.status) {
    throw new Error(data.message || 'Paystack initialization failed')
  }

  return data.data as PaystackInitializeResponse
}

export function generatePaystackRef(bookingId: string) {
  return `EVTCTR-${bookingId.slice(0, 8).toUpperCase()}-${Date.now()}`
}
