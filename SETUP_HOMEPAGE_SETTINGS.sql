-- Run once in Supabase SQL Editor to add homepage controls.
alter table public.store_settings
  add column if not exists hero_badge text not null default 'متجر هدايا فاخر',
  add column if not exists hero_title text not null default 'هدية صغيرة.. تصنع ذكرى كبيرة',
  add column if not exists hero_description text not null default 'اختر هديتك المميزة واجعل كل مناسبة ذكرى لا تُنسى.',
  add column if not exists hero_image text not null default 'https://images.pexels.com/photos/30632274/pexels-photo-30632274.png?auto=compress&cs=tinysrgb&h=650&w=940',
  add column if not exists show_categories boolean not null default true,
  add column if not exists show_best_sellers boolean not null default true,
  add column if not exists show_occasions boolean not null default true,
  add column if not exists show_why_us boolean not null default true,
  add column if not exists show_testimonials boolean not null default true,
  add column if not exists show_custom_gift_cta boolean not null default true;
