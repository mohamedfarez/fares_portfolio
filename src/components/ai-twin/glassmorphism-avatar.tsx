'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlassmorphismAvatarProps {
  expression?: 'neutral' | 'happy' | 'thinking' | 'explaining' | 'surprised' | 'confident' | 'listening' | 'speaking';
  isListening?: boolean;
  isSpeaking?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'w-24 h-24',
  md: 'w-32 h-32', 
  lg: 'w-48 h-48',
  xl: 'w-64 h-64'
};

const expressionThemes = {
  neutral: { primary: '#64748b', secondary: '#94a3b8', accent: '#cbd5e1' },
  happy: { primary: '#10b981', secondary: '#34d399', accent: '#6ee7b7' },
  thinking: { primary: '#f59e0b', secondary: '#fbbf24', accent: '#fcd34d' },
  explaining: { primary: '#3b82f6', secondary: '#60a5fa', accent: '#93c5fd' },
  surprised: { primary: '#8b5cf6', secondary: '#a78bfa', accent: '#c4b5fd' },
  confident: { primary: '#6366f1', secondary: '#818cf8', accent: '#a5b4fc' },
  listening: { primary: '#06b6d4', secondary: '#22d3ee', accent: '#67e8f9' },
  speaking: { primary: '#059669', secondary: '#10b981', accent: '#34d399' }
};

