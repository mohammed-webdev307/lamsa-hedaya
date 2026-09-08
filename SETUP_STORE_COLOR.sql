-- Run once in Supabase SQL Editor to enable the website primary color setting.
alter table public.store_settings
  add column if not exists primary_color text not null default '#8B6B3E';
