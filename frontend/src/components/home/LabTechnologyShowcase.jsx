import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Cpu,
  Microscope,
  Activity,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Maximize2,
} from 'lucide-react'

const MACHINES = [
  {
    id: 'master-poster',
    name: 'Our Advanced Laboratory Machinery Showcase',
    category: 'High-Precision Technology',
    speed: 'High-Precision Diagnostics',
    image: '/images/official-centre-poster.jpg',
    description:
      'Official machinery fleet of New Life Care Diagnostic Centre in Keranitola. Equipped with automated robotic biochemistry analyzers, 5-part hematology counters, automated centrifuges, and computerized digital microscopes for accurate & reliable reports.',
    specs: [
      { label: 'Technology', val: 'Robotic & Laser Flow' },
      { label: 'Accreditation', val: 'NABL M(EL)T & ISO 9001:2015' },
      { label: 'Reports', val: 'Accurate & Reliable' },
      { label: 'Quality Seals', val: 'NABL, ISO, IAF, KAB' },
    ],
    whyItMatters: 'Official equipment fleet serving Midnapore with globally accepted diagnostic reports.',
  },
  {
    id: 'biochem',
    name: 'AutoQuant Automated Biochemistry Suite',
    category: 'Robotic Clinical Chemistry',
    speed: '400 Tests / Hour',
    image: '/images/lab-packages-equipment.jpg',
    description:
      'High-throughput computerized spectrophotometric analyzer performing liver enzymes, kidney urea/creatinine, lipid fractions, cardiac enzymes, and electrolytes with automated robotic pipetting and zero manual handling.',
    specs: [
      { label: 'Sample Pipetting', val: 'Robotic Liquid Sensor' },
      { label: 'Quality Control', val: 'Two-Level Daily Calibration' },
      { label: 'Throughput', val: 'Up to 400 photometric tests/hr' },
      { label: 'Reporting', val: 'Instant LIS Bi-directional Interface' },
    ],
    whyItMatters: 'Guarantees standard deviation < 1.5% across all biochemical blood assays.',
  },
  {
    id: 'cellcounter',
    name: '5-Part Hematology Laser Flow Cell Counter',
    category: 'Precision Blood Morphology',
    speed: 'Instant CBC in 2 Mins',
    image: '/images/lab-interior-ncv-eeg.jpg',
    description:
      'Multi-angle laser flow cytometry cell counter measuring full blood counts, eosinophils, basophils, monocytes, neutrophils, lymphocytes, and micro-platelet aggregation with peripheral smear corroboration.',
    specs: [
      { label: 'Technology', val: 'Multi-Angle Laser Flow' },
      { label: 'Parameters', val: '28 Hematological Parameters' },
      { label: 'Platelet Precision', val: 'Optical & Impedance Dual Count' },
      { label: 'Pathologist Review', val: 'Manual Smear Verification' },
    ],
    whyItMatters: 'Critical for fever panels, dengue platelet monitoring, severe anemia, and infection detection.',
  },
  {
    id: 'neuro',
    name: 'Digital 32-Channel EEG & NCV Electrophysiology',
    category: 'Neuro-Diagnostics Bay',
    speed: 'Specialized Appointment Bay',
    image: '/images/lab-interior-ncv-eeg.jpg',
    description:
      'Dedicated electrophysiological station conducting computerized electroencephalography (EEG) for brainwave frequency mapping, and Nerve Conduction Velocity (NCV) testing for neuropathy, carpal tunnel, and radiculopathies.',
    specs: [
      { label: 'Channels', val: '32-Channel Digital Mapping' },
      { label: 'Stimulator', val: 'Dual Isolated Constant Current' },
      { label: 'Interpretation', val: 'AIIMS Neurology Trained Faculty' },
      { label: 'Waveform Analysis', val: 'Computerized Amplitude & Latency' },
    ],
    whyItMatters: 'The premier dedicated electrophysiological test station in Midnapore Town.',
  },
  {
    id: 'cardiac-oxygen',
    name: 'Cardiology Bay & 24/7 Medical Oxygen Support',
    category: 'Emergency & Cardiology',
    speed: '24/7 Emergency Ready',
    image: '/images/lab-equipment-oxygen.jpg',
    description:
      'Computerized 12-lead digital ECG with instant rhythm analysis, 24-hour ambulatory Holter recording bay, Pulmonary Function Testing (PFT), and 24/7 stocked medical oxygen cylinders for emergency home delivery.',
    specs: [
      { label: 'ECG Engine', val: '12-Lead High-Frequency Digital' },
      { label: 'Holter Unit', val: 'Ultra-light 24-Hr Ambulatory' },
      { label: 'Oxygen Supply', val: 'High-purity medical cylinders' },
      { label: 'Availability', val: '24 Hours / 365 Days' },
    ],
    whyItMatters: 'Immediate life-saving diagnostic recording and emergency oxygen availability.',
  },
]

