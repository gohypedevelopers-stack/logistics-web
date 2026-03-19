# BrandName Logistics - Platform scaffold

This is the foundational full-stack scaffold for the BrandName Logistics platform, built using the latest Next.js App Router, Tailwind CSS (v4), Prisma, and NextAuth.

## 1. Architecture

The application uses a monorepo structure utilizing Next.js App directory routing groups to separate public marketing, customer portal, and admin experiences:

- **`/(marketing)`**: Public-facing pages (Home, About, Tracking, Services). Clean design with strong international logistics messaging.
- **`/(auth)`**: Login and Registration system utilizing NextAuth (Credentials).
- **`/customer`**: The customer portal utilizing a dedicated layout with sidebar navigation to manage shipments, addresses, and view history.
- **`/admin`**: The CRM / Logistics Operations panel, designed for an internal operations team with dark-indigo theming and heavy tabular data management.

### Backend/API
- Route protection is handled gracefully via standard Next.js `middleware.ts` combined with `getServerSession` calls in individual layouts to enforce `Role`-based viewing.

## 2. Database Schema (Prisma)
The database structure maps out the complex ecosystem of a logistics business avoiding hard integrations for the MVP:
- **`User`**, **`CustomerProfile`**, **`StaffProfile`**: Strict table separation for Auth details vs Customer specific info vs Employee specific info.
- **`Address`**, **`Country`**: Geolocation storage.
- **`Route`**, **`RateCard`**: Pricing model based on weights between specific countries.
- **`LogisticsCompany`**: For dropdown selection (DHL, FedEx, etc).
- **`Shipment`**, **`ShipmentStatusHistory`**, **`ShipmentEvent`**: Deep tracking system with enums controlling the 16 steps of logistics delivery (Draft -> Flight Departed -> Customs -> Delivered).
- **`Invoice`**, **`AuditLog`**: Financial and security tables.

## 3. Role/Permission Logic

The `Role` enum is tightly coupled to NextAuth and Prisma:
- **`CREATOR`**: Highest access, can manage everything including other Admins and Managers.
- **`ADMIN`**: Global CRM access but cannot revoke Creator rights.
- **`MANAGER`**, **`OPERATIONS_MANAGER`**: Can oversee shipments and route mapping but disconnected from invoice/financial editing.
- **`ACCOUNTANT`**: Operates on the Finance/Invoice tabs.
- **`CUSTOMER`**: Restricted strictly to `/customer` routes via middleware. Cannot enter `/admin`.

## 4. Local Setup
1. `npm install`
2. Create your `.env` file (copying from `.env.example`).
3. Have a PostgreSQL instance running locally or remotely (e.g., Neon).
4. Run `npx prisma db push` to synchronize your database schema without full migrations.
5. Run `npx prisma generate`
6. Run `npm run prisma:seed` to populate the `CUSTOMER` account, Staff members, Routes, Rate Cards, and Logistics companies.
7. `npm run dev`

## 5. Neon DB Setup
1. Create a Neon Project and a Postgres Database.
2. Under "Connection Details", copy the connection string.
3. Update the `DATABASE_URL` in `.env`. Ensure to keep `?sslmode=require` if Neon forces SSL connections.
4. Push Prisma schema: `npx prisma db push`.

## 6. Vercel Deployment
1. Connect this GitHub repository to Vercel.
2. In the Vercel project settings, set:
   - `DATABASE_URL` = (Your Neon DB string)
   - `NEXTAUTH_SECRET` = (Generated secure string via `openssl rand -base64 32`)
   - `NEXTAUTH_URL` = (Your deployed Vercel domain name, e.g., `https://brandname-logistics.vercel.app`)
3. Vercel will automatically run `npm run build` which will run `npx prisma generate` in its lifecycle if the `postinstall` script is supplied (or next.js build handles it gracefully if configured).
4. For seeding in production, consider hitting an isolated API route or running the seed script manually from your local machine hooked up to the production Neon string ONE time.

## 7. Deferred Features (MVP Scope constraints)
- **Payment Gateways**: Deliberately disabled. `PaymentStatus` is purely informational.
- **Live Courier API (India Courier Setup)**: Excluded. We do not integrate Bluedart/Delhivery APIs yet. Statuses are manually updated.
- **Extravagant Animations**: Avoided in favor of premium structured components with subtle standard Tailwind hover states.
