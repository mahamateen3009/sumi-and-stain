import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Artwork } from '../lib/firestore';

interface ArtworkCardProps {
  artwork: Artwork;
  onClick: (artwork: Artwork) => void;
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -6 }}
      className="rounded-xl overflow-hidden cursor-pointer group flex flex-col h-full"
      // Everything is now inside ONE style object to prevent the JSX error
      style={{
        backgroundColor: '#D0C39F',
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 900
      }}
      onClick={() => onClick(artwork)}
    >
      {/* Image */}
      <div
        className="relative w-full pt-[100%] overflow-hidden"
        style={{ background: 'rgba(255, 255, 255, 0.2)' }}
      >
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(to top, rgba(26,42,58,0.38) 0%, rgba(26,42,58,0.06) 60%, transparent 100%)',
          }}
        />
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-grow">
        <h3
          className="font-serif text-lg font-bold mb-2 line-clamp-1"
          style={{ color: '#1A2A3A' }}
        >
          {artwork.title}
        </h3>
        <p
          className="text-sm line-clamp-2 mb-4 flex-grow"
          style={{ color: 'rgba(26, 42, 58, 0.8)' }}
        >
          {artwork.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {artwork.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="glass-tag text-xs px-2.5 py-1 rounded-full bg-white/30">{tag}</span>
          ))}
          {artwork.tags.length > 3 && (
            <span className="glass-tag text-xs px-2.5 py-1 rounded-full bg-white/30 opacity-70">
              +{artwork.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};