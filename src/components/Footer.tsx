import React from 'react';
import { Link } from 'wouter';
import { ArrowUpRight, Github, Linkedin, ExternalLink } from 'lucide-react';
import { useSiteConfig } from '../hooks/useSiteConfig';

/* ── tokens ── */
const FOOTER_BG = '#AF8A69';
const FG = '#FFFFFF';
const FG_MUTED = 'rgba(255, 255, 255, 0.68)';
const FG_HOVER = '#FFFFFF';

export const Footer = () => {
  const { config, loading } = useSiteConfig();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // If a link is empty, we return null so the "text-looking one" doesn't render at all.
  const SocialLink = ({ href, icon, label }: { href: string | undefined, icon: React.ReactNode; label: string }) => {
    if (!href || href.trim() === "" || href === "#") return null;

    const finalUrl = href.startsWith('http') ? href : `https://${href}`;

    return (
      <li className="flex items-center">
        <a
          href={finalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 transition-colors duration-200 cursor-pointer pointer-events-auto"
          style={{ color: FG_MUTED }}
          onMouseEnter={(e) => { e.currentTarget.style.color = FG_HOVER; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = FG_MUTED; }}
        >
          {icon}
          {label}
        </a>
      </li>
    );
  };

  if (loading) return null;

  return (
    <footer className="mt-20 relative overflow-hidden" style={{ background: FOOTER_BG, borderTop: '3px solid rgba(255, 255, 255, 0.20)' }}>
      <div className="container mx-auto px-6 py-16 relative z-10">
        < div className="grid grid-cols-3 gap-6 lg:gap-20">

          <div className="md:col-span-1">
            <h3 className="font-serif text-xl font-bold mb-4" style={{ color: FG }}>About Me</h3>
            <p className="text-sm leading-relaxed" style={{ color: FG_MUTED }}>
              {config?.footer?.aboutText || "I'm Maha Mateen — an artist who finds beauty in patterns, colour, and craft. Every piece is made with intention."}
            </p>
          </div>

          <div>
            <h4 className="font-serif text-base font-bold mb-5" style={{ color: FG }}>Explore</h4>
            <ul className="space-y-3 text-sm">
              <li><button onClick={scrollToTop} className="flex items-center gap-2 transition-colors duration-200" style={{ color: FG_MUTED }}><ArrowUpRight size={14} /> Back to Top</button></li>
              <li><Link href="/contact" className="flex items-center gap-2 transition-colors duration-200" style={{ color: FG_MUTED }}><ArrowUpRight size={14} /> Contact & Commission</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-base font-bold mb-5" style={{ color: FG }}>Developer Work</h4>
            <ul className="space-y-3 text-sm">
              {config?.footer?.projects?.map((proj, idx) => (
                <SocialLink key={idx} href={proj.url} icon={<ExternalLink size={14} />} label={proj.title} />
              ))}
              <SocialLink href={config?.footer?.githubLink} icon={<Github size={14} />} label="GitHub" />
              <SocialLink href={config?.footer?.linkedinLink} icon={<Linkedin size={14} />} label="LinkedIn" />
            </ul>
          </div>
        </div>

        <div className="flex justify-center mt-14">
          <div className="flex justify-center mt-14">
            <div className="pt-8 text-center text-xs font-medium px-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.22)', color: FG_MUTED }}>
              © {new Date().getFullYear()} Maha Mateen — All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};