import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Artwork } from '../lib/firestore';

interface ArtworkLightboxProps {
  artwork: Artwork | null;
  onClose: () => void;
}

export const ArtworkLightbox: React.FC<ArtworkLightboxProps> = ({ artwork, onClose }) => {
  // Check if we are on a mobile device (width < 768px)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // If mobile, we don't render the lightbox at all, or we handle it via navigation
  // For now, this simply returns null on mobile to avoid the "broken" overlay
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
          {/* Desktop Lightbox content only */}
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