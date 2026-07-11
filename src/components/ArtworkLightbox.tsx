import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Artwork } from '../lib/firestore';

interface ArtworkLightboxProps {
  artwork: Artwork | null;
  onClose: () => void;
}

export const ArtworkLightbox: React.FC<ArtworkLightboxProps> = ({ artwork, onClose }) => {
  // 1. Lock the scroll on the actual window, not just the body
  useEffect(() => {
    if (artwork) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [artwork]);

  return (
    <AnimatePresence>
      {artwork && (
        <motion.div
          key="lightbox-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // Fixed, full-screen overlay that ignores page flow
          className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-900/90 p-0"
          onClick={onClose}
        >
          {/* Close button - Always visible */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10000 p-2 bg-[#F49CBB] rounded-full text-white shadow-lg"
          >
            <X size={24} />
          </button>

          {/* Panel: 
            - w-screen h-screen (Mobile full screen takeover)
            - md:w-auto md:h-auto (Desktop natural sizing)
          */}
          <motion.div
            key="lightbox-panel"
            className="w-screen h-screen md:w-[90vw] md:h-[85vh] md:max-w-5xl bg-white flex flex-col md:flex-row overflow-hidden md:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Section - Force shrink-0 to prevent compression */}
            <div className="w-full md:w-3/5 h-1/2 md:h-full relative flex items-center justify-center bg-gray-100 shrink-0">
              <img src={artwork.imageUrl} alt={artwork.title} className="max-h-full w-full object-contain" />
            </div>

            {/* Info Section - Enable internal scrolling */}
            <div className="w-full md:w-2/5 p-8 flex flex-col overflow-y-auto">
              <h2 className="font-serif text-3xl font-bold mb-4">{artwork.title}</h2>
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