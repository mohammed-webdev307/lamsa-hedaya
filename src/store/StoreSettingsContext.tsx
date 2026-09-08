import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_STORE_SETTINGS,
  fetchStoreSettings,
  setRuntimeStoreSettings,
  type StoreSettings,
} from '@/lib/storeSettings';

interface StoreSettingsContextValue {
  settings: StoreSettings;
  loading: boolean;
  refresh: () => Promise<void>;
}

const StoreSettingsContext = createContext<StoreSettingsContextValue | undefined>(undefined);

export function StoreSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const next = await fetchStoreSettings();
    setSettings(next);
    setRuntimeStoreSettings(next);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    const primary = settings.primaryColor || DEFAULT_STORE_SETTINGS.primaryColor;
    const palettes: Record<string, { background: string; soft: string; text: string; border: string; dark: string; darker: string }> = {
      '#C85C7A': { background: '#FFF7F9', soft: '#FCEEF2', text: '#5B3341', border: '#F2D7DF', dark: '#7A334A', darker: '#562334' },
      '#8B654E': { background: '#FAF6F0', soft: '#F3EADF', text: '#4A3820', border: '#E7D8C8', dark: '#6A4936', darker: '#4A321F' },
      '#527A62': { background: '#F4F8F5', soft: '#EAF2EC', text: '#30483A', border: '#D6E5DA', dark: '#365842', darker: '#243D2D' },
      '#47759B': { background: '#F4F8FC', soft: '#EAF1F7', text: '#2E475C', border: '#D5E2ED', dark: '#315B7D', darker: '#213F58' },
    };
    const palette = palettes[primary.toUpperCase()] || {
      background: `color-mix(in srgb, ${primary} 6%, white)`,
      soft: `color-mix(in srgb, ${primary} 11%, white)`,
      text: `color-mix(in srgb, ${primary} 55%, black)`,
      border: `color-mix(in srgb, ${primary} 22%, white)`,
      dark: `color-mix(in srgb, ${primary} 72%, black)`,
      darker: `color-mix(in srgb, ${primary} 55%, black)`,
    };

    document.documentElement.style.setProperty('--brand-primary', primary);
    document.documentElement.style.setProperty('--theme-background', palette.background);
    document.documentElement.style.setProperty('--theme-soft', palette.soft);
    document.documentElement.style.setProperty('--theme-text', palette.text);
    document.documentElement.style.setProperty('--theme-border', palette.border);
    document.documentElement.style.setProperty('--theme-dark', palette.dark);
    document.documentElement.style.setProperty('--theme-darker', palette.darker);
  }, [settings.primaryColor]);

  const value = useMemo(() => ({ settings, loading, refresh }), [settings, loading]);

  return <StoreSettingsContext.Provider value={value}>{children}</StoreSettingsContext.Provider>;
}

export function useStoreSettings() {
  const context = useContext(StoreSettingsContext);
  if (!context) throw new Error('useStoreSettings must be used within StoreSettingsProvider');
  return context;
}
