import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Artwork } from '../lib/firestore';

interface ArtworkLightboxProps {
  artwork: Artwork | null;
  onClose: () => void;
}

export const ArtworkLightbox: React.FC<ArtworkLightboxProps> = ({ artwork, onClose }) => {
  // Enhanced scroll lock for iOS
  React.useEffect(() => {
    if (artwork) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
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
          // Added 'h-full' to ensure the backdrop takes full viewport height
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 h-full"
          style={{
            background: 'rgba(26,42,58,0.48)',
            // Disable backdrop filter on small screens for older iOS stability
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
          onClick={onClose}
        >
          {/* Close button - Ensure it's outside the scrolling panel */}
          <button
            onClick={onClose}
            className="fixed top-5 right-5 z-[101] p-2 rounded-full transition-opacity hover:opacity-70"
            style={{ background: 'rgba(244, 156, 187, 0.85)', border: '1px solid rgba(255,255,255,0.35)', color: '#FFFFFF' }}
          >
            <X size={22} />
          </button>

          {/* Panel */}
          <motion.div
            key="lightbox-panel"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="glass-panel rounded-2xl overflow-hidden w-full max-w-5xl max-h-[85vh] flex flex-col md:flex-row shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ... rest of your code remains same ... */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};