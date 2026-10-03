import React, { useState } from 'react';
import { JOURNEY_STAGES } from '../../data/journeyStagesData';
import { CheckCircle2, Clock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Journey({ onOpenModal }) {
  const [activeStep, setActiveStep] = useState(0);
  const currentStage = JOURNEY_STAGES[activeStep] || JOURNEY_STAGES[0];

  return (
    <section id="journey" className="relative py-28 px-6 md:px-16 bg-navy-900 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-850 border border-white/10 text-subtlecyan text-xs font-mono tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-softblue" />
            <span>THE APPLICATION JOURNEY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-offwhite tracking-tight mb-4">
            Structured Pathway to the World's Best
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
            From initial academic diagnostic to stepping onto your international campus, experience an orchestrated admissions pathway with zero ambiguity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 6-Step Stepper Roadmap */}
          <div className="lg:col-span-5 space-y-3">
            {JOURNEY_STAGES.map((s, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={s.step}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
                    isActive
                      ? 'bg-navy-850 border-softblue/50 shadow-glow-soft translate-x-2'
                      : 'bg-navy-950/60 border-white/5 opacity-70 hover:opacity-100 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-9 h-9 rounded-xl font-mono text-xs font-bold flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-softblue text-navy-950 shadow-md font-extrabold'
                          : 'bg-white/10 text-slate-400 group-hover:bg-white/20 group-hover:text-offwhite'
                      }`}
                    >
                      {s.step}
                    </span>
                    <div>
                      <h3 className={`text-sm font-semibold transition-colors ${isActive ? 'text-offwhite' : 'text-slate-300'}`}>
                        {s.title}
                      </h3>
                      <span className="text-[10px] font-mono text-subtlecyan uppercase tracking-wider block">
                        {s.category}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-softblue" />
                    {s.timeline}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed Stage Deep-Dive Card */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-white/10 shadow-glass relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-softblue">
                    MILESTONE {currentStage.step} OF 06
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-offwhite mt-1">
                    {currentStage.title}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-softblue">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              <p className="text-base text-slate-200 font-light leading-relaxed mb-8">
                {currentStage.desc}
              </p>

              {/* Deliverables List */}
              <div className="space-y-3 mb-8 bg-navy-950/60 p-6 rounded-2xl border border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-2">
                  Key Deliverables & Action Items
                </span>
                {currentStage.deliverables.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-200">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-mono text-slate-400">
                  Target Completion: <strong className="text-offwhite">{currentStage.timeline}</strong>
                </span>
                <button
                  onClick={onOpenModal}
                  className="px-6 py-3 rounded-full bg-softblue text-navy-950 text-xs font-bold uppercase tracking-wider hover:bg-subtlecyan transition-all flex items-center gap-2"
                >
                  <span>Initiate Stage {currentStage.step}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
