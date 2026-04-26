# The Cake Gallery

A complete online restaurant ordering system for a small Zambian-owned food business.

## Stack

- Frontend: Next.js, Tailwind CSS, TypeScript
- Backend: Node.js, Express, TypeScript
- Database: MongoDB with Mongoose
- Auth: JWT
- Currency: Zambia Kwacha (ZMW)

## Apps

- `frontend`: customer website, ordering flow, customer dashboard, admin dashboard
- `backend`: REST API for auth, products, categories, cart/order workflows, reviews, coupons, admin analytics

## Quick Start

1. Install dependencies:

```bash
cd backend && npm install
cd ../frontend && npm install
```

2. Configure environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

3. Seed demo data:

```bash
cd backend
npm run seed
```

4. Run the backend:

```bash
cd backend
npm run dev
```

5. Run the frontend:

```bash
cd frontend
npm run dev
```

Frontend: `http://localhost:3000`
Backend: `http://localhost:5000`

## Demo Admin

After seeding:

- Email: `waka.bk29@gmail.com`
- Password: `Admin@12345`

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md).

