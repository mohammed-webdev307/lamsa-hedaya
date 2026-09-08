-- Run once in Supabase SQL Editor to enable the store logo setting.
alter table public.store_settings
  add column if not exists logo_url text not null default '';
