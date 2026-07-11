import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Artwork } from '../lib/firestore';

interface ArtworkLightboxProps {
  artwork: Artwork | null;
  onClose: () => void;
}

export const ArtworkLightbox: React.FC<ArtworkLightboxProps> = ({ artwork, onClose }) => {
  // Use CSS media query via matchMedia for better performance
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // If mobile, don't even render the logic
  if (isMobile) return null;

  return (
    <AnimatePresence>
      {artwork && (
        <motion.div
          key="lightbox-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-8"
          onClick={onClose}
        >
          {/* Desktop Lightbox content */}
          <motion.div
            key="lightbox-panel"
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-row overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-3/5 bg-gray-50 flex items-center justify-center shrink-0">
              <img src={artwork.imageUrl} alt={artwork.title} className="max-h-[80vh] object-contain" />
            </div>
            <div className="w-2/5 overflow-y-auto p-8">
              <h2 className="text-2xl font-bold mb-4">{artwork.title}</h2>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{artwork.description}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};