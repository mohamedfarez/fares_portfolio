'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Github, Linkedin, MessageCircle } from 'lucide-react';

export function ContactSection() {
  const t = useTranslations('contact');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Refs for focusing
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // Handle quick option clicks
  const handleQuickOption = (optionType: 'job' | 'collaboration' | 'consultation') => {
    const messages = t.raw('quickOptionsMessages');
    const option = messages[optionType];

    setFormData(prev => ({
      ...prev,
      subject: option.subject,
      message: option.message
    }));

    // Focus on subject field after a short delay
    setTimeout(() => {
      subjectRef.current?.focus();
    }, 100);
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder={t('form.name')}
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ai-blue/50"
                />
                <input
                  type="email"
                  placeholder={t('form.email')}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ai-blue/50"
                />
              </div>
              <input
                ref={subjectRef}
                type="text"
                placeholder={t('form.subject')}
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ai-blue/50"
              />
              <textarea
                ref={messageRef}
                rows={6}
                placeholder={t('form.message')}
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ai-blue/50 resize-none"
              />
              <button
                type="submit"
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-ai-blue to-ai-purple text-white hover:shadow-lg hover:shadow-ai-blue/25 transition-all duration-300"
              >
                {t('form.send')}
              </button>
            </form>

            {/* Quick Options */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Quick Options:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { text: t('quickOptions.0'), type: 'job' as const },
                  { text: t('quickOptions.1'), type: 'collaboration' as const },
                  { text: t('quickOptions.2'), type: 'consultation' as const },
                ].map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickOption(option.type)}
                    className="px-3 py-1 text-sm rounded-full bg-muted hover:bg-accent hover:scale-105 transition-all duration-200 cursor-pointer"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Contact Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border">
                <MapPin className="w-5 h-5 text-ai-blue" />
                <span>{t('info.location')}</span>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border">
                <Mail className="w-5 h-5 text-ai-purple" />
                <span>{t('info.email')}</span>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border">
                <Phone className="w-5 h-5 text-ai-green" />
                <span>{t('info.phone')}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Connect with me</h3>
              <div className="flex gap-4">
                <a
                  href="https://linkedin.com/in/mohamedfarez"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
                <a
                  href="https://github.com/mohamedfarez"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-800 text-white hover:bg-gray-900 transition-colors duration-200"
                >
                  <Github className="w-6 h-6" />
                </a>
                <a
                  href="https://wa.me/201023629575"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors duration-200"
                >
                  <MessageCircle className="w-6 h-6" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
