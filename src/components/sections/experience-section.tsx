'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import CurvedZigzagTimeline from '@/components/ui/curved-zigzag-timeline';

export function ExperienceSection() {
  const t = useTranslations();

  return (
    <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('experience.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            🌟 My professional journey through an advanced curved timeline with stunning animations
          </p>
        </motion.div>

        {/* المسار المتعرج التفاعلي */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <CurvedZigzagTimeline />
        </motion.div>

        {/* ملخص الإحصائيات */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            {
              title: "Total Experience",
              value: "1.5+ Years",
              icon: "🚀",
              color: "text-ai-blue"
            },
            {
              title: "Companies Worked",
              value: "5+",
              icon: "🏢",
              color: "text-ai-purple"
            },
            {
              title: "Key Achievement",
              value: "+12% LLM Accuracy",
              icon: "📈",
              color: "text-ai-green"
            },
            {
              title: "Research Impact",
              value: "+12% LLM Accuracy",
              icon: "🔬",
              color: "text-ai-orange"
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-lg bg-card border border-border hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className={`text-2xl font-bold mb-1 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.title}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
