import React from 'react';

export default function LogoIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg 
      viewBox="55 20 150 95" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        <linearGradient id="logo-gradient-spec" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#051b42" />
          <stop offset="50%" stopColor="#1d518d" />
          <stop offset="100%" stopColor="#4f9bc2" />
        </linearGradient>
      </defs>
      
      {/* Back Wing (Upper) */}
      <path 
        d="M 62,110 C 75,90 90,70 105,52 C 118,36 138,28 162,28 C 182,28 198,28 198,28 C 198,28 203,28 200,36 C 195,44 180,50 155,50 C 138,50 128,58 120,68 C 112,78 102,92 90,110 Z" 
        fill="url(#logo-gradient-spec)"
      />
      
      {/* Front Wing (Lower) */}
      <path 
        d="M 94,110 C 104,94 114,80 124,68 C 132,58 142,54 159,54 C 169,54 178,54 178,54 C 178,54 182,54 180,61 C 176,67 162,72 146,72 C 132,72 124,88 120,110 Z" 
        fill="url(#logo-gradient-spec)"
      />
    </svg>
  );
}

