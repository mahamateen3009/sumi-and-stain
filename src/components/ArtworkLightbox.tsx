import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Artwork } from '../lib/firestore';

interface ArtworkLightboxProps {
  artwork: Artwork | null;
  onClose: () => void;
}

export const ArtworkLightbox: React.FC<ArtworkLightboxProps> = ({ artwork, onClose }) => {
  // Lock body scroll when lightbox is open
  React.useEffect(() => {
    if (artwork) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [artwork]);

  return (
    <AnimatePresence>
      {artwork && (
        <motion.div
          key="lightbox-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-8"
          style={{ background: 'rgba(26,42,58,0.48)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full transition-opacity hover:opacity-70"
            style={{ background: 'rgba(244, 156, 187, 0.85)', border: '1px solid rgba(255,255,255,0.35)', color: '#FFFFFF' }}
          >
            <X size={22} />
          </button>

          <motion.div
            key="lightbox-panel"
            initial={{ scale: 0.92, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="glass-panel rounded-2xl overflow-hidden w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="w-full md:w-3/5 h-[50vh] md:h-auto relative flex items-center justify-center" style={{ background: 'rgba(175, 210, 233, 0.45)' }}>
              <img src={artwork.imageUrl} alt={artwork.title} className="w-full h-full object-contain" />
            </div>

            {/* Info */}
            <div className="w-full md:w-2/5 p-7 md:p-10 flex flex-col overflow-y-auto" style={{ borderLeft: '1px solid rgba(175, 210, 233, 0.45)' }}>
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4 text-glow" style={{ color: '#1A2A3A' }}>{artwork.title}</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {artwork.tags.map((tag, i) => (<span key={i} className="glass-tag px-3 py-1 text-xs font-medium rounded-full">{tag}</span>))}
              </div>
              <p className="text-sm leading-relaxed grow whitespace-pre-wrap" style={{ color: 'rgba(26, 42, 58, 0.72)' }}>{artwork.description}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};