export default function LabTechnologyShowcase() {
  const [selectedMachine, setSelectedMachine] = useState(MACHINES[0].id)
  const active = MACHINES.find((m) => m.id === selectedMachine) || MACHINES[0]

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#ebf5ff]/60 via-white/80 to-[#f0f7fe]/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-black uppercase tracking-wider mb-3">
              <Cpu size={13} className="text-sky-600" />
              <span>Diagnostic Engineering Standards</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-nunito text-slate-900 tracking-tight leading-tight">
              Inside Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-sky-600">
                Automated NABL Testing
              </span>{' '}
              Floor
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
              Explore the clinical diagnostic analyzers operating 24/7 at Keranitola, Midnapore. Automated robotic pipetting, dual quality control calibrations, and zero human calculation variance.
            </p>
          </div>

          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-4 py-2.5 rounded-xl transition-all shrink-0 self-start md:self-auto"
          >
            <span>Explore Photo Gallery</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Machine Navigation Pills */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {MACHINES.map((m) => {
            const isSel = m.id === selectedMachine
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMachine(m.id)}
                className={`p-4 rounded-2xl text-left transition-all cursor-pointer border ${
                  isSel
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                }`}
              >
                <span className={`text-[10px] font-black uppercase tracking-wider block ${isSel ? 'text-rose-400' : 'text-slate-400'}`}>
                  {m.category}
                </span>
                <h4 className="font-bold text-xs sm:text-sm leading-snug mt-1 truncate">
                  {m.name}
                </h4>
                <span className={`text-[11px] font-semibold block mt-2 ${isSel ? 'text-sky-300' : 'text-emerald-700'}`}>
                  ⚡ {m.speed}
                </span>
              </button>
            )
          })}
        </div>

        {/* Machine Showcase Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden shadow-sm"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              {/* Photo Viewport */}
              <div className="lg:col-span-6 relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden bg-slate-900">
                <img
                  src={active.image}
                  alt={active.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-950/80 text-cyan-300 border border-white/20 backdrop-blur-md">
                    Verified Facility Setup • Midnapore
                  </span>
                  <h4 className="font-bold text-sm sm:text-base mt-1 text-white">
                    {active.name}
                  </h4>
                </div>
              </div>

              {/* Specs & Impact */}
              <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-rose-600">
                      {active.category}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {active.speed}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black font-nunito text-slate-900 mb-3 leading-tight">
                    {active.name}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {active.description}
                  </p>

                  {/* Machine Technical Specs Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {active.specs.map((sp, idx) => (
                      <div key={idx} className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                          {sp.label}
                        </span>
                        <strong className="text-xs font-bold text-slate-800 block mt-0.5">
                          {sp.val}
                        </strong>
                      </div>
                    ))}
                  </div>

                  {/* Why It Matters Callout */}
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 mb-6">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                      <p className="text-xs text-emerald-950 font-semibold leading-relaxed">
                        <strong className="font-bold">Clinical Impact:</strong> {active.whyItMatters}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs">
                  <span className="text-slate-500 font-medium">
                    Strict daily multi-level calibration protocols
                  </span>
                  <Link
                    to="/book-collection"
                    className="font-bold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1"
                  >
                    <span>Book Testing Now</span>
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
