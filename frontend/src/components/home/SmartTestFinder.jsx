import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Home,
  Clock,
  PhoneCall,
  Activity,
} from 'lucide-react'

const GOALS = [
  {
    id: 'wellness',
    title: 'Routine Annual Wellness',
    icon: '🩺',
    badge: 'Popular for All Ages',
    tests: ['Complete Blood Count (CBC + ESR)', 'Lipid Profile Screen', 'Fasting Blood Glucose', 'Liver Enzymes (SGOT/SGPT)', 'Serum Creatinine', 'Urine Routine'],
    sample: 'Blood & Urine',
    fasting: '10–12 Hours Overnight Fasting',
    tat: 'Within 4 Hours',
    bestFor: 'Healthy adults aged 20–60 wanting a clear, certified annual wellness baseline.',
  },
  {
    id: 'diabetes',
    title: 'Diabetes & BP Management',
    icon: '🩸',
    badge: 'Chronic Care Focus',
    tests: ['HbA1c (Glycated Hemoglobin)', 'Fasting Blood Glucose', 'Post-Prandial Glucose (PP)', 'Kidney Function Panel (KFT)', 'Complete Lipid Panel', 'Urine Microalbumin'],
    sample: 'Blood & Urine',
    fasting: 'Fasting + 2-Hr Post Meal Blood',
    tat: 'Within 3 Hours',
    bestFor: 'Diabetic and hypertensive patients needing precision quarterly tracking.',
  },
  {
    id: 'fatigue',
    title: 'Fatigue, Weakness & Hair Fall',
    icon: '⚡',
    badge: 'Deficiency Screener',
    tests: ['Serum Vitamin D (25-OH)', 'Serum Vitamin B12', 'Complete Hemogram (Hb %)', 'Ultrasensitive TSH Thyroid', 'Serum Iron & Ferritin', 'Electrolytes Screen'],
    sample: 'Blood Sample Only',
    fasting: 'No Strict Fasting Required',
    tat: 'Same-Day Reporting',
    bestFor: 'Individuals experiencing persistent tiredness, muscle cramps, hair thinning, or sluggishness.',
  },
  {
    id: 'senior',
    title: 'Senior Citizen Comprehensive',
    icon: '👵',
    badge: 'Elderly Care + Home Pickup',
    tests: ['Full CBC with Platelets', 'Liver & Kidney Complete Profiles', 'Computerized 12-Lead ECG', 'Lipid Risk Assessment', 'Serum Calcium & Uric Acid', 'HbA1c & Fasting Sugar'],
    sample: 'Blood, Urine + ECG Bay',
    fasting: '10 Hours Fasting',
    tat: 'Same Day by Evening',
    bestFor: 'Seniors aged 55+ needing holistic organ profiling and cardiovascular checks.',
  },
  {
    id: 'cardiac',
    title: 'Heart Health & Chest Tightness',
    icon: '🫀',
    badge: 'Specialist Verified',
    tests: ['Computerized 12-Lead ECG', 'High-Sensitivity Troponin-I', 'Comprehensive Lipid Risk Panel', 'Serum Electrolytes (Na/K/Cl)', 'Kidney Function (KFT)', 'Fasting Blood Glucose'],
    sample: 'Blood + Instant ECG Bay',
    fasting: '8 Hours (Urgent Bay No Prep)',
    tat: 'ECG in 15 Min, Blood in 3 Hr',
    bestFor: 'Anyone with family history of cardiac issues, high stress, chest discomfort, or breathlessness.',
  },
]

