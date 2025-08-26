-- Fix projects table schema to include all expected columns
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid()
);

alter table public.projects add column if not exists name         text;
alter table public.projects add column if not exists symbol       text check (char_length(symbol) <= 10);
alter table public.projects add column if not exists description  text;
alter table public.projects add column if not exists mint         text;
alter table public.projects add column if not exists dev_wallet   text;
alter table public.projects add column if not exists image_url    text;
alter table public.projects add column if not exists pump_url     text;
alter table public.projects add column if not exists created_at   timestamptz not null default now();

create unique index if not exists projects_mint_unique on public.projects(lower(mint));
create index if not exists projects_created_at_idx on public.projects(created_at desc);
