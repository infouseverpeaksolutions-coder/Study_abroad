import React from 'react';
import { Plane, Compass } from 'lucide-react';

export default function FlightSection() {
  return (
    <section
      id="flight"
      className="relative w-full h-full flex flex-col justify-center px-6 md:px-16 z-10 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Cinematic Subtitles / Narrative Card */}
        <div className="lg:col-span-6 pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-850/80 border border-white/10 text-subtlecyan text-xs font-mono tracking-widest uppercase mb-4 shadow-glass">
            <Plane className="w-3.5 h-3.5 text-softblue" />
            <span>SCENE 03 & 04 // THE TRANSATLANTIC FLIGHT</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-offwhite tracking-tight leading-[1.08] mb-6">
            Crossing Oceans. <br />
            <span className="bg-gradient-to-r from-softblue via-subtlecyan to-white bg-clip-text text-transparent">
              Reaching Ambitions.
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-lg font-light">
            As your aircraft climbs into the stratosphere, leaving behind familiar horizons, you embark on the academic voyage of a lifetime.
          </p>

          {/* Real-time Flight Metrics HUD */}
          <div className="p-5 rounded-2xl glass-panel border border-white/10 max-w-md space-y-3 shadow-glass">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-white/10 pb-2">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-softblue" />
                TRANSIT ROUTE
              </span>
              <span className="text-subtlecyan">INTERCONTINENTAL FLIGHT</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">ORIGIN</span>
                <span className="text-sm font-semibold text-offwhite">HOME AIRPORT</span>
              </div>
              <div className="flex items-center gap-2 px-3">
                <span className="w-8 h-[1px] bg-softblue/40" />
                <Plane className="w-4 h-4 text-softblue rotate-90" />
                <span className="w-8 h-[1px] bg-softblue/40" />
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">DESTINATION</span>
                <span className="text-sm font-semibold text-subtlecyan">CAMPUS GROUNDS</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-[11px] font-mono text-slate-400">
              <div>
                <span className="block text-[9px] uppercase text-slate-500">ALTITUDE</span>
                <span className="text-offwhite">38,000 FT</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase text-slate-500">GROUND SPEED</span>
                <span className="text-offwhite">560 KTS</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase text-slate-500">STATUS</span>
                <span className="text-emerald-400">ON COURSE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
