import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Artwork } from '../lib/firestore';

interface ArtworkLightboxProps {
  artwork: Artwork | null;
  onClose: () => void;
}

export const ArtworkLightbox: React.FC<ArtworkLightboxProps> = ({ artwork, onClose }) => {
  // Use a simple state to ensure the modal stays on top
  return (
    <AnimatePresence>
      {artwork && (
        <motion.div
          key="lightbox-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // We use 'fixed' and 'top-0 left-0' to bypass body scrolling issues
          className="fixed top-0 left-0 w-full h-full z-9999 flex items-center justify-center p-0 md:p-8"
          style={{
            background: 'rgba(26,42,58,0.85)', // Darker background to hide content behind
            backdropFilter: 'none' // Disable blur to ensure speed on older iPhones
          }}
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-10000 p-2 rounded-full"
            style={{ background: '#F49CBB', color: '#FFFFFF' }}
          >
            <X size={22} />
          </button>

          <motion.div
            key="lightbox-panel"
            className="w-full h-full md:h-auto md:max-w-5xl md:max-h-[85vh] flex flex-col md:flex-row bg-white overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="w-full md:w-3/5 h-1/2 md:h-auto relative flex items-center justify-center bg-gray-100">
              <img src={artwork.imageUrl} alt={artwork.title} className="w-full h-full object-contain" />
            </div>

            {/* Info */}
            <div className="w-full md:w-2/5 p-6 overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">{artwork.title}</h2>
              <p className="text-sm whitespace-pre-wrap text-gray-700">{artwork.description}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};