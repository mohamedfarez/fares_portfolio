import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['en', 'ar'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`../../../public/locales/${locale}/common.json`)).default,
    timeZone: 'Africa/Cairo',
    now: new Date(),
    formats: {
      dateTime: {
        short: {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }
      },
      number: {
        precise: {
          maximumFractionDigits: 5
        }
      },
      list: {
        enumeration: {
          style: 'long',
          type: 'conjunction'
        }
      }
    }
  };
});

// Utility functions for i18n
export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

export function getFontFamily(locale: Locale): string {
  return locale === 'ar' ? 'font-arabic' : 'font-english';
}

export function getOppositeLocale(locale: Locale): Locale {
  return locale === 'ar' ? 'en' : 'ar';
}

export function getLocaleName(locale: Locale, targetLocale: Locale): string {
  const names = {
    en: { en: 'English', ar: 'الإنجليزية' },
    ar: { en: 'العربية', ar: 'Arabic' }
  };
  return names[locale][targetLocale];
}
