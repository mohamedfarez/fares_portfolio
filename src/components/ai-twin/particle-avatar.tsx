'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ParticleAvatarProps {
  expression?: 'neutral' | 'happy' | 'thinking' | 'explaining' | 'surprised' | 'confident' | 'listening' | 'speaking';
  isListening?: boolean;
  isSpeaking?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'face' | 'eye' | 'mouth' | 'ambient';
}

const sizeClasses = {
  sm: 'w-24 h-24',
  md: 'w-32 h-32', 
  lg: 'w-48 h-48',
  xl: 'w-64 h-64'
};

const expressionColors = {
  neutral: ['#64748b', '#94a3b8', '#cbd5e1'],
  happy: ['#10b981', '#34d399', '#6ee7b7'],
  thinking: ['#f59e0b', '#fbbf24', '#fcd34d'],
  explaining: ['#3b82f6', '#60a5fa', '#93c5fd'],
  surprised: ['#8b5cf6', '#a78bfa', '#c4b5fd'],
  confident: ['#6366f1', '#818cf8', '#a5b4fc'],
  listening: ['#06b6d4', '#22d3ee', '#67e8f9'],
  speaking: ['#059669', '#10b981', '#34d399']
};

export default function ParticleAvatar({
  expression = 'neutral',
  isListening = false,
  isSpeaking = false,
  className = '',
  size = 'lg'
}: ParticleAvatarProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isBlinking, setIsBlinking] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const particleIdRef = useRef(0);

  const colors = expressionColors[expression];

  // Generate face particles
  const generateFaceParticles = useCallback(() => {
    const newParticles: Particle[] = [];
    
    // Face outline particles
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2;
      const radius = 35 + Math.random() * 5;
      const x = 50 + Math.cos(angle) * radius;
      const y = 50 + Math.sin(angle) * radius;
      
      newParticles.push({
        id: particleIdRef.current++,
        x,
        y,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        life: Math.random() * 100 + 50,
        maxLife: 150,
        size: Math.random() * 2 + 1,
        color: colors[0],
        type: 'face'
      });
    }

    // Eye particles
    const eyePositions = [
      { x: 35, y: 40 }, // Left eye
      { x: 65, y: 40 }  // Right eye
    ];

    eyePositions.forEach(eyePos => {
      for (let i = 0; i < 15; i++) {
        const angle = (i / 15) * Math.PI * 2;
        const radius = 5 + Math.random() * 3;
        const x = eyePos.x + Math.cos(angle) * radius;
        const y = eyePos.y + Math.sin(angle) * radius;
        
        newParticles.push({
          id: particleIdRef.current++,
          x,
          y,
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.1,
          life: Math.random() * 80 + 40,
          maxLife: 120,
          size: Math.random() * 1.5 + 0.5,
          color: colors[1],
          type: 'eye'
        });
      }
    });

    // Mouth particles
    const mouthY = isSpeaking ? 70 : expression === 'happy' ? 65 : 68;
    for (let i = 0; i < 20; i++) {
      const x = 35 + (i / 20) * 30;
      const y = mouthY + Math.sin((i / 20) * Math.PI) * (isSpeaking ? 8 : expression === 'happy' ? 5 : 2);
      
      newParticles.push({
        id: particleIdRef.current++,
        x,
        y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        life: Math.random() * 60 + 30,
        maxLife: 90,
        size: Math.random() * 1.5 + 0.5,
        color: colors[2],
        type: 'mouth'
      });
    }

    return newParticles;
  }, [expression, isSpeaking, colors]);

  // Generate ambient particles
  const generateAmbientParticles = useCallback(() => {
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: particleIdRef.current++,
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        life: Math.random() * 200 + 100,
        maxLife: 300,
        size: Math.random() * 1 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: 'ambient'
      });
    }
    
    return newParticles;
  }, [colors]);

  // Update particles
  const updateParticles = useCallback(() => {
    setParticles(prevParticles => {
      const updated = prevParticles.map(particle => {
        // Update position
        let newX = particle.x + particle.vx;
        let newY = particle.y + particle.vy;
        
        // Boundary collision for ambient particles
        if (particle.type === 'ambient') {
          if (newX <= 0 || newX >= 100) particle.vx *= -0.8;
          if (newY <= 0 || newY >= 100) particle.vy *= -0.8;
          newX = Math.max(0, Math.min(100, newX));
          newY = Math.max(0, Math.min(100, newY));
        }
        
        // Attraction to mouse for face particles
        if (particle.type === 'face' || particle.type === 'eye') {
          const mouseX = mousePosition.x * 100;
          const mouseY = mousePosition.y * 100;
          const dx = mouseX - newX;
          const dy = mouseY - newY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 20) {
            const force = 0.02;
            particle.vx += (dx / distance) * force;
            particle.vy += (dy / distance) * force;
          }
        }
        
        // Apply speaking/listening effects
        if (isSpeaking && particle.type === 'mouth') {
          particle.vy += Math.sin(Date.now() * 0.01 + particle.id) * 0.1;
        }
        
        if (isListening && particle.type === 'eye') {
          particle.vx += Math.cos(Date.now() * 0.008 + particle.id) * 0.05;
        }
        
        return {
          ...particle,
          x: newX,
          y: newY,
          life: particle.life - 1,
          vx: particle.vx * 0.99, // Damping
          vy: particle.vy * 0.99
        };
      });
      
      // Remove dead particles and add new ones
      const alive = updated.filter(p => p.life > 0);
      
      // Regenerate particles if needed
      if (alive.length < 80) {
        const newFaceParticles = generateFaceParticles();
        const newAmbientParticles = generateAmbientParticles();
        return [...alive, ...newFaceParticles, ...newAmbientParticles];
      }
      
      return alive;
    });
  }, [mousePosition, isSpeaking, isListening, generateFaceParticles, generateAmbientParticles]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      updateParticles();
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [updateParticles]);

  // Initialize particles
  useEffect(() => {
    const faceParticles = generateFaceParticles();
    const ambientParticles = generateAmbientParticles();
    setParticles([...faceParticles, ...ambientParticles]);
  }, [generateFaceParticles, generateAmbientParticles]);

  // Auto-blink effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Mouse tracking
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!avatarRef.current) return;
    
    const rect = avatarRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
  };

  return (
    <motion.div
      ref={avatarRef}
      className={`relative ${sizeClasses[size]} ${className} cursor-pointer overflow-hidden rounded-full`}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
      style={{
        background: `radial-gradient(circle at 50% 50%, ${colors[0]}20, ${colors[1]}10, transparent)`
      }}
    >
      {/* Background */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: `linear-gradient(135deg, rgba(0,0,0,0.1), rgba(255,255,255,0.05))`,
          backdropFilter: 'blur(10px)'
        }}
      />

      {/* Particle System */}
      <div className="relative w-full h-full">
        {particles.map(particle => {
          const opacity = particle.life / particle.maxLife;
          const scale = particle.type === 'ambient' ? 
            0.5 + (particle.life / particle.maxLife) * 0.5 : 
            0.8 + (particle.life / particle.maxLife) * 0.4;
          
          return (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                opacity: isBlinking && particle.type === 'eye' ? 0.1 : opacity,
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}40`,
                transform: `translate(-50%, -50%) scale(${scale})`
              }}
              animate={{
                scale: isSpeaking && particle.type === 'mouth' ? [scale, scale * 1.2, scale] : scale,
                opacity: isListening && particle.type === 'eye' ? [opacity, opacity * 0.5, opacity] : opacity
              }}
              transition={{
                duration: 0.5,
                repeat: (isSpeaking && particle.type === 'mouth') || (isListening && particle.type === 'eye') ? Infinity : 0
              }}
            />
          );
        })}
      </div>

      {/* Status Indicator */}
      <motion.div
        className="absolute bottom-2 right-2 w-3 h-3 rounded-full"
        style={{
          background: `linear-gradient(45deg, ${colors[0]}, ${colors[1]})`,
          boxShadow: `0 0 10px ${colors[0]}60`
        }}
        animate={{
          scale: isSpeaking || isListening ? [1, 1.4, 1] : [1, 1.1, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: isSpeaking || isListening ? 0.4 : 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Interactive Overlay */}
      <motion.div
        className="absolute inset-0 rounded-full border border-white/20"
        animate={{
          borderColor: isSpeaking ? `${colors[2]}60` : isListening ? `${colors[1]}60` : 'rgba(255,255,255,0.2)',
          boxShadow: isSpeaking || isListening ? `0 0 20px ${colors[0]}40` : 'none'
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
