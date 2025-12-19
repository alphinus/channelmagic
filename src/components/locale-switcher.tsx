'use client';

import { useAppStore } from '@/store/app-store';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config';
import { Button } from '@/components/ui/button';

export function LocaleSwitcher() {
  const { locale, setLocale } = useAppStore();

  const nextLocale = locales.find(l => l !== locale) || locales[0];

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLocale(nextLocale)}
      className="gap-2"
    >
      {localeFlags[nextLocale]} {localeNames[nextLocale]}
    </Button>
  );
}
