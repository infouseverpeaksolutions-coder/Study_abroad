import React, { useState } from 'react';
import { FEATURED_UNIVERSITIES } from '../../data/universitiesData';
import { GraduationCap, Award, MapPin, DollarSign, Percent, ArrowUpRight, BookOpen, Check } from 'lucide-react';

export default function Universities({ onOpenModal }) {
  const [activeUniId, setActiveUniId] = useState('oxford');
  const u = FEATURED_UNIVERSITIES.find((item) => item.id === activeUniId) || FEATURED_UNIVERSITIES[0];

  return (
    <section id="universities" className="relative py-28 px-6 md:px-16 bg-navy-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-850 border border-white/10 text-subtlecyan text-xs font-mono tracking-widest uppercase mb-3">
              <GraduationCap className="w-3.5 h-3.5 text-softblue" />
              <span>GLOBAL INSTITUTIONAL SHOWCASE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-offwhite tracking-tight">
              Featured Global Universities
            </h2>
          </div>
          <p className="text-slate-300 text-sm max-w-md font-light">
            We partner with leading universities to secure admissions, merit scholarships, and direct faculty mentorships.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Selector List */}
          <div className="lg:col-span-4 space-y-3">
            {FEATURED_UNIVERSITIES.map((u) => {
              const isSelected = u.id === activeUniId;
              return (
                <button
                  key={u.id}
                  onClick={() => setActiveUniId(u.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
                    isSelected
                      ? 'bg-navy-850 border-softblue/60 shadow-glow-soft translate-x-2'
                      : 'bg-navy-900/60 border-white/5 opacity-70 hover:opacity-100 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-2xl">{u.flag}</span>
                    <div>
                      <h3 className={`text-sm font-semibold transition-colors ${isSelected ? 'text-offwhite' : 'text-slate-300'}`}>
                        {u.name}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                        {u.city}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-softblue px-2 py-1 rounded-lg bg-softblue/10">
                    {u.country.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Institutional Profile Card */}
          <div className="lg:col-span-8">
            <div className="glass-panel rounded-3xl p-8 lg:p-10 border border-white/10 shadow-glass space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-softblue mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{u.city}, {u.country}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-offwhite">
                    {u.name}
                  </h3>
                  <span className="text-xs font-mono text-emerald-400 mt-1 inline-block">
                    {u.rank}
                  </span>
                </div>

                <button
                  onClick={onOpenModal}
                  className="px-6 py-3 rounded-full bg-softblue text-navy-950 text-xs font-bold uppercase tracking-wider hover:bg-subtlecyan transition-colors flex items-center gap-2 self-start sm:self-auto"
                >
                  <span>Check Admissions Criteria</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {/* Vital Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-navy-900/80 p-4 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Annual Tuition</span>
                  <span className="text-sm font-semibold text-subtlecyan flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-softblue" />
                    {u.tuition}
                  </span>
                </div>
                <div className="bg-navy-900/80 p-4 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Living Budget</span>
                  <span className="text-sm font-semibold text-offwhite">{u.livingCost}</span>
                </div>
                <div className="bg-navy-900/80 p-4 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Acceptance Rate</span>
                  <span className="text-sm font-semibold text-offwhite flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5 text-softblue" />
                    {u.acceptanceRate}
                  </span>
                </div>
              </div>

              {/* Flagship Faculties */}
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-300 block">
                  Flagship Degree Programs
                </span>
                <div className="flex flex-wrap gap-2">
                  {u.popularCourses.map((c, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-200 flex items-center gap-1.5">
                      <BookOpen className="w-3 h-3 text-softblue" />
                      <span>{c}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Fellowship & Highlights */}
              <div className="p-5 rounded-2xl bg-softblue/10 border border-softblue/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-softblue font-bold block mb-1">
                    EXCLUSIVE SCHOLARSHIP PIPELINE
                  </span>
                  <p className="text-xs text-slate-200 font-light">{u.scholarship}</p>
                </div>
                <Award className="w-6 h-6 text-softblue shrink-0 hidden sm:block" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
