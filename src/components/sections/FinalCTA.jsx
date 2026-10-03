import React from 'react';
import { Phone, Mail, MessageSquare, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export default function FinalCTA({ onOpenModal }) {
  return (
    <section
      id="final-cta"
      className="relative min-h-[85vh] flex flex-col justify-center px-6 md:px-16 py-28 bg-navy-900 border-t border-white/10"
    >
      <div className="max-w-4xl mx-auto w-full text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-850 border border-white/10 text-subtlecyan text-xs font-mono tracking-widest uppercase mb-6 shadow-glass">
          <Sparkles className="w-3.5 h-3.5 text-softblue" />
          <span>YOUR GLOBAL FUTURE AWAITS</span>
        </div>

        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-offwhite tracking-tight leading-tight mb-6">
          YOUR NEXT CHAPTER <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-softblue via-subtlecyan to-white bg-clip-text text-transparent">
            STARTS HERE.
          </span>
        </h2>

        <p className="text-base sm:text-xl text-slate-300 font-light leading-relaxed max-w-2xl mx-auto mb-10">
          Take the first step toward studying abroad.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-12">
          <button
            onClick={onOpenModal}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-softblue to-subtlecyan text-navy-950 text-sm font-bold tracking-wide shadow-glow-soft hover:shadow-subtlecyan/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <span>BOOK FREE COUNSELLING</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="tel:+18005550199"
            className="px-8 py-4 rounded-full glass-button text-offwhite text-sm font-medium tracking-wide hover:text-subtlecyan flex items-center gap-2.5"
          >
            <Phone className="w-4 h-4 text-softblue" />
            <span>TALK TO AN ADVISOR</span>
          </a>
        </div>

        {/* Direct Contact Options */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-slate-400 border-t border-white/10 pt-8 max-w-xl mx-auto">
          <a
            href="https://wa.me/18005550199"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp: +1 (800) 555-0199</span>
          </a>

          <a
            href="mailto:admissions@auraglobal.edu"
            className="flex items-center gap-2 hover:text-softblue transition-colors"
          >
            <Mail className="w-4 h-4 text-softblue" />
            <span>admissions@auraglobal.edu</span>
          </a>
        </div>
      </div>
    </section>
  );
}
