import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Artwork } from '../lib/firestore';

interface ArtworkLightboxProps {
  artwork: Artwork | null;
  onClose: () => void;
}

export const ArtworkLightbox: React.FC<ArtworkLightboxProps> = ({ artwork, onClose }) => {
  useEffect(() => {
    // Forcing the body to be completely frozen
    if (artwork) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
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
          // Added 'touch-none' and 'overscroll-none' to kill Safari's scroll propagation
          className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-900/95 touch-none overscroll-none"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10000 p-2 bg-[#F49CBB] rounded-full text-white"
          >
            <X size={24} />
          </button>

          <motion.div
            key="lightbox-panel"
            className="w-full h-full md:w-[80vw] md:h-[80vh] bg-white flex flex-col md:flex-row overflow-hidden md:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ touchAction: 'none' }}
          >
            {/* Image section */}
            <div className="w-full h-[40vh] md:h-full md:w-3/5 bg-gray-100 flex items-center justify-center shrink-0">
              <img src={artwork.imageUrl} alt={artwork.title} className="w-full h-full object-contain" />
            </div>

            {/* Content section */}
            <div className="w-full flex-1 overflow-y-auto p-6">
              <h2 className="text-2xl font-bold mb-4">{artwork.title}</h2>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{artwork.description}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};