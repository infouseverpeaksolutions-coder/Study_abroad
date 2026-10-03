import React from 'react';
import { Compass, CloudRain, ShieldCheck } from 'lucide-react';

export default function AtmosphereOverlay() {
  return (
    <section className="relative w-full h-full flex flex-col justify-center px-6 md:px-16 z-10 pointer-events-none">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-850/80 border border-white/10 text-subtlecyan text-xs font-mono tracking-widest uppercase mb-4 shadow-glass">
            <Compass className="w-3.5 h-3.5 text-softblue" />
            <span>SCENE 03 // ENTERING ATMOSPHERE</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-offwhite tracking-tight leading-[1.08] mb-6">
            Entering The <br />
            <span className="bg-gradient-to-r from-softblue via-subtlecyan to-white bg-clip-text text-transparent">
              Atmosphere.
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-lg font-light">
            Passing through the blue atmospheric rim into the destination airspace. Clouds part to reveal the city and campus below.
          </p>

          <div className="p-5 rounded-2xl glass-panel border border-white/10 max-w-md space-y-3 shadow-glass">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-white/10 pb-2">
              <span>DESCENT PROFILE</span>
              <span className="text-subtlecyan">SUBORBITAL TO SURFACE</span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] font-mono text-slate-300">
              <div>
                <span className="block text-[9px] uppercase text-slate-500">LAYER</span>
                <span className="text-offwhite">STRATOSPHERE</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase text-slate-500">REGION</span>
                <span className="text-subtlecyan">EUROPE / UK</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase text-slate-500">STATUS</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  STABLE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
