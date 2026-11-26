import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  Brain,
  FlaskConical,
  Wind,
  Stethoscope,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  CalendarDays,
  Sparkles,
} from 'lucide-react'

const SYSTEMS = [
  {
    id: 'pathology',
    name: 'Advanced Pathology & Blood',
    shortName: 'Pathology & Blood',
    icon: FlaskConical,
    tag: 'Automated Analyzers',
    tagColor: 'bg-rose-50 text-rose-700 border-rose-200',
    accentColor: 'from-rose-500 to-red-600',
    lightBg: 'bg-rose-50/60',
    description:
      'Fully robotic testing on automated chemistry and 5-part hematology counters. Comprehensive blood, urine, stool, semen, and sputum investigations with zero manual pipetting error.',
    parameters: ['AutoQuant 500 Chemistry', '5-Part Cell Counter', 'Spectrophotometric Precision', 'NABL Accredited'],
    commonTests: [
      { name: 'Complete Blood Count (CBC + ESR)', time: '2 Hours', prep: 'No Fasting' },
      { name: 'Liver Function Test (LFT Panel)', time: '4 Hours', prep: '8 Hr Fasting' },
      { name: 'Kidney Function Test (KFT / Urea / Creatinine)', time: '3 Hours', prep: 'No Fasting' },
      { name: 'Lipid Profile Screen (Cholesterol & Triglycerides)', time: '4 Hours', prep: '10–12 Hr Fasting' },
      { name: 'Thyroid Profile (T3, T4, Ultrasensitive TSH)', time: 'Same Day', prep: 'Morning Sample' },
      { name: 'HbA1c Glycated Hemoglobin', time: '2 Hours', prep: 'No Fasting' },
    ],
    highlight: 'Over 250+ specialized blood & fluid assays available 24/7 with doorstep collection.',
  },
  {
    id: 'cardiology',
    name: 'Cardiology & Heart Diagnostics',
    shortName: 'Heart & ECG',
    icon: Heart,
    tag: 'Continuous Monitoring',
    tagColor: 'bg-sky-50 text-sky-700 border-sky-200',
    accentColor: 'from-sky-500 to-cyan-600',
    lightBg: 'bg-sky-50/60',
    description:
      'Comprehensive cardiac rhythm and ischemic risk diagnostics featuring computerized 12-lead digital ECG and continuous 24-hour ambulatory Holter monitoring backed by senior cardiothoracic advisors.',
    parameters: ['12-Lead Computerized ECG', '24-Hour Ambulatory Holter', 'Instant Digital Rhythm Strip', 'Cardiologist Verified'],
    commonTests: [
      { name: 'Computerized 12-Lead Digital ECG', time: '15 Minutes', prep: 'Instant Priority' },
      { name: '24-Hour Ambulatory Holter Recording', time: 'Next Day', prep: 'Wearable Unit' },
      { name: 'High-Sensitivity Cardiac Enzymes (Trop-I)', time: '2 Hours', prep: 'Emergency Bay' },
      { name: 'Comprehensive Cardiovascular Risk Profile', time: 'Same Day', prep: '10 Hr Fasting' },
    ],
    highlight: 'Emergency ECG interpretations delivered immediately with consultant surgeon advisory.',
  },
  {
    id: 'neurology',
    name: 'Neurology & Electrophysiology',
    shortName: 'Brain & Nerves',
    icon: Brain,
    tag: 'Specialized Neuro Bay',
    tagColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    accentColor: 'from-indigo-500 to-purple-600',
    lightBg: 'bg-indigo-50/60',
    description:
      'Specialized electrophysiological diagnostic setup in Midnapore for brain waves, nerve impulse conduction, peripheral neuropathies, carpal tunnel syndrome, and seizure evaluations.',
    parameters: ['Digital 32-Channel EEG', 'Nerve Conduction Velocity (NCV)', 'Sensory & Motor Evoked Potentials', 'AIIMS Specialist Advisory'],
    commonTests: [
      { name: 'Digital Electroencephalogram (EEG)', time: 'Same Day', prep: 'Clean Hair, No Oil' },
      { name: 'Nerve Conduction Velocity (NCV Test)', time: 'Same Day', prep: 'Warm Extremities' },
      { name: 'Neuropathy & Radiculopathy Screen', time: 'Same Day', prep: 'Doctor Supervised' },
      { name: 'Epilepsy & Seizure Assessment Panel', time: 'Same Day', prep: 'Report with Graph' },
    ],
    highlight: 'Directed by AIIMS-trained neurologists with high-density computerized trace analysis.',
  },
  {
    id: 'pulmonology',
    name: 'Pulmonology & Respiratory Care',
    shortName: 'Lungs & Oxygen',
    icon: Wind,
    tag: '24/7 Oxygen Support',
    tagColor: 'bg-teal-50 text-teal-700 border-teal-200',
    accentColor: 'from-teal-500 to-emerald-600',
    lightBg: 'bg-teal-50/60',
    description:
      'Advanced respiratory investigations assessing lung volume, airway resistance, asthma, COPD, and occupational dust disease. Emergency medical oxygen cylinders available 24/7 across Midnapore.',
    parameters: ['Computerized Spirometry (PFT)', 'Pre & Post Bronchodilator Curve', 'Medical Oxygen Cylinders', '24x7 Emergency Dispatch'],
    commonTests: [
      { name: 'Computerized Pulmonary Function Test (PFT)', time: '30 Minutes', prep: 'Avoid Heavy Meal' },
      { name: 'Bronchodilator Reversibility Spirometry', time: '45 Minutes', prep: 'Inhaler Guidance' },
      { name: 'Emergency Medical Oxygen Cylinder Delivery', time: 'Immediate', prep: '24/7 Hotline' },
      { name: 'Sputum for AFB & Culture Examination', time: '24–48 Hours', prep: 'Early Morning Sample' },
    ],
    highlight: 'Emergency oxygen cylinders stocked and dispatched round-the-clock from Keranitola.',
  },
  {
    id: 'gastro',
    name: 'Gastroenterology & Liver Health',
    shortName: 'Digestive & GI',
    icon: Activity,
    tag: 'Endoscopy & Laser',
    tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    accentColor: 'from-emerald-500 to-teal-600',
    lightBg: 'bg-emerald-50/60',
    description:
      'Specialized gastrointestinal pathology, liver enzymes, hepatitis serology, pancreatic risk markers, and consultation chamber for advanced endo-laparoscopic & GI surgery.',
    parameters: ['Complete Liver Profile', 'Viral Hepatitis Serology (B & C)', 'Pancreatic Amylase & Lipase', 'BHU Surgeon Advisory'],
    commonTests: [
      { name: 'Comprehensive Liver Panel (LFT Complete)', time: '4 Hours', prep: '8 Hr Fasting' },
      { name: 'HBsAg & Anti-HCV Screening', time: '3 Hours', prep: 'No Fasting' },
      { name: 'Serum Amylase & Lipase Markers', time: '3 Hours', prep: 'Emergency Ready' },
      { name: 'Stool Occult Blood & Microscopic Analysis', time: '2 Hours', prep: 'Fresh Specimen' },
    ],
    highlight: 'Direct consultation available with BHU Surgical Gastroenterology consultants.',
  },
  {
    id: 'women',
    name: "Women's Health & Maternity",
    shortName: 'Maternity Care',
    icon: Stethoscope,
    tag: 'MRCOG London Panel',
    tagColor: 'bg-pink-50 text-pink-700 border-pink-200',
    accentColor: 'from-pink-500 to-rose-600',
    lightBg: 'bg-pink-50/60',
    description:
      'Compassionate antenatal profiling, high-risk pregnancy diagnostics, hormonal fertility panels, pap smear cervical screening, and gynecology consultations led by MRCOG London specialists.',
    parameters: ['Antenatal Screening Profile', 'Hormonal & Thyroid Assays', 'High-Risk Pregnancy Advisory', 'MRCOG Specialist Chamber'],
    commonTests: [
      { name: 'First Trimester Dual Marker / Antenatal Screen', time: '24 Hours', prep: 'Obstetric Protocol' },
      { name: 'Complete Hormonal Panel (FSH, LH, Prolactin)', time: 'Same Day', prep: 'Morning Sample' },
      { name: 'Serum Beta HCG Quantitative Assay', time: '3 Hours', prep: 'No Fasting' },
      { name: 'Rubella & TORCH Serology Panel', time: '24 Hours', prep: 'Routine Blood' },
    ],
    highlight: 'Comprehensive prenatal & reproductive diagnostics with maximum privacy and warmth.',
  },
]

