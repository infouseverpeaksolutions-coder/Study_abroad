import React from 'react';
import { Building2, MapPin } from 'lucide-react';

export default function CityOverlay() {
  return (
    <section className="relative w-full h-full flex flex-col justify-center px-6 md:px-16 z-10 pointer-events-none">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-850/80 border border-white/10 text-subtlecyan text-xs font-mono tracking-widest uppercase mb-4 shadow-glass">
            <Building2 className="w-3.5 h-3.5 text-softblue" />
            <span>SCENE 04 // DESTINATION METROPOLIS</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-offwhite tracking-tight leading-[1.08] mb-6">
            The City <br />
            <span className="bg-gradient-to-r from-softblue via-subtlecyan to-white bg-clip-text text-transparent">
              Breaks Through.
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6 max-w-lg font-light">
            Emerging from the cloud bank into the vibrant skyline of your host country. Global innovation hubs, cultural capitals, and industry leaders surround your academic journey.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-950/70 border border-white/10 text-xs font-mono text-softblue">
            <MapPin className="w-4 h-4 text-subtlecyan" />
            <span>METROPOLITAN CORRIDOR • UNIVERSITY PRECINCT AHEAD</span>
          </div>
        </div>
      </div>
    </section>
  );
}
