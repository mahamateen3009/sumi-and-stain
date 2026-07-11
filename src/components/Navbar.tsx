import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── palette tokens ── */
const NAV_BG = '#AF8A69';
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
      className="fixed top-0 w-full z-100"
      style={{
        background: NAV_BG,
        borderBottom: '1px solid rgba(255,255,255,0.25)',
        boxShadow: '0 2px 16px rgba(26,42,58,0.14)',
      }}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* 1. Logo */}
        <div className="shrink-0">
          <Link href="/henna">
            <div
              style={{
                width: '35px', // Slightly smaller for mobile room
                height: '35px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid rgba(255,255,255,0.55)',
                background: config?.logoUrl ? 'transparent' : 'rgba(255,255,255,0.2)'
              }}
            >
              {config?.logoUrl && (
                <img src={config.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>
          </Link>
        </div>

        {/* 2. All Links (Visible on Mobile & Desktop) */}
        <div className="flex items-center gap-3 sm:gap-6">
          {links.map((link) => {
            const isActive = location.startsWith(link.path);
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`text-[11px] sm:text-sm tracking-wide transition-all duration-200 relative ${isActive ? 'font-bold' : 'font-semibold'}`}
                style={{ color: isActive ? ACTIVE : MUTED }}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};