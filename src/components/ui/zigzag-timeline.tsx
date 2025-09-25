'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  GraduationCap, 
  Building2, 
  Code, 
  Brain, 
  Search, 
  Target,
  Calendar,
  MapPin,
  Award
} from 'lucide-react';

interface ExperienceItem {
  id: string;
  type: 'foundation' | 'internship' | 'research' | 'current';
  position: string;
  company: string;
  duration: string;
  location: string;
  highlights: string[];
  skills: string[];
  color: string;
  icon: any;
}

const ZigzagTimeline = () => {
  const t = useTranslations();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const experiences: ExperienceItem[] = [
    {
      id: 'current',
      type: 'current',
      position: 'AI Engineer',
      company: 'Hive Tech',
      duration: 'Jul 2025 - Present',
      location: 'Remote',
      highlights: [
        'Leading AI development projects with cutting-edge technologies',
        'Implementing advanced machine learning solutions for business growth'
      ],
      skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP'],
      color: '#10B981',
      icon: Target
    },
    {
      id: 'research',
      type: 'research',
      position: 'Research Assistant',
      company: 'Badia University',
      duration: 'Jul 2024 - Sep 2024',
      location: 'Egypt',
      highlights: [
        'Conducted research in AI and machine learning applications',
        'Published research papers in international conferences'
      ],
      skills: ['Research', 'Data Analysis', 'Academic Writing'],
      color: '#8B5CF6',
      icon: Search
    },
    {
      id: 'esaal',
      type: 'internship',
      position: 'AI Engineer Intern',
      company: 'Esaal',
      duration: 'Aug 2024 - Oct 2024',
      location: 'Remote',
      highlights: [
        'Developed advanced chatbots using NLP and AI technologies',
        'Implemented API integrations for enhanced natural language processing'
      ],
      skills: ['NLP', 'Chatbot Development', 'API Integration', 'Python'],
      color: '#F59E0B',
      icon: Brain
    },
    {
      id: 'codsoft',
      type: 'internship',
      position: 'AI Engineer Intern',
      company: 'CODSOFT',
      duration: 'Jul 2024 - Aug 2024',
      location: 'Remote',
      highlights: [
        'Built machine learning models for various business applications',
        'Gained hands-on experience with AI development workflows'
      ],
      skills: ['Machine Learning', 'Python', 'Data Science'],
      color: '#1D4ED8',
      icon: Code
    },
    {
      id: 'bharat',
      type: 'internship',
      position: 'ML Engineer Intern',
      company: 'Bharat Intern',
      duration: 'Jun 2024 - Jul 2024',
      location: 'Remote',
      highlights: [
        'Developed machine learning solutions for real-world problems',
        'Collaborated with cross-functional teams on AI projects'
      ],
      skills: ['Machine Learning', 'Python', 'Data Analysis'],
      color: '#3B82F6',
      icon: Building2
    },
    {
      id: 'foundation',
      type: 'foundation',
      position: 'Technical Trainer',
      company: 'Menoufia University',
      duration: '2021 - 2022',
      location: 'Egypt',
      highlights: [
        'Taught programming and computer science fundamentals',
        'Mentored students in technical skills development'
      ],
      skills: ['Teaching', 'Programming', 'Mentoring'],
      color: '#6B7280',
      icon: GraduationCap
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const pathVariants = {
    hidden: { 
      pathLength: 0,
      opacity: 0
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 2,
        ease: "easeInOut"
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      x: -50,
      rotateY: -15,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.08,
      rotateY: 8,
      z: 50,
      y: -5,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const skillVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.1,
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const highlightVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.1,
        ease: "easeOut"
      }
    })
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full max-w-6xl mx-auto py-16 px-4"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ai-primary/5 to-transparent rounded-3xl" />
      
      {/* Main Timeline Path */}
      <div className="relative">
        <svg
          className="absolute left-1/2 top-0 transform -translate-x-1/2 w-4 h-full z-0"
          viewBox="0 0 40 1000"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M20 0 Q30 100 20 200 Q10 300 20 400 Q30 500 20 600 Q10 700 20 800 Q30 900 20 1000"
            stroke="url(#timelineGradient)"
            strokeWidth="3"
            fill="none"
            variants={pathVariants}
            className="drop-shadow-lg"
          />
          <defs>
            <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="20%" stopColor="#8B5CF6" />
              <stop offset="40%" stopColor="#F59E0B" />
              <stop offset="60%" stopColor="#1D4ED8" />
              <stop offset="80%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#6B7280" />
            </linearGradient>
          </defs>
        </svg>

        {/* Experience Items */}
        <div className="relative z-10 space-y-24">
          {experiences.map((experience, index) => {
            const isLeft = index % 2 === 0;
            const Icon = experience.icon;
            
            return (
              <motion.div
                key={experience.id}
                className={`flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'} gap-8`}
                variants={itemVariants}
              >
                {/* Experience Card */}
                <motion.div
                  className={`w-full max-w-md ${isLeft ? 'text-right' : 'text-left'}`}
                  variants={cardVariants}
                  whileHover="hover"
                  onHoverStart={() => setHoveredItem(experience.id)}
                  onHoverEnd={() => setHoveredItem(null)}
                >
                  <div 
                    className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 overflow-hidden group cursor-pointer"
                    style={{
                      boxShadow: hoveredItem === experience.id 
                        ? `0 20px 40px ${experience.color}20, 0 0 0 1px ${experience.color}30`
                        : '0 10px 30px rgba(0,0,0,0.1)'
                    }}
                  >
                    {/* Animated Background */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                      style={{ backgroundColor: experience.color }}
                    />
                    
                    {/* Glowing Border Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(45deg, ${experience.color}20, transparent, ${experience.color}20)`,
                        filter: 'blur(1px)'
                      }}
                    />

                    <div className="relative z-10">
                      {/* Header */}
                      <div className={`flex items-center gap-3 mb-4 ${isLeft ? 'flex-row-reverse' : 'flex-row'}`}>
                        <motion.div
                          className="p-3 rounded-xl shadow-lg"
                          style={{ backgroundColor: `${experience.color}15` }}
                          whileHover={{ 
                            scale: 1.1, 
                            rotate: 5,
                            backgroundColor: `${experience.color}25`
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <Icon 
                            className="w-6 h-6" 
                            style={{ color: experience.color }}
                          />
                        </motion.div>
                        <div className={isLeft ? 'text-right' : 'text-left'}>
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                            {experience.position}
                          </h3>
                          <p className="text-sm font-medium" style={{ color: experience.color }}>
                            {experience.company}
                          </p>
                        </div>
                      </div>

                      {/* Duration & Location */}
                      <div className={`flex items-center gap-4 mb-4 text-sm text-gray-600 ${isLeft ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{experience.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{experience.location}</span>
                        </div>
                      </div>

                      {/* Highlights */}
                      <div className="mb-4">
                        <motion.div
                          className={`flex items-center gap-2 mb-2 ${isLeft ? 'flex-row-reverse' : 'flex-row'}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.4 }}
                        >
                          <motion.div
                            whileHover={{ rotate: 360, scale: 1.2 }}
                            transition={{ duration: 0.6 }}
                          >
                            <Award className="w-4 h-4 text-gray-500" />
                          </motion.div>
                          <span className="text-sm font-medium text-gray-700">Key Achievements</span>
                        </motion.div>
                        <ul className={`text-sm text-gray-600 space-y-1 ${isLeft ? 'text-right' : 'text-left'}`}>
                          {experience.highlights.slice(0, 2).map((highlight, idx) => (
                            <motion.li
                              key={idx}
                              className="flex items-start gap-2"
                              variants={highlightVariants}
                              initial="hidden"
                              animate="visible"
                              custom={idx}
                              whileHover={{ x: isLeft ? -5 : 5, transition: { duration: 0.2 } }}
                            >
                              {!isLeft && (
                                <motion.span
                                  className="text-xs mt-1"
                                  style={{ color: experience.color }}
                                  animate={{
                                    x: [0, 3, 0],
                                    opacity: [0.7, 1, 0.7]
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                  }}
                                >
                                  ▸
                                </motion.span>
                              )}
                              <span className="flex-1">{highlight}</span>
                              {isLeft && (
                                <motion.span
                                  className="text-xs mt-1"
                                  style={{ color: experience.color }}
                                  animate={{
                                    x: [0, -3, 0],
                                    opacity: [0.7, 1, 0.7]
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                  }}
                                >
                                  ◂
                                </motion.span>
                              )}
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      {/* Skills */}
                      <motion.div
                        className={`flex flex-wrap gap-2 ${isLeft ? 'justify-end' : 'justify-start'}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                      >
                        {experience.skills.slice(0, 3).map((skill, idx) => (
                          <motion.span
                            key={idx}
                            className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 border cursor-pointer"
                            variants={skillVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                            transition={{ delay: idx * 0.1 }}
                            style={{
                              background: hoveredItem === experience.id
                                ? `linear-gradient(45deg, ${experience.color}15, ${experience.color}25)`
                                : undefined
                            }}
                            onHoverStart={() => {
                              // تأثير إضافي عند hover على المهارة
                            }}
                          >
                            {skill.trim()}
                          </motion.span>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Central Node */}
                <motion.div
                  className="relative flex-shrink-0"
                  whileHover={{ scale: 1.3 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {/* Main Node */}
                  <motion.div
                    className="w-6 h-6 rounded-full border-4 border-white shadow-lg z-20 relative cursor-pointer"
                    style={{ backgroundColor: experience.color }}
                    animate={{
                      boxShadow: hoveredItem === experience.id
                        ? `0 0 25px ${experience.color}80, 0 0 50px ${experience.color}40, 0 0 75px ${experience.color}20`
                        : `0 0 15px ${experience.color}40, 0 0 30px ${experience.color}20`
                    }}
                    whileHover={{
                      rotate: 360,
                      transition: { duration: 0.8, ease: "easeInOut" }
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Inner Glow */}
                  <motion.div
                    className="absolute inset-1 rounded-full z-10"
                    style={{
                      background: `radial-gradient(circle, ${experience.color}40, transparent 70%)`
                    }}
                    animate={{
                      scale: hoveredItem === experience.id ? [1, 1.2, 1] : 1,
                      opacity: hoveredItem === experience.id ? [0.6, 1, 0.6] : 0.4
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: hoveredItem === experience.id ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                  />

                  {/* Pulsing Ring 1 */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 opacity-30"
                    style={{ borderColor: experience.color }}
                    animate={{
                      scale: hoveredItem === experience.id ? [1, 1.8, 1] : [1, 1.2, 1],
                      opacity: hoveredItem === experience.id ? [0.4, 0.1, 0.4] : [0.3, 0.1, 0.3]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0
                    }}
                  />

                  {/* Pulsing Ring 2 */}
                  <motion.div
                    className="absolute inset-0 rounded-full border opacity-20"
                    style={{ borderColor: experience.color }}
                    animate={{
                      scale: hoveredItem === experience.id ? [1, 2.2, 1] : [1, 1.5, 1],
                      opacity: hoveredItem === experience.id ? [0.3, 0.05, 0.3] : [0.2, 0.05, 0.2]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  />

                  {/* Orbiting Particles */}
                  {hoveredItem === experience.id && (
                    <>
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 rounded-full z-30"
                          style={{
                            backgroundColor: experience.color,
                            top: '50%',
                            left: '50%',
                            marginTop: '-2px',
                            marginLeft: '-2px',
                            transformOrigin: `${15 + i * 5}px 0px`
                          }}
                          animate={{
                            rotate: 360,
                            scale: [0.8, 1.2, 0.8]
                          }}
                          transition={{
                            rotate: {
                              duration: 2 + i * 0.5,
                              repeat: Infinity,
                              ease: "linear"
                            },
                            scale: {
                              duration: 1 + i * 0.3,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }
                          }}
                        />
                      ))}
                    </>
                  )}
                </motion.div>

                {/* Spacer for opposite side */}
                <div className="w-full max-w-md" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-ai-primary/20 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 15}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ZigzagTimeline;
