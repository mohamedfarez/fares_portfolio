'use client';

import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Target,
  Search,
  Brain,
  Code,
  Building2,
  GraduationCap,
  BookOpen,
  MapPin,
  Calendar,
  Star,
  Sparkles,
  Zap,
  Award
} from 'lucide-react';

interface ExperienceItem {
  id: string;
  type: 'current' | 'research' | 'internship' | 'foundation' | 'training';
  position: string;
  company: string;
  duration: string;
  location: string;
  highlights: string[];
  skills: string[];
  color: string;
  gradientColor: string;
  icon: React.ComponentType<any>;
  side: 'left' | 'right';
  x: number;
  y: number;
}

export default function CurvedZigzagTimeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

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
        'Implementing advanced machine learning solutions for business growth',
        'Mentoring junior developers in AI best practices'
      ],
      skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision'],
      color: '#10B981',
      gradientColor: '#34D399',
      icon: Target,
      side: 'right',
      x: 320,
      y: 50
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
        'Achieved +12% improvement in LLM response accuracy through research',
        'Collaborated with international research teams'
      ],
      skills: ['Research', 'Data Analysis', 'Academic Writing', 'Statistics'],
      color: '#8B5CF6',
      gradientColor: '#A78BFA',
      icon: Search,
      side: 'left',
      x: 80,
      y: 200
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
        'Implemented API integrations for enhanced natural language processing',
        'Improved user experience through intelligent automation'
      ],
      skills: ['NLP', 'Chatbot Development', 'API Integration', 'Python', 'Machine Learning'],
      color: '#F59E0B',
      gradientColor: '#FBBF24',
      icon: Brain,
      side: 'right',
      x: 320,
      y: 350
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
        'Gained hands-on experience with AI development workflows',
        'Collaborated with cross-functional teams on AI projects'
      ],
      skills: ['Machine Learning', 'Python', 'Data Science', 'Model Training'],
      color: '#1D4ED8',
      gradientColor: '#3B82F6',
      icon: Code,
      side: 'left',
      x: 80,
      y: 500
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
        'Collaborated with cross-functional teams on AI projects',
        'Enhanced problem-solving skills in ML domain'
      ],
      skills: ['Machine Learning', 'Python', 'Data Analysis', 'Problem Solving'],
      color: '#3B82F6',
      gradientColor: '#60A5FA',
      icon: Building2,
      side: 'right',
      x: 320,
      y: 650
    },
    {
      id: 'amit',
      type: 'training',
      position: 'AI Engineering Training',
      company: 'AMIT Learning',
      duration: 'Sep 2023 - Feb 2024',
      location: 'Online',
      highlights: [
        'Completed intensive training in data science and visualization',
        'Applied MLOps practices for efficient model deployment',
        'Gained expertise in statistical modeling and analysis'
      ],
      skills: ['Data Science', 'MLOps', 'Statistical Modeling', 'Model Deployment'],
      color: '#8B5CF6',
      gradientColor: '#A78BFA',
      icon: BookOpen,
      side: 'right',
      x: 320,
      y: 800
    },
    {
      id: 'foundation',
      type: 'foundation',
      position: 'Technical Trainer & Student Activities Facilitator',
      company: 'Menoufia University',
      duration: 'Sep 2021 - May 2022',
      location: 'Egypt',
      highlights: [
        'Delivered workshops on Python & Machine Learning fundamentals',
        'Mentored students in AI/ML projects improving their practical skills',
        'Developed training content and interactive materials for diverse student groups'
      ],
      skills: ['Teaching', 'Python', 'Machine Learning', 'Mentoring', 'Curriculum Development'],
      color: '#6B7280',
      gradientColor: '#9CA3AF',
      icon: GraduationCap,
      side: 'left',
      x: 80,
      y: 950
    }
  ];

  // SVG Path for curved zigzag line
  const createCurvedPath = () => {
    let path = `M ${experiences[experiences.length - 1].x} ${experiences[experiences.length - 1].y}`;
    
    for (let i = experiences.length - 2; i >= 0; i--) {
      const current = experiences[i];
      const next = experiences[i + 1];
      
      // Calculate control points for smooth curves
      const controlX1 = next.x + (current.x - next.x) * 0.5;
      const controlY1 = next.y;
      const controlX2 = current.x + (next.x - current.x) * 0.5;
      const controlY2 = current.y;
      
      path += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${current.x} ${current.y}`;
    }
    
    return path;
  };

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        duration: 3,
        ease: "easeInOut"
      }
    }
  };

  const nodeVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
      rotate: -180
    },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        delay: i * 0.15 + 0.2,
        duration: 0.6,
        ease: [0.68, -0.55, 0.265, 1.55]
      }
    }),
    hover: {
      scale: 1.15,
      rotate: 5,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      x: -100,
      y: 30,
      scale: 0.9
    },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }),
    hover: {
      scale: 1.02,
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div ref={ref} className="relative w-full py-20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/5 to-background"></div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main container with better spacing */}
      <div className="max-w-6xl mx-auto px-4 relative z-10">

        {/* Timeline container */}
        <div className="relative">

          {/* Central line with enhanced effects */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-muted via-primary to-muted rounded-full shadow-lg"></div>

          {/* Animated progress line */}
          <motion.div
            className="absolute left-1/2 transform -translate-x-1/2 w-1 rounded-full bg-gradient-to-b from-primary to-primary/60"
            initial={{ height: 0, opacity: 0 }}
            animate={isInView ? {
              height: "100%",
              opacity: 1,
              boxShadow: [
                "0 0 0px rgba(16, 185, 129, 0)",
                "0 0 20px rgba(16, 185, 129, 0.5)",
                "0 0 0px rgba(16, 185, 129, 0)"
              ]
            } : {}}
            transition={{
              duration: 2,
              ease: "easeInOut",
              boxShadow: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
          />

          {/* Experience items */}
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              className={`relative flex items-center mb-16 ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={index}
            >

              {/* Experience Card */}
              <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                <motion.div
                  className="bg-card/95 backdrop-blur-sm border-2 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                  whileHover={{ scale: 1.02, y: -8 }}
                  style={{
                    background: `linear-gradient(135deg, ${exp.color}12, ${exp.gradientColor}08)`,
                    borderColor: `${exp.color}40`,
                    boxShadow: `0 10px 40px ${exp.color}20`
                  }}
                >
                  {/* Subtle background pattern */}
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{
                      backgroundImage: `radial-gradient(circle at 20% 50%, ${exp.color} 1px, transparent 1px)`,
                      backgroundSize: '20px 20px'
                    }}
                  />

                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="p-3 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: `${exp.color}20` }}
                    >
                      <exp.icon className="w-6 h-6" style={{ color: exp.color }} />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-1" style={{ color: exp.color }}>
                        {exp.position}
                      </h3>
                      <p className="text-lg font-semibold text-foreground mb-2">
                        {exp.company}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {exp.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {exp.location}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-2 mb-4">
                    {exp.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <Star className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: exp.color }} />
                        <span className="text-foreground">{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs font-medium rounded-full border"
                        style={{
                          backgroundColor: `${exp.color}15`,
                          borderColor: `${exp.color}40`,
                          color: exp.color
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Central Node */}
              <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                <motion.div
                  className="relative"
                  variants={nodeVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  whileHover="hover"
                  custom={index}
                  onHoverStart={() => setHoveredNode(exp.id)}
                  onHoverEnd={() => setHoveredNode(null)}
                >

                  {/* Main node */}
                  <div
                    className="w-16 h-16 rounded-full border-4 border-background shadow-xl cursor-pointer relative flex items-center justify-center transition-all duration-300"
                    style={{
                      backgroundColor: exp.color,
                      boxShadow: `0 0 20px ${exp.color}40, 0 8px 32px rgba(0,0,0,0.12)`
                    }}
                  >
                    <exp.icon className="w-8 h-8 text-white drop-shadow-sm" />

                    {/* Always visible subtle pulse */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2"
                      style={{ borderColor: exp.color }}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0, 0.3]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />

                    {/* Enhanced pulsing ring on hover */}
                    {hoveredNode === exp.id && (
                      <>
                        <motion.div
                          className="absolute inset-0 rounded-full border-2"
                          style={{ borderColor: exp.color }}
                          animate={{
                            scale: [1, 2, 1],
                            opacity: [0.8, 0, 0.8]
                          }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                        <motion.div
                          className="absolute inset-0 rounded-full border-2"
                          style={{ borderColor: exp.gradientColor }}
                          animate={{
                            scale: [1, 1.6, 1],
                            opacity: [0.6, 0, 0.6]
                          }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                        />
                      </>
                    )}
                  </div>

                  {/* Enhanced connecting line to card */}
                  <motion.div
                    className={`absolute top-1/2 h-1 ${
                      index % 2 === 0 ? '-right-8' : '-left-8'
                    } rounded-full`}
                    style={{
                      backgroundColor: exp.color,
                      boxShadow: `0 0 8px ${exp.color}60`
                    }}
                    initial={{ width: 0 }}
                    animate={isInView ? { width: 32 } : {}}
                    transition={{
                      delay: index * 0.15 + 0.5,
                      duration: 0.6,
                      ease: "easeOut"
                    }}
                  />
                </motion.div>
              </div>

              {/* Empty space for alternating layout */}
              <div className="w-5/12"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
