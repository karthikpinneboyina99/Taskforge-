'use client';

import { create } from 'zustand';

export type Page = 'dashboard' | 'boards' | 'analytics' | 'ai' | 'team' | 'settings' | 'pricing';

export interface UiState {
  darkMode: boolean;
  activePage: Page;
  toggleDarkMode: () => void;
  setDarkMode: (dark: boolean) => void;
  setActivePage: (page: Page) => void;
}

export const useUiStore = create<UiState>((set) => ({
  darkMode: true,
  activePage: 'boards',
  toggleDarkMode: () =>
    set((state) => {
      const next = !state.darkMode;
      document.documentElement.classList.toggle('dark', next);
      return { darkMode: next };
    }),
  setDarkMode: (dark) => {
    document.documentElement.classList.toggle('dark', dark);
    set({ darkMode: dark });
  },
  setActivePage: (page) => set({ activePage: page }),
}));
