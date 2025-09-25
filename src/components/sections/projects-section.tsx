'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export function ProjectsSection() {
  const t = useTranslations('projects');

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
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
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* SmaTest Project */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="p-6 rounded-lg bg-card border border-border hover:border-ai-blue/50 transition-all duration-300"
          >
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">{t('smatest.title')}</h3>
              <span className="inline-block px-2 py-1 text-xs bg-ai-green/20 text-ai-green rounded-full">
                {t('smatest.achievement')}
              </span>
            </div>
            <p className="text-muted-foreground mb-4">{t('smatest.description')}</p>
            <div className="space-y-2">
              <div className="text-sm font-medium">Tech Stack:</div>
              <div className="flex flex-wrap gap-2">
                {['YOLOv5', 'OpenCV', 'TensorFlow'].map((tech) => (
                  <span key={tech} className="px-2 py-1 text-xs bg-muted rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Healthcare Chatbot */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="p-6 rounded-lg bg-card border border-border hover:border-ai-purple/50 transition-all duration-300"
          >
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">{t('healthcare.title')}</h3>
            </div>
            <p className="text-muted-foreground mb-4">{t('healthcare.description')}</p>
            <div className="space-y-2">
              <div className="text-sm font-medium">Tech Stack:</div>
              <div className="flex flex-wrap gap-2">
                {['Gemini API', 'NLP', 'Medical Knowledge'].map((tech) => (
                  <span key={tech} className="px-2 py-1 text-xs bg-muted rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Prompt Engineering Lab */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="p-6 rounded-lg bg-card border border-border hover:border-ai-orange/50 transition-all duration-300"
          >
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">{t('promptLab.title')}</h3>
              <span className="inline-block px-2 py-1 text-xs bg-ai-orange/20 text-ai-orange rounded-full">
                {t('promptLab.achievement')}
              </span>
            </div>
            <p className="text-muted-foreground mb-4">{t('promptLab.description')}</p>
            <div className="space-y-2">
              <div className="text-sm font-medium">Tech Stack:</div>
              <div className="flex flex-wrap gap-2">
                {['OpenAI API', 'Research Methods', 'Data Analysis'].map((tech) => (
                  <span key={tech} className="px-2 py-1 text-xs bg-muted rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