export default function SmartTestFinder() {
  const [selectedGoal, setSelectedGoal] = useState(GOALS[0].id)
  const current = GOALS.find((g) => g.id === selectedGoal) || GOALS[0]

  return (
    <section className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Neon Brand Ambient */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-rose-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-sky-500/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-cyan-300 text-xs font-black uppercase tracking-wider mb-3 backdrop-blur-md">
            <Sparkles size={13} className="text-cyan-400" />
            <span>Smart Health Screener</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-nunito tracking-tight text-white leading-tight">
            Find Your Recommended Tests in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-rose-400">
              One Single Tap
            </span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            Select your health goal or primary symptom. Our computerized diagnostic matcher instantly maps the exact NABL investigations, preparation requirements, and estimated package savings.
          </p>
        </div>

        {/* Goal Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {GOALS.map((g) => {
            const isSel = g.id === selectedGoal
            return (
              <button
                key={g.id}
                onClick={() => setSelectedGoal(g.id)}
                className={`p-4 rounded-2xl text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSel
                    ? 'bg-gradient-to-br from-rose-600 to-red-700 text-white shadow-xl shadow-rose-600/30 scale-[1.03] border-2 border-rose-400'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                <div>
                  <span className="text-2xl mb-2 block">{g.icon}</span>
                  <h4 className="font-bold text-xs sm:text-sm leading-snug">{g.title}</h4>
                </div>
                <span className={`text-[10px] font-bold mt-3 block ${isSel ? 'text-rose-200' : 'text-slate-400'}`}>
                  {g.badge}
                </span>
              </button>
            )
          })}
        </div>

        {/* Dynamic Screener Result Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-b from-white/10 to-white/5 border border-white/15 rounded-3xl p-6 sm:p-8 lg:p-10 backdrop-blur-xl shadow-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Recommended Tests */}
              <div className="lg:col-span-7">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{current.icon}</span>
                  <div>
                    <span className="text-xs uppercase tracking-wider font-extrabold text-cyan-300 block">
                      Recommended NABL Package
                    </span>
                    <h3 className="text-2xl font-black font-nunito text-white">
                      {current.title}
                    </h3>
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {current.bestFor}
                </p>

                {/* Investigations Grid */}
                <div className="space-y-2 mb-6">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Key Laboratory Investigations Included:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {current.tests.map((t, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 font-medium"
                      >
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                        <span className="truncate">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preparation & Sample Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Specimen Type</span>
                    <strong className="text-white font-bold">{current.sample}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Fasting Requirement</span>
                    <strong className="text-cyan-300 font-bold">{current.fasting}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Report Availability</span>
                    <strong className="text-emerald-400 font-bold">{current.tat}</strong>
                  </div>
                </div>
              </div>

              {/* Right Column: Certified Clinical Care & Instant Home Booking */}
              <div className="lg:col-span-5 bg-white/10 border border-white/15 rounded-2xl p-6 sm:p-8 flex flex-col justify-between text-center lg:text-left">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-sky-500/20 text-sky-300 border border-sky-400/30 mb-3">
                    <ShieldAlert size={14} className="text-sky-400" />
                    <span>NABL M(EL)T Reg. 02159 Assured</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black font-nunito text-white mb-2">
                    Certified Clinical Investigation
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Sample collected under strict cold-chain protocol with barcoded vacutainer tubes, dual senior pathologist review, and instant WhatsApp PDF delivery.
                  </p>

                  <div className="space-y-2 mb-6 text-left">
                    <div className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 size={14} className="text-sky-400 shrink-0" />
                      <span>Barcode-tracked sample integrity & zero mix-up guarantee</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 size={14} className="text-sky-400 shrink-0" />
                      <span>Dual pathologist verification before final sign-off</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 size={14} className="text-sky-400 shrink-0" />
                      <span>Doorstep blood collection available across Midnapore</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    to="/book-collection"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-sm py-3.5 px-6 rounded-xl shadow-xl shadow-rose-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Home size={16} />
                    <span>Book Doorstep Sample Collection</span>
                    <ArrowRight size={16} />
                  </Link>

                  <a
                    href="https://wa.me/919733525031?text=Hello%20New%20Life%20Care,%20I%20would%20like%20to%20book%20a%20clinical%20investigation."
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-md"
                  >
                    <span>Instant WhatsApp Dispatch (9733525031)</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
