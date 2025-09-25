'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Palette, Sparkles, Zap } from 'lucide-react';
import ModernAvatar from './modern-avatar';
import GlassmorphismAvatar from './glassmorphism-avatar';
import ParticleAvatar from './particle-avatar';
import EnhancedAvatar from './enhanced-avatar';
import ThreeJSAvatar from './threejs-avatar';
import HolographicAvatar from './holographic-avatar';

interface AvatarSelectorProps {
  expression?: 'neutral' | 'happy' | 'thinking' | 'explaining' | 'surprised' | 'confident' | 'listening' | 'speaking';
  isListening?: boolean;
  isSpeaking?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

type AvatarType = 'enhanced' | 'modern' | 'glassmorphism' | 'particle' | 'threejs' | 'holographic';

const avatarTypes = [
  {
    id: 'enhanced' as AvatarType,
    name: 'Enhanced',
    description: 'Classic enhanced design',
    icon: Settings,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'modern' as AvatarType,
    name: 'Modern 3D',
    description: 'Modern 3D-style avatar',
    icon: Palette,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'glassmorphism' as AvatarType,
    name: 'Glassmorphism',
    description: 'Glass-style modern design',
    icon: Sparkles,
    color: 'from-cyan-500 to-cyan-600'
  },
  {
    id: 'particle' as AvatarType,
    name: 'Particle System',
    description: 'Dynamic particle-based avatar',
    icon: Zap,
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    id: 'threejs' as AvatarType,
    name: '3D Canvas',
    description: 'Advanced 3D-rendered avatar',
    icon: Sparkles,
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'holographic' as AvatarType,
    name: 'Holographic',
    description: 'Futuristic hologram-style avatar',
    icon: Zap,
    color: 'from-cyan-400 to-purple-500'
  }
];

export default function AvatarSelector({
  expression = 'neutral',
  isListening = false,
  isSpeaking = false,
  className = '',
  size = 'lg'
}: AvatarSelectorProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarType>('modern');
  const [showSelector, setShowSelector] = useState(false);

  const renderAvatar = () => {
    const props = { expression, isListening, isSpeaking, size, className: 'w-full h-full' };
    
    switch (selectedAvatar) {
      case 'enhanced':
        return <EnhancedAvatar {...props} />;
      case 'modern':
        return <ModernAvatar {...props} />;
      case 'glassmorphism':
        return <GlassmorphismAvatar {...props} />;
      case 'particle':
        return <ParticleAvatar {...props} />;
      case 'threejs':
        return <ThreeJSAvatar {...props} />;
      case 'holographic':
        return <HolographicAvatar {...props} />;
      default:
        return <ModernAvatar {...props} />;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Avatar Display */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedAvatar}
            initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
            transition={{ 
              duration: 0.6, 
              type: "spring", 
              bounce: 0.3 
            }}
          >
            {renderAvatar()}
          </motion.div>
        </AnimatePresence>

        {/* Avatar Type Selector Button */}
        <motion.button
          onClick={() => setShowSelector(!showSelector)}
          className="absolute top-2 right-2 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings className="w-4 h-4 text-white" />
        </motion.button>
      </div>

      {/* Avatar Type Selector */}
      <AnimatePresence>
        {showSelector && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 right-0 mt-4 z-50"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 shadow-2xl">
              <h3 className="text-sm font-semibold text-white mb-3 text-center">
                Choose Avatar Style
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                {avatarTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedAvatar === type.id;
                  
                  return (
                    <motion.button
                      key={type.id}
                      onClick={() => {
                        setSelectedAvatar(type.id);
                        setShowSelector(false);
                      }}
                      className={`relative p-3 rounded-lg border transition-all duration-200 ${
                        isSelected
                          ? 'border-white/40 bg-white/20'
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Background Gradient */}
                      <div 
                        className={`absolute inset-0 rounded-lg bg-gradient-to-br ${type.color} opacity-20`}
                      />
                      
                      {/* Content */}
                      <div className="relative z-10 flex flex-col items-center gap-1">
                        <Icon className="w-5 h-5 text-white" />
                        <span className="text-xs font-medium text-white">
                          {type.name}
                        </span>
                        <span className="text-xs text-white/70 text-center leading-tight">
                          {type.description}
                        </span>
                      </div>
                      
                      {/* Selection Indicator */}
                      {isSelected && (
                        <motion.div
                          className="absolute inset-0 rounded-lg border-2 border-white/60"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
              
              {/* Current Selection Info */}
              <motion.div
                className="mt-3 p-2 bg-white/5 rounded-lg border border-white/10"
                layout
              >
                <div className="flex items-center gap-2">
                  {(() => {
                    const currentType = avatarTypes.find(t => t.id === selectedAvatar);
                    const Icon = currentType?.icon || Settings;
                    return (
                      <>
                        <Icon className="w-4 h-4 text-white/80" />
                        <span className="text-xs text-white/80">
                          Current: {currentType?.name}
                        </span>
                      </>
                    );
                  })()}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {showSelector && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSelector(false)}
        />
      )}
    </div>
  );
}
