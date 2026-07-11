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
          className="fixed inset-0 z-9999 bg-slate-900/95"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10000 p-2 bg-[#F49CBB] rounded-full text-white"
          >
            <X size={24} />
          </button>

          {/* Absolute centered panel instead of flex */}
          <motion.div
            key="lightbox-panel"
            className="absolute top-[5%] left-[5%] w-[90%] h-[90%] bg-white rounded-2xl overflow-hidden shadow-2xl md:top-[10%] md:left-[15%] md:w-[70%] md:h-[80%]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image section as absolute block */}
            <div className="absolute top-0 left-0 w-full h-[50%] bg-gray-100 flex items-center justify-center">
              <img src={artwork.imageUrl} alt={artwork.title} className="w-full h-full object-contain" />
            </div>

            {/* Info section as absolute block */}
            <div className="absolute bottom-0 left-0 w-full h-[50%] p-6 overflow-y-auto">
              <h2 className="text-2xl font-bold mb-2">{artwork.title}</h2>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{artwork.description}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};