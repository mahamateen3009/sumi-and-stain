import React from 'react';

interface PageBannerProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

export const PageBanner: React.FC<PageBannerProps> = ({ imageUrl }) => {
  return (
    <div
      className="relative w-full flex flex-col items-center justify-center border-b border-[#F49cbb]"
      style={{
        height: '800px',
        backgroundColor: '#FFFFFF', // Solid white base
        backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    />
  );
};