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
    if (artwork) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
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
          className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Close Button: Fixed to the backdrop */}
          <button
            onClick={onClose}
            className="fixed top-4 right-4 z-[10000] p-2 bg-white rounded-full shadow-lg"
          >
            <X size={24} />
          </button>

          {/* Panel: The most stable version */}
          <motion.div
            key="lightbox-panel"
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col md:flex-row overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="w-full md:w-3/5 h-[300px] md:h-auto bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
              <img src={artwork.imageUrl} alt={artwork.title} className="w-full h-full object-contain" />
            </div>

            {/* Scrollable text container */}
            <div className="w-full md:w-2/5 overflow-y-auto p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-4">{artwork.title}</h2>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{artwork.description}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};