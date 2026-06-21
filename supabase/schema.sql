-- Gatebreaker — Supabase schema
-- Run this in your Supabase project's SQL editor.
-- ALL tables are prefixed `gatebreaker_`.
--
-- The user owns external configuration (project + credentials). The app reads
-- VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY at build time; without them the game
-- falls back to a local highscore store.

-- ─────────────────────────────────────────────────────────────────────────────
-- Highscores
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.gatebreaker_highscores (
  id              bigint generated always as identity primary key,
  player_name     text        not null default 'Anonymous',
  score           integer     not null default 0,
  max_level       integer     not null default 1,
  resources_total integer     not null default 0,
  created_at      timestamptz not null default now()
);

-- Leaderboard query: top scores fast.
create index if not exists gatebreaker_highscores_score_idx
  on public.gatebreaker_highscores (score desc);

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security (PLACEHOLDER — tighten before production)
-- For a public arcade leaderboard we allow anyone to read and insert scores,
-- but never update/delete. Revisit during the balancing/production phase.
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.gatebreaker_highscores enable row level security;

drop policy if exists gatebreaker_highscores_read on public.gatebreaker_highscores;
create policy gatebreaker_highscores_read
  on public.gatebreaker_highscores
  for select
  using (true);

drop policy if exists gatebreaker_highscores_insert on public.gatebreaker_highscores;
create policy gatebreaker_highscores_insert
  on public.gatebreaker_highscores
  for insert
  with check (true);
