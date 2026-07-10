import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Artwork } from '../lib/firestore';

export const useArtworks = (colName: string) => {
  console.log("Fetching from collection:", colName);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, colName), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Artwork));
        setArtworks(data);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching artworks:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [colName]);

  return { artworks, loading, error };
};
