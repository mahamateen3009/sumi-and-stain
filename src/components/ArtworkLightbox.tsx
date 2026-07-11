import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Artwork } from '../lib/firestore';

interface ArtworkLightboxProps {
  artwork: Artwork | null;
  onClose: () => void;
}

export const ArtworkLightbox: React.FC<ArtworkLightboxProps> = ({ artwork, onClose }) => {
  React.useEffect(() => {
    if (artwork) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [artwork]);

  return (
    <AnimatePresence>
      {artwork && (
        <motion.div
          key="lightbox-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // Added 'overscroll-behavior-contain' to prevent Safari bounce/scroll leak
          className="fixed inset-0 z-100 flex items-center justify-center overscroll-contain"
          style={{ background: 'rgba(26,42,58,0.9)' }}
          onClick={onClose}
        >
          {/* Close button - Fixed position inside the fixed backdrop */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-101 p-2 bg-[#F49CBB] rounded-full text-white shadow-lg"
          >
            <X size={24} />
          </button>

          {/* Panel - Added 'touch-action-none' for iOS stability */}
          <motion.div
            key="lightbox-panel"
            className="w-full h-full md:h-auto md:max-w-5xl md:max-h-[90vh] bg-white flex flex-col md:flex-row overflow-hidden md:rounded-2xl shadow-2xl touch-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="w-full md:w-3/5 h-1/2 md:h-auto relative flex items-center justify-center bg-gray-50 shrink-0">
              <img src={artwork.imageUrl} alt={artwork.title} className="w-full h-full object-contain" />
            </div>

            {/* Info */}
            <div className="w-full md:w-2/5 p-6 flex flex-col overflow-y-auto">
              <h2 className="font-serif text-2xl font-bold mb-4">{artwork.title}</h2>
              {/* ... rest of your code ... */}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};