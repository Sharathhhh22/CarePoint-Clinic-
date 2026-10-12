# SlotUrSelf - Architecture Documentation

## 1. Architectural Overview
SlotUrSelf is built on **Next.js 16 (App Router)** and **Supabase (PostgreSQL + Auth + Storage)**. The application adheres to a clean, decoupled 4-layer architecture:

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
│    LLMService, TriageService, AppointmentService, ...  │
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
│   └── migrations/            # 20+ SQL schemas, triggers, indexing, and PostGIS scripts
├── src/
│   ├── app/                   # Next.js App Router (pages, layouts, routes)
│   │   ├── (dashboard)/       # Authenticated Patient/Admin portal layout
│   │   │   ├── appointments/  # Appointment history & booking wrapper
│   │   │   ├── dashboard/     # Patient overview & metrics
│   │   │   ├── doctor/        # Physician portal with AI SOAP note generator
│   │   │   ├── profile/       # User profile and password settings
│   │   │   ├── records/       # Secure medical document uploads
│   │   │   └── admin/         # Clinic & doctor administration
│   │   ├── (marketing)/       # Public marketing pages, legal pages & AI guide
│   │   │   ├── assistant/     # Full-page AI Symptom Checker & Clinical Guide
│   │   │   ├── privacy/       # DPDP-compliant Privacy Policy
│   │   │   └── terms/         # Medical terms & conditions
│   │   ├── api/               # Scalable HTTP Route Handlers
│   │   │   ├── appointments/  # Slot hold & confirmation endpoints
│   │   │   ├── assistant/     # AI Symptom Triage route
│   │   │   ├── chat/          # Conversational Healthcare Assistant endpoint
│   │   │   ├── doctor/        # Clinical SOAP note summarization
│   │   │   ├── clinics/       # PostGIS proximity search route
│   │   │   ├── emergency/     # Twilio proxied emergency calls
│   │   │   └── payments/      # Stripe Checkout session handlers
│   │   ├── error.tsx          # Root Error Boundary with retry action
│   │   └── not-found.tsx      # Standard 404 page
│   ├── components/
│   │   ├── booking/           # Multi-step booking wizard steps (1-6)
│   │   ├── chat/              # Floating AI Healthcare Chatbot
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
│   │   ├── llm/               # Multi-provider LLM orchestration (Gemini/OpenAI/Anthropic)
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
   - Standard `rounded-lg` button radii (no bubbly pill buttons).
   - High-contrast clinical color palette (Teal-600 `#0d9488` with Slate neutrals).
   - Zero fake metrics, zero AI-slop graphics, and zero artificial marketing counters.

4. **Database Security:**
   - Row Level Security (RLS) enabled on all tables (`appointments`, `profiles`, `patient_records`, `health_history`).
   - Storage buckets restricted to authenticated document owners.

---

## 4. Database Indexing & Performance Strategy

The database uses PostgreSQL on Supabase. To guarantee sub-10ms response times at scale, the database indexing migration is located at:
`supabase/migrations/comprehensive_database_indexing.sql`

### Key Indexes:
1. **Atomic Slot Availability & Collision Prevention:**
   - `idx_appointments_slot_lookup`: `appointments(doctor_id, appointment_date, appointment_time, status)`
   - `idx_unique_active_slot`: Unique partial index on active slots.
2. **Patient Dashboard & History Retrieval:**
   - `idx_appointments_patient_date_desc`: `appointments(patient_id, appointment_date DESC, appointment_time DESC)`
3. **Doctor Portal Schedule:**
   - `idx_appointments_doctor_schedule`: `appointments(doctor_id, appointment_date, appointment_time) WHERE status IN ('confirmed', 'held', 'upcoming')`
4. **Hold Cleanup / Garbage Collection:**
   - `idx_appointments_held_expiration`: `appointments(held_until) WHERE status = 'held'`
5. **Spatial Clinic Discovery:**
   - `idx_clinics_location_gist`: Spatial `GIST` index on `clinics(location)` for instant PostGIS `ST_DWithin` & `ST_Distance` scans.
6. **Fuzzy Search & Filtering:**
   - `idx_clinics_name_trgm`: Trigram GIN index for clinic name search.
   - `idx_doctors_name_trgm`: Trigram GIN index for doctor name search.
7. **RLS Authorization Acceleration:**
   - `idx_profiles_role`: `profiles(role)` prevents sequential scans on administrative permission checks.
