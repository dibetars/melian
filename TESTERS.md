# Melian Event Center — Testers Guide

**Live URL:** https://event-center-ten.vercel.app

---

## Test Accounts

### Customer Account
| Field    | Value                  |
|----------|------------------------|
| Email    | dibelaba@gmail.com     |
| Password | Melian2024!            |
| Role     | Customer               |
| Access   | Dashboard, Bookings    |

### Admin Account
| Field    | Value                          |
|----------|--------------------------------|
| Email    | fabrice@tarsusstudios.com      |
| Password | Melian2024!                    |
| Role     | Admin                          |
| Access   | Full admin panel + all above   |

---

## Customer Testing Checklist

### Registration & Login
- [ ] Visit homepage — video hero loads, booking widget visible
- [ ] Click **View All Venues** → redirects to `/auth/login`
- [ ] Click **Login** → sign in with customer account
- [ ] Verify redirect to `/dashboard` after login
- [ ] Log out and confirm redirect to homepage

### Booking Flow
- [ ] Use hero widget — select a venue, pick a date, enter guests → click **Check Availability**
- [ ] Confirm redirect to `/book/[venue]` with date pre-filled in calendar
- [ ] Complete booking form (name, email, event type, guests, notes)
- [ ] Submit form → confirm booking created with **Pending** status
- [ ] Verify confirmation page or redirect

### Dashboard
- [ ] Visit `/dashboard` → see summary stats
- [ ] Visit `/dashboard/bookings` → see list of own bookings
- [ ] Click a booking → view full booking details at `/dashboard/bookings/[id]`
- [ ] Verify booking status displays correctly (Pending / Confirmed / Completed)

### Payment (requires Paystack keys)
- [ ] On a confirmed booking, click **Pay Now**
- [ ] Use Paystack test card: `4084 0840 8408 4081` · Exp: any future · CVV: `408`
- [ ] Confirm payment success page loads
- [ ] Verify booking status updates to **Paid**

---

## Admin Testing Checklist

### Admin Panel Access
- [ ] Log in with admin account
- [ ] Confirm **Admin** link appears in navbar
- [ ] Visit `/admin` → dashboard with booking stats and revenue

### Venue Management
- [ ] Visit `/admin/venues` → see list of venues (Grand Ballroom, Garden Terrace, Executive Suite)
- [ ] Click a venue → edit name, description, capacity, price, amenities
- [ ] Visit `/admin/venues/new` → create a new venue, save, confirm it appears in list
- [ ] Toggle venue active/inactive → confirm it hides from public listing

### Booking Management
- [ ] Visit `/admin/bookings` → see all bookings across all users
- [ ] Filter/sort bookings by status
- [ ] Open a booking → change status from **Pending** to **Confirmed**
- [ ] Open a booking → change status to **Cancelled**, confirm customer booking reflects change

### Payment Management
- [ ] Visit `/admin/payments` → see all payment records
- [ ] Find the offline (bank transfer) booking → mark payment as **Paid**
- [ ] Confirm booking status updates accordingly

### Sample Data Verification
| Booking           | Venue           | Status    | Payment       |
|-------------------|-----------------|-----------|---------------|
| Wedding Reception | Grand Ballroom  | Confirmed | Paid (online) |
| Board Meeting     | Executive Suite | Pending   | Pending (offline) |
| Birthday Party    | Garden Terrace  | Completed | Paid (online) |

---

## Known Limitations (Pre-Launch)

- **Email notifications** — not yet configured
- **Hero video** — plays automatically on desktop; may not autoplay on iOS (muted autoplay policy)

---

## Quick Links

| Page              | URL                                              |
|-------------------|--------------------------------------------------|
| Homepage          | https://event-center-ten.vercel.app              |
| Login             | https://event-center-ten.vercel.app/auth/login   |
| Customer Dashboard| https://event-center-ten.vercel.app/dashboard    |
| Admin Panel       | https://event-center-ten.vercel.app/admin        |
| Venues            | https://event-center-ten.vercel.app/venues       |
