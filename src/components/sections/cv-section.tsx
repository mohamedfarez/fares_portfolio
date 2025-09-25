'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Download, Eye, FileText, Calendar, TrendingUp } from 'lucide-react';
import { useCVDownloads } from '@/hooks/use-cv-downloads';
import { CVActions } from '@/lib/cv/cv-actions';

export function CVSection() {
  const t = useTranslations('cv');
  const { downloadCount, incrementDownload } = useCVDownloads();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Handle CV Download
  const handleDownload = async () => {
    setIsLoading('download');
    try {
      const success = await CVActions.downloadCV();
      if (success) {
        await incrementDownload();
      }
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsLoading(null);
    }
  };

  // Handle CV Preview
  const handlePreview = async () => {
    setIsLoading('preview');
    try {
      const success = await CVActions.previewCV();
      if (success) {
        await incrementDownload();
      }
    } catch (error) {
      console.error('Preview failed:', error);
    } finally {
      setIsLoading(null);
    }
  };



  return (
    <section id="cv" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-4xl mx-auto">
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
            {t('description')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* CV Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[3/4] bg-card border border-border rounded-lg overflow-hidden shadow-lg">
              <div className="p-4 space-y-3 text-xs">
                {/* Header */}
                <div className="text-center space-y-1">
                  <div className="font-bold text-primary text-sm">MOHAMED FARES</div>
                  <div className="text-muted-foreground">AI Engineer</div>
                  <div className="text-muted-foreground text-[10px]">mohamedhfares5@gmail.com</div>
                </div>

                {/* Experience Section */}
                <div className="space-y-1">
                  <div className="font-semibold text-primary text-xs border-b border-border pb-1">EXPERIENCE</div>
                  <div className="space-y-1">
                    <div className="font-medium text-xs">AI Engineer - Hive Tech</div>
                    <div className="text-muted-foreground text-[10px]">2023 - Present</div>
                    <div className="text-muted-foreground text-[10px]">• Prompt Engineering (+12%)</div>
                    <div className="text-muted-foreground text-[10px]">• Computer Vision (YOLOv5)</div>
                  </div>
                </div>

                {/* Projects Section */}
                <div className="space-y-1">
                  <div className="font-semibold text-primary text-xs border-b border-border pb-1">PROJECTS</div>
                  <div className="space-y-1">
                    <div className="font-medium text-xs">SmaTest - 1st Place</div>
                    <div className="text-muted-foreground text-[10px]">AI Exam Monitoring</div>
                    <div className="font-medium text-xs">Healthcare Chatbot</div>
                    <div className="text-muted-foreground text-[10px]">Gemini API Integration</div>
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-1">
                  <div className="font-semibold text-primary text-xs border-b border-border pb-1">SKILLS</div>
                  <div className="text-muted-foreground text-[10px]">Python, TensorFlow, OpenCV, NLP</div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-lg flex items-end justify-center pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-ai-blue" />
                <span className="text-sm text-muted-foreground">CV Preview</span>
              </div>
            </div>
          </motion.div>

          {/* Download Options */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                t('stats.0'),
                t('stats.1'),
                t('stats.2'),
              ].map((stat, index) => (
                <div key={index} className="text-center p-4 rounded-lg bg-card border border-border">
                  <div className="text-sm text-muted-foreground">{stat}</div>
                </div>
              ))}
            </div>

            {/* Download Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleDownload}
                disabled={isLoading === 'download'}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg bg-gradient-to-r from-ai-blue to-ai-purple text-white hover:shadow-lg hover:shadow-ai-blue/25 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className={`w-5 h-5 ${isLoading === 'download' ? 'animate-spin' : 'group-hover:animate-bounce'}`} />
                <span className="font-medium">
                  {isLoading === 'download' ? 'Downloading...' : t('options.pdf')}
                </span>
              </button>

              <button
                onClick={handlePreview}
                disabled={isLoading === 'preview'}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg border border-border bg-background hover:bg-accent transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Eye className={`w-5 h-5 ${isLoading === 'preview' ? 'animate-pulse' : 'group-hover:scale-110'} transition-transform duration-300`} />
                <span className="font-medium">
                  {isLoading === 'preview' ? 'Opening...' : t('options.preview')}
                </span>
              </button>


            </div>

            {/* Download Stats */}
            <div className="text-center text-sm text-muted-foreground space-y-1">
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4 text-ai-green" />
                <p>{t('downloadCount', { count: downloadCount.toString() })}</p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                <p>{t('lastUpdated', { date: 'Jan 2025' })}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
