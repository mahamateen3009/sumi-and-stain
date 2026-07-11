import React from 'react';

interface PageBannerProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

export const PageBanner: React.FC<PageBannerProps> = ({ imageUrl }) => {
  // Use a smaller height for mobile (e.g., 300px), and 870px for larger screens
  const height = typeof window !== 'undefined' && window.innerWidth < 768 ? '300px' : '870px';

  return (
    <div
      className="relative w-full flex flex-col items-center justify-center border-b border-[#F49cbb] "
      style={{
        height: height,
        backgroundColor: '#FFFFFF',
        backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    />
  );
};