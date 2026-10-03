import React from 'react';
import { Sun, Users, BookOpen, Trophy, ArrowRight } from 'lucide-react';

export default function ArrivalSection({ onOpenModal }) {
  const chapterPillars = [
    { title: 'Global Friendships', icon: Users, desc: 'Connect with curious minds from over 80+ nations in collaborative campus halls.' },
    { title: 'World-Class Research', icon: BookOpen, desc: 'Conduct experiments in multibillion-dollar labs under renowned academic authorities.' },
    { title: 'Career Trajectory', icon: Trophy, desc: 'Access international alumni career networks, internships at Fortune 500s, and post-study work.' }
  ];

  return (
    <section
      id="arrival"
      className="relative w-full h-full flex flex-col justify-center px-6 md:px-16 z-10 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-850/80 border border-white/10 text-subtlecyan text-xs font-mono tracking-widest uppercase mb-4 shadow-glass">
            <Sun className="w-3.5 h-3.5 text-softblue" />
            <span>SCENE 05 & 06 // ARRIVAL & CAMPUS</span>
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-offwhite tracking-tight leading-[1.05] mb-6">
            Your New Chapter <br />
            <span className="bg-gradient-to-r from-softblue via-subtlecyan to-white bg-clip-text text-transparent">
              Begins on Campus.
            </span>
          </h2>

          <p className="text-lg sm:text-2xl text-slate-200 font-light tracking-wide mb-10 max-w-xl">
            Study. Explore. Grow. Build your future.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {chapterPillars.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="p-4 rounded-2xl glass-panel-subtle border border-white/10 backdrop-blur-xl"
                >
                  <div className="w-8 h-8 rounded-lg bg-softblue/10 flex items-center justify-center text-softblue mb-2">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-semibold text-offwhite mb-1">
                    {p.title}
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <button
            onClick={onOpenModal}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-softblue to-subtlecyan text-navy-950 text-xs font-bold uppercase tracking-wider shadow-glow-soft hover:shadow-subtlecyan/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <span>Explore Campus Pathways</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
