/**
 * DemoGallery
 * Shows hardcoded dummy artwork cards when no real artworks exist in Firestore yet.
 * Demonstrates: 3D tilt (Framer Motion), cornflower-blue glass cards, and the new palette.
 * Replace or hide once real artworks are uploaded via the Admin dashboard.
 */
import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

const DEMO_ARTWORKS = [
  {
    id: 'd1',
    title: 'Bridal Henna',
    description: 'Intricate paisley patterns inspired by Mughal miniature art — layered, flowing, and bold.',
    tags: ['Bridal', 'Traditional', 'Paisley'],
    imageUrl: 'https://images.unsplash.com/photo-1583265627959-fb7042f5d9f?w=600&q=80',
  },
  {
    id: 'd2',
    title: 'Botanical Lattice',
    description: 'Fine-line botanical motifs woven into a symmetrical lattice — perfect for sleeves.',
    tags: ['Botanical', 'Fine Line', 'Sleeve'],
    imageUrl: 'https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?w=600&q=80',
  },
  {
    id: 'd3',
    title: 'Geometric Flow',
    description: 'Modern geometric forms softened with organic curves — where structure meets freedom.',
    tags: ['Geometric', 'Modern', 'Abstract'],
    imageUrl: 'https://images.unsplash.com/photo-1614555183067-5e29c1c3d78a?w=600&q=80',
  },
  {
    id: 'd4',
    title: 'Floral Mandala',
    description: 'A mandala built outward from a single rose — every petal a deliberate brushstroke.',
    tags: ['Mandala', 'Floral', 'Intricate'],
    imageUrl: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=600&q=80',
  },
];

/* ── Individual tilt card ─────────────────────────────────────────── */
const DemoCard = ({
  artwork,
  onOpen,
  index,
}: {
  artwork: (typeof DEMO_ARTWORKS)[number];
  onOpen: (a: (typeof DEMO_ARTWORKS)[number]) => void;
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 900 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={{ y: -7 }}
      onClick={() => onOpen(artwork)}
      className="glass-card rounded-xl overflow-hidden cursor-pointer group flex flex-col h-full"
    >
      <div className="relative w-full pt-[100%] overflow-hidden" style={{ background: 'rgba(175, 210, 233, 0.45)' }}>
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        {/* Demo badge */}
        <div
          className="absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-medium"
          style={{ background: 'rgba(227,99,151,0.75)', color: '#fff', backdropFilter: 'blur(8px)' }}
        >
          Preview
        </div>
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(to top, rgba(26,42,58,0.45) 0%, rgba(26,42,58,0.08) 60%, transparent 100%)',
          }}
        />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-serif text-lg font-semibold mb-2 line-clamp-1" style={{ color: '#1A2A3A' }}>
          {artwork.title}
        </h3>
        <p className="text-sm line-clamp-2 mb-4 flex-grow" style={{ color: 'rgba(26, 42, 58, 0.68)' }}>
          {artwork.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {artwork.tags.map((tag, i) => (
            <span key={i} className="glass-tag text-xs px-2.5 py-1 rounded-full">{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

/* ── Lightbox ─────────────────────────────────────────────────────── */
const DemoLightbox = ({
  artwork,
  onClose,
}: {
  artwork: (typeof DEMO_ARTWORKS)[number] | null;
  onClose: () => void;
}) => (
  <AnimatePresence>
    {artwork && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
        style={{ background: 'rgba(26,42,58,0.45)', backdropFilter: 'blur(20px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, y: 16 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, y: 16 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="glass-panel rounded-2xl overflow-hidden max-w-3xl w-full flex flex-col md:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full md:w-1/2 h-64 md:h-auto">
            <img src={artwork.imageUrl} alt={artwork.title} className="w-full h-full object-cover" />
          </div>
          <div className="p-8 flex flex-col md:w-1/2">
            <h2 className="font-serif text-2xl font-bold mb-3 text-glow" style={{ color: '#1A2A3A' }}>
              {artwork.title}
            </h2>
            <div className="flex flex-wrap gap-2 mb-5">
              {artwork.tags.map((t, i) => (
                <span key={i} className="glass-tag text-xs px-3 py-1 rounded-full">{t}</span>
              ))}
            </div>
            <p className="text-sm leading-relaxed flex-grow" style={{ color: 'rgba(26, 42, 58, 0.72)' }}>
              {artwork.description}
            </p>
            <button
              onClick={onClose}
              className="mt-6 self-start text-sm btn-primary px-5 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ── Export ───────────────────────────────────────────────────────── */
export const DemoGallery: React.FC = () => {
  const [selected, setSelected] = useState<(typeof DEMO_ARTWORKS)[number] | null>(null);

  return (
    <>
      {/* Explanatory notice */}
      <div
        className="mb-8 px-5 py-3 rounded-xl text-sm text-center"
        style={{
          background: 'rgba(175, 210, 233, 0.30)',
          border: '1px dashed rgba(227, 99, 151, 0.45)',
          color: 'rgba(26, 42, 58, 0.72)',
        }}
      >
        These are preview cards. Add your artworks in the{' '}
        <a href="/admin" className="underline underline-offset-2" style={{ color: '#E36397' }}>
          Admin Dashboard
        </a>{' '}
        and they will replace this section automatically.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {DEMO_ARTWORKS.map((a, i) => (
          <DemoCard key={a.id} artwork={a} onOpen={setSelected} index={i} />
        ))}
      </div>

      <DemoLightbox artwork={selected} onClose={() => setSelected(null)} />
    </>
  );
};
