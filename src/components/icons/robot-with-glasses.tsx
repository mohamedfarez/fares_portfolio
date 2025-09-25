import React from 'react';

interface RobotWithGlassesProps {
  className?: string;
}

export function RobotWithGlasses({ className = "w-5 h-5" }: RobotWithGlassesProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Robot head */}
      <rect x="6" y="6" width="12" height="10" rx="2" />
      
      {/* Robot eyes */}
      <circle cx="9" cy="10" r="1" />
      <circle cx="15" cy="10" r="1" />
      
      {/* Glasses frame */}
      <circle cx="9" cy="10" r="2" fill="none" strokeWidth="1.5" />
      <circle cx="15" cy="10" r="2" fill="none" strokeWidth="1.5" />
      <line x1="11" y1="10" x2="13" y2="10" strokeWidth="1.5" />
      
      {/* Robot mouth */}
      <path d="M11 13h2" />
      
      {/* Robot antennas */}
      <line x1="9" y1="6" x2="9" y2="4" />
      <line x1="15" y1="6" x2="15" y2="4" />
      <circle cx="9" cy="4" r="0.5" fill="currentColor" />
      <circle cx="15" cy="4" r="0.5" fill="currentColor" />
      
      {/* Robot body connection */}
      <line x1="12" y1="16" x2="12" y2="18" />
      
      {/* Robot body */}
      <rect x="8" y="18" width="8" height="4" rx="1" />
    </svg>
  );
}
