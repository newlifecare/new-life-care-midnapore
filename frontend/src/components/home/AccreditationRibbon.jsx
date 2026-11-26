import { ShieldCheck, Award, CheckCircle2, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AccreditationRibbon() {
  return (
    <section className="bg-white border-b border-slate-200/90 py-5 select-none relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left Title & Status */}
          <div className="text-center lg:text-left flex flex-col sm:flex-row items-center gap-3.5">
            <img
              src="/images/logo.jpg"
              alt="New Life Care Diagnostic Centre"
              className="w-12 h-12 rounded-full border-2 border-slate-200 shadow-sm shrink-0 object-cover bg-white"
            />
            <div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[11px] font-black uppercase tracking-widest text-rose-600">
                  Verified Government & International Quality Accreditations
                </span>
              </div>
              <p className="text-slate-900 font-extrabold text-sm sm:text-base tracking-tight">
                NABL M(EL)T Reg. No. 02159 • ISO 9001:2015 Pathology • IAF & KAB Certified
              </p>
              <p className="text-xs text-slate-500 font-medium">
                Keranitola, Station Road, Midnapore Town (721101) • Reports Valid Globally & at AIIMS
              </p>
            </div>
          </div>

          {/* Right Official Accreditation Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Accreditation Badges Strip Image */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2 px-4 sm:px-6 shadow-2xs flex items-center justify-center hover:border-slate-300 transition-colors">
              <img
                src="/images/accreditations-strip.jpg"
                alt="Accreditations: IAF, KAB KAB-QC-88, NABL Medical Labs, ISO 9001:2015"
                className="h-9 sm:h-11 md:h-12 object-contain"
              />
            </div>

            {/* Quick Stat Chips */}
            <div className="hidden sm:flex flex-col gap-1 text-left">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <CheckCircle2 size={13} className="text-emerald-600" />
                <span>100% Computerized Analyzers</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <CheckCircle2 size={13} className="text-sky-600" />
                <span>Dual Pathologist Sign-Off</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
