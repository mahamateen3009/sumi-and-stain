import React, { useEffect, useState, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { SiteConfig, updateSiteConfig } from '../lib/firestore';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Upload, Plus, Trash2 } from 'lucide-react';
import { uploadToCloudinary } from '../lib/cloudinary';

const ImageUploader = ({ name, register, setValue }: any) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setValue(name, url, { shouldValidate: true });
    } catch (err) { alert("Upload failed."); }
    finally { setUploading(false); }
  };

  return (
    <div className="flex gap-2">
      <input {...register(name)} className="w-full rounded-lg px-4 py-2.5 text-sm border" placeholder="URL or upload..." />
      <button type="button" onClick={() => inputRef.current?.click()} className="p-2.5 bg-gray-100 rounded-lg hover:bg-gray-200">
        <Upload size={16} />
      </button>
      <input type="file" ref={inputRef} onChange={handleFile} className="hidden" accept="image/*" />
      {uploading && <span className="text-xs text-blue-500 ml-2">Uploading...</span>}
    </div>
  );
};

export const AdminSiteConfig: React.FC = () => {
  const { config, loading } = useSiteConfig();
  const [activeTab, setActiveTab] = useState<'banners' | 'footer' | 'formspree'>('banners');
  const { register, handleSubmit, reset, control, setValue } = useForm<SiteConfig>();

  const { fields, append, remove } = useFieldArray({ control, name: 'footer.projects' });

  useEffect(() => {
    if (!loading && config) {
      reset({
        ...config,
        banners: {
          anime: config.banners?.anime || "",
          contact: config.banners?.contact || "",
          henna: config.banners?.henna || "",
          other: config.banners?.other || "",
          accessoryMaking: config.banners?.accessoryMaking || "",
          calligraphy: config.banners?.calligraphy || "",
          clothPainting: config.banners?.clothPainting || "",
          potPainting: config.banners?.potPainting || "",
        },
        footer: {
          ...config.footer,
          projects: config.footer?.projects || []
        }
      });
    }
  }, [config, loading, reset]);

  const onFormSubmit = async (data: SiteConfig) => {
    try {
      console.log("Saving configuration:", data);
      await updateSiteConfig(data);
      alert('Configuration Saved Successfully!');
      window.location.reload();
    } catch (err) {
      console.error("Save error:", err);
      alert('Error saving configuration. Check Console (F12).');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="rounded-2xl p-8 bg-[rgba(228,191,184,0.88)] shadow-lg">
      <div className="flex gap-2 mb-8">
        {['banners', 'footer', 'formspree'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-lg text-sm ${activeTab === tab ? 'bg-[#B1BCAC] text-white' : 'bg-white/50'}`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {activeTab === 'banners' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1.5">Navbar Logo</label>
              <ImageUploader name="logoUrl" register={register} setValue={setValue} />
            </div>
            {['anime', 'henna', 'other', 'contact', 'accessoryMaking', 'calligraphy', 'clothPainting', 'potPainting'].map((b) => (
              <div key={b}>
                <label className="block text-xs font-bold mb-1.5 capitalize">{b.replace(/([A-Z])/g, ' $1')} Page Banner</label>
                <ImageUploader name={`banners.${b}`} register={register} setValue={setValue} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'footer' && (
          <div className="space-y-4">
            <textarea {...register('footer.aboutText')} rows={4} className="w-full rounded-lg px-4 py-2.5 text-sm border" />
            <div className="pt-4 border-t border-gray-200">
              <label className="block text-xs font-bold mb-1.5">Footer Projects</label>
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 mb-2 items-center">
                  <input {...register(`footer.projects.${index}.title`)} className="w-full rounded-lg px-4 py-2.5 text-sm border" />
                  <input {...register(`footer.projects.${index}.url`)} className="w-full rounded-lg px-4 py-2.5 text-sm border" />
                  <button type="button" onClick={() => remove(index)} className="p-2 text-red-500"><Trash2 size={18} /></button>
                </div>
              ))}
              <button type="button" onClick={() => append({ title: '', url: '' })} className="mt-2 text-xs bg-gray-200 px-3 py-1.5 rounded">Add Project</button>
            </div>
          </div>
        )}

        {activeTab === 'formspree' && (
          <input {...register('formspreeEndpoint')} className="w-full rounded-lg px-4 py-2.5 text-sm border" placeholder="Endpoint ID" />
        )}

        <button type="submit" className="px-8 py-3 bg-[#879585] text-white rounded-xl">Save Configuration</button>
      </form>
    </div>
  );
};