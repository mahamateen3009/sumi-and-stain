import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Artwork } from '../lib/firestore';

interface ArtworkLightboxProps {
  artwork: Artwork | null;
  onClose: () => void;
}

export const ArtworkLightbox: React.FC<ArtworkLightboxProps> = ({ artwork, onClose }) => {
  // Simple lock
  useEffect(() => {
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
          // Changed to absolute to stop Safari from "locking" the whole viewport
          className="absolute top-0 left-0 w-full min-h-screen z-9999 bg-slate-900/90 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="fixed top-4 right-4 z-10000 p-2 bg-[#F49CBB] rounded-full text-white"
          >
            <X size={24} />
          </button>

          {/* Panel: Added 'fixed' and 'inset-0' to force its own scroll context */}
          <motion.div
            key="lightbox-panel"
            className="relative bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image: Fixed height, no growth */}
            <div className="w-full md:w-3/5 h-300px md:h-auto bg-gray-100 flex items-center justify-center shrink-0">
              <img src={artwork.imageUrl} alt={artwork.title} className="h-full w-full object-contain" />
            </div>

            {/* Scrollable Info: Added 'relative' to force scroll context */}
            <div className="w-full md:w-2/5 overflow-y-auto p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-4">{artwork.title}</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {artwork.tags.map((tag, i) => (
                  <span key={i} className="bg-gray-100 px-3 py-1 text-xs font-medium rounded-full">{tag}</span>
                ))}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{artwork.description}</p>
              {/* Spacer so the last text isn't cut off */}
              <div className="h-20" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};