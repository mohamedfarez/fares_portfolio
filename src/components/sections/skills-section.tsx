'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export function SkillsSection() {
  const t = useTranslations('skills');

  const skillCategories = [
    {
      key: 'programming',
      color: 'ai-blue',
      items: ['Python', 'JavaScript', 'TypeScript', 'SQL']
    },
    {
      key: 'ai',
      color: 'ai-purple',
      items: ['TensorFlow', 'PyTorch', 'OpenCV', 'Scikit-learn']
    },
    {
      key: 'nlp',
      color: 'ai-green',
      items: ['OpenAI API', 'Gemini API', 'Prompt Engineering', 'Text Processing']
    },
    {
      key: 'tools',
      color: 'ai-orange',
      items: ['Git', 'Docker', 'Google Cloud', 'Streamlit', 'Flask']
    }
  ];

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-lg bg-card border border-border hover:border-ai-blue/50 transition-all duration-300"
            >
              <h3 className="text-lg font-bold mb-4">
                {t(`categories.${category.key}.title`)}
              </h3>
              <div className="space-y-2">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 p-2 rounded bg-muted/50"
                  >
                    <div className={`w-2 h-2 rounded-full bg-${category.color}`} />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Specialties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <h3 className="text-xl font-bold mb-6">Specialties</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              'Prompt Engineering',
              'Computer Vision',
              'Natural Language Processing',
              'Model Deployment',
              'Research & Development'
            ].map((specialty, index) => (
              <span
                key={specialty}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-ai-blue/20 to-ai-purple/20 border border-ai-blue/30 text-sm font-medium"
              >
                {specialty}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
