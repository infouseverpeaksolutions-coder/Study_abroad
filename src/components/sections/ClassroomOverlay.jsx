import React from 'react';
import { GraduationCap, Sparkles } from 'lucide-react';

export default function ClassroomOverlay() {
  return (
    <section className="relative w-full h-full flex flex-col justify-center px-6 md:px-16 z-10 pointer-events-none">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 max-w-xl pointer-events-auto p-6 sm:p-8 rounded-3xl bg-navy-950/75 backdrop-blur-xl border border-white/10 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-850/80 border border-white/10 text-subtlecyan text-xs font-mono tracking-widest uppercase mb-4 shadow-glass backdrop-blur-md">
            <GraduationCap className="w-3.5 h-3.5 text-softblue" />
            <span>CLASSROOM 204 // ACTIVE SEMINAR</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-5xl font-display font-extrabold text-offwhite tracking-tight leading-[1.08] mb-4">
            THIS IS WHERE YOUR <br />
            <span className="bg-gradient-to-r from-softblue via-subtlecyan to-white bg-clip-text text-transparent">
              JOURNEY LEADS.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-200 font-light tracking-wide mb-4">
            LEARN. GROW. BUILD YOUR FUTURE.
          </p>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-light">
            Surrounded by passionate peers, world-renowned faculty, and vibrant campus sunlight streaming through the windows. The goal of every application, visa interview, and late-night study session begins right here.
          </p>

          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-softblue">
            <Sparkles className="w-4 h-4 text-subtlecyan" />
            <span>FACULTY OF ADVANCED STUDIES • SEMESTER IN SESSION</span>
          </div>
        </div>
      </div>
    </section>
  );
}
