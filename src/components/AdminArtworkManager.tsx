import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Artwork, addArtwork, updateArtwork, deleteArtwork } from '../lib/firestore';
import { useArtworks } from '../hooks/useArtworks';
import { Plus, X, Upload } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
import axios from 'axios';

const artworkSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  description: z.string().trim(),
  imageUrl: z.string().url('Must be a valid URL').trim().or(z.literal('')),
  tags: z.string().trim(),
  order: z.coerce.number().int().default(0),
});

type ArtworkFormData = z.infer<typeof artworkSchema>;

interface AdminArtworkManagerProps {
  collectionName: string;
  title: string;
}

async function uploadArtworkImage(
  file: File,
  collectionName: string,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'artportfolio');
  formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    formData,
    {
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(pct);
        }
      },
    }
  );
  return response.data.secure_url;
}
export const AdminArtworkManager: React.FC<AdminArtworkManagerProps> = ({ collectionName, title }) => {
  const { artworks, loading } = useArtworks(collectionName);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<ArtworkFormData>({
    resolver: zodResolver(artworkSchema),
    defaultValues: { order: 0, tags: '', imageUrl: '', description: '' },
  });

  const openAddModal = () => {
    setEditingId(null);
    reset({ title: '', description: '', imageUrl: '', tags: '', order: 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (artwork: Artwork) => {
    setEditingId(artwork.id);
    reset({
      title: artwork.title,
      description: artwork.description,
      imageUrl: artwork.imageUrl,
      tags: artwork.tags.join(', '),
      order: artwork.order,
    });
    setIsModalOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploadProgress(0);
    try {
      const url = await uploadArtworkImage(file, collectionName, setUploadProgress);
      setValue('imageUrl', url, { shouldValidate: true });
      setUploadProgress(null);
    } catch (err: any) {
      setUploadError('Upload failed.');
      setUploadProgress(null);
    }
  };

  const onSubmit = async (data: ArtworkFormData) => {
    const tagsArray = data.tags.split(',').map((t) => t.trim()).filter(Boolean);
    try {
      if (editingId) await updateArtwork(collectionName, editingId, { ...data, tags: tagsArray });
      else await addArtwork(collectionName, { ...data, tags: tagsArray });
      setIsModalOpen(false);
    } catch (err: any) { setUploadError('Failed to save.'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center p-4 rounded-xl bg-[rgba(228,191,184,0.88)]">
        <h2 className="font-serif text-2xl" style={{ color: '#879585' }}>{title}</h2>
        <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg text-sm">
          <Plus size={15} /> Add Artwork
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {artworks.map((art) => (
          <div key={art.id} className="p-4 bg-white rounded-xl shadow">
            <img src={art.imageUrl} className="w-full h-32 object-cover rounded" />
            <h3 className="mt-2 font-bold">{art.title}</h3>
            <div className="flex gap-2 mt-2">
              <button onClick={() => openEditModal(art)} className="text-xs bg-gray-200 px-3 py-1 rounded">Edit</button>
              <button onClick={() => deleteArtwork(collectionName, art.id)} className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">{editingId ? 'Edit' : 'Add'} Artwork</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <input {...register('title')} placeholder="Title" className="w-full p-2 border rounded" />
              <div className="flex gap-2">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 bg-gray-100 rounded"><Upload size={16} /></button>
                <input {...register('imageUrl')} placeholder="Image URL" className="w-full p-2 border rounded" />
              </div>
              {uploadProgress !== null && <p className="text-xs text-blue-500">Uploading: {uploadProgress}%</p>}
              <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">{isSubmitting ? 'Saving...' : 'Save'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};