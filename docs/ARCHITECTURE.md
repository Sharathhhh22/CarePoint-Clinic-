# APPOINTLY - Architecture Documentation

## 1. Architectural Overview
APPOINTLY is built on **Next.js 16 (App Router)** and **Supabase (PostgreSQL + Auth + Storage)**. The application adheres to a clean, decoupled 4-layer architecture:

```
┌────────────────────────────────────────────────────────┐
│                   1. Presentation Layer                │
│    React Server & Client Components, Layouts, UI Kit   │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│              2. State & Hook Layer                     │
│    React Context, Custom Hooks (useBooking, countdown) │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│              3. Business Service Layer                 │
│  TriageService, AppointmentService, ClinicService, ... │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│             4. Data & Infrastructure Layer             │
│    Supabase Client / RLS, PostGIS, Gemini, Twilio      │
└────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure

```
├── docs/                      # Architectural and system documentation
├── supabase/
│   └── migrations/            # 20+ SQL schemas, triggers, and PostGIS scripts
├── src/
│   ├── app/                   # Next.js App Router (pages, layouts, routes)
│   │   ├── (dashboard)/       # Authenticated Patient/Admin portal layout
│   │   │   ├── appointments/  # Appointment history & booking wrapper
│   │   │   ├── dashboard/     # Patient overview & metrics
│   │   │   ├── profile/       # User profile and password settings
│   │   │   ├── records/       # Secure medical document uploads
│   │   │   └── admin/         # Clinic & doctor administration
│   │   ├── (marketing)/       # Public marketing pages & legal pages
│   │   │   ├── privacy/       # DPDP-compliant Privacy Policy
│   │   │   └── terms/         # Medical terms & conditions
│   │   ├── api/               # Scalable HTTP Route Handlers
│   │   │   ├── appointments/  # Slot hold & confirmation endpoints
│   │   │   ├── assistant/     # AI Symptom Triage route
│   │   │   ├── clinics/       # PostGIS proximity search route
│   │   │   ├── emergency/     # Twilio proxied emergency calls
│   │   │   └── payments/      # Stripe Checkout session handlers
│   │   ├── error.tsx          # Root Error Boundary with retry action
│   │   └── not-found.tsx      # Standard 404 page
│   ├── components/
│   │   ├── booking/           # Multi-step booking wizard steps (1-6)
│   │   ├── layout/            # Navbar, Footer, FeaturesOverlay
│   │   ├── telephony/         # Emergency SOS button & modals
│   │   └── ui/                # Modular, accessible UI components
│   ├── config/
│   │   ├── env.ts             # Typed environment variable validation
│   │   └── site.ts            # Site metadata & application constants
│   ├── context/
│   │   └── BookingContext.tsx # Centralized multi-step booking state
│   ├── hooks/
│   │   ├── useBooking.ts      # Hook for booking wizard state
│   │   └── useCountdown.ts    # Reusable appointment countdown timer hook
│   ├── lib/
│   │   ├── api/               # API response and error handling utilities
│   │   ├── payments/          # Stripe provider implementation
│   │   └── telephony/         # Twilio provider implementation
│   ├── services/              # Pure business logic services
│   │   ├── appointmentService.ts
│   │   ├── clinicService.ts
│   │   ├── triageService.ts
│   │   └── notificationService.ts
│   ├── types/                 # Central TypeScript domain types
│   └── utils/
│       └── supabase/          # SSR & Browser Supabase client factories
```

---

## 3. Core Principles & Conventions

1. **Separation of Concerns:**
   - UI components (`src/components/`) handle presentation and user interactions.
   - Domain logic and database mutations reside in `src/services/`.
   - Environment variables are exclusively consumed through `src/config/env.ts`.

2. **Error Handling:**
   - Every API endpoint uses `ApiError` and standard response helpers (`jsonSuccess`, `jsonError`).
   - Client routes are guarded by Next.js `error.tsx` error boundaries.
   - UI surfaces error states gracefully using `<ErrorMessage />`.

3. **Design & UX Guidelines:**
   - Standard `rounded-md` button radii (no bubbly pill buttons).
   - High-contrast clinical color palette (Teal-600 `#0d9488` with Slate neutrals).
   - Zero fake metrics, zero AI-slop graphics, and zero artificial marketing counters.

4. **Database Security:**
   - Row Level Security (RLS) enabled on all tables (`appointments`, `profiles`, `medical_records`, `health_history`).
   - Storage buckets restricted to authenticated document owners.
