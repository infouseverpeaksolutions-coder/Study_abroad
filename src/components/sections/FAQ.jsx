import React, { useState } from 'react';
import { FAQS } from '../../data/consultancyContent';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';

export default function FAQ({ onOpenModal }) {
  const [openIdx, setOpenIdx] = useState(0);

  const toggleFaq = (idx) => {
    setOpenIdx(openIdx === idx ? -1 : idx);
  };

  return (
    <section id="faq" className="relative py-28 px-6 md:px-16 bg-navy-950 border-t border-white/10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-850 border border-white/10 text-subtlecyan text-xs font-mono uppercase tracking-widest mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-softblue" />
            <span>TRANSPARENT ANSWERS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-offwhite tracking-tight mb-4">
            Frequently Asked Questions
          </h2>

          <p className="text-slate-300 text-sm sm:text-base font-light max-w-lg mx-auto">
            Everything you need to know about admissions, tuition economics, visa guidelines, and our advisory methodology.
          </p>
        </div>

        {/* Clean Accordion List */}
        <div className="space-y-3">
          {FAQS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 glass-panel overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-base sm:text-lg font-display font-semibold text-offwhite">
                    {item.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-softblue transition-transform duration-300 ${isOpen ? 'rotate-180 bg-softblue/20' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-0 animate-fade-in">
                    <p className="text-sm text-slate-300 font-light leading-relaxed border-t border-white/5 pt-4">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center p-6 rounded-3xl bg-navy-900 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <MessageSquare className="w-6 h-6 text-softblue shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-offwhite">Have a specific or complex inquiry?</h4>
              <p className="text-xs text-slate-400">Our senior counselors are available for confidential profile evaluations.</p>
            </div>
          </div>
          <button
            onClick={onOpenModal}
            className="px-6 py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-offwhite transition-all shrink-0"
          >
            Speak With Counselor
          </button>
        </div>
      </div>
    </section>
  );
}
