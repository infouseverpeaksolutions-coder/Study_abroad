import React, { useState } from 'react';
import { X, CheckCircle, ArrowRight, Sparkles, Calendar, ShieldCheck, Mail, Phone, User, GraduationCap } from 'lucide-react';
import { DESTINATIONS } from '../../data/destinationsData';

export default function ConsultationModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'United Kingdom',
    degree: 'Masters (Postgraduate)',
    intake: 'Fall 2026',
    qualification: '',
    budget: '$25,000 – $40,000 / yr'
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-space-950/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-2xl bg-space-900 border border-cyan-500/20 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden">
        {/* Glow ambient background blur */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                1-on-1 Strategic Profile Evaluation
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                Begin Your Global Chapter
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Receive an algorithmic eligibility report, university shortlist & scholarship roadmap within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elena Rostova"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-space-850 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="elena@university.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-space-850 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone / WhatsApp */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-cyan-400" />
                    WhatsApp / Phone
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 019-2834"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-space-850 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>

                {/* Preferred Destination */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Target Study Destination
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-space-850 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  >
                    {DESTINATIONS.map((d) => (
                      <option key={d.id} value={d.name} className="bg-space-900 text-white">
                        {d.flag} {d.name}
                      </option>
                    ))}
                    <option value="Undecided / Open to Options" className="bg-space-900 text-white">
                      🌍 Undecided / Open to Options
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Degree Level */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                    Target Program Level
                  </label>
                  <select
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-space-850 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  >
                    <option value="Masters (Postgraduate)">Masters (Postgraduate / MSc / MA)</option>
                    <option value="Undergraduate (BSc / BA)">Undergraduate (BSc / BA / BEng)</option>
                    <option value="MBA (Business Administration)">MBA (Business Administration)</option>
                    <option value="PhD / Doctoral Research">PhD / Doctoral Research</option>
                  </select>
                </div>

                {/* Target Intake */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    Anticipated Intake
                  </label>
                  <select
                    value={formData.intake}
                    onChange={(e) => setFormData({ ...formData, intake: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-space-850 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  >
                    <option value="Fall 2026 (Priority)">Fall 2026 (Aug / Sept)</option>
                    <option value="Spring 2027">Spring 2027 (Jan / Feb)</option>
                    <option value="Fall 2027">Fall 2027</option>
                  </select>
                </div>
              </div>

              {/* Current Background / GPA */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Current Degree, Major & Approx GPA / Percentage (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. B.Tech Computer Science, 8.4 CGPA or 3.6/4.0"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-space-850 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-slate-950 font-bold text-sm tracking-wide shadow-glow-cyan hover:shadow-cyan-400/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      Analyzing Academic Profile...
                    </span>
                  ) : (
                    <>
                      <span>Submit Profile for Expert Review</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1.5 mt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                100% Confidential. GDPR Compliant. No Spam Guarantee.
              </p>
            </form>
          </div>
        ) : (
          <div className="py-8 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 mx-auto flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/20">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-display font-bold text-white mb-2">
              Profile Successfully Registered
            </h4>
            <p className="text-slate-300 text-sm max-w-md mx-auto mb-6">
              Thank you, <span className="text-cyan-400 font-semibold">{formData.name}</span>. A senior international admissions director specializing in <span className="text-cyan-400 font-semibold">{formData.country}</span> has been assigned to your file.
            </p>

            <div className="bg-space-850/80 border border-white/10 rounded-2xl p-4 max-w-sm mx-auto mb-6 text-left text-xs font-mono space-y-1.5 text-slate-300">
              <div className="flex justify-between text-slate-400">
                <span>FILE REFERENCE:</span>
                <span className="text-cyan-400">#AGY-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between">
                <span>TARGET:</span>
                <span className="text-white">{formData.country}</span>
              </div>
              <div className="flex justify-between">
                <span>INTAKE:</span>
                <span className="text-white">{formData.intake}</span>
              </div>
              <div className="flex justify-between">
                <span>STATUS:</span>
                <span className="text-emerald-400">Priority Dispatch</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold tracking-wider uppercase transition-colors"
            >
              Return to Journey
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
