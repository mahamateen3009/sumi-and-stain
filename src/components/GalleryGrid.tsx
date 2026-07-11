import React, { useState } from 'react';
import { Artwork } from '../lib/firestore';
import { ArtworkCard } from './ArtworkCard';
import { ArtworkLightbox } from './ArtworkLightbox';

interface GalleryGridProps {
  artworks: Artwork[];
  emptyMessage?: string;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ artworks, emptyMessage }) => {
  const [selected, setSelected] = React.useState<Artwork | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {artworks.map((artwork) => (
          <div
            key={artwork.id}
            className="cursor-pointer"
            onClick={() => {
              // Only trigger the lightbox on desktop screens (768px+)
              if (window.innerWidth >= 768) {
                setSelected(artwork);
              }
            }}
          >
            {/* 'onClick' prop is now correctly passed */}
            <ArtworkCard artwork={artwork} onClick={setSelected} />
          </div>
        ))}
      </div>
      <ArtworkLightbox artwork={selected} onClose={() => setSelected(null)} />
    </>
  );
};