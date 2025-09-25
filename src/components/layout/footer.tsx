'use client';

import { useTranslations } from 'next-intl';
import { Github, Linkedin, Mail, MessageCircle } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/50 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-ai-blue to-ai-purple flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-ai-blue to-ai-purple bg-clip-text text-transparent">
                Fares AI
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI Engineer specializing in Prompt Engineering, Computer Vision, and NLP.
              Building the future with artificial intelligence.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <div className="space-y-2">
              {[
                { label: 'About', href: '#about' },
                { label: 'Projects', href: '#projects' },
                { label: 'Experience', href: '#experience' },
                { label: 'Skills', href: '#skills' },
                { label: 'Contact', href: '#contact' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h3 className="font-semibold">Get in Touch</h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                mohamedhfares5@gmail.com
              </p>
              <p className="text-sm text-muted-foreground">
                +20 1023629575
              </p>
              <p className="text-sm text-muted-foreground">
                Cairo, Egypt
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="https://linkedin.com/in/mohamedfarez"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors duration-200"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/mohamedfarez"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-gray-800 text-white flex items-center justify-center hover:bg-gray-900 transition-colors duration-200"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="mailto:mohamedhfares5@gmail.com"
                className="w-8 h-8 rounded-lg bg-ai-blue text-white flex items-center justify-center hover:bg-ai-blue/90 transition-colors duration-200"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/201023629575"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors duration-200"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Mohamed Fares. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with Next.js, TypeScript, and AI ✨
          </p>
        </div>
      </div>
    </footer>
  );
}
