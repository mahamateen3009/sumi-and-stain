import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Artwork } from '../lib/firestore';

interface ArtworkLightboxProps {
  artwork: Artwork | null;
  onClose: () => void;
}

export const ArtworkLightbox: React.FC<ArtworkLightboxProps> = ({ artwork, onClose }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // CIRCUIT BREAKER: If it's a mobile device, or no artwork is selected, don't render anything.
  if (isMobile || !artwork) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-12"
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl w-full max-w-5xl h-[80vh] flex overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image Side: Forced to stay within the 3/5 width */}
          <div className="w-3/5 bg-gray-50 flex items-center justify-center overflow-hidden">
            <img src={artwork.imageUrl} alt={artwork.title} className="max-h-full w-full object-contain" />
          </div>

          {/* Content Side: Scrollable text */}
          <div className="w-2/5 overflow-y-auto p-10">
            <h2 className="text-3xl font-bold mb-6">{artwork.title}</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{artwork.description}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};