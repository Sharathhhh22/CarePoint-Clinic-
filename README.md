# APPOINTLY - Clinic Appointment & Triage Platform

APPOINTLY is an enterprise healthcare platform that connects patients directly with verified clinical specialists. It features AI-powered clinical triage, real-time slot locking, PostGIS distance-based clinic discovery, and digital appointment passes with live countdowns.

---

## Key Features

- **AI Symptom Triage**: Guided 5-step booking wizard powered by Google Gemini (`gemini-3.8-flash`) that evaluates patient symptoms and recommends the correct medical specialty and urgency level.
- **Race-Condition-Proof Booking**: Uses PostgreSQL unique indexes (`idx_unique_active_slot`) and atomic holds to prevent double-booking.
- **Live Pass & Countdown**: Digital appointment receipt with dynamic QR codes, real-time countdown, and in-app reminder notifications.
- **PostGIS Geolocation**: Spatial distance calculations connecting patients to the closest available clinic.
- **Decoupled Architecture**: Pure service layer (`src/services/`), typed state management (`BookingContext`), and centralized environment validation (`src/config/env.ts`).
- **No-Gimmick Clinical UI**: Clean, accessible Tailwind design with zero fake counters, no pill buttons, and no distracting scroll animations.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Database & Auth**: Supabase (PostgreSQL, Row Level Security, Storage)
- **AI/LLM**: Google Gen AI SDK (`@google/genai`)
- **Styling**: Tailwind CSS & Framer Motion
- **Payments**: Stripe Checkout
- **Telephony & Notifications**: Twilio (SMS & Emergency Masked Proxy), Resend (Email)

---

## Project Structure

```
├── docs/                      # Architecture documentation & guides
├── supabase/
│   └── migrations/            # Database schemas, RLS policies, and PostGIS SQL
├── src/
│   ├── app/                   # Next.js App Router (pages, layouts, error boundaries)
│   │   ├── (dashboard)/       # Authenticated Patient/Admin portal
│   │   ├── (marketing)/       # Public marketing & legal pages
│   │   └── api/               # Standardized REST API endpoints
│   ├── components/
│   │   ├── booking/           # Multi-step booking wizard components
│   │   ├── layout/            # Navbar, Footer, FeaturesOverlay
│   │   ├── telephony/         # Emergency SOS and proxy call components
│   │   └── ui/                # Modular, accessible UI components
│   ├── config/
│   │   ├── env.ts             # Typed environment configuration
│   │   └── site.ts            # Site constants and branding
│   ├── context/
│   │   └── BookingContext.tsx # Centralized multi-step booking state
│   ├── hooks/                 # Custom reusable hooks (useBooking, useCountdown)
│   ├── lib/                   # API utilities, Stripe and Twilio providers
│   ├── services/              # Pure business logic services (Appointment, Clinic, Triage)
│   └── types/                 # Centralized TypeScript interfaces
```

---

## Getting Started

### 1. Prerequisites
- Node.js 18+
- Supabase project
- Google Gemini API key

### 2. Installation
```bash
git clone https://github.com/Sharathhhh22/Slot-Yourself.git
cd Slot-Yourself
npm install
```

### 3. Environment Setup
Copy the sample environment file and populate your keys:
```bash
cp .env.example .env.local
```

Required variables:
```ini
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GEMINI_API_KEY=your-gemini-key
```

### 4. Database Setup
Execute the SQL files inside `supabase/migrations/` in your Supabase SQL Editor.

### 5. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Production Build & Quality Checks

Run full TypeScript verification:
```bash
npx tsc --noEmit
```

Build production bundle:
```bash
npm run build
```

---

## License
MIT License. All rights reserved.
