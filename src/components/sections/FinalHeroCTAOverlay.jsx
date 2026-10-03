import React from 'react';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';

export default function FinalHeroCTAOverlay({ onOpenModal, onExploreClick }) {
  return (
    <section className="relative w-full h-full flex flex-col justify-center items-center text-center px-6 md:px-16 z-10 pointer-events-none">
      <div className="max-w-3xl mx-auto pointer-events-auto p-8 sm:p-12 rounded-3xl bg-navy-950/80 backdrop-blur-2xl border border-white/10 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-subtlecyan text-xs font-mono tracking-widest uppercase mb-6 shadow-glass">
          <Sparkles className="w-3.5 h-3.5 text-subtlecyan" />
          <span>SCENE 06 // YOUR FUTURE AWAITS</span>
        </div>

        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-offwhite tracking-tight leading-[1.06] mb-6">
          YOUR NEXT <br />
          CHAPTER <br />
          <span className="bg-gradient-to-r from-softblue via-subtlecyan to-white bg-clip-text text-transparent">
            STARTS HERE.
          </span>
        </h2>

        <p className="text-base sm:text-xl text-slate-300 font-light leading-relaxed max-w-xl mx-auto mb-8">
          From choosing your destination to reaching your university, we're with you throughout the journey.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <button
            onClick={onOpenModal}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-softblue to-subtlecyan text-navy-950 text-sm font-bold tracking-wide shadow-glow-soft hover:shadow-subtlecyan/40 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5"
          >
            <span>START YOUR JOURNEY</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExploreClick}
            className="px-8 py-4 rounded-full glass-button text-offwhite text-sm font-medium tracking-wide hover:text-subtlecyan flex items-center gap-2.5"
          >
            <Compass className="w-4 h-4 text-softblue" />
            <span>EXPLORE DESTINATIONS</span>
          </button>
        </div>
      </div>
    </section>
  );
}