export default function GlassmorphismAvatar({
  expression = 'neutral',
  isListening = false,
  isSpeaking = false,
  className = '',
  size = 'lg'
}: GlassmorphismAvatarProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [currentExpression, setCurrentExpression] = useState(expression);
  const [ripples, setRipples] = useState<Array<{id: number, x: number, y: number, timestamp: number}>>([]);
  const avatarRef = useRef<HTMLDivElement>(null);

  const theme = expressionThemes[currentExpression];

  // Auto-blink effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Update expression
  useEffect(() => {
    setCurrentExpression(expression);
  }, [expression]);

  // Mouse tracking
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!avatarRef.current) return;
    
    const rect = avatarRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
  };

  // Create ripple effect on click
  const handleClick = (e: React.MouseEvent) => {
    if (!avatarRef.current) return;
    
    const rect = avatarRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const newRipple = {
      id: Date.now(),
      x,
      y,
      timestamp: Date.now()
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 1000);
  };

  const eyeOffsetX = (mousePosition.x - 0.5) * 6;
  const eyeOffsetY = (mousePosition.y - 0.5) * 4;

  return (
    <motion.div
      ref={avatarRef}
      className={`relative ${sizeClasses[size]} ${className} cursor-pointer`}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
    >
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 rounded-full opacity-30 blur-2xl"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${theme.primary}40, ${theme.secondary}20, ${theme.accent}10)`
        }}
      />

      {/* Ripple Effects */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full border-2 border-white/30"
            style={{
              left: `${ripple.x}%`,
              top: `${ripple.y}%`,
              borderColor: theme.primary + '60'
            }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ 
              width: '200%', 
              height: '200%', 
              opacity: 0,
              x: '-50%',
              y: '-50%'
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full opacity-40"
            style={{
              background: `linear-gradient(45deg, ${theme.primary}, ${theme.secondary})`,
              left: `${20 + (i * 12)}%`,
              top: `${15 + (i * 8)}%`,
            }}
            animate={{
              y: [-5, -15, -5],
              x: [-2, 2, -2],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3 + (i * 0.5),
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main Glass Container */}
      <motion.div
        className="relative w-full h-full rounded-full overflow-hidden"
        style={{
          background: `linear-gradient(135deg, 
            rgba(255,255,255,0.25) 0%, 
            rgba(255,255,255,0.1) 50%, 
            rgba(255,255,255,0.05) 100%)`,
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: `
            0 8px 32px rgba(0,0,0,0.1),
            inset 0 1px 0 rgba(255,255,255,0.3),
            0 0 0 1px rgba(255,255,255,0.1)
          `
        }}
        animate={{
          rotateY: eyeOffsetX * 2,
          rotateX: -eyeOffsetY * 1.5,
          scale: isSpeaking ? [1, 1.02, 1] : isListening ? [1, 0.98, 1] : 1,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 20,
          scale: {
            duration: 0.6,
            repeat: (isSpeaking || isListening) ? Infinity : 0
          }
        }}
      >
        {/* Inner Glow */}
        <div 
          className="absolute inset-2 rounded-full opacity-20"
          style={{
            background: `radial-gradient(circle at 40% 40%, ${theme.primary}, transparent 70%)`
          }}
        />

        {/* Avatar Content */}
        <div className="relative w-full h-full flex items-center justify-center">
          <svg
            viewBox="0 0 200 200"
            className="w-4/5 h-4/5"
          >
            {/* Gradients */}
            <defs>
              <linearGradient id="glassEyeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={theme.primary} />
                <stop offset="50%" stopColor={theme.secondary} />
                <stop offset="100%" stopColor={theme.accent} />
              </linearGradient>
              
              <radialGradient id="glassHighlight" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
              </radialGradient>

              <filter id="glassGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Eyes */}
            <g>
              {/* Left Eye */}
              <motion.g
                animate={{
                  scaleY: isBlinking ? 0.1 : 1,
                }}
                transition={{ duration: 0.15 }}
              >
                {/* Eye Base */}
                <ellipse
                  cx={75 + eyeOffsetX}
                  cy={90 + eyeOffsetY}
                  rx="20"
                  ry="15"
                  fill="url(#glassEyeGradient)"
                  opacity="0.8"
                  filter="url(#glassGlow)"
                />
                {/* Eye Highlight */}
                <ellipse
                  cx={75 + eyeOffsetX}
                  cy={90 + eyeOffsetY}
                  rx="18"
                  ry="13"
                  fill="url(#glassHighlight)"
                />
                {/* Pupil */}
                {!isBlinking && (
                  <circle
                    cx={75 + eyeOffsetX}
                    cy={90 + eyeOffsetY}
                    r="8"
                    fill="rgba(0,0,0,0.7)"
                  />
                )}
                {/* Pupil Highlight */}
                {!isBlinking && (
                  <circle
                    cx={78 + eyeOffsetX}
                    cy={87 + eyeOffsetY}
                    r="3"
                    fill="rgba(255,255,255,0.9)"
                  />
                )}
              </motion.g>

              {/* Right Eye */}
              <motion.g
                animate={{
                  scaleY: isBlinking ? 0.1 : 1,
                }}
                transition={{ duration: 0.15 }}
              >
                {/* Eye Base */}
                <ellipse
                  cx={125 + eyeOffsetX}
                  cy={90 + eyeOffsetY}
                  rx="20"
                  ry="15"
                  fill="url(#glassEyeGradient)"
                  opacity="0.8"
                  filter="url(#glassGlow)"
                />
                {/* Eye Highlight */}
                <ellipse
                  cx={125 + eyeOffsetX}
                  cy={90 + eyeOffsetY}
                  rx="18"
                  ry="13"
                  fill="url(#glassHighlight)"
                />
                {/* Pupil */}
                {!isBlinking && (
                  <circle
                    cx={125 + eyeOffsetX}
                    cy={90 + eyeOffsetY}
                    r="8"
                    fill="rgba(0,0,0,0.7)"
                  />
                )}
                {/* Pupil Highlight */}
                {!isBlinking && (
                  <circle
                    cx={128 + eyeOffsetX}
                    cy={87 + eyeOffsetY}
                    r="3"
                    fill="rgba(255,255,255,0.9)"
                  />
                )}
              </motion.g>
            </g>

            {/* Mouth */}
            <motion.path
              d={
                isSpeaking 
                  ? "M 70 130 Q 100 155 130 130" 
                  : currentExpression === 'happy' 
                  ? "M 75 125 Q 100 145 125 125"
                  : currentExpression === 'thinking'
                  ? "M 85 135 Q 100 140 115 135"
                  : "M 85 130 Q 100 135 115 130"
              }
              stroke={theme.primary}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
              filter="url(#glassGlow)"
              animate={{
                pathLength: isSpeaking ? [0, 1, 0] : 1,
                opacity: isSpeaking ? [0.5, 1, 0.5] : 0.8,
              }}
              transition={{
                duration: 0.8,
                repeat: isSpeaking ? Infinity : 0,
              }}
            />

            {/* Nose */}
            <ellipse
              cx="100"
              cy="110"
              rx="2"
              ry="5"
              fill="rgba(255,255,255,0.3)"
            />
          </svg>
        </div>

        {/* Status Indicator */}
        <motion.div
          className="absolute bottom-3 right-3 w-3 h-3 rounded-full"
          style={{
            background: `linear-gradient(45deg, ${theme.primary}, ${theme.secondary})`,
            boxShadow: `0 0 10px ${theme.primary}60`
          }}
          animate={{
            scale: isSpeaking || isListening ? [1, 1.3, 1] : [1, 1.1, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: isSpeaking || isListening ? 0.6 : 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </motion.div>
  );
}
