import React from 'react';
import { Compass, ShieldCheck, Mail, Phone, MapPin, ArrowUp, Globe2 } from 'lucide-react';

export default function Footer({ onOpenModal }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const offices = [
    { city: 'London', address: '12 Berkeley Square, Mayfair, W1J 6BD', phone: '+44 20 7946 0920' },
    { city: 'Boston', address: '100 Federal Street, Suite 2900, MA 02110', phone: '+1 617 555 0142' },
    { city: 'Toronto', address: 'Bay Adelaide Centre, 333 Bay St, ON M5H 2R2', phone: '+1 416 555 0188' },
    { city: 'Sydney', address: 'Barangaroo International Towers, NSW 2000', phone: '+61 2 8000 0177' },
    { city: 'Berlin', address: 'Potsdamer Platz 1, 10785 Berlin', phone: '+49 30 555 0192' }
  ];

  return (
    <footer className="relative bg-navy-950 border-t border-white/10 text-slate-400 z-20 pt-20 pb-12 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16 pb-16 border-b border-white/10">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-softblue/15 border border-softblue/30 flex items-center justify-center">
                <Compass className="w-5 h-5 text-softblue" />
              </div>
              <span className="font-display font-bold text-xl text-offwhite tracking-wider">
                AURA <span className="text-softblue font-light">GLOBAL</span>
              </span>
            </div>

            <p className="text-sm text-slate-300 font-light leading-relaxed max-w-sm">
              A premier international education advisory firm guiding high-achieving scholars into the world’s leading universities through bespoke strategic counsel.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono uppercase text-slate-400">
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">ICEF Accredited #4920</span>
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">British Council Certified</span>
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">AIRC Certified</span>
            </div>
          </div>

          {/* Col 3: Destinations */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-offwhite mb-4">
              Destinations
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#destinations" className="hover:text-softblue transition-colors">Study in United Kingdom</a></li>
              <li><a href="#destinations" className="hover:text-softblue transition-colors">Study in United States</a></li>
              <li><a href="#destinations" className="hover:text-softblue transition-colors">Study in Canada</a></li>
              <li><a href="#destinations" className="hover:text-softblue transition-colors">Study in Australia</a></li>
              <li><a href="#destinations" className="hover:text-softblue transition-colors">Study in Germany</a></li>
              <li><a href="#destinations" className="hover:text-softblue transition-colors">Study in New Zealand</a></li>
            </ul>
          </div>

          {/* Col 4: Services */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-offwhite mb-4">
              Advisory Suites
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#services" className="hover:text-softblue transition-colors">Profile Diagnostic Assessment</a></li>
              <li><a href="#services" className="hover:text-softblue transition-colors">Institutional Selection</a></li>
              <li><a href="#services" className="hover:text-softblue transition-colors">SOP & Application Editing</a></li>
              <li><a href="#services" className="hover:text-softblue transition-colors">Visa & Embassy Defense</a></li>
              <li><a href="#services" className="hover:text-softblue transition-colors">Fellowship Hunting</a></li>
              <li><a href="#services" className="hover:text-softblue transition-colors">Pre-Departure Housing</a></li>
            </ul>
          </div>

          {/* Col 5: Global Inquiries */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-offwhite mb-4">
              Direct Contact
            </h4>
            <div className="text-xs space-y-2.5">
              <a href="tel:+18005550199" className="flex items-center gap-2 hover:text-softblue transition-colors">
                <Phone className="w-3.5 h-3.5 text-softblue" />
                <span>+1 (800) 555-0199</span>
              </a>
              <a href="mailto:admissions@auraglobal.edu" className="flex items-center gap-2 hover:text-softblue transition-colors">
                <Mail className="w-3.5 h-3.5 text-softblue" />
                <span>admissions@auraglobal.edu</span>
              </a>
            </div>
            <button
              onClick={onOpenModal}
              className="w-full py-2.5 px-4 rounded-xl bg-softblue/10 border border-softblue/30 text-softblue hover:bg-softblue hover:text-navy-950 text-xs font-semibold uppercase tracking-wider transition-all mt-4"
            >
              Book Private Consultation
            </button>
          </div>
        </div>

        {/* Global Advisory Suites Grid */}
        <div className="mb-12">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-4">
            GLOBAL ADVISORY SUITES
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-[11px] font-mono">
            {offices.map((o) => (
              <div key={o.city} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-offwhite font-bold block mb-1">{o.city}</span>
                <span className="text-slate-400 block text-[10px] leading-tight mb-2">{o.address}</span>
                <span className="text-softblue block text-[10px]">{o.phone}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AURA Global Overseas Advisory Ltd. All international rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-slate-400 hover:text-offwhite transition-colors"
          >
            <span>Back to Summit</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
