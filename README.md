# LawFlow

Desktop-first SaaS web app for solo lawyers in Israel. RTL-first Hebrew with optional English.

## Stack
- Next.js App Router + TypeScript
- Prisma + Postgres (Railway)
- Auth.js (email OTP)
- Postmark email (SendGrid fallback)
- Cloudflare R2 / S3 storage
- TanStack Table
- React Hook Form + Zod

## Local setup
```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## Env
Required:
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `POSTMARK_API_TOKEN`
- `POSTMARK_FROM_EMAIL`
- `S3_ENDPOINT`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`
- `S3_BUCKET`

Optional:
- `ADMIN_EMAIL`
- `SENDGRID_API_KEY`
- `SENDGRID_FROM_EMAIL`
- `S3_PUBLIC_URL`

## Deploy
- Frontend: Vercel
- Backend + DB: Railway (Postgres)

## Notes
- Default route is Today dashboard.
- Global search: `Ctrl/⌘ + K`
- Quick add: `Ctrl/⌘ + J`
