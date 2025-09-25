'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from 'boring-avatars';
import { ExpressionType } from '@/lib/ai/avatar-expressions';

interface ProfessionalAvatarProps {
  expression: ExpressionType;
  isActive: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onExpressionChange?: (expression: ExpressionType) => void;
}

const sizeMap = {
  small: 80,
  medium: 120,
  large: 200
};

const expressionColors = {
  neutral: ['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90'],
  happy: ['#FD9644', '#F9CA24', '#F0932B', '#EB4D4B', '#6C5CE7'],
  thinking: ['#A29BFE', '#6C5CE7', '#5F3DC4', '#364FC7', '#1E3A8A'],
  explaining: ['#00B894', '#00CEC9', '#55A3FF', '#74B9FF', '#0984E3'],
  surprised: ['#FDCB6E', '#E17055', '#D63031', '#E84393', '#FD79A8'],
  confident: ['#E17055', '#D63031', '#74B9FF', '#0984E3', '#00B894'],
  listening: ['#81ECEC', '#74B9FF', '#A29BFE', '#FD79A8', '#FDCB6E'],
  speaking: ['#00B894', '#55A3FF', '#FD9644', '#E17055', '#6C5CE7']
};

const expressionVariants = {
  neutral: ['marble', 'beam'],
  happy: ['sunset', 'ring'],
  thinking: ['bauhaus', 'marble'],
  explaining: ['beam', 'pixel'],
  surprised: ['sunset', 'ring'],
  confident: ['bauhaus', 'beam'],
  listening: ['pixel', 'sunset'],
  speaking: ['ring', 'marble']
};

export default function ProfessionalAvatar({
  expression,
  isActive,
  isSpeaking,
  isListening,
  size = 'large',
  className = '',
  onExpressionChange
}: ProfessionalAvatarProps) {
  const [currentVariant, setCurrentVariant] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const avatarRef = useRef<HTMLDivElement>(null);

  // Change variant based on expression
  useEffect(() => {
    const variants = expressionVariants[expression];
    setCurrentVariant(Math.floor(Math.random() * variants.length));
  }, [expression]);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (avatarRef.current) {
        const rect = avatarRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        setMousePosition({
          x: (e.clientX - centerX) / rect.width,
          y: (e.clientY - centerY) / rect.height
        });
      }
    };

    if (isActive) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isActive]);

  const avatarSize = sizeMap[size];
  const colors = expressionColors[expression];
  const variant = expressionVariants[expression][currentVariant];

  return (
    <div 
      ref={avatarRef}
      className={`relative flex flex-col items-center ${className}`}
    >
      {/* Main Avatar Container */}
      <motion.div
        className="relative"
        animate={{
          scale: isSpeaking ? [1, 1.05, 1] : isListening ? [1, 0.98, 1] : 1,
          rotate: mousePosition.x * 2
        }}
        transition={{
          scale: { duration: 0.6, repeat: isSpeaking || isListening ? Infinity : 0 },
          rotate: { duration: 0.3 }
        }}
      >
        {/* Outer Glow Ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: isActive 
              ? `0 0 ${avatarSize * 0.3}px ${colors[0]}40, 0 0 ${avatarSize * 0.6}px ${colors[1]}20`
              : 'none'
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Pulse Ring for Speaking */}
        <AnimatePresence>
          {isSpeaking && (
            <motion.div
              className="absolute inset-0 rounded-full border-4"
              style={{ borderColor: colors[2] }}
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ 
                scale: [1, 1.2, 1.4], 
                opacity: [0.8, 0.4, 0] 
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          )}
        </AnimatePresence>

        {/* Listening Indicator */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ 
                background: `conic-gradient(from 0deg, ${colors[0]}, ${colors[1]}, ${colors[2]}, ${colors[0]})` 
              }}
              initial={{ rotate: 0, opacity: 0.3 }}
              animate={{ 
                rotate: 360,
                opacity: [0.3, 0.6, 0.3]
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                opacity: { duration: 1, repeat: Infinity }
              }}
            />
          )}
        </AnimatePresence>

        {/* Main Avatar */}
        <motion.div
          className="relative z-10 rounded-full overflow-hidden"
          style={{ 
            width: avatarSize, 
            height: avatarSize,
            background: `linear-gradient(135deg, ${colors[0]}10, ${colors[1]}10)`
          }}
          animate={{
            y: mousePosition.y * 5
          }}
          transition={{ duration: 0.3 }}
        >
          <Avatar
            size={avatarSize}
            name="Mohamed Fares AI Engineer"
            variant={variant as any}
            colors={colors}
          />
        </motion.div>

        {/* Expression Indicator */}
        <motion.div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div 
            className="px-3 py-1 rounded-full text-xs font-medium text-white shadow-lg"
            style={{ backgroundColor: colors[0] }}
          >
            {expression === 'neutral' && '😐'}
            {expression === 'happy' && '😊'}
            {expression === 'thinking' && '🤔'}
            {expression === 'explaining' && '💡'}
            {expression === 'surprised' && '😲'}
            {expression === 'confident' && '😎'}
            {expression === 'listening' && '👂'}
            {expression === 'speaking' && '🗣️'}
          </div>
        </motion.div>
      </motion.div>

      {/* Status Text */}
      <motion.div
        className="mt-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="text-sm font-medium text-foreground">
          Mohamed Fares
        </div>
        <div className="text-xs text-muted-foreground">
          AI Engineer
        </div>
        
        {/* Dynamic Status */}
        <motion.div
          className="mt-2 flex items-center justify-center gap-2"
          animate={{
            opacity: isActive ? 1 : 0.7
          }}
        >
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: colors[0] }}
            animate={{
              scale: isSpeaking ? [1, 1.2, 1] : isListening ? [1, 0.8, 1] : 1
            }}
            transition={{
              duration: 0.6,
              repeat: (isSpeaking || isListening) ? Infinity : 0
            }}
          />
          <span className="text-xs text-muted-foreground">
            {isSpeaking ? 'Speaking...' : 
             isListening ? 'Listening...' : 
             isActive ? 'Online' : 'Ready'}
          </span>
        </motion.div>
      </motion.div>

      {/* Interactive Hint */}
      {isActive && (
        <motion.div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
            Move your mouse around me!
          </div>
        </motion.div>
      )}
    </div>
  );
}
