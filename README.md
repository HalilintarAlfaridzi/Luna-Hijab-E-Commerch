# Luna Hijab E-Commerce

Modern hijab e-commerce portfolio built with React, Vite, Tailwind CSS, React Router, and Supabase-ready architecture.

## Overview

Luna Hijab is a portfolio-grade e-commerce experience for modern hijab essentials. The app is built to demonstrate a real storefront flow, a customer account area, and an admin backoffice without requiring a live payment gateway.

The project includes:

- A polished public storefront
- Product catalog, filtering, and product detail pages
- Cart and checkout simulation
- Demo authentication with customer and admin roles
- Customer account pages
- Admin dashboard and management pages
- Supabase schema and production-hardening SQL
- Demo mode for safe public portfolio hosting

## Live Demo

For GitHub Pages, the site is intended to run under:

```txt
https://HalilintarAlfaridzi.github.io/Luna-Hijab-E-Commerch/
```

The app uses `HashRouter`, so routes remain stable on static hosting.

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS 3
- React Router DOM 6
- Supabase JS client
- LocalStorage-based demo persistence

## Core Features

### Public Storefront

- Landing page with hero, featured products, categories, trust section, review section, shop-by-need cards, and how-to-order flow
- Shop page with search, category filter, sorting, and pagination
- Product detail page with variant selection, stock visibility, pricing, and related products
- Cart page with quantity control and order summary
- Checkout page with shipping form and payment method simulation
- Order success page with timeline and order snapshot

### Customer Area

- Role-based login
- Customer dashboard
- Profile page
- Order history
- Wishlist demo view
- Saved addresses page

### Admin Area

- Admin dashboard
- Product management
- Category management
- Inventory management
- Order management
- Customer management preview
- Review management preview
- Banner management preview
- Analytics preview

## Demo Mode

This project supports a safe public demo mode for portfolio use.

When demo mode is enabled:

- Login uses local demo sessions
- Orders are saved in the browser `localStorage`
- Admin actions are simulated locally where supported
- The app does not depend on a real Supabase auth session for public use

### Demo Mode Flag

```env
VITE_FORCE_DEMO_MODE=true
```

Recommended for public portfolio hosting.

### Demo Accounts

Customer:

```txt
Email: customer@demo.com
Password: customer123
```

Admin:

```txt
Email: admin@demo.com
Password: admin123
```

## Supabase Mode

If you want to connect the app to a real Supabase project, set valid values for:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_FORCE_DEMO_MODE=false
```

In Supabase mode, the app can use:

- Supabase Auth for login and sign up
- `profiles` table for customer profile data
- `orders` and `order_items` for order records
- `products`, `categories`, `inventory`, and `product_images` for catalog management
- Storage buckets for product and banner images

## Local Development

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Open the local URL shown by Vite.

## Production Build

Build the app:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Environment Variables

Copy `.env.example` to `.env` and fill in the values you need.

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_FORCE_DEMO_MODE=true
```

Recommended setup for public portfolio hosting:

```env
VITE_FORCE_DEMO_MODE=true
```

## Supabase Setup

1. Create a Supabase project.
2. Put your real project values into `.env`.
3. Run `supabase/schema.sql` in the SQL editor.
4. Run `supabase/seed.sql` if you want seeded demo products and stock.
5. Run `supabase/production-hardening.sql` if you want the full order and RLS setup.
6. Create the storage buckets used by the app:

- `product-images`
- `banner-images`
- `avatars`

## GitHub Pages Deployment

This repo is configured for GitHub Pages with `HashRouter`.

### What is already set

- `HashRouter` is used in `src/main.jsx`
- Vite `base` is set to `/Luna-Hijab-E-Commerch/`

### Deploy steps

1. Push the repository to GitHub.
2. In the repo, go to `Settings` -> `Pages`.
3. Under `Build and deployment`, set `Source` to `GitHub Actions`.
4. Add a workflow file at `.github/workflows/deploy.yml`.
5. Push to `main`.
6. Wait for the GitHub Actions run to finish.
7. Open the published URL:

```txt
https://HalilintarAlfaridzi.github.io/Luna-Hijab-E-Commerch/
```

If the workflow is configured correctly, the site will deploy automatically on every push to `main`.

## Routes

- `/`
- `/shop`
- `/product/:slug`
- `/categories`
- `/category/:slug`
- `/new-arrivals`
- `/best-sellers`
- `/about`
- `/testimonials`
- `/faq`
- `/contact`
- `/cart`
- `/checkout`
- `/order-success/:orderId`
- `/account`
- `/account/profile`
- `/account/orders`
- `/account/wishlist`
- `/account/addresses`
- `/admin/dashboard`
- `/admin/products`
- `/admin/categories`
- `/admin/inventory`
- `/admin/orders`
- `/admin/customers`
- `/admin/reviews`
- `/admin/banners`
- `/admin/analytics`

## Data Persistence

The app uses different storage strategies depending on mode:

- Public demo mode: browser `localStorage`
- Supabase mode: database tables and storage buckets

Important demo-only persistence areas:

- Cart state
- Auth session
- Demo orders
- Demo draft products
- Demo categories

## Security Notes

- Real card payment data is not stored.
- Checkout is simulated for portfolio use.
- RLS policies are included in the Supabase SQL files.
- Admin access is role-based.
- For public hosting, keep `VITE_FORCE_DEMO_MODE=true` so visitors do not write into your real backend.

## Project Notes

Some admin pages are intentionally preview-only in demo mode:

- Reviews
- Banners
- Customer management

The main interactive flows that are fully demonstrated are:

- Browse products
- Add to cart
- Checkout simulation
- Login as customer or admin
- View order history
- Update profile
- Manage categories in demo mode

## Next Improvements

- Connect review moderation to Supabase
- Connect wishlist and saved addresses to real tables in demo mode
- Add working banner CRUD
- Add real customer management data source
- Add a GitHub Actions workflow file for one-click deploy

