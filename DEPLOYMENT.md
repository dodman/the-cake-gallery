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
CORS_ORIGIN=https://your-vercel-domain.vercel.app
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

## Production Notes

- Replace demo payment capture with real Airtel Money and MTN MoMo integrations.
- Configure SMTP and SMS provider credentials for order notifications.
- Store uploaded images in Cloudinary or S3. The current API accepts image URLs for deployment simplicity.
- Set a strong JWT secret and strict CORS origin.
- Keep admin users limited and seeded manually after launch.

