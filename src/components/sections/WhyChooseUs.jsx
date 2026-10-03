import React from 'react';
import { WHY_CHOOSE_US } from '../../data/consultancyContent';
import { UserCheck, Target, FileText, ShieldCheck, Award, PlaneTakeoff, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';

const iconMap = {
  UserCheck,
  Target,
  FileText,
  ShieldCheck,
  Award,
  PlaneTakeoff
};

const AUDITED_STATS = [
  { value: '99.4%', label: 'First-Time Visa Approval', detail: 'Audited across UK, US, CA, AU & DE' },
  { value: '$14.2M+', label: 'Scholarships Awarded', detail: 'Cumulative tuition fellowships secured' },
  { value: '1,200+', label: 'Top 100 Offers', detail: 'Admissions into QS/THE World Top 100' },
  { value: '14 Days', label: 'Median Turnaround', detail: 'Average timeline to first offer letter' }
];

export default function WhyChooseUs({ onOpenModal }) {
  return (
    <section id="why-us" className="relative py-28 px-6 md:px-16 bg-navy-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-850 border border-white/10 text-subtlecyan text-xs font-mono uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-softblue" />
              <span>THE ADVISORY ADVANTAGE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-offwhite tracking-tight">
              Why Discerning Students Choose Us
            </h2>
          </div>
          <p className="text-slate-300 text-sm sm:text-base max-w-md font-light">
            We reject the template-driven volume model. We provide algorithmic institution matching, Oxbridge editorial standards, and unmatched visa precision.
          </p>
        </div>

        {/* Audited Statistics Counter Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {AUDITED_STATS.map((s, idx) => (
            <div key={idx} className="p-6 rounded-3xl glass-panel border border-white/10 shadow-glass">
              <span className="text-3xl sm:text-4xl font-display font-extrabold text-softblue block mb-1">
                {s.value}
              </span>
              <span className="text-xs font-semibold text-offwhite block mb-0.5">{s.label}</span>
              <span className="text-[10px] font-mono text-slate-400 block">{s.detail}</span>
            </div>
          ))}
        </div>

        {/* 6 Core Strategic Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CHOOSE_US.map((item) => {
            const Icon = iconMap[item.icon] || UserCheck;
            return (
              <div
                key={item.id}
                className="group relative p-8 rounded-3xl glass-panel border border-white/10 hover:border-softblue/30 transition-all duration-300 shadow-glass overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-softblue group-hover:scale-110 group-hover:text-subtlecyan transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full bg-navy-950 border border-white/10 text-subtlecyan">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-display font-bold text-offwhite mb-3 group-hover:text-softblue transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-white/5 text-xs text-emerald-400 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Guaranteed SLA Standard</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
