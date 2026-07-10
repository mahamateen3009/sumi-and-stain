import React, { useState } from 'react';
import { Artwork } from '../lib/firestore';
import { ArtworkCard } from './ArtworkCard';
import { ArtworkLightbox } from './ArtworkLightbox';

interface GalleryGridProps {
  artworks: Artwork[];
  emptyMessage?: string;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({
  artworks,
  emptyMessage = 'No artworks yet. Check back soon!',
}) => {
  const [selected, setSelected] = useState<Artwork | null>(null);

  if (artworks.length === 0) {
    return (
      <div className="py-20 flex justify-center">
        <div
          className="p-12 rounded-2xl max-w-md w-full text-center"
          style={{
            background: 'rgba(228,191,184,0.6)',
            border: '1px solid rgba(177,188,172,0.45)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <p className="font-serif text-lg" style={{ color: 'rgba(135,149,133,0.7)' }}>
            {emptyMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} onClick={setSelected} />
        ))}
      </div>
      <ArtworkLightbox artwork={selected} onClose={() => setSelected(null)} />
    </>
  );
};
