-- ============================================================
-- VisaPilot — Pending Migrations
-- Paste this entire file into Supabase SQL Editor and run it.
-- All statements use IF NOT EXISTS / IF NOT EXISTS guards
-- so it is safe to run multiple times.
-- ============================================================

-- ─── 1. Profile personal info columns ────────────────────────────────────────
alter table public.profiles add column if not exists first_name      text;
alter table public.profiles add column if not exists last_name       text;
alter table public.profiles add column if not exists middle_name     text;
alter table public.profiles add column if not exists date_of_birth   date;
alter table public.profiles add column if not exists ssn             text;
alter table public.profiles add column if not exists mailing_street  text;
alter table public.profiles add column if not exists mailing_city    text;
alter table public.profiles add column if not exists mailing_state   text;
alter table public.profiles add column if not exists mailing_zip     text;
alter table public.profiles add column if not exists phone           text;
alter table public.profiles add column if not exists a_number        text;
alter table public.profiles add column if not exists i20_start_date          date;
alter table public.profiles add column if not exists notification_prefs     jsonb;
alter table public.profiles add column if not exists onboarding_complete    boolean not null default false;
alter table public.profiles add column if not exists subscription_plan      text not null default 'free';

-- ─── Chat conversations ───────────────────────────────────────────────────────
create table if not exists public.chat_conversations (
  id          uuid primary key default uuid_generate_v4(),
  clerk_id    text not null references public.profiles(clerk_id) on delete cascade,
  title       text not null default 'New conversation',
  messages    jsonb not null default '[]',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
create index if not exists idx_chat_conversations_clerk    on public.chat_conversations(clerk_id);
create index if not exists idx_chat_conversations_updated  on public.chat_conversations(updated_at desc);

-- ─── 2. Form submissions (I-864 and future forms) ────────────────────────────
create table if not exists public.form_submissions (
  id           uuid primary key default uuid_generate_v4(),
  clerk_id     text not null references public.profiles(clerk_id) on delete cascade,
  form_type    text not null default 'I-864',
  fields       jsonb not null default '{}',
  user_email   text,
  user_name    text,
  status       text not null default 'submitted',
  admin_notes  text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);
create unique index if not exists idx_form_submissions_unique  on public.form_submissions(clerk_id, form_type);
create index        if not exists idx_form_submissions_status  on public.form_submissions(status);
create index        if not exists idx_form_submissions_clerk   on public.form_submissions(clerk_id);

-- ─── 3. Community posts ───────────────────────────────────────────────────────
create table if not exists public.community_posts (
  id               uuid primary key default uuid_generate_v4(),
  user_id          text not null,
  author_name      text not null default 'Anonymous',
  author_initials  text not null default '?',
  author_visa      text not null default 'F-1',
  category         text not null default 'General',
  title            text not null,
  body             text not null,
  tags             text[] default array[]::text[],
  upvotes          integer not null default 0,
  replies          integer not null default 0,
  is_answered      boolean not null default false,
  is_pinned        boolean not null default false,
  created_at       timestamptz default now()
);
create index if not exists idx_community_posts_category  on public.community_posts(category);
create index if not exists idx_community_posts_created   on public.community_posts(created_at desc);
create index if not exists idx_community_posts_upvotes   on public.community_posts(upvotes desc);
create index if not exists idx_community_posts_user      on public.community_posts(user_id);

-- Upvote helper (drop old version first to allow parameter rename)
drop function if exists increment_upvotes(uuid);
create or replace function increment_upvotes(post_id uuid)
returns void language sql as $$
  update public.community_posts set upvotes = upvotes + 1 where id = post_id;
$$;

-- ─── 4. Payment submissions (manual Cash App / Venmo / Zelle etc.) ────────────
create table if not exists public.payment_submissions (
  id             uuid primary key default uuid_generate_v4(),
  clerk_id       text references public.profiles(clerk_id) on delete set null,
  email          text not null,
  plan_id        text not null,
  plan_name      text not null,
  amount         numeric(8,2) not null,
  tx_note        text,
  screenshot_url text,
  status         text not null default 'pending' check (status in ('pending','activated','rejected')),
  activated_at   timestamptz,
  created_at     timestamptz default now()
);
create index if not exists idx_payment_submissions_status  on public.payment_submissions(status);
create index if not exists idx_payment_submissions_clerk   on public.payment_submissions(clerk_id);
create index if not exists idx_payment_submissions_created on public.payment_submissions(created_at desc);

-- ─── 5. User plans (activated plans after payment verification) ───────────────
create table if not exists public.user_plans (
  id         uuid primary key default uuid_generate_v4(),
  clerk_id   text references public.profiles(clerk_id) on delete cascade,
  email      text not null,
  plan_id    text not null,
  plan_name  text not null,
  expires_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists idx_user_plans_clerk on public.user_plans(clerk_id);
create index if not exists idx_user_plans_email on public.user_plans(email);

-- ─── 6. Community post upvotes (one vote per user per post) ───────────────────
create table if not exists public.community_post_upvotes (
  post_id    uuid not null references public.community_posts(id) on delete cascade,
  clerk_id   text not null references public.profiles(clerk_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, clerk_id)
);

-- ─── 7. Community replies ────────────────────────────────────────────────────
create table if not exists public.community_replies (
  id               uuid primary key default uuid_generate_v4(),
  post_id          uuid not null references public.community_posts(id) on delete cascade,
  user_id          text not null,
  author_name      text not null default 'Anonymous',
  author_initials  text not null default '?',
  body             text not null,
  upvotes          integer not null default 0,
  is_best_answer   boolean not null default false,
  created_at       timestamptz not null default now()
);
create index if not exists idx_community_replies_post    on public.community_replies(post_id, created_at);
create index if not exists idx_community_replies_user    on public.community_replies(user_id);
