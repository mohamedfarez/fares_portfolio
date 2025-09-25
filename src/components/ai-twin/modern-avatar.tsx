'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModernAvatarProps {
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

const expressionColors = {
  neutral: 'from-slate-400 to-slate-600',
  happy: 'from-emerald-400 to-emerald-600',
  thinking: 'from-amber-400 to-amber-600',
  explaining: 'from-blue-400 to-blue-600',
  surprised: 'from-purple-400 to-purple-600',
  confident: 'from-indigo-400 to-indigo-600',
  listening: 'from-cyan-400 to-cyan-600',
  speaking: 'from-green-400 to-green-600'
};

export default function ModernAvatar({
  expression = 'neutral',
  isListening = false,
  isSpeaking = false,
  className = '',
  size = 'lg'
}: ModernAvatarProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [currentExpression, setCurrentExpression] = useState(expression);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);
  const avatarRef = useRef<HTMLDivElement>(null);

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

  // Generate floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  // Mouse tracking
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!avatarRef.current) return;
    
    const rect = avatarRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
  };

  const eyeOffsetX = (mousePosition.x - 0.5) * 8;
  const eyeOffsetY = (mousePosition.y - 0.5) * 6;

  return (
    <motion.div
      ref={avatarRef}
      className={`relative ${sizeClasses[size]} ${className}`}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
    >
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [-10, -30, -10],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Outer Glow Ring */}
      <motion.div
        className={`absolute inset-0 rounded-full bg-gradient-to-br ${expressionColors[currentExpression]} opacity-20 blur-xl`}
        animate={{
          scale: isSpeaking ? [1, 1.3, 1] : isListening ? [1, 1.15, 1] : [1, 1.05, 1],
          rotate: [0, 360],
        }}
        transition={{
          scale: {
            duration: isSpeaking ? 0.6 : isListening ? 1.2 : 4,
            repeat: Infinity,
            ease: "easeInOut"
          },
          rotate: {
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }
        }}
      />

      {/* Middle Ring */}
      <motion.div
        className="absolute inset-2 rounded-full border-2 border-white/20 backdrop-blur-sm"
        animate={{
          rotate: [360, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Main Avatar Container */}
      <motion.div
        className="relative w-full h-full rounded-full overflow-hidden backdrop-blur-md border border-white/30"
        style={{
          background: `linear-gradient(135deg, 
            rgba(255,255,255,0.1) 0%, 
            rgba(255,255,255,0.05) 50%, 
            rgba(0,0,0,0.1) 100%)`
        }}
        animate={{
          rotateY: eyeOffsetX * 1.5,
          rotateX: -eyeOffsetY * 1,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        {/* Inner Gradient */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${expressionColors[currentExpression]} opacity-30 rounded-full`}
        />

        {/* Avatar SVG */}
        <svg
          viewBox="0 0 200 200"
          className="relative z-10 w-full h-full"
        >
          {/* Gradients */}
          <defs>
            <linearGradient id="faceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.7)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.5)" />
            </linearGradient>
            
            <radialGradient id="eyeGradient" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="70%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1e40af" />
            </radialGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Face Base */}
          <motion.circle
            cx="100"
            cy="100"
            r="75"
            fill="url(#faceGradient)"
            filter="url(#glow)"
            animate={{
              scale: isSpeaking ? [1, 1.03, 1] : 1,
            }}
            transition={{
              duration: 0.4,
              repeat: isSpeaking ? Infinity : 0,
            }}
          />

          {/* Eyes Container */}
          <g>
            {/* Left Eye */}
            <motion.g
              animate={{
                scaleY: isBlinking ? 0.1 : 1,
              }}
              transition={{ duration: 0.15 }}
            >
              {/* Eye Socket */}
              <ellipse
                cx={75 + eyeOffsetX}
                cy={85 + eyeOffsetY}
                rx="18"
                ry="12"
                fill="rgba(0,0,0,0.1)"
              />
              {/* Eye */}
              <ellipse
                cx={75 + eyeOffsetX}
                cy={85 + eyeOffsetY}
                rx="15"
                ry="10"
                fill="url(#eyeGradient)"
              />
              {/* Pupil */}
              {!isBlinking && (
                <circle
                  cx={75 + eyeOffsetX}
                  cy={85 + eyeOffsetY}
                  r="6"
                  fill="#1e293b"
                />
              )}
              {/* Highlight */}
              {!isBlinking && (
                <circle
                  cx={77 + eyeOffsetX}
                  cy={82 + eyeOffsetY}
                  r="2"
                  fill="rgba(255,255,255,0.8)"
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
              {/* Eye Socket */}
              <ellipse
                cx={125 + eyeOffsetX}
                cy={85 + eyeOffsetY}
                rx="18"
                ry="12"
                fill="rgba(0,0,0,0.1)"
              />
              {/* Eye */}
              <ellipse
                cx={125 + eyeOffsetX}
                cy={85 + eyeOffsetY}
                rx="15"
                ry="10"
                fill="url(#eyeGradient)"
              />
              {/* Pupil */}
              {!isBlinking && (
                <circle
                  cx={125 + eyeOffsetX}
                  cy={85 + eyeOffsetY}
                  r="6"
                  fill="#1e293b"
                />
              )}
              {/* Highlight */}
              {!isBlinking && (
                <circle
                  cx={127 + eyeOffsetX}
                  cy={82 + eyeOffsetY}
                  r="2"
                  fill="rgba(255,255,255,0.8)"
                />
              )}
            </motion.g>
          </g>

          {/* Mouth */}
          <motion.path
            d={
              isSpeaking 
                ? "M 75 130 Q 100 150 125 130" 
                : currentExpression === 'happy' 
                ? "M 75 125 Q 100 145 125 125"
                : currentExpression === 'thinking'
                ? "M 85 135 Q 100 140 115 135"
                : "M 85 130 Q 100 135 115 130"
            }
            stroke="rgba(0,0,0,0.6)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            filter="url(#glow)"
            animate={{
              pathLength: isSpeaking ? [0, 1, 0] : 1,
            }}
            transition={{
              duration: 0.8,
              repeat: isSpeaking ? Infinity : 0,
            }}
          />

          {/* Nose */}
          <ellipse
            cx="100"
            cy="105"
            rx="3"
            ry="6"
            fill="rgba(0,0,0,0.1)"
          />
        </svg>

        {/* Status Indicator */}
        <motion.div
          className="absolute bottom-2 right-2 w-4 h-4 rounded-full"
          style={{
            background: isSpeaking 
              ? 'linear-gradient(45deg, #10b981, #059669)' 
              : isListening 
              ? 'linear-gradient(45deg, #3b82f6, #1d4ed8)'
              : 'linear-gradient(45deg, #6b7280, #4b5563)'
          }}
          animate={{
            scale: isSpeaking || isListening ? [1, 1.2, 1] : 1,
            boxShadow: isSpeaking || isListening 
              ? ['0 0 0 0 rgba(59, 130, 246, 0.7)', '0 0 0 10px rgba(59, 130, 246, 0)', '0 0 0 0 rgba(59, 130, 246, 0.7)']
              : '0 0 0 0 rgba(59, 130, 246, 0)'
          }}
          transition={{
            duration: 1,
            repeat: (isSpeaking || isListening) ? Infinity : 0,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
