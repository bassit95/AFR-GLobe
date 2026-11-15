// src/components/ui/ImageWithFallback.jsx
import React, { useState, useEffect } from 'react';
import { resolveImageUrl } from '../../utils/image';

export default function ImageWithFallback({
  src,
  alt = '',
  className = '',
  nameForFallback = 'Africa Global',
  ...props
}) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  // Toute la logique URL vit désormais dans utils/image.js
  const fullSrc = resolveImageUrl(src);

  
  const getInitials = (name) => {
    if (!name) return 'AG';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Placeholder initiales si pas d'image ou erreur de chargement
  if (!fullSrc || hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-[#EFE8DC] text-[#B85C38] font-serif font-semibold select-none ${className}`}
        aria-label={alt}
      >
        <span className="text-sm tracking-widest">{getInitials(nameForFallback)}</span>
      </div>
    );
  }

  return (
    <img
      src={fullSrc}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      loading="lazy"
      {...props}
    />
  );
}