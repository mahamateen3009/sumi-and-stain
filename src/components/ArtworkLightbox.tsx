import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Artwork } from '../lib/firestore';

interface ArtworkLightboxProps {
  artwork: Artwork | null;
  onClose: () => void;
}

export const ArtworkLightbox: React.FC<ArtworkLightboxProps> = ({ artwork, onClose }) => {
  // Use CSS media query to determine behavior
  const [isDesktop, setIsDesktop] = React.useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);

  React.useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // If NOT desktop, render nothing. This prevents the "scattered" iOS view.
  if (!isDesktop) return null;

  return (
    <AnimatePresence>
      {artwork && (
        <motion.div
          key="lightbox-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-12"
          onClick={onClose}
        >
          {/* Main Container - Keeps the desktop layout you like */}
          <motion.div
            key="lightbox-panel"
            className="bg-white rounded-2xl w-full max-w-5xl h-[80vh] flex flex-row overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Side */}
            <div className="w-3/5 bg-gray-100 flex items-center justify-center">
              <img src={artwork.imageUrl} alt={artwork.title} className="max-h-full object-contain" />
            </div>

            {/* Content Side */}
            <div className="w-2/5 overflow-y-auto p-10">
              <h2 className="text-3xl font-bold mb-6">{artwork.title}</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{artwork.description}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};