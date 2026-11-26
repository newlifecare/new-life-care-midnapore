import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CalendarDays,
  QrCode,
  Truck,
  Cpu,
  UserCheck,
  FileCheck2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'

const STAGES = [
  {
    step: '01',
    title: 'Booking & Dispatch',
    subtitle: 'Under 10 Minutes',
    icon: CalendarDays,
    color: 'from-rose-500 to-red-600',
    description: 'Book online, via WhatsApp (9733525031) or phone. A certified phlebotomist is assigned immediately.',
    detail: 'Automated SMS & WhatsApp confirmation with technician name and verified time slot.',
  },
  {
    step: '02',
    title: 'Barcoded Collection',
    subtitle: 'Zero Mix-Up Protocol',
    icon: QrCode,
    color: 'from-sky-500 to-cyan-600',
    description: 'Blood, urine or fluid samples collected using vacuum-sealed BD Vacutainers with unique QR barcodes.',
    detail: 'Patient scans the barcode directly on the spot to verify identity and requested investigations.',
  },
  {
    step: '03',
    title: 'Cold-Chain Transport',
    subtitle: 'Strict 2°C–8°C Box',
    icon: Truck,
    color: 'from-teal-500 to-emerald-600',
    description: 'Specimens are transported in insulated thermal carrier kits directly to our Keranitola central facility.',
    detail: 'Preserves cellular integrity and prevents pre-analytical enzyme degradation.',
  },
  {
    step: '04',
    title: 'Robotic Analysis',
    subtitle: 'Automated Analyzers',
    icon: Cpu,
    color: 'from-indigo-500 to-purple-600',
    description: 'AutoQuant spectrophotometer and 5-Part flow cytometers process specimens with zero manual pipetting.',
    detail: 'Bi-directional LIS interface feeds numerical test data straight from machine into hospital records.',
  },
  {
    step: '05',
    title: 'Dual Pathologist Sign-Off',
    subtitle: 'Clinical Quality Check',
    icon: UserCheck,
    color: 'from-pink-500 to-rose-600',
    description: 'Consultant pathologists scrutinize all abnormal flags and cross-verify with previous patient records.',
    detail: 'Critical panic values are alerted to the patient and consulting physician immediately by phone.',
  },
  {
    step: '06',
    title: 'Instant Digital Report',
    subtitle: 'WhatsApp & Portal Access',
    icon: FileCheck2,
    color: 'from-emerald-500 to-teal-600',
    description: 'NABL-certified PDF report with doctor digital signature and QR verification sent to WhatsApp and web portal.',
    detail: 'Permanent lifetime encrypted cloud storage accessible anytime with Mobile / Booking ID.',
  },
]

export default function SampleJourneyVisualizer() {
  const [activeStage, setActiveStage] = useState(0)

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#ebf5ff]/50 via-white/70 to-[#ebf5ff]/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles size={13} className="text-rose-600" />
            <span>The Diagnostic Quality Pipeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-nunito text-slate-900 tracking-tight leading-tight">
            From Your Arm To Verified Report:{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-red-500 to-sky-600">
              The 6-Stage Journey
            </span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Every test follows an uncompromised NABL quality chain. Zero sample mix-ups, multi-level robotic testing, and dual pathologist cross-verification.
          </p>
        </div>

        {/* 6 Stage Interactive Grid / Pipeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-10">
          {STAGES.map((st, idx) => {
            const Icon = st.icon
            const isAct = idx === activeStage
            return (
              <div
                key={st.step}
                onClick={() => setActiveStage(idx)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                  isAct
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/20 scale-105'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-2xs hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-black font-mono px-2 py-0.5 rounded-md ${isAct ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {st.step}
                    </span>
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${st.color} text-white flex items-center justify-center shadow-xs`}>
                      <Icon size={15} />
                    </div>
                  </div>

                  <h4 className="font-extrabold text-sm leading-snug mb-1">
                    {st.title}
                  </h4>
                  <span className={`text-[10px] font-bold block ${isAct ? 'text-rose-300' : 'text-slate-400'}`}>
                    {st.subtitle}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 text-[11px] leading-relaxed line-clamp-3 opacity-90">
                  {st.description}
                </div>
              </div>
            )
          })}
        </div>

        {/* Active Stage Callout Detail Card */}
        <motion.div
          key={activeStage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${STAGES[activeStage].color} text-white flex items-center justify-center shrink-0 shadow-lg`}>
              {(() => {
                const ActiveIcon = STAGES[activeStage].icon
                return <ActiveIcon size={26} />
              })()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-rose-600">
                  STAGE {STAGES[activeStage].step} OF 06
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-bold text-slate-500">
                  {STAGES[activeStage].subtitle}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-nunito text-slate-900 mt-0.5">
                {STAGES[activeStage].title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                {STAGES[activeStage].detail}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <Link
              to="/book-collection"
              className="flex-1 md:flex-initial text-center bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs sm:text-sm py-3 px-5 rounded-xl shadow-md shadow-rose-600/20 transition-all active:scale-95"
            >
              Experience At-Home Collection
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
