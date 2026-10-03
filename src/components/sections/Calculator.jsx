import React, { useState } from 'react';
import { Calculator, DollarSign, Clock, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { DESTINATIONS } from '../../data/destinationsData';

export default function CalculatorSection({ onOpenModal }) {
  const [selectedCountry, setSelectedCountry] = useState(DESTINATIONS[0].id);
  const [degreeLevel, setDegreeLevel] = useState('Masters');

  const dest = DESTINATIONS.find((d) => d.id === selectedCountry) || DESTINATIONS[0];

  const costLookup = {
    uk: { Masters: { tuition: '£18,500 – £26,000', living: '£12,000 – £15,000', psw: '2 Years' }, Undergraduate: { tuition: '£16,000 – £22,000', living: '£12,000 – £15,000', psw: '2 Years' }, MBA: { tuition: '£28,000 – £45,000', living: '£15,000 – £18,000', psw: '2 Years' } },
    canada: { Masters: { tuition: 'CAD $22,000 – $32,000', living: 'CAD $16,000 – $20,000', psw: 'Up to 3 Years (PGWP)' }, Undergraduate: { tuition: 'CAD $24,000 – $36,000', living: 'CAD $16,000 – $20,000', psw: '3 Years' }, MBA: { tuition: 'CAD $38,000 – $58,000', living: 'CAD $18,000 – $22,000', psw: '3 Years' } },
    australia: { Masters: { tuition: 'AUD $28,000 – $38,000', living: 'AUD $24,000 – $28,000', psw: '2 – 3 Years' }, Undergraduate: { tuition: 'AUD $26,000 – $35,000', living: 'AUD $24,000 – $28,000', psw: '2 Years' }, MBA: { tuition: 'AUD $40,000 – $60,000', living: 'AUD $26,000 – $30,000', psw: '2 – 3 Years' } },
    usa: { Masters: { tuition: '$28,000 – $48,000', living: '$18,000 – $24,000', psw: '3 Years (OPT + STEM)' }, Undergraduate: { tuition: '$30,000 – $55,000', living: '$18,000 – $24,000', psw: '3 Years' }, MBA: { tuition: '$55,000 – $85,000', living: '$22,000 – $28,000', psw: '1 – 3 Years' } },
    germany: { Masters: { tuition: '€0 – €3,000 (Public)', living: '€11,208 (Blocked Account)', psw: '18 Months' }, Undergraduate: { tuition: '€0 – €1,500 (Public)', living: '€11,208 (Blocked Account)', psw: '18 Months' }, MBA: { tuition: '€15,000 – €30,000', living: '€11,208 (Blocked Account)', psw: '18 Months' } },
    newzealand: { Masters: { tuition: 'NZD $26,000 – $35,000', living: 'NZD $20,000 – $24,000', psw: 'Up to 3 Years' }, Undergraduate: { tuition: 'NZD $24,000 – $32,000', living: 'NZD $20,000 – $24,000', psw: '3 Years' }, MBA: { tuition: 'NZD $35,000 – $50,000', living: 'NZD $22,000 – $26,000', psw: '3 Years' } }
  };

  const currentEstimates = costLookup[selectedCountry]?.[degreeLevel] || {
    tuition: '$25,000 / yr',
    living: '$15,000 / yr',
    psw: '2-3 Years'
  };

  return (
    <section id="calculator" className="relative py-28 px-6 md:px-16 bg-navy-900 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Form Controls */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-850 border border-white/10 text-subtlecyan text-xs font-mono uppercase tracking-widest">
              <Calculator className="w-3.5 h-3.5 text-softblue" />
              <span>FINANCIAL PLANNING // ROI MATRIX</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-offwhite tracking-tight">
              Interactive Budget & Visa Estimator
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
              Calculate projected tuition fees, statutory cost-of-living proof requirements, and post-study employment rights across the world’s top academic destinations.
            </p>

            {/* Country Selector */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                1. Select Destination Country
              </label>
              <div className="grid grid-cols-3 gap-2">
                {DESTINATIONS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedCountry(d.id)}
                    className={`p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                      selectedCountry === d.id
                        ? 'bg-softblue text-navy-950 font-bold border-softblue shadow-glow-soft'
                        : 'bg-navy-950/70 border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <span>{d.flag}</span>
                    <span>{d.name === 'United Kingdom' ? 'UK' : d.name === 'United States' ? 'USA' : d.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Degree Level Selector */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                2. Target Degree Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Undergraduate', 'Masters', 'MBA'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setDegreeLevel(lvl)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                      degreeLevel === lvl
                        ? 'bg-softblue text-navy-950 font-bold border-softblue shadow-glow-soft'
                        : 'bg-navy-950/70 border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Live Estimate Output Card */}
          <div className="lg:col-span-6">
            <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-white/10 shadow-glass space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{dest.flag}</span>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-softblue">ANNUAL PROJECTION</span>
                    <h3 className="text-xl font-display font-bold text-offwhite">{dest.name} ({degreeLevel})</h3>
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  Eligible
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-navy-950/60 border border-white/5">
                  <span className="text-xs text-slate-400">Estimated Annual Tuition</span>
                  <span className="text-base font-semibold text-subtlecyan">{currentEstimates.tuition}</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-navy-950/60 border border-white/5">
                  <span className="text-xs text-slate-400">Living Expenses / Proof of Funds</span>
                  <span className="text-base font-semibold text-offwhite">{currentEstimates.living}</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-navy-950/60 border border-white/5">
                  <span className="text-xs text-slate-400">Post-Study Work Visa</span>
                  <span className="text-base font-semibold text-emerald-400">{currentEstimates.psw}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-softblue/10 border border-softblue/20">
                <span className="text-[10px] font-mono uppercase tracking-widest text-softblue font-bold block mb-1">
                  MAXIMUM SCHOLARSHIP POTENTIAL
                </span>
                <p className="text-xs text-slate-200 font-light">{dest.scholarships}</p>
              </div>

              <button
                onClick={onOpenModal}
                className="w-full py-4 rounded-full bg-gradient-to-r from-softblue to-subtlecyan text-navy-950 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <span>Request Detailed Cost & Visa Audit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
