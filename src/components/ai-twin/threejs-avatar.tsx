'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ThreeJSAvatarProps {
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

export default function ThreeJSAvatar({
  expression = 'neutral',
  isListening = false,
  isSpeaking = false,
  className = '',
  size = 'lg'
}: ThreeJSAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isBlinking, setIsBlinking] = useState(false);
  const animationRef = useRef<number>();

  // Simple 3D-like rendering using Canvas 2D
  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Mouse influence
    const mouseInfluenceX = (mousePosition.x - 0.5) * 20;
    const mouseInfluenceY = (mousePosition.y - 0.5) * 15;

    // Expression colors
    const expressionColors = {
      neutral: { primary: '#64748b', secondary: '#94a3b8', accent: '#cbd5e1' },
      happy: { primary: '#10b981', secondary: '#34d399', accent: '#6ee7b7' },
      thinking: { primary: '#f59e0b', secondary: '#fbbf24', accent: '#fcd34d' },
      explaining: { primary: '#3b82f6', secondary: '#60a5fa', accent: '#93c5fd' },
      surprised: { primary: '#8b5cf6', secondary: '#a78bfa', accent: '#c4b5fd' },
      confident: { primary: '#6366f1', secondary: '#818cf8', accent: '#a5b4fc' },
      listening: { primary: '#06b6d4', secondary: '#22d3ee', accent: '#67e8f9' },
      speaking: { primary: '#059669', secondary: '#10b981', accent: '#34d399' }
    };

    const colors = expressionColors[expression];

    // Create 3D-like sphere effect
    const radius = Math.min(width, height) * 0.35;
    
    // Background glow
    const glowGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radius * 1.5
    );
    glowGradient.addColorStop(0, colors.primary + '40');
    glowGradient.addColorStop(0.5, colors.secondary + '20');
    glowGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, width, height);

    // Main sphere with 3D gradient
    const sphereGradient = ctx.createRadialGradient(
      centerX - radius * 0.3, centerY - radius * 0.3, 0,
      centerX, centerY, radius
    );
    sphereGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    sphereGradient.addColorStop(0.3, colors.primary + 'cc');
    sphereGradient.addColorStop(0.7, colors.secondary + 'aa');
    sphereGradient.addColorStop(1, colors.primary + '88');

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = sphereGradient;
    ctx.fill();

    // Sphere highlight
    const highlightGradient = ctx.createRadialGradient(
      centerX - radius * 0.4, centerY - radius * 0.4, 0,
      centerX - radius * 0.4, centerY - radius * 0.4, radius * 0.6
    );
    highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    highlightGradient.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.arc(centerX - radius * 0.4, centerY - radius * 0.4, radius * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = highlightGradient;
    ctx.fill();

    // Eyes
    const eyeY = centerY - radius * 0.2 + mouseInfluenceY;
    const eyeSize = isBlinking ? 2 : 8;
    const eyeHeight = isBlinking ? 1 : 6;

    // Left eye
    const leftEyeX = centerX - radius * 0.25 + mouseInfluenceX;
    ctx.beginPath();
    ctx.ellipse(leftEyeX, eyeY, eyeSize, eyeHeight, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#1e40af';
    ctx.fill();

    // Left pupil
    if (!isBlinking) {
      ctx.beginPath();
      ctx.arc(leftEyeX + mouseInfluenceX * 0.3, eyeY + mouseInfluenceY * 0.2, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();

      // Left highlight
      ctx.beginPath();
      ctx.arc(leftEyeX + mouseInfluenceX * 0.3 + 1, eyeY + mouseInfluenceY * 0.2 - 1, 1, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fill();
    }

    // Right eye
    const rightEyeX = centerX + radius * 0.25 + mouseInfluenceX;
    ctx.beginPath();
    ctx.ellipse(rightEyeX, eyeY, eyeSize, eyeHeight, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#1e40af';
    ctx.fill();

    // Right pupil
    if (!isBlinking) {
      ctx.beginPath();
      ctx.arc(rightEyeX + mouseInfluenceX * 0.3, eyeY + mouseInfluenceY * 0.2, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();

      // Right highlight
      ctx.beginPath();
      ctx.arc(rightEyeX + mouseInfluenceX * 0.3 + 1, eyeY + mouseInfluenceY * 0.2 - 1, 1, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fill();
    }

    // Mouth
    const mouthY = centerY + radius * 0.2;
    const mouthWidth = radius * 0.3;
    const mouthCurve = isSpeaking ? 15 : expression === 'happy' ? 10 : 5;

    ctx.beginPath();
    ctx.moveTo(centerX - mouthWidth, mouthY);
    ctx.quadraticCurveTo(centerX, mouthY + mouthCurve, centerX + mouthWidth, mouthY);
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Nose
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + radius * 0.05, 2, 4, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fill();

    // Speaking/Listening effects
    if (isSpeaking || isListening) {
      const time = Date.now() * 0.005;
      const effectRadius = radius + Math.sin(time) * 10;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, effectRadius, 0, Math.PI * 2);
      ctx.strokeStyle = isSpeaking ? colors.accent + '60' : colors.secondary + '60';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Status indicator
    const statusX = centerX + radius * 0.7;
    const statusY = centerY + radius * 0.7;
    const statusColor = isSpeaking ? '#10b981' : isListening ? '#3b82f6' : '#6b7280';
    
    ctx.beginPath();
    ctx.arc(statusX, statusY, 6, 0, Math.PI * 2);
    ctx.fillStyle = statusColor;
    ctx.fill();

    // Status glow
    if (isSpeaking || isListening) {
      const statusGlow = ctx.createRadialGradient(statusX, statusY, 0, statusX, statusY, 12);
      statusGlow.addColorStop(0, statusColor + '80');
      statusGlow.addColorStop(1, 'transparent');
      
      ctx.fillStyle = statusGlow;
      ctx.fillRect(statusX - 12, statusY - 12, 24, 24);
    }
  };

  // Animation loop
  useEffect(() => {
    const animate = () => {
      render();
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition, expression, isListening, isSpeaking, isBlinking]);

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
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
  };

  // Canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-full cursor-pointer"
        onMouseMove={handleMouseMove}
        style={{
          filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.2))'
        }}
      />
    </motion.div>
  );
}
