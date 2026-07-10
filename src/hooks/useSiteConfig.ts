import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SiteConfig } from '../lib/firestore';

const DEFAULT_CONFIG: SiteConfig = {
  logoUrl: '',
  banners: {
    henna: '',
    anime: '',
    clothPainting: '',
    accessoryMaking: '',
    calligraphy: '',
    potPainting: '',
  },
  footer: {
    aboutText: "A 22-year-old self-taught artist blending traditional hand-crafted designs with modern technology. Every piece is made with intention, patience, and a love for cultural artistry.",
    extensionLink: "#",
    linkedinLink: "#",
    githubLink: "#",
    copyright: "© 2025 Maha's Art. All rights reserved.",
  },
  formspreeEndpoint: import.meta.env.VITE_FORMSPREE_ENDPOINT || '',
};

export const useSiteConfig = () => {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'site-config', 'main');
    const unsubscribe = onSnapshot(docRef, 
      (snapshot) => {
        if (snapshot.exists()) {
          setConfig({ ...DEFAULT_CONFIG, ...(snapshot.data() as SiteConfig) });
        } else {
          setConfig(DEFAULT_CONFIG);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching site config:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { config, loading };
};
