import React from 'react';
import { UserCheck, Compass, FileText, ShieldCheck, Award, Plane, ArrowRight } from 'lucide-react';

const SERVICES = [
  {
    step: '01',
    title: 'Profile Assessment',
    desc: 'Comprehensive diagnostic evaluation of your academic records, research publications, GPA conversions, and extracurricular accomplishments.',
    icon: UserCheck,
    tag: 'Diagnostic'
  },
  {
    step: '02',
    title: 'University Selection',
    desc: 'Algorithmic tier-based institutional shortlisting (Ambitious, Target, Safe) tailored to acceptance rates, faculty specializations, and living costs.',
    icon: Compass,
    tag: 'Strategy'
  },
  {
    step: '03',
    title: 'Application Assistance',
    desc: 'Bespoke drafting and editorial refinement for Statements of Purpose (SOP), Letters of Recommendation (LOR), and institutional portfolios.',
    icon: FileText,
    tag: 'Editorial'
  },
  {
    step: '04',
    title: 'Visa Guidance',
    desc: 'Precision embassy interview preparation, financial proof audits, CAS/I-20 validation, and 99.4% first-time visa approval architecture.',
    icon: ShieldCheck,
    tag: 'Compliance'
  },
  {
    step: '05',
    title: 'Scholarship Guidance',
    desc: 'Aggressive institutional fellowship hunting, merit bursary application strategies, and external government endowment filings.',
    icon: Award,
    tag: 'Funding'
  },
  {
    step: '06',
    title: 'Pre-Departure Support',
    desc: 'Student accommodation reservations, health insurance compliance, student forex accounts, and international peer community onboarding.',
    icon: Plane,
    tag: 'Logistics'
  }
];

export default function Services({ onOpenModal }) {
  return (
    <section id="services" className="relative py-28 px-6 md:px-16 bg-navy-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-850 border border-white/10 text-subtlecyan text-xs font-mono tracking-widest uppercase mb-3">
            <span>END-TO-END ADVISORY SUITE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-offwhite tracking-tight mb-4">
            Bespoke Advisory Services
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
            Every step of your transatlantic academic pathway is orchestrated by senior admissions directors and licensed immigration attorneys.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="glass-panel rounded-3xl p-8 border border-white/10 hover:border-softblue/30 transition-all duration-300 group relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-softblue group-hover:scale-110 group-hover:text-subtlecyan transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs text-slate-500 font-semibold">{s.step}</span>
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-widest text-subtlecyan block mb-2">{s.tag}</span>
                  <h3 className="text-xl font-display font-bold text-offwhite mb-3 group-hover:text-softblue transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed mb-6">
                    {s.desc}
                  </p>
                </div>

                <button
                  onClick={onOpenModal}
                  className="text-xs font-semibold text-softblue hover:text-white flex items-center gap-1.5 pt-4 border-t border-white/5 transition-colors"
                >
                  <span>Consult Advisory Team</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
