import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Mode = 'auto' | 'diy' | null;
export type Locale = 'de' | 'en';

interface ApiKeys {
  openrouter: string | null;
  heygen: string | null;
}

interface AppState {
  // Mode
  mode: Mode;
  setMode: (mode: Mode) => void;

  // Locale
  locale: Locale;
  setLocale: (locale: Locale) => void;

  // Session
  sessionId: string;

  // Auth
  isAuthenticated: boolean;
  userId: string | null;
  setAuth: (isAuthenticated: boolean, userId?: string | null) => void;

  // API Keys (only for auto mode)
  apiKeys: ApiKeys;
  setApiKey: (service: keyof ApiKeys, key: string | null) => void;
  apiKeysValidated: boolean;
  setApiKeysValidated: (validated: boolean) => void;

  // Reset
  reset: () => void;
}

const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

const initialState = {
  mode: null as Mode,
  locale: 'de' as Locale,
  sessionId: generateSessionId(),
  isAuthenticated: false,
  userId: null,
  apiKeys: {
    openrouter: null,
    heygen: null,
  },
  apiKeysValidated: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,

      setMode: (mode) => set({ mode }),

      setLocale: (locale) => set({ locale }),

      setAuth: (isAuthenticated, userId = null) =>
        set({ isAuthenticated, userId }),

      setApiKey: (service, key) =>
        set((state) => ({
          apiKeys: { ...state.apiKeys, [service]: key },
          apiKeysValidated: false, // Reset validation when keys change
        })),

      setApiKeysValidated: (validated) => set({ apiKeysValidated: validated }),

      reset: () =>
        set({
          ...initialState,
          sessionId: generateSessionId(), // Generate new session on reset
        }),
    }),
    {
      name: 'channelmagic-app',
      partialize: (state) => ({
        mode: state.mode,
        locale: state.locale,
        sessionId: state.sessionId,
        // Don't persist API keys in localStorage for security
        // They should be stored encrypted in database for authenticated users
      }),
    }
  )
);
