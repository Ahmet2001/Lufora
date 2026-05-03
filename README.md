# 🌿 Lufora — AI-Powered Plant Care Platform

A mobile-first plant care application with grow journeys, gamification, community, and AI-powered plant health analysis.

**Tech Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Prisma ORM · PostgreSQL (Neon) · Netlify

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL database (local or [Neon](https://neon.tech))

### 1. Clone & Install

```bash
git clone https://github.com/your-username/lufora.git
cd lufora
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your database credentials:

```env
# Neon Postgres (pooled connection — used at runtime)
DATABASE_URL="postgresql://user:pass@ep-xxx-pooler.us-east-2.aws.neon.tech/lufora?sslmode=require"

# Neon Postgres (direct connection — used for migrations)
DIRECT_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/lufora?sslmode=require"

# Auth (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

> **Note:** Also create a `.env` file with the same `DATABASE_URL` and `DIRECT_URL` values — Prisma CLI reads from `.env`, not `.env.local`.

### 3. Set Up Database

```bash
# Push schema to database (creates all tables)
npm run db:push

# Seed demo data (Ada Green + 8 users, plants, journeys, tasks, posts, badges)
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Verify

Visit these pages:
- `/api/health` — Database connectivity check
- `/home` — Dashboard with tasks, plants, streak
- `/plants` — Plant collection
- `/grow` — Grow journeys
- `/calendar` — Today's tasks (try completing one!)
- `/community` — Community posts
- `/profile` — User profile & badges
- `/leaderboard` — Rankings

---

## 🌐 Deploy to Netlify

### Step 1: Create Neon Database

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project → choose a region near your users
3. Copy **two** connection strings from the Neon dashboard:
   - **Pooled** connection → `DATABASE_URL`
   - **Non-pooled / Direct** connection → `DIRECT_URL`

### Step 2: Prepare Database

```bash
# Set your .env with Neon credentials, then:
npm run db:push    # Creates schema on Neon
npm run db:seed    # Seeds demo data
```

### Step 3: Push to GitHub

```bash
git init
git add .
git commit -m "🌿 Lufora v0.1 — ready for deployment"
git remote add origin https://github.com/your-username/lufora.git
git push -u origin main
```

### Step 4: Deploy on Netlify

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repo
4. Netlify will auto-detect the `netlify.toml` config
5. **Add environment variables** in Netlify Dashboard → Site → Environment Variables:

| Variable | Value | Required |
|----------|-------|----------|
| `DATABASE_URL` | Neon pooled connection string | ✅ |
| `DIRECT_URL` | Neon direct connection string | ✅ |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` | ✅ |
| `NEXTAUTH_URL` | `https://your-site.netlify.app` | ✅ |
| `NEXT_PUBLIC_APP_URL` | `https://your-site.netlify.app` | ✅ |
| `AUTH_SECRET` | Same as NEXTAUTH_SECRET | ✅ |
| `CLOUDINARY_CLOUD_NAME` | — | 🔜 Future |
| `CLOUDINARY_API_KEY` | — | 🔜 Future |
| `CLOUDINARY_API_SECRET` | — | 🔜 Future |

6. Click **Deploy**

### Step 5: Verify Deployment

Visit your deployed site and check:
- `https://your-site.netlify.app/api/health` → Should return `{ "ok": true, "database": { "status": "connected" } }`
- `https://your-site.netlify.app/home` → Dashboard loads with seeded data
- `https://your-site.netlify.app/plants` → Plants list shows seeded plants
- `https://your-site.netlify.app/calendar` → Tasks with working complete button

---

## 📦 Database Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Generate | `npm run db:generate` | Regenerate Prisma Client |
| Push | `npm run db:push` | Push schema to DB (no migration files) |
| Migrate | `npm run db:migrate` | Run pending migrations |
| Migrate Dev | `npm run db:migrate:dev` | Create new migration (dev only) |
| Seed | `npm run db:seed` | Seed demo data |
| Studio | `npm run db:studio` | Open Prisma Studio GUI |
| Reset | `npm run db:reset` | ⚠️ Drop all data & re-seed |

### Seed Data Includes

- 🏷️ **14 badges** across plant care, grow journey, community, and streak categories
- 👤 **9 users** — Ada Green (demo user) + 8 leaderboard users
- 🪴 **4 plants** — Monstera, Cactus, Orchid, Pothos (Ada's collection)
- 📊 **5 health logs** — Monstera health history
- 📸 **3 plant photos** — Growth progression
- 🌱 **2 grow journeys** — Basil (from seed, day 12) + Avocado (from seed, day 24)
- 📸 **4 journey photos** — Journey progress
- 🏆 **9 milestones** — Journey stage milestones
- ✅ **12 tasks** — Mix of plant care + journey tasks (1 completed)
- 💬 **7 community posts** — From various users
- 💬 **12 replies** — Community discussions
- 💰 **8 point transactions** — Ada's points history
- 🏅 **4 earned badges** — Ada's unlocked badges

---

## ⚠️ Current Limitations (MVP)

### Auth
- **Current user is mocked** — `src/lib/current-user.ts` returns the first user (Ada Green)
- Real NextAuth integration is planned for Phase 6
- All API routes work without authentication for demo purposes

### AI
- Plant Doctor and Grow Guide use **mock AI responses**
- Located in `src/lib/ai/mock-ai-service.ts`
- Ready to swap with OpenAI/Anthropic/Gemini SDK calls

### Images
- Uses **placeholder image URLs** (`placehold.co`)
- Ready for Cloudinary/Supabase Storage integration

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── (main)/          # Pages with bottom navigation
│   │   ├── home/        # Dashboard
│   │   ├── plants/      # My Plants + Plant Detail
│   │   ├── grow/        # Grow Journeys + Journey Detail
│   │   ├── calendar/    # Tasks with complete button
│   │   ├── community/   # Community posts
│   │   ├── profile/     # User profile + badges
│   │   └── leaderboard/ # Rankings
│   └── api/             # 28 API routes
│       ├── ai/          # Mock AI endpoints
│       ├── badges/      # Badge management
│       ├── community/   # Posts + replies + likes
│       ├── grow-journeys/ # Journey CRUD
│       ├── health/      # Health check
│       ├── leaderboard/ # Rankings
│       ├── me/          # Current user
│       ├── plants/      # Plant CRUD + photos + health logs
│       ├── profile/     # Profile management
│       └── tasks/       # Task CRUD + complete
├── components/ui/       # Reusable UI components
├── hooks/               # Custom React hooks (useApi)
├── lib/                 # Business logic
│   ├── ai/              # AI service abstraction
│   ├── api-client.ts    # Typed fetch helpers
│   ├── api-helpers.ts   # API response helpers
│   ├── current-user.ts  # Mock auth (TODO: real NextAuth)
│   ├── mock-data.ts     # Frontend fallback data
│   ├── points.ts        # Points/badge business logic
│   ├── prisma.ts        # Prisma singleton
│   ├── utils.ts         # Utility functions
│   └── validations.ts   # Zod schemas
└── types/               # Shared TypeScript types
```

---

## 🔧 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Production build (includes prisma generate)
npm run lint         # ESLint check
npx tsc --noEmit     # TypeScript check
npx prisma validate  # Validate Prisma schema
npx prisma studio    # Open database GUI
```

---

## 📄 License

MIT
