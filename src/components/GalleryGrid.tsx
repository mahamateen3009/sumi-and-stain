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
            // 'pointer-events-none' on mobile stops ALL clicks. 
            // 'md:pointer-events-auto' enables them on desktop.
            className="cursor-pointer pointer-events-none md:pointer-events-auto"
            onClick={() => setSelected(artwork)}
          >
            <ArtworkCard artwork={artwork} onClick={setSelected} />
          </div>
        ))}
      </div>
      <ArtworkLightbox artwork={selected} onClose={() => setSelected(null)} />
    </>
  );
};