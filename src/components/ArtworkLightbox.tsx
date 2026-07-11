import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Artwork } from '../lib/firestore';

interface ArtworkLightboxProps {
  artwork: Artwork | null;
  onClose: () => void;
}

export const ArtworkLightbox: React.FC<ArtworkLightboxProps> = ({ artwork, onClose }) => {
  // Use a simple state-based render check
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    // iOS fix: prevent background scroll
    if (artwork) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, [artwork]);

  if (!isClient || !artwork) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4 md:p-12"
        onClick={onClose}
      >
        <motion.div
          className="relative bg-white rounded-2xl w-full max-w-5xl h-[80vh] flex flex-col md:flex-row overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image Container: Forced 50% width on desktop, 100% on mobile */}
          <div className="w-full md:w-3/5 h-1/2 md:h-full bg-gray-100 relative">
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>

          {/* Content Container */}
          <div className="w-full md:w-2/5 h-1/2 md:h-full overflow-y-auto p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{artwork.title}</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
              {artwork.description}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};