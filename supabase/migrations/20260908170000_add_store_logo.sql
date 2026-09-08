alter table public.store_settings
  add column if not exists logo_url text not null default '';
