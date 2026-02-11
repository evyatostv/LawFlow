# LawFlow

Desktop-first SaaS web app for solo lawyers in Israel. RTL-first Hebrew with optional English.

## Stack
- Next.js App Router + TypeScript
- Prisma + Postgres
- shadcn-style UI primitives (custom)
- TanStack Table
- React Hook Form + Zod

## Quick start
```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

## Notes
- Default route is Today dashboard.
- Global search: `Ctrl/⌘ + K`
- Quick add: `Ctrl/⌘ + J`
