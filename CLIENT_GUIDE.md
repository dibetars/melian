# Melian Event Center — Client Guide
**Version 1.0 · March 2026 · Prepared by Tarsus Studios**

---

## 1. Getting Started

### Website URLs
| | |
|---|---|
| **Live Site** | https://event-center-ten.vercel.app |
| **Login** | https://event-center-ten.vercel.app/auth/login |
| **Venues** | https://event-center-ten.vercel.app/venues |

### Test Accounts

**Admin (Business Owner)**
| | |
|---|---|
| Email | `fabrice@tarsusstudios.com` |
| Password | `Melian2024!` |
| Access | Full admin dashboard — venues, bookings, payments, stats |

**Customer (Test Booker)**
| | |
|---|---|
| Email | `dibelaba@gmail.com` |
| Password | `Melian2024!` |
| Access | Customer dashboard — my bookings, profile |

> 💡 **Tip:** Use two different browsers (e.g. Chrome + Safari) to be logged in as both admin and customer at the same time during testing.

### Two Distinct Areas
- **`/admin`** — You (the business owner) see all bookings, manage venues, confirm payments, view revenue
- **`/dashboard`** — Customers see only their own bookings and profile. Any customer trying to access `/admin` is automatically redirected.

---

## 2. Pre-Launch Checklist

Before sharing the site with real customers, complete these one-time steps:

### A. Add Your Logo
- Save your logo as **`public/logo.png`** inside the project folder
- The navbar will automatically display it — a text fallback shows until then

### B. Add a Hero Video *(optional but recommended)*
- Save a short looping video (10–30 sec, MP4) as **`public/hero-video.mp4`**
- Ideal: event hall interior, wedding setup, conference ambiance
- The green overlay is already in place — any video colour scheme works

