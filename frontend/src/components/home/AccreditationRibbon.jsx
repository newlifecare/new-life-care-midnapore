import { ShieldCheck, Award, CheckCircle2, FileCheck, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'

const CERTIFICATES = [
  {
    code: 'NABL M(EL)T',
    name: 'National Accreditation Board for Testing and Calibration Laboratories',
    badge: 'Reg. No. 02159',
    description: 'Highest government quality accreditation for clinical pathology & medical laboratory precision.',
    color: 'from-rose-500 to-red-600',
    borderColor: 'border-red-200',
    bgLight: 'bg-red-50/60',
  },
  {
    code: 'ISO 9001 : 2015',
    name: 'Certified Pathology Laboratory',
    badge: 'Global Quality Standard',
    description: 'Certified standard operating procedures for zero-contamination blood handling & dual pathologist sign-off.',
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-200',
    bgLight: 'bg-amber-50/60',
  },
  {
    code: 'IAF Multilateral',
    name: 'International Accreditation Forum',
    badge: 'Global Recognition',
    description: 'Reports valid across AIIMS, PGIMER, CMC Vellore, and top medical institutes worldwide.',
    color: 'from-sky-500 to-blue-600',
    borderColor: 'border-sky-200',
    bgLight: 'bg-sky-50/60',
  },
  {
    code: 'KAB Accreditation',
    name: 'Korea Accreditation Board',
    badge: 'KAB-QC-88',
    description: 'International quality audit compliance for automated clinical analyzers and quality controls.',
    color: 'from-indigo-500 to-blue-700',
    borderColor: 'border-indigo-200',
    bgLight: 'bg-indigo-50/60',
  },
]

export default function AccreditationRibbon() {
  return (
    <section className="bg-gradient-to-b from-[#f2f8ff] via-white to-[#edf6ff] border-y border-sky-100 py-8 select-none relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Strip with Official Banner */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="text-center lg:text-left flex flex-col sm:flex-row items-center gap-4">
            <img
              src="/images/logo.jpg"
              alt="New Life Care Diagnostic Centre"
              className="w-14 h-14 rounded-full border-2 border-red-500 shadow-sm shrink-0 object-cover bg-white p-0.5"
            />
            <div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-widest text-[#d91d24]">
                  Official Quality Certifications & Accreditations
                </span>
              </div>
              <h2 className="text-slate-900 font-black text-lg sm:text-xl tracking-tight mt-0.5">
                NABL M(EL)T Accredited & ISO 9001:2015 Certified Diagnostic Centre
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Reg. No. 02159 • Keranitola, Paschim Medinipur (721101) • Reports Valid Globally & at AIIMS
              </p>
            </div>
          </div>

          {/* Official Certificates Strip Badge */}
          <div className="flex items-center justify-center">
            <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 border-2 border-slate-200/90 rounded-2xl p-2 px-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
              <img
                src="/images/accreditations-strip.jpg"
                alt="Accreditations: NABL LABS, ISO 9001:2015, IAF, KAB KAB-QC-88"
                className="h-10 sm:h-12 md:h-14 object-contain"
              />
            </div>
          </div>
        </div>

        {/* 4 Interactive Certification Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {CERTIFICATES.map((cert, idx) => (
            <motion.div
              key={cert.code}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className={`p-4 rounded-2xl border ${cert.borderColor} ${cert.bgLight} hover:bg-white hover:shadow-md transition-all duration-300 flex flex-col justify-between group`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-lg text-white bg-gradient-to-r ${cert.color} shadow-xs`}>
                    {cert.code}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-white/80 border border-slate-200 px-2 py-0.5 rounded-full">
                    {cert.badge}
                  </span>
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-[#07478f] transition-colors leading-snug">
                  {cert.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {cert.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                <span>Verified & Active Certification</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
