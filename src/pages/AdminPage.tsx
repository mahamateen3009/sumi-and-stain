import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AdminArtworkManager } from '../components/AdminArtworkManager';
import { AdminSiteConfig } from '../components/AdminSiteConfig';
import { LogOut, Settings, Brush, Sparkles, Palette, Scissors, PenTool, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { id: 'henna-artworks', label: 'Henna', icon: Brush },
  { id: 'anime-artworks', label: 'Anime', icon: Sparkles },
  { id: 'cloth-painting-artworks', label: 'Cloth Painting', icon: Palette },
  { id: 'accessory-making-artworks', label: 'Accessory Making', icon: Scissors },
  { id: 'calligraphy-artworks', label: 'Calligraphy', icon: PenTool },
  { id: 'pot-painting-artworks', label: 'Pot Painting', icon: Circle },
];

const NAVY = '#1A2A3A';
const NAVY_MUTED = 'rgba(26, 42, 58, 0.62)';

const panelStyle: React.CSSProperties = {
  background: 'rgba(175, 210, 233, 0.85)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(227, 99, 151, 0.22)',
};

export default function AdminPage() {
  const { user, loading, isAdmin, signInWithGoogle, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState('henna-artworks');

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#CBEEF3]">
        <div className="w-8 h-8 rounded-full border-4 animate-spin border-[#AFD2E9] border-t-[#E36397]" />      </div>
    );
  }

  // 2. Unauthenticated State
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#CBEEF3]">
        <div className="rounded-3xl p-10 max-w-sm w-full text-center" style={panelStyle}>
          <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: NAVY }}>Admin</h1>
          <p className="text-sm mb-8" style={{ color: NAVY_MUTED }}>Sign in to manage your portfolio.</p>
          <button
            onClick={signInWithGoogle}
            className="w-full bg-white font-medium py-3 rounded-xl shadow-sm hover:scale-[1.02] transition-transform"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  // 3. Unauthorized State
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#CBEEF3]">
        <div className="rounded-3xl p-10 max-w-sm w-full text-center" style={panelStyle}>
          <h1 className="font-serif text-3xl font-bold mb-4" style={{ color: NAVY }}>Access Denied</h1>
          <p className="text-sm mb-6" style={{ color: NAVY_MUTED }}>Account is not authorized.</p>
          <button onClick={signOut} className="bg-[#E36397] text-white px-6 py-2 rounded-lg">Sign out</button>
        </div>
      </div>
    );
  }

  // 4. Authorized Admin Dashboard
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#CBEEF3]">
      <aside className="w-full md:w-60 p-4" style={panelStyle}>
        <div className="mb-6 px-2">
          <p className="font-serif text-xl font-bold" style={{ color: NAVY }}>Dashboard</p>
          <p className="text-xs truncate opacity-60">{user.email}</p>
        </div>
        <nav className="space-y-2">
          {CATEGORIES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${activeSection === id ? 'bg-[#E36397] text-white' : 'text-gray-600 hover:bg-white/20'
                }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
          <button
            onClick={() => setActiveSection('site-config')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${activeSection === 'site-config' ? 'bg-[#E36397] text-white' : 'text-gray-600'
              }`}
          >
            <Settings size={14} /> Site Config
          </button>
        </nav>
        <button onClick={signOut} className="mt-8 w-full py-2 text-sm text-[#E36397] border border-[#E36397] rounded-lg">
          Sign out
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {activeSection === 'site-config' ? (
            <AdminSiteConfig />
          ) : (
            <AdminArtworkManager
              collectionName={activeSection}
              title={CATEGORIES.find((c) => c.id === activeSection)?.label ?? 'Artworks'}
            />
          )}
        </motion.div>
      </main>
    </div>
  );
}