### C. Set API Keys in Vercel
Go to [vercel.com → your project → Settings → Environment Variables](https://vercel.com/dibe-labas-projects/event-center/settings/environment-variables) and add:

| Variable | Status |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Already set |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Already set |
| `NEXT_PUBLIC_APP_URL` | ✅ Already set |
| `SUPABASE_SERVICE_ROLE_KEY` | ⚠️ Add from Supabase → Project Settings → API |
| `PAYSTACK_SECRET_KEY` | ⚠️ Add from Paystack → Settings → API Keys |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | ⚠️ Add from Paystack → Settings → API Keys |

> After adding any variable, go to **Deployments → Redeploy** in Vercel for it to take effect.

### D. Update Supabase Auth Redirect URLs
Go to [Supabase Dashboard → Authentication → URL Configuration](https://supabase.com/dashboard/project/cofjlbtnsfsrfbmmfoed/auth/url-configuration):

| Setting | Value |
|---|---|
| **Site URL** | `https://event-center-ten.vercel.app` |
| **Redirect URLs** | `https://event-center-ten.vercel.app/auth/callback` |

### E. Connect a Custom Domain *(optional)*
1. Vercel Dashboard → Domains → add your domain (e.g. `melianventcenter.com`)
2. Update Supabase Auth **Site URL** and **Redirect URL** to the new domain
3. Update `NEXT_PUBLIC_APP_URL` env var to the new domain

---

## 3. Admin Dashboard Guide

Log in with the admin account, then go to **`/admin`**.

### 3.1 Creating a Venue
Go to **Admin → Venues → Add New Venue** and fill in:

1. **Name** — public display name (e.g. "The Grand Hall")
2. **Slug** — URL path, auto-generated or type your own (e.g. `grand-hall`)
3. **Description** — full details about the space and services
4. **Capacity** — maximum number of guests
5. **Price Per Day / Per Hour** — set one or both
6. **Amenities** — comma-separated (e.g. `Wi-Fi, Sound System, Air Conditioning`)
7. **Images** — upload one or more photos

> New venues are **Active** by default. Toggle to Inactive at any time from the edit page — inactive venues are hidden from customers.

### 3.2 Managing Bookings
Go to **Admin → Bookings** to see every booking across all venues.

Click any booking row to open the detail view. Available actions:
- **Confirm** — marks booking as Confirmed (use after receiving payment)
- **Cancel** — cancels the booking
- **Mark Complete** — marks the event as delivered (post-event)
- **Add Admin Note** — internal note, not visible to the customer

**Booking Status Flow:**

| Status | Meaning |
|---|---|
| `pending` | Newly created, awaiting payment |
| `confirmed` | Payment received, booking locked in |
| `completed` | Event has taken place |
| `cancelled` | Cancelled by admin or customer |

### 3.3 Handling Payments
Go to **Admin → Payments**.

- **Online payments (Paystack)** — update automatically when the customer pays; no action needed
- **Offline payments (Bank Transfer)** — customer receives your bank details + a unique reference

For offline payments, once you receive the bank transfer:
1. Find the payment in Admin → Payments (filter by Offline / Pending)
2. Click **Mark as Paid**
3. The booking status automatically updates to **Confirmed**

> The unique reference given to the customer (format: `BOOK-XXXXXXXX`) appears in the Payment Reference column. Ask customers to include it in their transfer description.

### 3.4 Viewing Stats
The Admin Dashboard homepage (`/admin`) shows:
- **Total Bookings** — all-time count
- **Total Revenue** — sum of all confirmed/completed payments
- **Pending Bookings** — awaiting payment or confirmation
- **Upcoming Events** — confirmed bookings in the next 30 days

---

## 4. Testing the Booking Flow

> Before testing online payments, make sure `PAYSTACK_SECRET_KEY` and `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` are set in Vercel. Use **TEST keys** (not live) for initial testing.

### Step 1 — Create a Venue (as Admin)
1. Log in as admin
2. Admin → Venues → Add New Venue → fill all fields → Save
3. Visit `/venues` and confirm the venue card appears

**Expected:** Venue shows with name, capacity, and pricing.

### Step 2 — Book the Venue (as Customer)
1. Open a new browser window / incognito
2. Sign in as customer (`dibelaba@gmail.com`)
3. Go to `/venues` → click your venue → **Book This Venue**
4. Fill in event name, date, start/end time, guest count → **Confirm Booking**

**Expected:** Redirected to the payment options page.

### Step 3a — Test Online Payment (Paystack)
1. Select **Online Payment** → **Pay with Paystack**
2. Use test card: `4084 0840 8408 4081` · Expiry: any future date · CVV: `408`
3. Complete payment → redirected to `/payment/success`

**Expected in admin:** Booking shows as Confirmed, payment marked Paid.

### Step 3b — Test Offline Payment (Bank Transfer)
1. Create a second booking (different date)
2. Select **Bank Transfer** → note the `BOOK-XXXXXXXX` reference
3. In admin, go to Admin → Payments → find the offline pending entry → **Mark as Paid**

**Expected:** Booking status changes to Confirmed.

### Step 4 — Verify Double-Booking Prevention
Try booking the same venue, same date, overlapping time.

**Expected:** Error message blocks the booking.

### Step 5 — Verify Access Control
- Visit `/admin` while logged in as the customer → **Expected:** Redirect to `/dashboard`
- Visit `/dashboard` while logged out → **Expected:** Redirect to `/auth/login` (with return URL preserved)

---

## 5. Paystack Test Cards

| Card Number | Expiry | CVV | Result |
|---|---|---|---|
| `4084 0840 8408 4081` | Any future | `408` | ✅ Success |
| `4084 0840 8408 4081` | Any future | `000` | ❌ Declined |
| `5060 6666 6666 6666 04` | Any future | `123` | ✅ Success (Verve) |

> When ready to go live, replace TEST keys in Vercel with your **LIVE** Paystack keys. Test transactions do not involve real money.

---

## 6. Going Live — Final Checklist

- [ ] Logo uploaded to `public/logo.png`
- [ ] Hero video uploaded to `public/hero-video.mp4` *(optional)*
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set in Vercel (live value)
- [ ] `PAYSTACK_SECRET_KEY` set in Vercel (live key)
- [ ] `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` set in Vercel (live key)
- [ ] Supabase Auth Site URL updated to production domain
- [ ] Supabase Auth Redirect URL updated to `/auth/callback` on production domain
- [ ] At least one venue created and marked Active
- [ ] Full booking flow tested end-to-end
- [ ] Paystack webhook registered: `https://your-domain/api/paystack/webhook`

### Registering the Paystack Webhook
1. Paystack Dashboard → Settings → API Keys & Webhooks
2. Add webhook URL: `https://event-center-ten.vercel.app/api/paystack/webhook`
3. Paystack sends a `charge.success` event here after each payment
4. The site verifies the signature and automatically confirms the booking

> Without the webhook, Paystack payments won't automatically update bookings to Confirmed.

### Redeploying After Changes
Any time you update files locally (add logo, update pages):
```bash
npx vercel --prod
```
This re-uploads and deploys the latest version in ~30 seconds.

---

## 7. Useful Links

| | |
|---|---|
| **Vercel Dashboard** | https://vercel.com/dibe-labas-projects/event-center |
| **Supabase Dashboard** | https://supabase.com/dashboard/project/cofjlbtnsfsrfbmmfoed |
| **Paystack Dashboard** | https://dashboard.paystack.com |

---

## 8. Support

| | |
|---|---|
| **Studio** | Tarsus Studios |
| **Email** | fabrice@tarsusstudios.com |
| **Project** | Melian Event Center v1.0 |
| **Delivered** | March 2026 |
