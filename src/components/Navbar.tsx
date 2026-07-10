import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── palette tokens ── */
const NAV_BG = '#AF8A69'; /* Updated color */
const TEXT = '#FFFFFF';
const ACTIVE = '#FFFFFF';
const MUTED = 'rgba(255, 255, 255, 0.72)';

export const Navbar = () => {
  const [location] = useLocation();
  const { config } = useSiteConfig();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { name: 'Henna', path: '/henna' },
    { name: 'Anime', path: '/anime' },
    { name: 'Other', path: '/other' },
    { name: 'Contact', path: '/contact' },
  ];

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav
      className="fixed top-0 w-full z-50 py-3"
      style={{
        background: NAV_BG,
        borderBottom: '1px solid rgba(255,255,255,0.25)',
        boxShadow: '0 2px 16px rgba(26,42,58,0.14)',
      }}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">

        {/* 1. Logo (Fixed Left) */}
        <div className="flex-shrink-0">
          <Link href="/henna" className="z-50 relative">
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid rgba(255,255,255,0.55)',
                boxShadow: '0 2px 8px rgba(26,42,58,0.18)',
                background: config?.logoUrl ? 'transparent' : 'rgba(255,255,255,0.2)'
              }}
            >
              {config?.logoUrl && (
                <img src={config.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              )}
            </div>
          </Link>
        </div>

        {/* 2. Links (Nudged slightly right of center) */}
        {/* The 'pl-24' (padding-left) is what pushes them away from dead center */}
        <div className="hidden md:flex items-center gap-10 pl-24">
          {links.map((link) => {
            const isActive = location.startsWith(link.path);
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm tracking-wide transition-all duration-200 relative ${isActive ? 'font-bold' : 'font-semibold'}`}
                style={{ color: isActive ? ACTIVE : MUTED }}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: '#FFFFFF' }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* 3. Mobile Toggle */}
        <div className="md:hidden">
          <button style={{ color: TEXT }} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu logic... */}
    </nav>
  );
};