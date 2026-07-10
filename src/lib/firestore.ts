
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, getDoc, setDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

// --- Interfaces ---

export interface Artwork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  order: number;
  createdAt: Timestamp;
}

export interface SiteConfig {
  logoUrl: string;
  formspreeEndpoint: string;
  banners: {
    anime: string;
    contact: string;
    henna: string;
    other: string;
    accessoryMaking: string;
    calligraphy: string;
    clothPainting: string;
    potPainting: string;
  };
  footer: {
    aboutText: string;
    projects: Array<{ title: string; url: string }>;
    copyright: string;
    githubLink: string;
    linkedinLink: string;
  };
}

// --- Artwork Functions (EXPORTED) ---

export const getArtworks = async (colName: string): Promise<Artwork[]> => {
  const q = query(collection(db, colName), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Artwork));
};

export const addArtwork = async (colName: string, data: Omit<Artwork, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, colName), {
    ...data,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

export const updateArtwork = async (colName: string, id: string, data: Partial<Artwork>): Promise<void> => {
  const docRef = doc(db, colName, id);
  await updateDoc(docRef, data);
};

export const deleteArtwork = async (colName: string, id: string): Promise<void> => {
  const docRef = doc(db, colName, id);
  await deleteDoc(docRef);
};

// --- Config Functions (EXPORTED) ---

export const getSiteConfig = async (): Promise<SiteConfig | null> => {
  const docRef = doc(db, 'site-config', 'main');
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return snapshot.data() as SiteConfig;
  }
  return null;
};

export const updateSiteConfig = async (data: Partial<SiteConfig>): Promise<void> => {
  const docRef = doc(db, 'site-config', 'main');

  // Clean structure to match SiteConfig interface
  const cleanData = {
    ...data,
    banners: data.banners ? { ...data.banners } : undefined,
    footer: data.footer ? {
      ...data.footer,
      projects: Array.isArray(data.footer.projects)
        ? data.footer.projects.filter(p => p.title.trim() !== '' || p.url.trim() !== '')
        : []
    } : undefined
  };

  await setDoc(docRef, cleanData, { merge: true });
};