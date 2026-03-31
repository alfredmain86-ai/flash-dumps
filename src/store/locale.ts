import { create } from 'zustand';
import type { Locale } from '@/types';

interface LocaleStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggle: () => void;
}

export const useLocaleStore = create<LocaleStore>((set) => ({
  locale: 'en',
  setLocale: (locale) => set({ locale }),
  toggle: () => set((state) => ({ locale: state.locale === 'en' ? 'es' : 'en' })),
}));
