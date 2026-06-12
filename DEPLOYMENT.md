# Deployment Guide

## MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Add a database user.
3. Allow Render's outbound access or temporarily allow `0.0.0.0/0`.
4. Copy the MongoDB connection string into `MONGODB_URI`.

## Backend on Render

Create a Web Service from the repository.

- Root directory: `backend`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Node version: 20+

Environment variables:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=use-a-long-random-secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://thecakegallery.online,https://www.thecakegallery.online
EMAIL_FROM=waka.bk29@gmail.com
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMS_PROVIDER=mock
```

## Frontend on Vercel

Create a Vercel project from the repository.

- Root directory: `frontend`
- Framework preset: Next.js
- Build command: `npm run build`

Environment variables:

```env
NEXT_PUBLIC_API_URL=https://your-render-service.onrender.com/api
NEXT_PUBLIC_WHATSAPP_NUMBER=260974063136
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL=https://www.google.com/maps?q=Lusaka%2C%20Zambia&output=embed
```

## Custom Domain — thecakegallery.online (Namecheap)

The website is served on the apex domain `thecakegallery.online`, with `www` redirecting to it. The API stays on its `onrender.com` URL.

### 1. Add the domain in Vercel
- Vercel → frontend project → **Settings → Domains**.
- Add `thecakegallery.online` and `www.thecakegallery.online`.
- Set `thecakegallery.online` as **Primary** and accept the `www` → apex redirect.
- Vercel displays the exact DNS records to add — they should match the ones below.

### 2. DNS records at Namecheap
Namecheap → **Domain List → Manage → Advanced DNS**.
- **Delete** the default parking records Namecheap pre-adds (`CNAME www → parkingpage.com` and the `URL Redirect @`), or they will conflict.
- Add:

| Type  | Host  | Value                   | TTL       |
|-------|-------|-------------------------|-----------|
| A     | `@`   | `76.76.21.21`           | Automatic |
| CNAME | `www` | `cname.vercel-dns.com.` | Automatic |

> Match whatever Vercel's dashboard shows — it is the source of truth. DNS can take minutes to ~24h to propagate; Vercel auto-issues HTTPS once verified.

### 3. Allow the domain in the backend (Render) — required
Render → backend service → **Environment**:

```env
CORS_ORIGIN=https://thecakegallery.online,https://www.thecakegallery.online
```

`CORS_ORIGIN` accepts a comma-separated list (keep the old `…vercel.app` URL too if still used). Render restarts on save. **Skip this and the site loads but every API call fails with a CORS error.** The frontend `NEXT_PUBLIC_API_URL` does not change.

## Production Notes

- Replace demo payment capture with real Airtel Money and MTN MoMo integrations.
- Configure SMTP and SMS provider credentials for order notifications.
- Store uploaded images in Cloudinary or S3. The current API accepts image URLs for deployment simplicity.
- Set a strong JWT secret and strict CORS origin.
- Keep admin users limited and seeded manually after launch.

