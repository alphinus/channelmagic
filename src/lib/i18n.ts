'use client';

import { useAppStore } from '@/store/app-store';
import type { Locale } from '@/i18n/config';
import de from '@/i18n/de.json';
import en from '@/i18n/en.json';

const messages = { de, en };

type NestedKeyOf<T> = T extends object
  ? { [K in keyof T]: K extends string ? (T[K] extends object ? `${K}.${NestedKeyOf<T[K]>}` : K) : never }[keyof T]
  : never;

type TranslationKey = NestedKeyOf<typeof de>;

export function useTranslation() {
  const locale = useAppStore((state) => state.locale);

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: unknown = messages[locale];

    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }

    if (typeof value !== 'string') return key;

    if (params) {
      return value.replace(/{(\w+)}/g, (_, k) => String(params[k] ?? `{${k}}`));
    }

    return value;
  };

  // New function to get arrays from translations
  const tArray = (key: string): string[] => {
    const keys = key.split('.');
    let value: unknown = messages[locale];

    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }

    if (Array.isArray(value)) {
      return value;
    }

    return [];
  };

  return { t, tArray, locale };
}
