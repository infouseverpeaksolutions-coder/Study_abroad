import React, { useState } from 'react';
import { STUDENT_STORIES } from '../../data/consultancyContent';
import { Quote, Award, Sparkles, Briefcase, GraduationCap } from 'lucide-react';

export default function Stories() {
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const story = STUDENT_STORIES[activeStoryIdx] || STUDENT_STORIES[0];

  return (
    <section id="stories" className="relative py-28 px-6 md:px-16 bg-navy-900 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-850 border border-white/10 text-subtlecyan text-xs font-mono uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-softblue" />
              <span>EDITORIAL ARCHIVE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-offwhite tracking-tight">
              Portraits of Ambition
            </h2>
          </div>

          {/* Story Selector Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {STUDENT_STORIES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveStoryIdx(idx)}
                className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-300 flex items-center gap-2 shrink-0 ${
                  activeStoryIdx === idx
                    ? 'bg-softblue text-navy-950 font-bold shadow-glow-soft'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-offwhite'
                }`}
              >
                <span>{s.flag}</span>
                <span>{s.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Large Editorial Magazine Spread */}
        <div
          key={story.id}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center p-8 sm:p-12 rounded-3xl glass-panel border border-white/10 shadow-glass relative overflow-hidden"
        >
          {/* Left Column: Editorial Photo */}
          <div className="lg:col-span-5 relative group">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={story.image}
                alt={story.name}
                className="w-full h-full object-cover object-center filter grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] font-mono tracking-widest uppercase text-subtlecyan block mb-1">
                  ALUMNUS SPOTLIGHT
                </span>
                <h3 className="text-2xl font-display font-bold text-offwhite">{story.name}</h3>
                <p className="text-xs text-slate-300 font-mono mt-0.5">{story.university}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Metrics */}
          <div className="lg:col-span-7 space-y-6">
            <Quote className="w-10 h-10 text-softblue/30" />

            <h4 className="text-xl sm:text-2xl font-light text-offwhite italic leading-relaxed">
              “{story.quote}”
            </h4>

            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              {story.narrative}
            </p>

            {/* Achievement Badge */}
            <div className="p-4 rounded-2xl bg-softblue/10 border border-softblue/20 flex items-center gap-3">
              <Award className="w-6 h-6 text-softblue shrink-0" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-softblue font-bold block">
                  FELLOWSHIP SECURED
                </span>
                <span className="text-xs text-slate-200 font-medium">{story.scholarshipWon}</span>
              </div>
            </div>

            {/* Career Placement */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <Briefcase className="w-5 h-5 text-subtlecyan shrink-0" />
              <div className="text-xs text-slate-300">
                Current Role: <strong className="text-offwhite">{story.currentRole}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
