'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('theme');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg bg-muted animate-pulse" />
    );
  }

  const themes = [
    { value: 'light', icon: Sun, label: t('light') },
    { value: 'dark', icon: Moon, label: t('dark') },
    { value: 'system', icon: Monitor, label: t('system') },
  ];

  const currentThemeIndex = themes.findIndex(t => t.value === theme);
  const nextTheme = themes[(currentThemeIndex + 1) % themes.length];

  return (
    <button
      onClick={() => setTheme(nextTheme.value)}
      className="relative w-9 h-9 rounded-lg border border-border bg-background hover:bg-accent transition-all duration-300 group"
      title={`Switch to ${nextTheme.label}`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {themes.map(({ value, icon: Icon }) => (
          <Icon
            key={value}
            className={`w-4 h-4 transition-all duration-300 ${
              theme === value
                ? 'opacity-100 scale-100 rotate-0'
                : 'opacity-0 scale-75 rotate-90 absolute'
            }`}
          />
        ))}
      </div>
      
      {/* Animated background */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-ai-blue/20 to-ai-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-ai-blue to-ai-purple opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300" />
    </button>
  );
}
