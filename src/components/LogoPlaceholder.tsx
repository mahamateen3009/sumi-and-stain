/**
 * LogoPlaceholder
 * When no logoUrl is configured: renders an empty 40px placeholder div
 * so the navbar layout is preserved until the admin uploads a real logo.
 * Upload via Admin → Site Config → Logo URL.
 */
import React from 'react';

interface LogoPlaceholderProps {
  logoUrl?: string;
  className?: string;
}

export const LogoPlaceholder: React.FC<LogoPlaceholderProps> = ({ logoUrl, className = '' }) => {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt="Site logo"
        className={`h-10 w-auto object-contain transition-transform group-hover:scale-105 ${className}`}
      />
    );
  }

  /* Empty placeholder — exact height matches a logo so layout stays stable */
  return (
    <div
      className={`select-none ${className}`}
      aria-label="Logo placeholder — upload via Admin"
      style={{ width: 40, height: 40 }}
    />
  );
};
