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
    document.documentElement.style.setProperty('--brand-primary', settings.primaryColor || DEFAULT_STORE_SETTINGS.primaryColor);
  }, [settings.primaryColor]);

  const value = useMemo(() => ({ settings, loading, refresh }), [settings, loading]);

  return <StoreSettingsContext.Provider value={value}>{children}</StoreSettingsContext.Provider>;
}

export function useStoreSettings() {
  const context = useContext(StoreSettingsContext);
  if (!context) throw new Error('useStoreSettings must be used within StoreSettingsProvider');
  return context;
}
