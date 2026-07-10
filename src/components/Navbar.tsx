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
      className="fixed top-0 w-full z-100" // Increased z-index to 100 to stay above everything
      style={{
        background: NAV_BG,
        borderBottom: '1px solid rgba(255,255,255,0.25)',
        boxShadow: '0 2px 16px rgba(26,42,58,0.14)',
      }}
    >
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        {/* 1. Logo */}
        <div className="shrink-0">
          <Link href="/henna" onClick={closeMenu}>
            <div
              style={{
                width: '45px',
                height: '45px',
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

        {/* 2. Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
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
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* 4. Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/20"
            style={{ background: NAV_BG }}
          >
            <div className="flex flex-col items-center py-6 gap-6">
              {links.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={closeMenu}
                  className="text-lg font-semibold tracking-wide"
                  style={{ color: location.startsWith(link.path) ? ACTIVE : MUTED }}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};