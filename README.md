# TeamProgressHub

Production-ready team progress dashboard built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, **shadcn/ui-style components**, and **Supabase (PostgreSQL)**. Data is synced from a Google Sheet (`Progress` tab) every 3 minutes.

## Features

- Google Sheets API v4 integration via **Service Account** (server-side only)
- Automatic sync every **180 seconds** using `setInterval` from the client polling `/api/sync`
- Supabase-backed caching/data model: `teams`, `stages`, `tasks`, `progress`, `task_progress`, `videos`, `app_meta`
- Gamified dashboard with stage locking and sequential unlock rules
- Team switcher (Armavir, Yerevan, Gyumri, Vanadzor, Dilijan sample teams)
- Leaderboard page sorted by total points desc
- Videos page with responsive YouTube embeds
- Light/dark mode, loading/error toasts, deploy-ready for Vercel

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui-style primitives (Button, Card, Select, Progress)
- Supabase JS
- Google APIs Node.js client

## Folder Structure

```txt
app/
  actions/sync-actions.ts
  api/sync/route.ts
  leaderboard/page.tsx
  videos/page.tsx
  globals.css
  layout.tsx
  page.tsx
components/
  app-shell.tsx
  theme-provider.tsx
  theme-toggle.tsx
  dashboard/
    refresh-indicator.tsx
    stage-stepper.tsx
    team-switcher.tsx
  ui/
    badge.tsx
    button.tsx
    card.tsx
    progress.tsx
    select.tsx
lib/
  env.ts
  google-sheets.ts
  supabase.ts
  sync.ts
types/
  index.ts
supabase/
  schema.sql
.env.example
```

## Google Sheet Template (Source of Truth)

Create a Google Sheet with:
- **Spreadsheet name**: anything (copy ID from URL)
- **Worksheet/tab name**: `Progress`
- Header row (A1 onward) in this exact order:

```txt
Team | TotalPoints | Stage1_Completed | Stage2_Completed | Stage3_Completed | Stage4_Completed |
Task1_Completed | Task1_Points | Task2_Completed | Task2_Points | ... | Task12_Completed | Task12_Points
```

### Sample template description
1. Create a new Google Sheet.
2. Add tab `Progress`.
3. Paste the header above in row 1.
4. Add rows for sample teams.

Sample team rows to start:
- Armavir
- Yerevan
- Gyumri
- Vanadzor
- Dilijan

## Google Service Account Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create project (or use existing).
3. Enable **Google Sheets API**.
4. Create Service Account:
   - IAM & Admin → Service Accounts → Create
   - Role can be minimal read-only for Sheets access.
5. Create key (JSON) and copy:
   - `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (preserve newlines; use `\n` in `.env`)
6. Share your Google Sheet with the service account email as Viewer.
7. Copy Spreadsheet ID from URL to `GOOGLE_SHEET_ID`.

## Supabase Setup

1. Create Supabase project.
2. Open SQL editor and run `supabase/schema.sql`.
3. Get project URL + keys from Settings → API.
4. Fill `.env.local` based on `.env.example`.

## Environment Variables

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=
```

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Deployment (Vercel)

1. Push code to GitHub.
2. Import project in Vercel.
3. Add all env vars from above.
4. Deploy.
5. Optional: call `/api/sync` on a Vercel cron as additional server-side safeguard.

## Data Sync Flow

- Client dashboard runs `setInterval` every 3 minutes.
- It `POST`s `/api/sync`.
- API route fetches Google Sheet `Progress` via Service Account.
- Sync writes/updates rows in Supabase tables.
- UI calls `router.refresh()` to show latest data instantly.

## Notes

- Stage unlocking logic:
  - Stage 1 unlocked by default.
  - Stage N unlocks when Stage N-1 is completed in sheet-derived progress.
- Leaderboard includes all teams and sorts by `total_points DESC`.
- Videos page pulls from `videos` table and displays 6 embedded placeholders.
