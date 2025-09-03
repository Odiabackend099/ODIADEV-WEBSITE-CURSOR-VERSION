-- Supabase schema for ODIADEV
create extension if not exists "uuid-ossp";

create table if not exists public.leads (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  name text,
  email text unique,
  phone text,
  message text,
  source text,
  session_id text,
  qualified boolean,
  score numeric,
  notes text
);

create table if not exists public.client_intake (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  business_name text,
  industry text,
  country text,
  preferred_channels text[],
  whatsapp_number text,
  telegram_handle text,
  website_url text,
  use_cases text[],
  required_integrations text[],
  budget_tier text,
  timeline text,
  voice_pref jsonb,
  contact jsonb,
  session_id text
);

create table if not exists public.conversations (
  id uuid primary key default uuid_generate_v4(),
  session_id text,
  ended_at timestamptz,
  final_reply text,
  transcript text,
  summary text
);
