'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ChevronDown, MessageCircle, FolderOpen, Mail } from 'lucide-react';
import { type Locale } from '@/lib/i18n/config';
import Image from 'next/image';

export function HeroSection() {
  const t = useTranslations('hero');
  const locale = useLocale() as Locale;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-right space-y-8">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <p className="text-lg text-muted-foreground">
              {t('greeting')}
            </p>
            
            {/* Name with gradient */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold">
              <span className="bg-gradient-to-r from-ai-blue via-ai-purple to-ai-green bg-clip-text text-transparent">
                {t('name')}
              </span>
            </h1>
            
            {/* Title with typing animation */}
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground">
                {t('title')}
              </h2>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-ai-blue to-ai-purple rounded-full" />
            </div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            {t('subtitle')}
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed"
          >
            {t('description')}
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {[
              { key: 'experience', icon: '⚡' },
              { key: 'improvement', icon: '📈' },
              { key: 'projects', icon: '🚀' },
              { key: 'achievement', icon: '🏆' },
            ].map((stat, index) => (
              <div
                key={stat.key}
                className="p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border hover:border-ai-blue/50 transition-all duration-300 group"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <p className="text-sm text-muted-foreground">
                  {t(`stats.${stat.key}`)}
                </p>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={() => scrollToSection('ai-twin')}
              className="flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-ai-blue to-ai-purple text-white hover:shadow-lg hover:shadow-ai-blue/25 transition-all duration-300 group"
            >
              <MessageCircle className="w-5 h-5 group-hover:animate-pulse" />
              <span className="font-medium">{t('cta.chat')}</span>
            </button>
            
            <button
              onClick={() => scrollToSection('projects')}
              className="flex items-center gap-2 px-8 py-4 rounded-lg border border-border bg-background hover:bg-accent transition-all duration-300 group"
            >
              <FolderOpen className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-medium">{t('cta.projects')}</span>
            </button>
            
            <button
              onClick={() => scrollToSection('contact')}
              className="flex items-center gap-2 px-8 py-4 rounded-lg border border-ai-green bg-ai-green/10 hover:bg-ai-green/20 transition-all duration-300 group"
            >
              <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-medium">{t('cta.contact')}</span>
            </button>
          </motion.div>

          </div>

          {/* Profile Image */}
          <div className="flex justify-center lg:justify-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Animated background rings */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-ai-blue via-ai-purple to-ai-green opacity-20 animate-pulse" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-ai-green via-ai-blue to-ai-purple opacity-30 animate-pulse delay-1000" />

              {/* Main image container */}
              <div className="relative w-80 h-80 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                <Image
                  src="/mohamed-fares.jpeg"
                  alt="Mohamed Fares - AI Engineer"
                  fill
                  sizes="(max-width: 768px) 280px, 320px"
                  className="object-cover"
                  priority
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{
                  y: [-10, 10, -10],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-ai-blue to-ai-purple rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
              >
                AI
              </motion.div>

              <motion.div
                animate={{
                  y: [10, -10, 10],
                  rotate: [0, -5, 5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-ai-green to-ai-blue rounded-full flex items-center justify-center text-white font-bold shadow-lg"
              >
                🚀
              </motion.div>
            </motion.div>
          </div>
        </div>


      </div>
    </section>
  );
}
