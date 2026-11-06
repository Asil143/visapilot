# StatusClock

**Immigration checklists, deadline tracking, and AI guidance for international students and professionals.**

StatusClock provides step-by-step checklists, deadline tracking, an AI assistant, and attorney inquiry referrals for F-1, OPT, H-1B, green card, and other US immigration paths. Built as a full-stack Next.js application with Supabase, Clerk, and the Claude API.

---

## Features

### For users
- **AI Assistant** — Ask immigration questions 24/7, powered by Claude (Anthropic)
- **Visa Checklists** — Step-by-step checklists for F-1, OPT, STEM OPT, H-1B, green card, and more
- **Visa Path Finder** — A guided questionnaire that turns your goal and current situation into a research map
- **OPT Day Counter** — Track the 90-day unemployment limit in real time
- **Visa Bulletin Tracker** — Priority date wait-time calculator with movement speed estimates from USCIS history
- **Form Guides** — AI-guided interviews for USCIS forms
- **Fee Calculator** — Calculate USCIS filing fees by form type
- **RFE Assistant** — Build a structured RFE response (Pro)
- **Case Status** — Check USCIS case status by receipt number
- **My Cases / Timeline / Documents** — Personal case management dashboard
- **Community** — Q&A community for immigration discussions
- **Attorney Referrals** — Submit attorney inquiries; attorneys are matched to your case type
- **Deadline Alerts** — Daily email reminders for upcoming immigration deadlines (via Vercel Cron + Resend)

### For attorneys *(coming soon)*
- Partner portal to receive matched client leads, manage consultations, and build a verified profile

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org) (App Router) |
| Auth | [Clerk](https://clerk.com) |
| Database | [Supabase](https://supabase.com) (PostgreSQL + Storage) |
| AI | [Anthropic Claude API](https://anthropic.com) (`@anthropic-ai/sdk`) |
| Email | [Resend](https://resend.com) |
| UI | [Tailwind CSS](https://tailwindcss.com) + [Radix UI](https://radix-ui.com) (shadcn/ui components) |
| State | [Zustand](https://zustand-demo.pmnd.rs) + [TanStack Query](https://tanstack.com/query) |
| Forms | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| Animation | [Framer Motion](https://framer.com/motion) |
| PDF | `pdf-lib`, `jspdf`, `html2canvas` |
| Deployment | [Vercel](https://vercel.com) |

---

## Project Structure

```
app/
├── (marketing)/          # Public-facing pages (no auth required)
│   ├── about/
│   ├── blog/
│   ├── contact/
│   ├── events/
│   ├── faq/
│   ├── guides/           # Visa guide articles (F-1, OPT, H-1B, etc.)
│   ├── lawyers/          # Attorney referral & inquiry page
│   ├── pricing/
│   ├── success-stories/
│   └── ...
├── (dashboard)/          # Authenticated dashboard
│   ├── dashboard/
│   │   ├── cases/
│   │   ├── documents/
│   │   ├── timeline/
│   │   └── tools/        # Visa Checklists, OPT Tracker, Visa Bulletin, etc.
│   ├── ai-assistant/
│   ├── community/
│   ├── rfe-assistant/
│   ├── settings/
│   └── lawyer-portal/    # Attorney partner portal (coming soon)
├── (auth)/               # Clerk sign-in / sign-up
├── admin/                # Admin panel (payment activation, submissions)
└── api/
    ├── chat/             # AI assistant (Claude API)
    ├── contact/          # Contact form → Resend email
    ├── payments/submit   # Manual payment submission
    ├── user/plan         # User plan lookup
    ├── profile/          # Profile updates (priority date, prefs)
    ├── community/        # Community posts CRUD
    ├── cases/            # Case management
    ├── documents/        # Document storage
    ├── reminders/        # Deadline management
    ├── forms/            # USCIS form guides
    ├── checklists/       # Visa checklist data
    ├── admin/            # Admin payment activation
    ├── cron/
    │   └── deadline-alerts  # Runs daily at 9 AM via Vercel Cron
    └── webhooks/stripe   # Stripe webhooks (legacy)

components/
├── layout/              # Navbar, Sidebar, Footer
├── payments/            # PaymentModal (Cash App, PayPal, Venmo, Chime, Zelle)
└── ui/                  # shadcn/ui components

lib/
├── supabase/            # Supabase client + admin client + migrations.sql
├── anthropic/           # Claude API client
└── utils/

config/
└── navigation.ts        # Sidebar and navbar link definitions
```

---

## Environment Variables

Create a `.env.local` file at the project root with the following:

```bash
# Clerk — https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Supabase — https://supabase.com/dashboard
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Anthropic — https://console.anthropic.com
ANTHROPIC_API_KEY=sk-ant-...

# Resend — https://resend.com/api-keys
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Database Setup

Run the migration file against your Supabase project. In the Supabase dashboard, go to **SQL Editor** and paste the contents of:

```
lib/supabase/migrations.sql
```

This creates the following tables:
- `profiles` — extended user data synced from Clerk
- `chat_conversations` — AI chat history per user
- `form_submissions` — USCIS form guide responses
- `community_posts` — Community Q&A posts
- `payment_submissions` — Manual payment records (pending / activated / rejected)
- `user_plans` — Activated plan records after admin approval

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project
- A Clerk application
- An Anthropic API key
- A Resend account

### Local development

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other commands

```bash
npm run build   # Production build
npm run start   # Start production server
npm run lint    # ESLint
```

---

## Payments

StatusClock uses a **manual payment flow** — no Stripe checkout required:

1. User selects a plan on `/pricing` or `/settings`
2. A modal shows payment handles (Cash App `$AsilKamepalli`, PayPal, Venmo, Chime, Zelle)
3. User pays and uploads a screenshot via the modal
4. Submission is saved to `payment_submissions` and an email notification is sent
5. Admin reviews at `/admin/payments` and activates the plan, which writes to `user_plans`
6. The sidebar and `/api/user/plan` read `user_plans` to show the correct plan badge

---

## Cron Jobs

A Vercel Cron runs daily at 9 AM UTC:

```
GET /api/cron/deadline-alerts
```

Configured in `vercel.json`. It sends deadline reminder emails to users with upcoming immigration milestones via Resend.

---

## Key Conventions

- **`createAdminClient()` is synchronous** — do not `await` it. It returns a Supabase client with the service role key.
- **Clerk `useUser()`** provides the authenticated user on the client. For server-side auth use `auth()` from `@clerk/nextjs/server`.
- **Navigation is defined in `config/navigation.ts`** — add or remove sidebar/navbar items there, not inline in components.
- **Shared UI components** live in `components/ui/` (shadcn/ui) and `components/payments/` (PaymentModal).

---

## Disclaimer

StatusClock provides general immigration information only. It is **not a law firm** and does not provide legal advice. Always consult a licensed immigration attorney for your specific situation.

---

## License

Private repository. All rights reserved.
