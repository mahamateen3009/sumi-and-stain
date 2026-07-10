import React from 'react';
import { useArtworks } from '../hooks/useArtworks';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { PageBanner } from '../components/PageBanner';
import { GalleryGrid } from '../components/GalleryGrid';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { motion } from 'framer-motion';

export default function HennaPage() {
  const { artworks, loading: artworksLoading } = useArtworks('henna-artworks');
  const { config, loading: configLoading } = useSiteConfig();

  if (artworksLoading || configLoading) return <LoadingSpinner />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#E0DCBE]"
    >
      <PageBanner
        title="Henna Art"
        subtitle="Traditional patterns woven with modern elegance."
        imageUrl={config?.banners?.henna}
      />

      <div className="container mx-auto px-4 md:px-8 mt-10 pb-20">
        {artworks.length > 0 ? (
          <GalleryGrid artworks={artworks} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-slate-400 font-medium">No artworks found yet.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}