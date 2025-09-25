'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export function AboutSection() {
  const t = useTranslations('about');

  const highlights = [
    t('highlights.0'),
    t('highlights.1'),
    t('highlights.2'),
    t('highlights.3'),
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
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

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Bio Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-lg leading-relaxed text-muted-foreground">
              {t('bio')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border hover:border-ai-blue/50 transition-all duration-300"
                >
                  <div className="w-2 h-2 rounded-full bg-ai-blue" />
                  <span className="text-sm font-medium">{highlight}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Animated Character */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Coding Animation */}
              <svg viewBox="0 0 400 300" className="w-full max-w-md">
                {/* Character */}
                <g>
                  {/* Head */}
                  <circle cx="200" cy="80" r="30" fill="currentColor" className="text-ai-blue/20" />
                  
                  {/* Body */}
                  <rect x="180" y="110" width="40" height="60" rx="20" fill="currentColor" className="text-ai-blue/20" />
                  
                  {/* Arms - Animated typing */}
                  <g className="text-ai-blue/30">
                    <rect x="160" y="120" width="15" height="30" rx="7" fill="currentColor">
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        values="0 167 135; -10 167 135; 0 167 135"
                        dur="1s"
                        repeatCount="indefinite"
                      />
                    </rect>
                    <rect x="225" y="120" width="15" height="30" rx="7" fill="currentColor">
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        values="0 232 135; 10 232 135; 0 232 135"
                        dur="1s"
                        begin="0.5s"
                        repeatCount="indefinite"
                      />
                    </rect>
                  </g>
                </g>

                {/* Computer Screen */}
                <rect x="120" y="180" width="160" height="100" rx="8" fill="currentColor" className="text-muted" stroke="currentColor" strokeWidth="2" />
                <rect x="130" y="190" width="140" height="80" rx="4" fill="currentColor" className="text-background" />
                
                {/* Code Lines */}
                <g className="text-ai-green text-xs">
                  <text x="135" y="205" fontSize="8">
                    <tspan>import tensorflow as tf</tspan>
                    <animate attributeName="opacity" values="0;1" dur="2s" begin="0s" fill="freeze" />
                  </text>
                  <text x="135" y="220" fontSize="8">
                    <tspan>model = tf.keras.Sequential()</tspan>
                    <animate attributeName="opacity" values="0;1" dur="2s" begin="1s" fill="freeze" />
                  </text>
                  <text x="135" y="235" fontSize="8">
                    <tspan>model.add(Dense(128))</tspan>
                    <animate attributeName="opacity" values="0;1" dur="2s" begin="2s" fill="freeze" />
                  </text>
                  <text x="135" y="250" fontSize="8">
                    <tspan>model.compile(optimizer='adam')</tspan>
                    <animate attributeName="opacity" values="0;1" dur="2s" begin="3s" fill="freeze" />
                  </text>
                </g>

                {/* Cursor */}
                <rect x="265" y="245" width="1" height="10" fill="currentColor" className="text-ai-blue">
                  <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
                </rect>
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
