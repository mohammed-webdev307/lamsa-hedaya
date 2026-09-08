-- Store-wide settings editable from the admin dashboard.
create table if not exists public.store_settings (
  id integer primary key default 1 check (id = 1),
  name text not null default 'لمسة هدية',
  tagline text not null default 'هدية صغيرة.. تصنع ذكرى كبيرة',
  currency text not null default 'QAR',
  currency_name text not null default 'ريال قطري',
  whatsapp_number text not null default '970595263662',
  phone text not null default '+974 0000 0000',
  email text not null default 'info@lamsahadiya.qa',
  instagram text not null default 'lamsahadiya',
  instagram_url text not null default 'https://instagram.com/lamsahadiya',
  location text not null default 'الدوحة، قطر',
  weekdays_hours text not null default 'السبت إلى الخميس: 9:00 صباحًا - 10:00 مساءً',
  friday_hours text not null default 'الجمعة: 4:00 مساءً - 10:00 مساءً',
  footer_description text not null default 'متجر هدايا فاخر يقدم تشكيلة مميزة من الهدايا لكل المناسبات بلمسة راقية.',
  updated_at timestamptz not null default now()
);

alter table public.store_settings enable row level security;

drop policy if exists "store settings public read" on public.store_settings;
create policy "store settings public read"
on public.store_settings for select
to public
using (true);

drop policy if exists "store settings authenticated write" on public.store_settings;
create policy "store settings authenticated write"
on public.store_settings for all
to authenticated
using (true)
with check (true);

insert into public.store_settings (id)
values (1)
on conflict (id) do nothing;

grant select on public.store_settings to anon, authenticated;
grant insert, update on public.store_settings to authenticated;
