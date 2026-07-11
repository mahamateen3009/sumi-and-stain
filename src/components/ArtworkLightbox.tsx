import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Artwork } from '../lib/firestore';

interface ArtworkLightboxProps {
  artwork: Artwork | null;
  onClose: () => void;
}

export const ArtworkLightbox: React.FC<ArtworkLightboxProps> = ({ artwork, onClose }) => {
  // 1. We keep the body scroll lock for stability
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, [artwork]);

  return (
    <AnimatePresence>
      {artwork && (
        <motion.div
          key="lightbox-backdrop"
          // Removed 'flex items-center justify-center' from here to prevent layout locking
          // We use absolute/fixed positioning to allow the modal to manage its own space
          className="fixed inset-0 z-9999 bg-slate-900/90 p-4 md:flex md:items-center md:justify-center"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="fixed top-4 right-4 z-10000 p-2 bg-[#F49CBB] rounded-full text-white"
          >
            <X size={24} />
          </button>

          {/* This panel now manages its own internal overflow */}
          <motion.div
            key="lightbox-panel"
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row mt-12 md:mt-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image section */}
            <div className="w-full md:w-3/5 h-300px md:h-auto bg-gray-100 shrink-0">
              <img src={artwork.imageUrl} alt={artwork.title} className="h-full w-full object-contain" />
            </div>

            {/* Info section: Ensure this has the scroll capability */}
            <div
              className="flex-1 overflow-y-auto p-6 md:p-8"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <h2 className="text-2xl font-bold mb-4">{artwork.title}</h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{artwork.description}</p>
              <div className="h-20" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};