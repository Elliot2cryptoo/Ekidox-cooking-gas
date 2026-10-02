# Ekidox

Cooking gas delivery web application for a Nigerian retail/reselling business. Customers can browse gas products, place orders, and track deliveries online.

## Tech Stack

- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth (Google OAuth + email/password)
- **Email**: Mailgun (transactional emails)

## Features

- Browse gas products (1kg, 3kg, 5kg, 6kg, 12.5kg, 25kg)
- Shopping cart with real-time updates
- Secure checkout with server-side price calculation
- Order tracking and history
- Google OAuth + email/password authentication
- Admin dashboard for managing products, orders, and customers
- Order confirmation and status update emails
- Mobile-first responsive design
- Row Level Security (RLS) for data protection

## Local Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Mailgun account
- Google Cloud Console project

### 1. Clone and Install

```bash
git clone <repository-url>
cd ekidox
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `MAILGUN_API_KEY` | Mailgun API key |
| `MAILGUN_DOMAIN` | Mailgun sending domain |
| `MAILGUN_FROM_EMAIL` | From address for emails |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NEXT_PUBLIC_APP_URL` | Public URL of the app |

### 3. Supabase Setup

1. Create a new Supabase project
2. Go to **Authentication > Providers > Google** and enable Google OAuth
3. Add your Google Client ID and Client Secret
4. Set the redirect URL to: `http://localhost:3000/auth/callback`
5. Run the database migration:
   - Go to **SQL Editor**
   - Copy and run the contents of `supabase/migrations/001_initial_schema.sql`
6. Run the seed data:
   - Copy and run the contents of `supabase/seed.sql`

### 4. Mailgun Setup

1. Create a Mailgun account
2. Verify your domain
3. Get your API key from **Settings > API Security**
4. Add the credentials to your `.env.local`

### 5. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Go to **APIs & Services > Credentials**
4. Create OAuth 2.0 Client ID
5. Add authorized redirect URI: `http://localhost:3000/auth/callback`
6. Copy the Client ID and Client Secret to your `.env.local`

### 6. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Creating an Admin User

1. Sign up for an account through the app
2. Go to your Supabase dashboard
3. Navigate to **Table Editor > profiles**
4. Find your user and change the `role` from `customer` to `admin`

## Database Schema

### profiles
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key, references auth.users |
| full_name | TEXT | User's full name |
| email | TEXT | User's email |
| phone | TEXT | User's phone number |
| avatar_url | TEXT | User's avatar URL |
| role | TEXT | 'customer' or 'admin' |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

### products
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Product name |
| slug | TEXT | URL-friendly slug |
| description | TEXT | Product description |
| price | INTEGER | Price in kobo (1 Naira = 100 kobo) |
| image_url | TEXT | Product image URL |
| weight_kg | NUMERIC | Weight in kilograms |
| stock_quantity | INTEGER | Available stock |
| is_active | BOOLEAN | Whether product is active |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

### orders
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| order_number | TEXT | Human-readable order number |
| user_id | UUID | Reference to profiles |
| customer_name | TEXT | Customer's name |
| customer_email | TEXT | Customer's email |
| customer_phone | TEXT | Customer's phone |
| delivery_address | TEXT | Delivery address |
| delivery_area | TEXT | Delivery area/zone |
| delivery_instructions | TEXT | Optional instructions |
| subtotal | INTEGER | Subtotal in kobo |
| delivery_fee | INTEGER | Delivery fee in kobo |
| total | INTEGER | Total in kobo |
| status | TEXT | Order status |
| payment_status | TEXT | Payment status |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

### order_items
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| order_id | UUID | Reference to orders |
| product_id | UUID | Reference to products |
| product_name | TEXT | Product name at time of purchase |
| quantity | INTEGER | Quantity ordered |
| unit_price | INTEGER | Unit price at time of purchase |
| subtotal | INTEGER | Item subtotal |
| created_at | TIMESTAMPTZ | Creation timestamp |

### delivery_zones
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Zone name |
| fee | INTEGER | Delivery fee in kobo |
| is_active | BOOLEAN | Whether zone is active |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

## Order Statuses

- `pending` — Order received, awaiting confirmation
- `confirmed` — Order confirmed by admin
- `preparing` — Order being prepared
- `out_for_delivery` — Order is on its way
- `delivered` — Order delivered successfully
- `cancelled` — Order cancelled

## Payment Statuses

- `unpaid` — Payment not yet made
- `pending` — Payment processing
- `paid` — Payment completed
- `failed` — Payment failed
- `refunded` — Payment refunded

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/orders` | POST | Create new order |
| `/api/delivery-zones` | GET | Get active delivery zones |
| `/api/admin/products` | GET/POST | List/create products |
| `/api/admin/products/[id]` | PATCH/DELETE | Update/delete product |
| `/api/admin/orders/[id]` | PATCH | Update order status |
| `/api/admin/delivery-zones` | GET/POST | List/create delivery zones |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add all environment variables
4. Deploy

### Other Platforms

1. Build the app: `npm run build`
2. Start the server: `npm start`
3. Set all environment variables on your hosting platform

## License

Private — All rights reserved.
