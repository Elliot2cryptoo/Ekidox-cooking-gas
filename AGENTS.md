# AGENTS.md — Ekidox

## Project Overview

Ekidox is a Nigerian cooking-gas retail/reselling business. This is a production-ready web application built with Next.js, Supabase, and Mailgun.

## Tech Stack

- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript
- **Styling**: Tailwind CSS (mobile-first, responsive)
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth (Google OAuth + email/password)
- **Email**: Mailgun (transactional)
- **Deployment**: Vercel (recommended) or any Node.js host

## Architecture

### Directory Structure

```
src/
  app/                    # Next.js App Router pages
    (marketing)/          # Public pages (home, products, about)
    auth/                 # Auth pages (login, signup, forgot-password)
    checkout/             # Checkout flow
    orders/               # Customer order tracking
    account/              # Customer profile/dashboard
    admin/                # Admin dashboard
    api/                  # API routes
      auth/               # Auth callbacks
      orders/             # Order creation/management
      products/           # Product management
      admin/              # Admin operations
      webhooks/           # Payment webhooks (future)
  components/             # Reusable React components
    ui/                   # Base UI components (Button, Input, etc.)
    layout/               # Header, Footer, Navigation
    product/              # Product cards, grids
    cart/                 # Cart drawer, cart items
    checkout/             # Checkout forms, order summary
    order/                # Order cards, status badges
    admin/                # Admin-specific components
  lib/                    # Server-side utilities
    supabase/             # Supabase client configurations
    mailgun/              # Email service
    validation/           # Zod schemas for validation
    utils/                # Helper functions
  types/                  # TypeScript type definitions
  hooks/                  # Custom React hooks
  context/                # React context providers
supabase/
  migrations/             # Database migrations
  seed.sql                # Seed data
public/                   # Static assets
```

### Key Architectural Decisions

1. **Server-side price calculation**: All order totals are calculated on the server using prices from the database. Client-sent prices are never trusted.
2. **Database as source of truth**: Products, orders, and user data are stored in Supabase PostgreSQL. No localStorage for critical data.
3. **Row Level Security**: Supabase RLS policies enforce data access at the database level.
4. **Payment separation**: Order creation is separate from payment processing. Orders start as `payment_status = 'unpaid'` and can be updated later via Paystack/Flutterwave.
5. **Atomic order creation**: Database transactions ensure orders and order items are created together or not at all.

## Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run linting
npm run lint

# Run TypeScript checks
npx tsc --noEmit

# Build for production
npm run build

# Run production server
npm start
```

## Environment Variables

See `.env.example` for all required variables. Never commit `.env` or `.env.local` to Git.

### Required Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `MAILGUN_API_KEY` | Mailgun API key |
| `MAILGUN_DOMAIN` | Mailgun sending domain |
| `MAILGUN_FROM_EMAIL` | From address for transactional emails |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NEXT_PUBLIC_APP_URL` | Public URL of the application |

## Database Conventions

- All money values use `integer` (kobo/cents) — never floating point
- All timestamps use `timestamptz` with `now()` default
- UUIDs for all primary keys
- Foreign keys with `ON DELETE CASCADE` where appropriate
- Indexes on all foreign keys and frequently queried columns
- RLS enabled on all tables with user data

### Tables

- `profiles` — User profiles linked to Supabase Auth
- `products` — Gas products with pricing and stock
- `orders` — Customer orders
- `order_items` — Individual items within orders
- `delivery_zones` — Configurable delivery areas and fees

## Development Rules

1. **Never trust the client**: All prices, totals, stock checks, and authorization must be verified server-side.
2. **Use server components** where possible for better performance.
3. **Validate all input** using Zod schemas before processing.
4. **Handle errors gracefully**: Show user-friendly messages, log technical details server-side.
5. **Mobile-first**: Design for mobile devices first, then enhance for desktop.
6. **Accessibility**: Use semantic HTML, proper ARIA labels, and keyboard navigation.
7. **No secrets in code**: All sensitive values come from environment variables.
8. **Atomic operations**: Use database transactions for multi-step operations.
9. **Idempotency**: Prevent duplicate order submissions using idempotency keys.
10. **Log server-side**: Use `console.error` or a logging service for debugging; never expose to users.

## Security Practices

- Supabase RLS policies on all user-data tables
- Server-side authorization checks on all API routes
- Input validation with Zod on all API endpoints
- CSRF protection via SameSite cookies
- Rate limiting on auth endpoints (handled by Supabase)
- No service-role key exposure to client
- SQL injection prevention via Supabase parameterized queries

## Brand Guidelines

- **Colors**: Deep blue (trust/safety), white (cleanliness), orange/amber (energy/gas)
- **Typography**: Clean, readable sans-serif
- **Tone**: Professional, trustworthy, approachable
- **Logo**: Simple "Ekidox" wordmark with a flame/gas icon
