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
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, [artwork]);

  return (
    <AnimatePresence>
      {artwork && (
        <motion.div
          key="lightbox-backdrop"
          className="fixed inset-0 z-9999 bg-slate-900/90 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10000 p-2 bg-[#F49CBB] rounded-full text-white"
          >
            <X size={24} />
          </button>

          {/* This panel now dynamically grows based on screen size */}
          <motion.div
            key="lightbox-panel"
            className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image section: Set to grow, but min-h-64 so it doesn't vanish */}
            <div className="w-full md:w-3/5 min-h-300px bg-gray-100 flex items-center justify-center shrink-0">
              <img src={artwork.imageUrl} alt={artwork.title} className="max-h-[50vh] md:max-h-[80vh] w-full object-contain" />
            </div>

            {/* Info section: This part will scroll if the content is long */}
            <div className="w-full md:w-2/5 overflow-y-auto p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-4">{artwork.title}</h2>
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