'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { GraduationCap, Award, Calendar, MapPin, BookOpen, Trophy } from 'lucide-react';

export function EducationSection() {
  const t = useTranslations('education');

  const educationData = [
    {
      id: 'university',
      type: 'degree',
      institution: t('university'),
      degree: t('degree'),
      duration: t('duration'),
      gpa: t('gpa'),
      location: 'Menoufia, Egypt',
      project: {
        title: t('graduationProject.title'),
        grade: t('graduationProject.grade'),
        rank: t('graduationProject.rank')
      },
      icon: GraduationCap,
      color: '#3B82F6',
      gradientColor: '#60A5FA'
    },
    {
      id: 'training',
      type: 'training',
      institution: t('training.institute'),
      degree: t('training.title'),
      duration: t('training.duration'),
      location: 'Online',
      modules: [
        t('training.modules.0'),
        t('training.modules.1'),
        t('training.modules.2'),
        t('training.modules.3')
      ],
      icon: BookOpen,
      color: '#10B981',
      gradientColor: '#34D399'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="education" className="py-20 px-4 sm:px-6 lg:px-8">
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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            🎓 Academic foundation and professional training in AI and Computer Science
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-8"
        >
          {educationData.map((edu, index) => (
            <motion.div
              key={edu.id}
              variants={itemVariants}
              className="relative"
            >
              <div className="bg-card/95 backdrop-blur-sm border-2 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${edu.color}12, ${edu.gradientColor}08)`,
                  borderColor: `${edu.color}40`,
                  boxShadow: `0 10px 40px ${edu.color}20`
                }}
              >
                {/* Background pattern */}
                <div 
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage: `radial-gradient(circle at 20% 50%, ${edu.color} 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: edu.color }}
                    >
                      <edu.icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                        <h3 className="text-xl font-bold text-foreground">
                          {edu.degree}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {edu.duration}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <h4 className="text-lg font-semibold" style={{ color: edu.color }}>
                          {edu.institution}
                        </h4>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {edu.location}
                        </div>
                      </div>

                      {/* University specific content */}
                      {edu.type === 'degree' && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Award className="w-5 h-5" style={{ color: edu.color }} />
                            <span className="font-medium">{edu.gpa}</span>
                          </div>

                          {edu.project && (
                            <div className="bg-background/50 rounded-lg p-4 border border-border">
                              <div className="flex items-center gap-2 mb-2">
                                <Trophy className="w-5 h-5 text-yellow-500" />
                                <h5 className="font-semibold">Graduation Project</h5>
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">
                                {edu.project.title}
                              </p>
                              <div className="flex gap-4 text-sm">
                                <span className="text-green-600 font-medium">
                                  Grade: {edu.project.grade}
                                </span>
                                <span className="text-yellow-600 font-medium">
                                  {edu.project.rank}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Training specific content */}
                      {edu.type === 'training' && edu.modules && (
                        <div className="space-y-3">
                          <h5 className="font-semibold text-foreground">Training Modules:</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {edu.modules.map((module, idx) => (
                              <div 
                                key={idx}
                                className="flex items-center gap-2 text-sm bg-background/50 rounded-lg p-2 border border-border"
                              >
                                <div 
                                  className="w-2 h-2 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: edu.color }}
                                />
                                {module}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Education Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
        >
          {[
            {
              title: "Degree",
              value: "B.Sc. Computer Science",
              icon: "🎓",
              color: "text-blue-600"
            },
            {
              title: "GPA",
              value: "Very Good (2.9/4.0)",
              icon: "📊",
              color: "text-green-600"
            },
            {
              title: "Achievement",
              value: "1st Place Project",
              icon: "🏆",
              color: "text-yellow-600"
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <h3 className="font-semibold text-foreground mb-1">{stat.title}</h3>
              <p className={`text-sm font-medium ${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
