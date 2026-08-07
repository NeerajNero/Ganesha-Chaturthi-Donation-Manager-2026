# Ganesh Utsav 2026 — Donation Collection App 🙏

Mobile-first web app for a Ganesh Utsav committee to manage **door-to-door
donation collection**: volunteers record cash/UPI donations on their phones,
donors get WhatsApp receipts, admins verify UPI payments and reconcile cash,
expenses are tracked, and a public transparency wall shows where every rupee
goes.

## Features

- **Volunteers** log in and record donations with a one-hand form: quick
  amount chips, live UPI QR (amount prefilled), optional payment-screenshot
  upload, WhatsApp receipt button.
- **Receipts**: every donation gets a gapless number (`GU26-0001`, …) and a
  public festive receipt page at `/r/<receiptNo>` (zero client JS — instant
  on cheap phones).
- **Admin**: dashboard stats (total/today/cash-in-hand/pending UPI/spent/
  balance), UPI verify/reject with screenshot review, cash deposit
  reconciliation, volunteer management, expense tracking with bill photos,
  one-tap Telegram summary broadcast.
- **Public**: interactive homepage (tap Ganesha for a blessing 🐘), donation
  wall with goal progress and a "Where the money went" expense list.
  Anonymous donors show as "A Well-Wisher" — enforced server-side.
- **Telegram**: every donation posts to a channel; admins can broadcast a
  collection summary (rate-limited to one per 2 minutes).

## Tech stack

Next.js 16 (App Router) · TypeScript strict · Tailwind CSS v4 ·
TanStack Query v5 · Prisma 6 · Neon Postgres · JWT auth via `jose`
(httpOnly cookie + `proxy.ts`) · bcryptjs · Cloudinary unsigned uploads ·
Telegram Bot API (plain fetch) · Vercel.

## Local setup

```bash
npm install                 # also runs prisma generate (postinstall)
cp .env.example .env        # then fill in values (see table below)
npm run db:push             # create tables on Neon
npm run db:seed             # create the super admin + receipt counter
npm run dev                 # http://localhost:3000
```

Useful scripts: `npm run db:studio` (Prisma Studio), `npm run lint`,
`npm run build`.

## Environment variables

| Variable | Required | How to get it |
|---|---|---|
| `DATABASE_URL` | ✅ | Neon dashboard → your project → **Connection string**, choose **Pooled connection**. Keep `?sslmode=require`. |
| `JWT_SECRET` | ✅ | Any long random string: `openssl rand -base64 48` |
| `ADMIN_USERNAME` | ✅ (seed) | Your choice — the single super-admin login. |
| `ADMIN_PASSWORD` | ✅ (seed) | Plain text here; the seed stores only a bcrypt hash. |
| `ADMIN_NAME` | ✅ (seed) | Display name, e.g. `Neeraj Sharma`. |
| `TELEGRAM_BOT_TOKEN` | optional | Chat with **@BotFather** → `/newbot` → copy the token. Add the bot to your channel as an **admin** (needs "Post messages"). |
| `TELEGRAM_CHANNEL_ID` | optional | Public channel: `@yourchannel`. Private channel: forward a channel post to **@userinfobot** and use the `-100…` id. |
| `CRON_SECRET` | optional | Random string (`openssl rand -hex 24`). When set on Vercel, the daily 8pm IST cron (see `vercel.json`) authenticates with it and posts the Telegram summary automatically. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | optional | Cloudinary dashboard → account **Cloud name**. |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | optional | Cloudinary → Settings → Upload → **Add upload preset** → Signing mode: **Unsigned**. Uploads go straight from the browser; the server stores only the URL. |
| `NEXT_PUBLIC_UPI_ID` | optional | Committee UPI VPA, e.g. `gu2026@oksbi`. Without it the UPI QR is hidden. |
| `NEXT_PUBLIC_UPI_NAME` | optional | Payee name shown in UPI apps. |
| `NEXT_PUBLIC_APP_URL` | ✅ in prod | The deployed URL, e.g. `https://gu2026.vercel.app`. Used in WhatsApp receipt links and Telegram broadcasts. |

Telegram/Cloudinary/UPI features degrade gracefully when unset (no
notifications, no upload button, no QR) — nothing breaks.

Committee-specific text (goal amount, committee name, festival dates, venue)
lives in `lib/config.ts`.

## Deploying (Neon + Vercel, both free tier)

### 1. Neon (database)

1. Create a project at [neon.tech](https://neon.tech) (region close to your
   users, e.g. `ap-southeast-1`).
2. Copy the **pooled** connection string → this is your production
   `DATABASE_URL`.
3. Create the tables from your machine:
   ```bash
   DATABASE_URL="<prod pooled url>" npx prisma db push
   ```

### 2. Seed the production admin

Run the seed from your machine against the production database (shell env
vars override `.env`):

```bash
DATABASE_URL="<prod pooled url>" \
ADMIN_USERNAME="admin" \
ADMIN_PASSWORD="<strong password>" \
ADMIN_NAME="Your Name" \
npx prisma db seed
```

The seed is an upsert — safe to re-run (also handy for resetting the admin
password later).

### 3. Vercel (app)

1. Push this repo to GitHub and **Import** it in Vercel.
2. Framework preset **Next.js** — default build settings are correct.
   `prisma generate` runs automatically via the `postinstall` script, so no
   custom build command is needed.
3. Add **all** environment variables from the table above in
   Project → Settings → Environment Variables (set `NEXT_PUBLIC_APP_URL` to
   the final URL — you can add it after the first deploy shows you the
   domain, then redeploy).
4. Deploy, then walk through the smoke test below **on a phone**.

### Post-deploy smoke test

1. Log in as admin → create a volunteer.
2. Log in as that volunteer (second browser/incognito) → record a UPI
   donation with a screenshot → Telegram message arrives.
3. Tap "Send receipt on WhatsApp" → receipt link opens logged-out.
4. Admin → Donations → Verify the pending UPI → it appears on `/wall`.
5. Record a cash donation → admin marks it deposited → cash-in-hand drops.
6. Add an expense → appears in "Where the money went" on `/wall`.
7. Dashboard → 📢 Send summary to Telegram.

## Operational notes

- **Daily summary cron**: `vercel.json` schedules `GET /api/broadcast/summary`
  at 14:30 UTC (8pm IST). Vercel sends `Authorization: Bearer <CRON_SECRET>`
  automatically when the `CRON_SECRET` env var exists on the project. On the
  Hobby plan, cron timing can drift within the hour.
- **PWA**: volunteers can "Add to Home Screen" — the app installs with the
  diya icon and opens full-screen straight to `/collect`.

- **Rate limits are in-memory** (login: 5 fails/username/15 min; broadcast:
  1 per 2 min). On Vercel each serverless instance has its own memory, so
  they're best-effort — fine for this app's scale.
- **Timezone**: all "today"/date filtering assumes IST (UTC+5:30),
  regardless of server region.
- **Roles**: there is exactly one admin (from the seed). Volunteers are
  created/deactivated in Admin → Volunteers; deactivating blocks login and
  donation posting immediately.
- **Receipt numbers** are issued inside a DB transaction — gapless even
  under concurrent submissions.
