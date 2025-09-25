'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HolographicAvatarProps {
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

const holographicColors = {
  neutral: ['#00ffff', '#0080ff', '#8000ff'],
  happy: ['#00ff80', '#80ff00', '#ffff00'],
  thinking: ['#ff8000', '#ff4000', '#ff0080'],
  explaining: ['#0080ff', '#4000ff', '#8000ff'],
  surprised: ['#ff00ff', '#ff0080', '#8000ff'],
  confident: ['#8000ff', '#4000ff', '#0080ff'],
  listening: ['#00ffff', '#00ff80', '#80ff00'],
  speaking: ['#80ff00', '#ffff00', '#ff8000']
};

export default function HolographicAvatar({
  expression = 'neutral',
  isListening = false,
  isSpeaking = false,
  className = '',
  size = 'lg'
}: HolographicAvatarProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [scanLines, setScanLines] = useState<Array<{id: number, y: number, opacity: number}>>([]);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  const colors = holographicColors[expression];

  // Auto-blink effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Scan lines animation
  useEffect(() => {
    const generateScanLines = () => {
      const newScanLines = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        y: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.2
      }));
      setScanLines(newScanLines);
    };

    generateScanLines();
    const interval = setInterval(generateScanLines, 2000);
    return () => clearInterval(interval);
  }, []);

  // Glitch effect
  useEffect(() => {
    if (isSpeaking || isListening) {
      const glitchInterval = setInterval(() => {
        setGlitchEffect(true);
        setTimeout(() => setGlitchEffect(false), 100);
      }, 1000);
      
      return () => clearInterval(glitchInterval);
    }
  }, [isSpeaking, isListening]);

  // Mouse tracking
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!avatarRef.current) return;
    
    const rect = avatarRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
  };

  const eyeOffsetX = (mousePosition.x - 0.5) * 10;
  const eyeOffsetY = (mousePosition.y - 0.5) * 8;

  return (
    <motion.div
      ref={avatarRef}
      className={`relative ${sizeClasses[size]} ${className} overflow-hidden`}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
    >
      {/* Holographic Base */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, ${colors[0]}20, transparent 50%),
            radial-gradient(circle at 70% 70%, ${colors[1]}15, transparent 50%),
            linear-gradient(45deg, ${colors[2]}10, transparent)
          `,
          backdropFilter: 'blur(1px)'
        }}
      />

      {/* Scan Lines */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        {scanLines.map((line) => (
          <motion.div
            key={line.id}
            className="absolute w-full h-0.5"
            style={{
              top: `${line.y}%`,
              background: `linear-gradient(90deg, transparent, ${colors[0]}80, transparent)`,
              opacity: line.opacity
            }}
            animate={{
              y: [-2, 2, -2],
              opacity: [line.opacity, line.opacity * 1.5, line.opacity],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: line.id * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main Holographic Container */}
      <motion.div
        className="relative w-full h-full rounded-full"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(0,255,255,0.1) 0%, 
              rgba(128,0,255,0.05) 50%, 
              rgba(255,0,128,0.1) 100%)
          `,
          border: `2px solid ${colors[0]}60`,
          boxShadow: `
            0 0 20px ${colors[0]}40,
            inset 0 0 20px ${colors[1]}20,
            0 0 40px ${colors[2]}20
          `
        }}
        animate={{
          rotateY: eyeOffsetX * 2,
          rotateX: -eyeOffsetY * 1.5,
          scale: isSpeaking ? [1, 1.03, 1] : isListening ? [1, 0.97, 1] : 1,
          filter: glitchEffect ? 'hue-rotate(180deg) saturate(2)' : 'hue-rotate(0deg) saturate(1)',
        }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 20,
          scale: {
            duration: 0.6,
            repeat: (isSpeaking || isListening) ? Infinity : 0
          },
          filter: {
            duration: 0.1
          }
        }}
      >
        {/* Holographic Grid Pattern */}
        <div 
          className="absolute inset-2 rounded-full opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(${colors[0]}40 1px, transparent 1px),
              linear-gradient(90deg, ${colors[0]}40 1px, transparent 1px)
            `,
            backgroundSize: '8px 8px'
          }}
        />

        {/* Avatar Content */}
        <svg
          viewBox="0 0 200 200"
          className="relative z-10 w-full h-full"
        >
          {/* Gradients */}
          <defs>
            <linearGradient id="holoEyeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors[0]} />
              <stop offset="50%" stopColor={colors[1]} />
              <stop offset="100%" stopColor={colors[2]} />
            </linearGradient>
            
            <radialGradient id="holoGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={colors[0]} stopOpacity="0.8" />
              <stop offset="100%" stopColor={colors[1]} stopOpacity="0.2" />
            </radialGradient>

            <filter id="holoFilter">
              <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
              <feColorMatrix type="matrix" values="1 0 1 0 0  0 1 1 0 0  1 0 1 0 0  0 0 0 1 0"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Eyes */}
          <g filter="url(#holoFilter)">
            {/* Left Eye */}
            <motion.g
              animate={{
                scaleY: isBlinking ? 0.1 : 1,
              }}
              transition={{ duration: 0.15 }}
            >
              {/* Eye Glow */}
              <ellipse
                cx={75 + eyeOffsetX}
                cy={85 + eyeOffsetY}
                rx="25"
                ry="18"
                fill="url(#holoGlow)"
                opacity="0.6"
              />
              {/* Eye Base */}
              <ellipse
                cx={75 + eyeOffsetX}
                cy={85 + eyeOffsetY}
                rx="18"
                ry="12"
                fill="url(#holoEyeGradient)"
                opacity="0.9"
              />
              {/* Pupil */}
              {!isBlinking && (
                <circle
                  cx={75 + eyeOffsetX}
                  cy={85 + eyeOffsetY}
                  r="6"
                  fill={colors[2]}
                  opacity="0.8"
                />
              )}
              {/* Highlight */}
              {!isBlinking && (
                <circle
                  cx={78 + eyeOffsetX}
                  cy={82 + eyeOffsetY}
                  r="2"
                  fill={colors[0]}
                  opacity="1"
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
              {/* Eye Glow */}
              <ellipse
                cx={125 + eyeOffsetX}
                cy={85 + eyeOffsetY}
                rx="25"
                ry="18"
                fill="url(#holoGlow)"
                opacity="0.6"
              />
              {/* Eye Base */}
              <ellipse
                cx={125 + eyeOffsetX}
                cy={85 + eyeOffsetY}
                rx="18"
                ry="12"
                fill="url(#holoEyeGradient)"
                opacity="0.9"
              />
              {/* Pupil */}
              {!isBlinking && (
                <circle
                  cx={125 + eyeOffsetX}
                  cy={85 + eyeOffsetY}
                  r="6"
                  fill={colors[2]}
                  opacity="0.8"
                />
              )}
              {/* Highlight */}
              {!isBlinking && (
                <circle
                  cx={128 + eyeOffsetX}
                  cy={82 + eyeOffsetY}
                  r="2"
                  fill={colors[0]}
                  opacity="1"
                />
              )}
            </motion.g>
          </g>

          {/* Mouth */}
          <motion.path
            d={
              isSpeaking 
                ? "M 70 130 Q 100 155 130 130" 
                : expression === 'happy' 
                ? "M 75 125 Q 100 145 125 125"
                : expression === 'thinking'
                ? "M 85 135 Q 100 140 115 135"
                : "M 85 130 Q 100 135 115 130"
            }
            stroke={colors[1]}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
            filter="url(#holoFilter)"
            animate={{
              pathLength: isSpeaking ? [0, 1, 0] : 1,
              opacity: isSpeaking ? [0.5, 1, 0.5] : 0.9,
              strokeWidth: isSpeaking ? [3, 5, 3] : 3,
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
            rx="2"
            ry="4"
            fill={colors[0]}
            opacity="0.6"
          />

          {/* Holographic Data Streams */}
          {(isSpeaking || isListening) && (
            <g opacity="0.7">
              {[...Array(3)].map((_, i) => (
                <motion.line
                  key={i}
                  x1="50"
                  y1={60 + i * 20}
                  x2="150"
                  y2={60 + i * 20}
                  stroke={colors[i]}
                  strokeWidth="1"
                  opacity="0.6"
                  animate={{
                    pathLength: [0, 1, 0],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </g>
          )}
        </svg>

        {/* Status Indicator */}
        <motion.div
          className="absolute bottom-3 right-3 w-4 h-4 rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors[0]}, ${colors[1]})`,
            boxShadow: `0 0 15px ${colors[0]}80`
          }}
          animate={{
            scale: isSpeaking || isListening ? [1, 1.4, 1] : [1, 1.2, 1],
            opacity: [0.6, 1, 0.6],
            boxShadow: isSpeaking || isListening 
              ? [`0 0 15px ${colors[0]}80`, `0 0 25px ${colors[1]}60`, `0 0 15px ${colors[0]}80`]
              : `0 0 15px ${colors[0]}80`
          }}
          transition={{
            duration: isSpeaking || isListening ? 0.5 : 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Holographic Border Effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: `1px solid ${colors[0]}80`,
          }}
          animate={{
            rotate: [0, 360],
            borderColor: [
              `${colors[0]}80`,
              `${colors[1]}80`,
              `${colors[2]}80`,
              `${colors[0]}80`
            ]
          }}
          transition={{
            rotate: {
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            },
            borderColor: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        />
      </motion.div>
    </motion.div>
  );
}
