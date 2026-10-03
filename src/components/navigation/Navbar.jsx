import React, { useState, useEffect } from 'react';
import { Compass, Menu, X, PhoneCall, ChevronRight } from 'lucide-react';

export default function Navbar({ onOpenModal, activeScene }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Destinations', href: '#destinations' },
    { label: 'Universities', href: '#universities' },
    { label: 'Services', href: '#services' },
    { label: 'Success Stories', href: '#stories' },
    { label: 'About', href: '#why-us' },
    { label: 'Contact', href: '#final-cta' },
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-navy-950/85 backdrop-blur-xl border-b border-white/[0.08] py-3.5 shadow-2xl'
            : 'bg-gradient-to-b from-navy-950/90 via-navy-950/40 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#"
            className="flex items-center gap-3 group focus:outline-none shrink-0 mr-8"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-softblue/15 border border-softblue/30 flex items-center justify-center shadow-glow-soft group-hover:scale-105 transition-transform duration-300">
              <Compass className="w-5 h-5 text-softblue animate-spin-slow" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg tracking-wider text-offwhite flex items-center gap-1.5 whitespace-nowrap">
                AURA <span className="text-softblue font-light">GLOBAL</span>
              </span>
              <span className="text-[10px] tracking-widest text-slate-400 uppercase font-mono whitespace-nowrap">
                Study Abroad Advisory
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 shrink-0">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-xs uppercase tracking-wider font-medium text-slate-300 hover:text-softblue transition-colors duration-200 relative group py-1 whitespace-nowrap"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-softblue to-subtlecyan transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right Action CTA */}
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-navy-850 border border-white/10 text-[11px] font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Fall 2026 Admissions Open</span>
            </div>

            <button
              onClick={onOpenModal}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-softblue to-subtlecyan text-navy-950 text-xs font-bold uppercase tracking-wider shadow-glow-soft hover:shadow-subtlecyan/40 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
            >
              <span>BOOK CONSULTATION</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl glass-panel text-offwhite hover:text-softblue transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-navy-950/95 backdrop-blur-2xl lg:hidden flex flex-col justify-between pt-28 pb-10 px-8 animate-fade-in">
          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-lg font-display uppercase tracking-wider text-slate-200 hover:text-softblue transition-colors flex items-center justify-between border-b border-white/10 pb-3"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </a>
            ))}
          </nav>

          <div className="space-y-4 pt-6">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenModal();
              }}
              className="w-full py-4 rounded-full bg-gradient-to-r from-softblue to-subtlecyan text-navy-950 text-sm font-bold uppercase tracking-wider shadow-glow-soft flex items-center justify-center gap-2"
            >
              <span>BOOK CONSULTATION</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
