import React from 'react';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';

export default function Hero({ onOpenModal, onExploreClick }) {
  return (
    <section
      id="hero"
      className="relative w-full h-full flex flex-col justify-between px-6 md:px-16 pt-28 pb-8 z-10 pointer-events-none"
    >
      {/* Top ambient tag */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-850/80 border border-white/10 text-subtlecyan text-xs font-mono tracking-widest uppercase shadow-glass">
          <Sparkles className="w-3.5 h-3.5 text-subtlecyan" />
          <span>STUDY ABROAD</span>
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="max-w-7xl mx-auto w-full my-auto py-12 pointer-events-auto">
        <div className="max-w-3xl">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-extrabold tracking-tight text-offwhite leading-[1.04] mb-6">
            YOUR WORLD <br />
            <span className="bg-gradient-to-r from-softblue via-subtlecyan to-white bg-clip-text text-transparent">
              STARTS HERE.
            </span>
          </h1>

          <p className="text-lg sm:text-2xl text-slate-300 font-light leading-relaxed max-w-2xl mb-10">
            Explore leading study destinations and take the next step toward your international future.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button
              onClick={onExploreClick}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-softblue to-subtlecyan text-navy-950 text-sm font-bold tracking-wide shadow-glow-soft hover:shadow-subtlecyan/40 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5"
            >
              <Compass className="w-4 h-4 text-navy-950" />
              <span>EXPLORE DESTINATIONS</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenModal}
              className="px-8 py-4 rounded-full glass-button text-offwhite text-sm font-medium tracking-wide hover:text-subtlecyan flex items-center gap-2.5"
            >
              <span>BOOK A CONSULTATION</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-slate-400 text-xs font-mono tracking-widest pointer-events-auto">
        <div className="flex items-center gap-2 text-softblue animate-bounce">
          <span>SCROLL TO TRAVEL ↓</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-[11px] text-slate-400">
          <span>UK • USA • CANADA • AUSTRALIA • GERMANY • NEW ZEALAND</span>
        </div>
      </div>
    </section>
  );
}
