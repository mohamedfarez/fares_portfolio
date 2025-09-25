'use client';

import { Languages, Globe } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useTransition } from 'react';
import { type Locale, getOppositeLocale, getLocaleName } from '@/lib/i18n/config';

export function LanguageToggle() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('language');
  const [isPending, startTransition] = useTransition();
  const [isHovered, setIsHovered] = useState(false);

  const oppositeLocale = getOppositeLocale(locale);
  const currentLanguageName = getLocaleName(locale, locale);
  const nextLanguageName = getLocaleName(oppositeLocale, locale);

  const handleLanguageChange = () => {
    startTransition(() => {
      // Remove the current locale from the pathname
      const pathWithoutLocale = pathname.replace(`/${locale}`, '');
      // Navigate to the new locale
      router.push(`/${oppositeLocale}${pathWithoutLocale}`);
    });
  };

  return (
    <button
      onClick={handleLanguageChange}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isPending}
      className="relative w-auto h-9 px-3 rounded-lg border border-border bg-background hover:bg-accent transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
      title={`Switch to ${nextLanguageName}`}
    >
      <div className="flex items-center gap-2">
        {/* Language Icon */}
        <div className="relative">
          <Globe
            className={`w-4 h-4 transition-all duration-300 ${
              isHovered ? 'opacity-0 scale-75 rotate-90' : 'opacity-100 scale-100 rotate-0'
            }`}
          />
          <Languages
            className={`w-4 h-4 absolute inset-0 transition-all duration-300 ${
              isHovered ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-90'
            }`}
          />
        </div>

        {/* Language Text */}
        <div className="relative overflow-hidden">
          <span
            className={`block text-sm font-medium transition-all duration-300 ${
              isHovered ? 'transform -translate-y-full opacity-0' : 'transform translate-y-0 opacity-100'
            }`}
          >
            {currentLanguageName}
          </span>
          <span
            className={`absolute inset-0 text-sm font-medium transition-all duration-300 ${
              isHovered ? 'transform translate-y-0 opacity-100' : 'transform translate-y-full opacity-0'
            }`}
          >
            {nextLanguageName}
          </span>
        </div>

        {/* Loading indicator */}
        {isPending && (
          <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {/* Animated background */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-ai-green/20 to-ai-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-ai-green to-ai-blue opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300" />
    </button>
  );
}
