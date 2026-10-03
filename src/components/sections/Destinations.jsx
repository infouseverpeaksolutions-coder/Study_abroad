import React, { useState } from 'react';
import { DESTINATIONS } from '../../data/destinationsData';
import { Clock, Shield, ArrowUpRight, GraduationCap, ChevronRight, Globe2, Award } from 'lucide-react';

export function DestinationOverlay({ activeIndex = 0, onSelectDestination }) {
  const currentDest = DESTINATIONS[activeIndex] || DESTINATIONS[0];

  return (
    <section
      id="destinations"
      className="relative w-full h-full flex flex-col justify-center px-6 md:px-16 z-10 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left column text */}
        <div className="lg:col-span-5 pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-850/80 border border-white/10 text-subtlecyan text-xs font-mono tracking-widest uppercase mb-4 shadow-glass">
            <span>SCENE 02 // GLOBAL DESTINATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-offwhite tracking-tight leading-tight mb-4">
            Explore The World
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-md">
            As the Earth rotates, discover premier international educational ecosystems with globally recognized degrees and verified post-study work pathways.
          </p>

          {/* Quick country switcher pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {DESTINATIONS.map((d, idx) => (
              <button
                key={d.id}
                onClick={() => onSelectDestination && onSelectDestination(idx)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-1.5 ${
                  activeIndex === idx
                    ? 'bg-softblue text-navy-950 font-semibold shadow-glow-soft scale-105'
                    : 'glass-panel text-slate-300 hover:text-offwhite hover:bg-white/10'
                }`}
              >
                <span>{d.flag}</span>
                <span>{d.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right side: Active Country Detail Card */}
        <div className="lg:col-span-7 flex justify-end pointer-events-auto">
          <div
            key={currentDest.id}
            className="w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-glass relative overflow-hidden transition-all duration-500 mr-6 xl:mr-16"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentDest.flag}</span>
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-subtlecyan">
                    DESTINATION {activeIndex + 1} OF 6
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-offwhite uppercase tracking-wider">
                    {currentDest.name}
                  </h3>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  Visa Support Active
                </span>
              </div>
            </div>

            <h4 className="text-base font-medium text-softblue mb-2 leading-snug">
              “{currentDest.heading}”
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-light">
              {currentDest.tagline}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6 bg-navy-950/60 border border-white/5 rounded-2xl p-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
                  Post-Study Work
                </span>
                <span className="text-xs sm:text-sm font-semibold text-offwhite flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-softblue" />
                  {currentDest.postStudyWork}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
                  Avg Annual Tuition
                </span>
                <span className="text-xs sm:text-sm font-semibold text-subtlecyan">
                  {currentDest.avgCost}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Destinations({ onOpenModal }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const dest = DESTINATIONS[selectedIdx];

  return (
    <section id="destinations-deepdive" className="relative py-28 px-6 md:px-16 border-t border-white/10 bg-navy-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-850 border border-white/10 text-softblue text-xs font-mono tracking-widest uppercase mb-3">
              <Globe2 className="w-3.5 h-3.5" />
              <span>GLOBAL DESTINATION DEEP DIVE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-offwhite tracking-tight">
              Curated Study Destinations
            </h2>
          </div>
          <p className="text-slate-300 text-sm max-w-md font-light">
            Compare admissions timelines, post-study work authorization, tuition structures, and top institutional ecosystems.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {DESTINATIONS.map((d, i) => (
            <button
              key={d.id}
              onClick={() => setSelectedIdx(i)}
              className={`px-5 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 shrink-0 ${
                selectedIdx === i
                  ? 'bg-softblue text-navy-950 shadow-glow-soft font-bold'
                  : 'glass-panel text-slate-300 hover:text-offwhite hover:bg-white/10'
              }`}
            >
              <span className="text-base">{d.flag}</span>
              <span>{d.name}</span>
            </button>
          ))}
        </div>

        {/* Editorial Country Card */}
        <div className="glass-panel rounded-3xl p-8 lg:p-12 border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{dest.flag}</span>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-softblue">DESTINATION INSIGHT</span>
                <h3 className="text-3xl lg:text-4xl font-display font-extrabold text-offwhite">{dest.name}</h3>
              </div>
            </div>

            <p className="text-lg text-slate-200 font-light leading-relaxed">
              {dest.heading}. {dest.tagline}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div className="bg-navy-950/60 p-4 rounded-2xl border border-white/5">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Post-Study Visa</span>
                <span className="text-xs sm:text-sm font-semibold text-offwhite">{dest.postStudyWork}</span>
              </div>
              <div className="bg-navy-950/60 p-4 rounded-2xl border border-white/5">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Tuition Estimate</span>
                <span className="text-xs sm:text-sm font-semibold text-subtlecyan">{dest.avgCost}</span>
              </div>
              <div className="bg-navy-950/60 p-4 rounded-2xl border border-white/5">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Primary Intakes</span>
                <span className="text-xs sm:text-sm font-semibold text-offwhite">{dest.intakes}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenModal}
                className="px-6 py-3 rounded-full bg-softblue text-navy-950 text-xs font-bold uppercase tracking-wider hover:bg-subtlecyan transition-colors flex items-center gap-2"
              >
                <span>Check Eligibility For {dest.name}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-navy-950/70 p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            <h4 className="text-sm font-mono uppercase tracking-widest text-slate-300 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-softblue" />
              <span>Top Tier Universities</span>
            </h4>
            <div className="space-y-2.5">
              {dest.topUniversities.map((uni, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-200">
                  <span>{uni}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-softblue" />
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-softblue/10 border border-softblue/20">
              <div className="flex items-center gap-2 text-xs font-semibold text-softblue mb-1">
                <Award className="w-4 h-4" />
                <span>Scholarships Available</span>
              </div>
              <p className="text-[11px] text-slate-300 font-light">{dest.scholarships}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
