import React from 'react';
import { DoorOpen, ArrowRight } from 'lucide-react';

export default function CorridorOverlay() {
  return (
    <section className="relative w-full h-full flex flex-col justify-center px-6 md:px-16 z-10 pointer-events-none">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 max-w-xl pointer-events-auto p-6 sm:p-8 rounded-3xl bg-navy-950/75 backdrop-blur-xl border border-white/10 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-850/80 border border-white/10 text-subtlecyan text-xs font-mono tracking-widest uppercase mb-4 shadow-glass">
            <DoorOpen className="w-3.5 h-3.5 text-softblue" />
            <span>FACULTY CORRIDOR // ROOM 204</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-offwhite tracking-tight leading-[1.08] mb-4">
            Approaching Your <br />
            <span className="bg-gradient-to-r from-softblue via-subtlecyan to-white bg-clip-text text-transparent">
              First Lecture.
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-light">
            Walking down the long hall bathed in natural light from panoramic campus windows. Notice boards, student lockers, and the entrance to Classroom 204 directly ahead.
          </p>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-w-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">DESTINATION ROOM</span>
              <span className="text-sm font-bold text-subtlecyan">CLASSROOM 204 • ADVANCED STUDIES</span>
            </div>
            <ArrowRight className="w-5 h-5 text-softblue" />
          </div>
        </div>
      </div>
    </section>
  );
}
