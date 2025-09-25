'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExpressionType, 
  AvatarState, 
  avatarExpressionManager,
  expressions 
} from '@/lib/ai/avatar-expressions';

interface AvatarProps {
  expression?: ExpressionType;
  isActive?: boolean;
  isSpeaking?: boolean;
  isListening?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onExpressionChange?: (expression: ExpressionType) => void;
}

export default function Avatar({
  expression = 'neutral',
  isActive = true,
  isSpeaking = false,
  isListening = false,
  size = 'medium',
  className = '',
  onExpressionChange
}: AvatarProps) {
  const [avatarState, setAvatarState] = useState<AvatarState>(
    avatarExpressionManager.getCurrentState()
  );
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const avatarRef = useRef<HTMLDivElement>(null);

  // Size configurations
  const sizeConfig = {
    small: { width: 120, height: 140, scale: 0.8 },
    medium: { width: 160, height: 180, scale: 1 },
    large: { width: 200, height: 220, scale: 1.2 }
  };

  const config = sizeConfig[size];

  // Update avatar state when props change
  useEffect(() => {
    if (isSpeaking) {
      avatarExpressionManager.startSpeaking();
    } else if (isListening) {
      avatarExpressionManager.startListening();
    } else {
      avatarExpressionManager.setExpression(expression);
    }
  }, [expression, isSpeaking, isListening]);

  // Mouse tracking for eye movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!avatarRef.current || !isActive) return;

      const rect = avatarRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);

      setMousePosition({ x: deltaX, y: deltaY });
      avatarExpressionManager.updateEyePosition(deltaX * 0.3, deltaY * 0.2);
    };

    if (isActive) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isActive]);

  // State updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAvatarState(avatarExpressionManager.getCurrentState());
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Auto-blink
  useEffect(() => {
    if (isActive) {
      avatarExpressionManager.startAutoBlink();
    }
  }, [isActive]);

  // Get current expression data
  const currentExpression = expressions[avatarState.currentExpression];
  const eyeOffsetX = avatarState.eyePosition.x * 3;
  const eyeOffsetY = avatarState.eyePosition.y * 2;

  return (
    <div 
      ref={avatarRef}
      className={`relative ${className}`}
      style={{ width: config.width, height: config.height }}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ 
          scale: isActive ? config.scale : config.scale * 0.95,
          opacity: isActive ? 1 : 0.8
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Avatar SVG */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 160 180"
          className="drop-shadow-lg"
        >
          {/* Background Circle */}
          <defs>
            <radialGradient id="avatarBg" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
              <stop offset="100%" stopColor="rgba(147, 51, 234, 0.1)" />
            </radialGradient>
          </defs>
          
          <circle
            cx="80"
            cy="90"
            r="75"
            fill="url(#avatarBg)"
            stroke="rgba(59, 130, 246, 0.2)"
            strokeWidth="2"
          />

          {/* Head */}
          <ellipse
            cx="80"
            cy="70"
            rx="35"
            ry="40"
            fill="#fbbf24"
            stroke="#f59e0b"
            strokeWidth="1"
          />

          {/* Hair */}
          <path
            d="M 45 45 Q 80 25 115 45 Q 110 35 80 30 Q 50 35 45 45"
            fill="#374151"
          />

          {/* Eyes */}
          <g>
            {/* Eye whites */}
            <ellipse
              cx={65 + eyeOffsetX}
              cy={60 + eyeOffsetY}
              rx="8"
              ry={avatarState.blinkState ? "1" : "6"}
              fill="white"
              stroke="#374151"
              strokeWidth="1"
            />
            <ellipse
              cx={95 + eyeOffsetX}
              cy={60 + eyeOffsetY}
              rx="8"
              ry={avatarState.blinkState ? "1" : "6"}
              fill="white"
              stroke="#374151"
              strokeWidth="1"
            />

            {/* Pupils */}
            {!avatarState.blinkState && (
              <>
                <circle
                  cx={65 + eyeOffsetX}
                  cy={60 + eyeOffsetY}
                  r="3"
                  fill="#1f2937"
                />
                <circle
                  cx={95 + eyeOffsetX}
                  cy={60 + eyeOffsetY}
                  r="3"
                  fill="#1f2937"
                />
                {/* Eye shine */}
                <circle
                  cx={66 + eyeOffsetX}
                  cy={59 + eyeOffsetY}
                  r="1"
                  fill="white"
                />
                <circle
                  cx={96 + eyeOffsetX}
                  cy={59 + eyeOffsetY}
                  r="1"
                  fill="white"
                />
              </>
            )}
          </g>

          {/* Eyebrows */}
          <g>
            <path
              d={`M 57 ${currentExpression.eyebrowPosition === 'raised' ? '50' : 
                     currentExpression.eyebrowPosition === 'high' ? '48' : 
                     currentExpression.eyebrowPosition === 'slightly-furrowed' ? '52' : '51'} 
                  Q 65 ${currentExpression.eyebrowPosition === 'raised' ? '48' : 
                         currentExpression.eyebrowPosition === 'high' ? '46' : 
                         currentExpression.eyebrowPosition === 'slightly-furrowed' ? '50' : '49'} 
                  73 ${currentExpression.eyebrowPosition === 'raised' ? '50' : 
                       currentExpression.eyebrowPosition === 'high' ? '48' : 
                       currentExpression.eyebrowPosition === 'slightly-furrowed' ? '52' : '51'}`}
              stroke="#374151"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d={`M 87 ${currentExpression.eyebrowPosition === 'raised' ? '50' : 
                     currentExpression.eyebrowPosition === 'high' ? '48' : 
                     currentExpression.eyebrowPosition === 'slightly-furrowed' ? '52' : '51'} 
                  Q 95 ${currentExpression.eyebrowPosition === 'raised' ? '48' : 
                         currentExpression.eyebrowPosition === 'high' ? '46' : 
                         currentExpression.eyebrowPosition === 'slightly-furrowed' ? '50' : '49'} 
                  103 ${currentExpression.eyebrowPosition === 'raised' ? '50' : 
                        currentExpression.eyebrowPosition === 'high' ? '48' : 
                        currentExpression.eyebrowPosition === 'slightly-furrowed' ? '52' : '51'}`}
              stroke="#374151"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </g>

          {/* Nose */}
          <path
            d="M 78 70 Q 80 75 82 70"
            stroke="#f59e0b"
            strokeWidth="1"
            fill="none"
          />

          {/* Mouth */}
          <g>
            {currentExpression.mouthShape === 'smile' && (
              <path
                d="M 70 85 Q 80 95 90 85"
                stroke="#374151"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            )}
            {currentExpression.mouthShape === 'open' && (
              <ellipse
                cx="80"
                cy="87"
                rx="6"
                ry={avatarState.lipSyncState === 'wide' ? '8' : 
                    avatarState.lipSyncState === 'open' ? '4' : '2'}
                fill="#8b5cf6"
                stroke="#374151"
                strokeWidth="1"
              />
            )}
            {currentExpression.mouthShape === 'closed' && (
              <line
                x1="75"
                y1="85"
                x2="85"
                y2="85"
                stroke="#374151"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
            {currentExpression.mouthShape === 'slight-smile' && (
              <path
                d="M 75 85 Q 80 88 85 85"
                stroke="#374151"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            )}
          </g>

          {/* Status Indicator */}
          {isActive && (
            <circle
              cx="140"
              cy="40"
              r="6"
              fill={isSpeaking ? "#10b981" : isListening ? "#3b82f6" : "#6b7280"}
              className="animate-pulse"
            />
          )}
        </svg>

        {/* Expression Label */}
        <AnimatePresence>
          {avatarState.isAnimating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-full">
                {currentExpression.name}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
