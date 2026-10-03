import React from 'react';
import { Landmark, ArrowDown } from 'lucide-react';

export default function EntranceOverlay() {
  return (
    <section className="relative w-full h-full flex flex-col justify-center px-6 md:px-16 z-10 pointer-events-none">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 max-w-xl pointer-events-auto p-6 sm:p-8 rounded-3xl bg-navy-950/75 backdrop-blur-xl border border-white/10 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-850/80 border border-white/10 text-subtlecyan text-xs font-mono tracking-widest uppercase mb-4 shadow-glass">
            <Landmark className="w-3.5 h-3.5 text-softblue" />
            <span>CAMPUS ENTRANCE // THE GRAND PORTAL</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-offwhite tracking-tight leading-[1.08] mb-4">
            Step Up To The <br />
            <span className="bg-gradient-to-r from-softblue via-subtlecyan to-white bg-clip-text text-transparent">
              Threshold.
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-light">
            Approaching the historic sandstone archway. Hand-carved collegiate masonry, royal blue faculty banners, and welcoming lantern lights guide your first steps inside.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-softblue">
            <span>ENTERING MAIN FACULTY HALL</span>
            <ArrowDown className="w-3.5 h-3.5 text-subtlecyan animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
