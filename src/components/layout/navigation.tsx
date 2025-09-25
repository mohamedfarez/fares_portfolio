'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Menu, X, Download } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { LanguageToggle } from '@/components/i18n/language-toggle';
import { type Locale } from '@/lib/i18n/config';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations('nav');
  const locale = useLocale() as Locale;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}#about`, label: t('about') },
    { href: `/${locale}#projects`, label: t('projects') },
    { href: `/${locale}#demos`, label: t('demos') },
    { href: `/${locale}#experience`, label: t('experience') },
    { href: `/${locale}#education`, label: t('education') },
    { href: `/${locale}#skills`, label: t('skills') },
    { href: `/${locale}#contact`, label: t('contact') },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center space-x-2 group"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-ai-blue to-ai-purple flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-ai-blue to-ai-purple opacity-0 group-hover:opacity-50 blur-sm transition-opacity duration-300" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-ai-blue to-ai-purple bg-clip-text text-transparent">
              Fares AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-ai-blue to-ai-purple transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* CV Download Button */}
            <Link
              href={`/${locale}#cv`}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-ai-blue to-ai-purple text-white hover:shadow-lg hover:shadow-ai-blue/25 transition-all duration-300 group"
            >
              <Download className="w-4 h-4 group-hover:animate-bounce" />
              <span className="text-sm font-medium">{t('cv')}</span>
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Toggle */}
            <LanguageToggle />

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden w-9 h-9 rounded-lg border border-border bg-background hover:bg-accent transition-colors duration-200 flex items-center justify-center"
            >
              {isOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background/95 backdrop-blur-md border border-border rounded-lg mt-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile CV Download */}
              <Link
                href={`/${locale}#cv`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 mx-3 mt-4 rounded-lg bg-gradient-to-r from-ai-blue to-ai-purple text-white text-center"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">{t('cv')}</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
