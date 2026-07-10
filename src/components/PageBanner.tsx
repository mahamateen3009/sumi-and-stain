import React from 'react';

interface PageBannerProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

export const PageBanner: React.FC<PageBannerProps> = ({ imageUrl }) => {
  return (
    <div
      className="relative w-full flex flex-col items-center justify-center border-b border-[#F49cbb] bg-white bg-cover bg-center bg-no-repeat"
      style={{
        // Use vh (viewport height) to make it responsive
        // h-[40vh] for mobile, h-[70vh] for laptop/desktop
        height: '40vh',
      }}
    // Add a media query for larger screens via class
    // Tailwind classes override the inline style for screen sizes
    >
      <style>{`
        @media (min-width: 768px) {
          .banner-height { height: 70vh !important; }
        }
      `}</style>

      {/* Apply the class to the div */}
      <div className="banner-height w-full h-full" style={{
        backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }} />
    </div>
  );
};