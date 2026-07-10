import React from 'react';
import { useArtworks } from '../hooks/useArtworks';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { PageBanner } from '../components/PageBanner';
import { GalleryGrid } from '../components/GalleryGrid';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { motion } from 'framer-motion';

export default function AnimePage() {
  const { artworks, loading: artworksLoading } = useArtworks('anime-artworks');
  const { config, loading: configLoading } = useSiteConfig();

  if (artworksLoading || configLoading) {
    return <LoadingSpinner />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pb-20"
    >
      {/* Banner Section */}
      <PageBanner
        title="Anime Illustrations"
        subtitle="Vibrant characters brought to life."
        imageUrl={config.banners.anime}
      />

      {/* Gallery Section
         'pt-16' adds breathing room (padding) between the banner and the grid.
      */}
      <div className="container mx-auto px-4 md:px-8 pt-16">
        <GalleryGrid artworks={artworks} />
      </div>
    </motion.div>
  );
}