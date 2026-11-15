import React from 'react';

export default function AfricanMotif({ className = '', color = '#D4A84B', horizontal = false }) {
  if (horizontal) {
    return (
      <svg aria-hidden="true" viewBox="0 0 320 52" preserveAspectRatio="none" className={className} fill="none">
        {Array.from({ length: 8 }, (_, index) => (
          <g key={index} transform={`translate(${index * 40} 0)`} stroke={color} strokeWidth="2">
            <path d="M20 3 L36 26 L20 49 L4 26 Z" />
            <path d="M20 12 L29 26 L20 40 L11 26 Z" />
            <path d="M4 26 H0 M36 26 H40 M20 3 V0 M20 49 V52" />
          </g>
        ))}
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 80 240" preserveAspectRatio="none" className={className} fill="none">
      {Array.from({ length: 6 }, (_, index) => (
        <g key={index} transform={`translate(0 ${index * 40})`} stroke={color} strokeWidth="2">
          <path d="M40 2 L61 20 L40 38 L19 20 Z" />
          <path d="M40 10 L51 20 L40 30 L29 20 Z" />
          <path d="M19 20 H7 M61 20 H73 M40 2 V0 M40 38 V40" />
        </g>
      ))}
    </svg>
  );
}