export default function InteractiveHealthExplorer() {
  const [activeTab, setActiveTab] = useState(SYSTEMS[0].id)
  const cur = SYSTEMS.find((s) => s.id === activeTab) || SYSTEMS[0]
  const Icon = cur.icon

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
      {/* Decorative Brand Ambient */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles size={13} className="text-rose-600" />
            <span>Interactive Diagnostic System</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-nunito text-slate-900 tracking-tight leading-tight">
            Explore Diagnostics By{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-red-500 to-sky-600">
              Clinical Department
            </span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Select a specialized medical system below to explore advanced testing parameters, automated analyzer technology, sample turn-around times, and patient preparation guidelines.
          </p>
        </div>

        {/* Interactive Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
          {SYSTEMS.map((sys) => {
            const TabIcon = sys.icon
            const isActive = sys.id === activeTab
            return (
              <button
                key={sys.id}
                onClick={() => setActiveTab(sys.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-105'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <TabIcon size={16} className={isActive ? 'text-rose-400' : 'text-slate-400'} />
                <span>{sys.shortName}</span>
              </button>
            )
          })}
        </div>

        {/* Interactive Detail Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={cur.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Column: Department Description & Specs */}
              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100 bg-gradient-to-br from-slate-50/50 via-white to-slate-50/30">
                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cur.accentColor} text-white flex items-center justify-center shadow-md`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${cur.tagColor}`}>
                        {cur.tag}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black font-nunito text-slate-900 leading-tight mt-1">
                        {cur.name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {cur.description}
                  </p>

                  {/* High-Tech Parameters */}
                  <div className="space-y-2 mb-6">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      Laboratory Technology Standards
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {cur.parameters.map((param, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-200/80 rounded-xl px-3 py-2 shadow-2xs">
                          <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                          <span className="truncate">{param}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Highlight Callout */}
                <div className="bg-sky-50/80 border border-sky-200/80 rounded-2xl p-4 mb-6">
                  <p className="text-xs text-sky-900 font-semibold leading-relaxed">
                    💡 <strong className="text-sky-950 font-bold">Midnapore Guarantee:</strong> {cur.highlight}
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to="/book-collection"
                    className="flex-1 text-center bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md shadow-rose-600/20 transition-all active:scale-95"
                  >
                    Book Home Collection
                  </Link>
                  <Link
                    to="/diagnostics"
                    className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm py-3 px-4 rounded-xl transition-all"
                  >
                    <span>View Catalog</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Right Column: Key Investigations & Fast Turnaround Table */}
              <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Standard Clinical Investigations
                    </h4>
                    <span className="text-[11px] font-bold text-slate-500">
                      Average Reporting Speed
                    </span>
                  </div>

                  <div className="space-y-3">
                    {cur.commonTests.map((t, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/60 transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="text-sm font-bold text-slate-900 block leading-tight">
                              {t.name}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Prep: {t.prep}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto ml-8 sm:ml-0">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-lg">
                            <Clock size={12} />
                            {t.time}
                          </span>
                          <Link
                            to="/book-collection"
                            className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline px-1 py-1"
                          >
                            Book →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Info Strip */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={15} className="text-emerald-600" />
                    <span>NABL Approved Methodology & Digital Barcoded Vials</span>
                  </div>
                  <Link
                    to="/book-consultation"
                    className="text-rose-600 hover:text-rose-700 font-bold inline-flex items-center gap-1"
                  >
                    <span>Consult Visiting Doctor</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
