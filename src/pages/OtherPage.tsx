import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useArtworks } from '../hooks/useArtworks';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { PageBanner } from '../components/PageBanner';
import { GalleryGrid } from '../components/GalleryGrid';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

const TABS = [
  { id: 'cloth-painting', label: 'Cloth Painting', collection: 'cloth-painting-artworks', configKey: 'clothPainting' },
  { id: 'accessory-making', label: 'Accessory Making', collection: 'accessory-making-artworks', configKey: 'accessoryMaking' },
  { id: 'calligraphy', label: 'Calligraphy', collection: 'calligraphy-artworks', configKey: 'calligraphy' },
  { id: 'pot-painting', label: 'Pot Painting', collection: 'pot-painting-artworks', configKey: 'potPainting' },
];

const TabContent: React.FC<{ collection: string }> = ({ collection }) => {
  const { artworks, loading } = useArtworks(collection);
  if (loading) return <div className="py-20"><LoadingSpinner /></div>;

  return artworks.length > 0 ? (
    <GalleryGrid artworks={artworks} />
  ) : (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-slate-400 font-medium">No artworks found in this category yet.</p>
    </div>
  );
};

export default function OtherPage() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const { config, loading: configLoading } = useSiteConfig();
  const [location] = useLocation();

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && TABS.some((t) => t.id === hash)) setActiveTab(hash);
  }, [location]);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    window.history.replaceState(null, '', `#${id}`);
  };

  if (configLoading) return <LoadingSpinner />;

  const currentTab = TABS.find((t) => t.id === activeTab) || TABS[0];
  const bannerImageUrl = config?.banners?.[currentTab.configKey as keyof typeof config.banners];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen pb-20">

      {/* Consistent Banner */}
      <PageBanner
        title="Other Works"
        subtitle="Exploring diverse artistic mediums."
        imageUrl={bannerImageUrl}
      />

      <div className="container mx-auto px-4 md:px-8 mt-12">
        {/* Tab bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className="relative px-5 py-2.5 rounded-full text-sm font-medium transition-all"
                style={
                  isActive
                    ? { background: '#AF8A69', color: '#fff' } // Active color set to your request
                    : { background: 'rgba(175, 138, 105, 0.2)', color: '#AF8A69' } // Inactive is transparent version of your color
                }
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
          >
            <TabContent collection={currentTab.collection} />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}