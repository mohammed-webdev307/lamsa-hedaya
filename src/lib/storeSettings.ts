import { STORE_CONFIG } from '@/data/store';
import { supabase } from '@/lib/supabase';

export interface StoreSettings {
  name: string;
  tagline: string;
  currency: string;
  currencyName: string;
  whatsappNumber: string;
  phone: string;
  email: string;
  instagram: string;
  instagramUrl: string;
  location: string;
  weekdaysHours: string;
  fridayHours: string;
  footerDescription: string;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  name: STORE_CONFIG.name,
  tagline: STORE_CONFIG.tagline,
  currency: STORE_CONFIG.currency,
  currencyName: STORE_CONFIG.currencyName,
  whatsappNumber: STORE_CONFIG.whatsappNumber,
  phone: STORE_CONFIG.phone,
  email: STORE_CONFIG.email,
  instagram: STORE_CONFIG.instagram,
  instagramUrl: STORE_CONFIG.instagramUrl,
  location: STORE_CONFIG.location,
  weekdaysHours: STORE_CONFIG.workingHours.weekdays,
  fridayHours: STORE_CONFIG.workingHours.friday,
  footerDescription: 'متجر هدايا فاخر يقدم تشكيلة مميزة من الهدايا لكل المناسبات بلمسة راقية.',
};

let runtimeSettings: StoreSettings = DEFAULT_STORE_SETTINGS;

export function getRuntimeStoreSettings() {
  return runtimeSettings;
}

export function setRuntimeStoreSettings(settings: StoreSettings) {
  runtimeSettings = settings;
}

export async function fetchStoreSettings(): Promise<StoreSettings> {
  const { data, error } = await supabase
    .from('store_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  if (error || !data) return DEFAULT_STORE_SETTINGS;

  return {
    name: data.name || DEFAULT_STORE_SETTINGS.name,
    tagline: data.tagline || DEFAULT_STORE_SETTINGS.tagline,
    currency: data.currency || DEFAULT_STORE_SETTINGS.currency,
    currencyName: data.currency_name || DEFAULT_STORE_SETTINGS.currencyName,
    whatsappNumber: data.whatsapp_number || DEFAULT_STORE_SETTINGS.whatsappNumber,
    phone: data.phone || DEFAULT_STORE_SETTINGS.phone,
    email: data.email || DEFAULT_STORE_SETTINGS.email,
    instagram: data.instagram || DEFAULT_STORE_SETTINGS.instagram,
    instagramUrl: data.instagram_url || DEFAULT_STORE_SETTINGS.instagramUrl,
    location: data.location || DEFAULT_STORE_SETTINGS.location,
    weekdaysHours: data.weekdays_hours || DEFAULT_STORE_SETTINGS.weekdaysHours,
    fridayHours: data.friday_hours || DEFAULT_STORE_SETTINGS.fridayHours,
    footerDescription: data.footer_description || DEFAULT_STORE_SETTINGS.footerDescription,
  };
}

export async function saveStoreSettings(settings: StoreSettings) {
  return supabase.from('store_settings').upsert({
    id: 1,
    name: settings.name.trim(),
    tagline: settings.tagline.trim(),
    currency: settings.currency.trim() || 'QAR',
    currency_name: settings.currencyName.trim(),
    whatsapp_number: settings.whatsappNumber.replace(/[^0-9]/g, ''),
    phone: settings.phone.trim(),
    email: settings.email.trim(),
    instagram: settings.instagram.replace(/^@/, '').trim(),
    instagram_url: settings.instagramUrl.trim(),
    location: settings.location.trim(),
    weekdays_hours: settings.weekdaysHours.trim(),
    friday_hours: settings.fridayHours.trim(),
    footer_description: settings.footerDescription.trim(),
    updated_at: new Date().toISOString(),
  });
}
