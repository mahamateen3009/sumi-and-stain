import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Artwork } from '../lib/firestore';

interface ArtworkLightboxProps {
  artwork: Artwork | null;
  onClose: () => void;
}

export const ArtworkLightbox: React.FC<ArtworkLightboxProps> = ({ artwork, onClose }) => {
  // Simplest, most compatible scroll lock
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
          // z-100 and fixed inset-0 pins it to the screen regardless of scroll
          className="fixed inset-0 z-100 flex items-center justify-center"
          style={{ background: 'rgba(26,42,58,0.8)' }}
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-101 p-2 bg-[#F49CBB] rounded-full text-white shadow-lg"
          >
            <X size={24} />
          </button>

          {/* Panel */}
          <motion.div
            key="lightbox-panel"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="w-full h-full md:h-auto md:max-w-5xl md:max-h-[90vh] bg-white flex flex-col md:flex-row overflow-hidden md:rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image container */}
            <div className="w-full md:w-3/5 h-1/2 md:h-auto relative flex items-center justify-center bg-gray-50">
              <img src={artwork.imageUrl} alt={artwork.title} className="w-full h-full object-contain" />
            </div>

            {/* Info container */}
            <div className="w-full md:w-2/5 p-6 flex flex-col overflow-y-auto">
              <h2 className="font-serif text-2xl font-bold mb-4">{artwork.title}</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {artwork.tags.map((tag, i) => (
                  <span key={i} className="bg-gray-100 px-3 py-1 text-xs font-medium rounded-full">{tag}</span>
                ))}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{artwork.description}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};