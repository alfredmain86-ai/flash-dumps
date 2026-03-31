# FLASH DUMPS — Construction Debris Hauling Platform

Full-stack web application for a construction debris hauling company based in Miami, FL. Built with Next.js 14+, TypeScript, Tailwind CSS, Supabase, and Stripe.

## Tech Stack

- **Frontend:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- **Backend:** Next.js API Routes + Supabase (PostgreSQL, Auth, Realtime)
- **Payments:** Stripe (Phase 2)
- **Maps:** Google Maps API (Phase 2)
- **Deployment:** Vercel-ready

## Features (Phase 1)

### Public Website
- SEO-optimized landing page with bilingual support (English/Spanish)
- Services page with detailed service descriptions
- **Instant Quote Calculator** — multi-step wizard: waste type → load size → address → frequency → schedule → contact info → price estimate
- Sticky CTA bar and WhatsApp button
- Mobile-first responsive design

### Admin Dashboard
- Dashboard with revenue stats and today's schedule
- Schedule calendar with truck lanes and color-coded booking statuses
- Quote management (review, adjust pricing, approve)
- Customer CRM with tags and history
- Truck management with maintenance tracking
- Configurable pricing panel (base rates, multipliers, discounts)
- Financial overview with revenue/expense tracking

### Driver Mobile View
- Today's jobs in order with status progression
- One-tap navigation to job address
- Status update buttons: En Route → Arrived → Loading → Completed
- Photo upload and notes

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Supabase project (free tier works)
- Stripe account (for Phase 2)
- Google Maps API key (for Phase 2)

### Setup

1. **Clone and install:**
   ```bash
   git clone <repo-url>
   cd WASTE-MANAGEMENT
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase URL, anon key, and service role key.

3. **Set up the database:**
   Run the migration files in your Supabase SQL editor:
   - `supabase/migrations/001_initial_schema.sql` — creates all tables, indexes, RLS policies
   - `supabase/migrations/002_seed_data.sql` — inserts trucks and default pricing config

4. **Run the dev server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   - Public site: [http://localhost:3000](http://localhost:3000)
   - Quote calculator: [http://localhost:3000/quote](http://localhost:3000/quote)
   - Admin dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
   - Driver view: [http://localhost:3000/driver](http://localhost:3000/driver)
   - Services: [http://localhost:3000/services](http://localhost:3000/services)

### Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `STRIPE_SECRET_KEY` | Stripe secret key (Phase 2) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (Phase 2) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret (Phase 2) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key (Phase 2) |
| `NEXT_PUBLIC_COMPANY_NAME` | Company display name |
| `NEXT_PUBLIC_COMPANY_PHONE` | Company phone number |
| `NEXT_PUBLIC_COMPANY_EMAIL` | Company email |
| `NEXT_PUBLIC_COMPANY_WHATSAPP` | WhatsApp number |
| `NEXT_PUBLIC_BASE_LAT` | Base location latitude (for distance calc) |
| `NEXT_PUBLIC_BASE_LNG` | Base location longitude |

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public website pages
│   │   ├── page.tsx       # Homepage
│   │   ├── services/      # Services page
│   │   └── quote/         # Quote calculator
│   ├── (admin)/           # Admin dashboard
│   │   ├── dashboard/     # Stats & overview
│   │   ├── schedule/      # Calendar view
│   │   ├── quotes/        # Quote management
│   │   ├── customers/     # CRM
│   │   ├── trucks/        # Truck management
│   │   ├── pricing/       # Pricing config
│   │   └── finances/      # Revenue & expenses
│   ├── (driver)/          # Driver mobile view
│   │   └── driver/        # Today's jobs
│   └── api/               # API routes
│       ├── quotes/        # Quote CRUD
│       ├── bookings/      # Booking CRUD + status
│       ├── pricing/       # Pricing config
│       ├── trucks/        # Truck listing
│       └── upload/        # File upload
├── components/
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Header, Footer, Sidebar
│   └── quote/             # Quote wizard + steps
├── lib/
│   ├── constants.ts       # App constants, helpers
│   ├── i18n.ts            # English/Spanish translations
│   ├── mock-data.ts       # Sample data for development
│   ├── pricing.ts         # Pricing calculation engine
│   └── supabase/          # Supabase client setup
├── store/                 # Zustand stores
└── types/                 # TypeScript type definitions

supabase/
└── migrations/            # SQL schema + seed data
```

## Pricing Logic

All pricing is configurable from the admin panel. Default rates:

| Load Size | Price Range |
|---|---|
| Light (< 1 ton) | $150 - $250 |
| Medium (1-3 tons) | $250 - $450 |
| Heavy (3-5 tons) | $450 - $650 |
| Full Truck (5+ tons) | $650 - $900 |

**Multipliers:** Concrete 1.3x, Roofing 1.2x, Tile 1.1x, Mixed 1.0x, Drywall 0.9x, Wood 0.85x, Metal 0.7x

**Distance:** 0-15mi 1.0x, 15-30mi 1.15x, 30+mi 1.3x

**Discounts:** Weekly -15%, Bi-weekly -10%, Retainer -20%

**Emergency surcharge:** +30%

## Phase 2 Roadmap

- [ ] Stripe payment integration (deposits, invoices, online payment)
- [ ] Google Maps address autocomplete + route optimization
- [ ] Customer portal (view bookings, pay invoices, upload photos)
- [ ] Real-time updates via Supabase Realtime
- [ ] Email/SMS notifications
- [ ] Blog/SEO content management
- [ ] Export to CSV/QuickBooks
- [ ] Customer signature capture
- [ ] PWA for driver mobile view

## Deployment

Deploy to Vercel:

```bash
npx vercel
```

Set all environment variables in the Vercel dashboard before deploying.

## License

Private — All rights reserved.
