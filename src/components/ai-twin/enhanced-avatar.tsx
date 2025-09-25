'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedAvatarProps {
  expression?: 'neutral' | 'happy' | 'thinking' | 'explaining' | 'surprised' | 'confident' | 'listening' | 'speaking';
  isListening?: boolean;
  isSpeaking?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const expressionEmojis = {
  neutral: '😐',
  happy: '😊',
  thinking: '🤔',
  explaining: '💡',
  surprised: '😲',
  confident: '😎',
  listening: '👂',
  speaking: '🗣️'
};

const expressionColors = {
  neutral: 'from-gray-400 to-gray-600',
  happy: 'from-yellow-400 to-orange-500',
  thinking: 'from-purple-400 to-blue-500',
  explaining: 'from-green-400 to-blue-500',
  surprised: 'from-pink-400 to-red-500',
  confident: 'from-indigo-400 to-purple-600',
  listening: 'from-blue-400 to-cyan-500',
  speaking: 'from-green-400 to-emerald-500'
};

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-40 h-40'
};

export default function EnhancedAvatar({
  expression = 'neutral',
  isListening = false,
  isSpeaking = false,
  className = '',
  size = 'lg'
}: EnhancedAvatarProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [currentExpression, setCurrentExpression] = useState(expression);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Auto-blink effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Update expression based on state
  useEffect(() => {
    if (isSpeaking) {
      setCurrentExpression('speaking');
    } else if (isListening) {
      setCurrentExpression('listening');
    } else {
      setCurrentExpression(expression);
    }
  }, [expression, isListening, isSpeaking]);

  // Mouse tracking
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (avatarRef.current) {
      const rect = avatarRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
    }
  };

  // Calculate eye position based on mouse
  const eyeOffsetX = (mousePosition.x - 0.5) * 8;
  const eyeOffsetY = (mousePosition.y - 0.5) * 6;

  return (
    <motion.div
      ref={avatarRef}
      className={`relative ${sizeClasses[size]} ${className}`}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      {/* Main Avatar Container */}
      <div className="relative w-full h-full">
        {/* Background Glow */}
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${expressionColors[currentExpression]} opacity-20 blur-xl`}
          animate={{
            scale: isSpeaking ? [1, 1.2, 1] : isListening ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: isSpeaking ? 0.5 : isListening ? 1 : 0,
            repeat: (isSpeaking || isListening) ? Infinity : 0,
          }}
        />

        {/* Avatar SVG */}
        <motion.div
          className="relative w-full h-full"
          animate={{
            rotateY: eyeOffsetX * 2,
            rotateX: -eyeOffsetY * 1,
          }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-lg"
          >
            {/* Head */}
            <motion.circle
              cx="100"
              cy="100"
              r="80"
              fill="url(#headGradient)"
              stroke="url(#borderGradient)"
              strokeWidth="3"
              animate={{
                scale: isSpeaking ? [1, 1.02, 1] : 1,
              }}
              transition={{
                duration: 0.3,
                repeat: isSpeaking ? Infinity : 0,
              }}
            />

            {/* Eyes */}
            <g>
              {/* Left Eye */}
              <motion.ellipse
                cx={70 + eyeOffsetX}
                cy={80 + eyeOffsetY}
                rx={isBlinking ? 8 : 12}
                ry={isBlinking ? 2 : 8}
                fill="#2563eb"
                animate={{
                  scaleY: isBlinking ? 0.1 : 1,
                }}
                transition={{ duration: 0.1 }}
              />
              {/* Left Pupil */}
              {!isBlinking && (
                <motion.circle
                  cx={70 + eyeOffsetX}
                  cy={80 + eyeOffsetY}
                  r="4"
                  fill="#1e40af"
                />
              )}

              {/* Right Eye */}
              <motion.ellipse
                cx={130 + eyeOffsetX}
                cy={80 + eyeOffsetY}
                rx={isBlinking ? 8 : 12}
                ry={isBlinking ? 2 : 8}
                fill="#2563eb"
                animate={{
                  scaleY: isBlinking ? 0.1 : 1,
                }}
                transition={{ duration: 0.1 }}
              />
              {/* Right Pupil */}
              {!isBlinking && (
                <motion.circle
                  cx={130 + eyeOffsetX}
                  cy={80 + eyeOffsetY}
                  r="4"
                  fill="#1e40af"
                />
              )}
            </g>

            {/* Mouth */}
            <motion.path
              d={isSpeaking 
                ? "M 80 130 Q 100 145 120 130" 
                : currentExpression === 'happy' 
                ? "M 80 125 Q 100 140 120 125"
                : "M 85 130 Q 100 135 115 130"
              }
              stroke="#374151"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              animate={{
                d: isSpeaking 
                  ? ["M 80 130 Q 100 145 120 130", "M 80 135 Q 100 150 120 135", "M 80 130 Q 100 145 120 130"]
                  : undefined
              }}
              transition={{
                duration: 0.4,
                repeat: isSpeaking ? Infinity : 0,
              }}
            />

            {/* Gradients */}
            <defs>
              <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f3f4f6" />
                <stop offset="100%" stopColor="#e5e7eb" />
              </linearGradient>
              <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Expression Indicator */}
        <motion.div
          className="absolute -top-2 -right-2 text-2xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          key={currentExpression}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {expressionEmojis[currentExpression]}
        </motion.div>

        {/* Status Rings */}
        <AnimatePresence>
          {(isSpeaking || isListening) && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-current"
              style={{
                color: isSpeaking ? '#10b981' : '#3b82f6',
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: [0.8, 1.2, 0.8], 
                opacity: [0, 0.6, 0] 
              }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </AnimatePresence>

        {/* Floating Particles */}
        {isSpeaking && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-green-400 rounded-full"
                style={{
                  left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 40}%`,
                  top: `${50 + Math.sin(i * 60 * Math.PI / 180) * 40}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info Labels */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
          Mohamed Fares
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          AI Engineer
        </div>
        {(isSpeaking || isListening) && (
          <motion.div
            className={`text-xs px-2 py-1 rounded-full mt-1 ${
              isSpeaking 
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            {isSpeaking ? '🗣️ Speaking' : '👂 Listening'}
          </motion.div>
        )}
      </div>

      {/* Interactive Hint */}
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 dark:text-gray-500 text-center whitespace-nowrap">
        Move your mouse around me!
      </div>
    </motion.div>
  );
}
