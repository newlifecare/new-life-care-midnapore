import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Home,
  Clock,
} from 'lucide-react'

const PACKAGES = [
  {
    id: 'health47',
    name: 'Full Health Checkup Package',
    badge: 'Most Popular',
    badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
    totalTests: '47 NABL Tests',
    price: '₹1,350',
    original: '₹2,200',
    savings: 'Save ₹850',
    highlight: true,
    description: 'Comprehensive essential wellness evaluation covering heart, liver, kidney, blood cells, and metabolism.',
    categories: [
      { name: 'Complete Blood Count (CBC)', items: ['Hemoglobin', 'Total Leukocyte Count (TLC)', 'Differential Count (DLC)', 'Platelet Count', 'RBC & Hematocrit', 'ESR'] },
      { name: 'Liver Function Panel (LFT)', items: ['Bilirubin (Total & Direct)', 'SGPT (ALT)', 'SGOT (AST)', 'Alkaline Phosphatase (ALP)', 'Total Protein & Albumin', 'A/G Ratio'] },
      { name: 'Kidney Function Panel (KFT)', items: ['Serum Urea', 'Serum Creatinine', 'Serum Uric Acid', 'Blood Urea Nitrogen'] },
      { name: 'Cardiovascular Lipid Screen', items: ['Total Cholesterol', 'Triglycerides', 'HDL Good Cholesterol', 'LDL Bad Cholesterol', 'VLDL'] },
      { name: 'Glucose & Urine Chemistry', items: ['Fasting Blood Glucose', 'Urine Routine & Microscopy (18 chemical & cellular markers)'] },
    ],
  },
  {
    id: 'advanced12',
    name: 'Advanced Master Health Profile',
    badge: 'Comprehensive Suite',
    badgeStyle: 'bg-sky-50 text-sky-700 border-sky-200',
    totalTests: '12 Systems + ECG',
    price: '₹1,999',
    original: '₹3,200',
    savings: 'Save ₹1,201',
    highlight: false,
    description: 'Includes Computerized 12-Lead ECG, HbA1c 3-month sugar monitoring, and ultrasensitive thyroid testing.',
    categories: [
      { name: 'Cardiac & Electrophysiology', items: ['Computerized 12-Lead Digital ECG', 'Comprehensive Lipid Risk Ratio'] },
      { name: 'Endocrine & Diabetes', items: ['HbA1c Glycated Hemoglobin', 'Average Estimated Blood Glucose', 'Fasting Blood Sugar'] },
      { name: 'Thyroid Function', items: ['Ultrasensitive TSH (Thyroid Stimulating Hormone)'] },
      { name: 'Pathology & Organ Profiling', items: ['Complete Hemogram (28 parameters)', 'Liver Function Full Suite', 'Kidney Function Full Suite', 'Urine Routine Complete'] },
    ],
  },
  {
    id: 'diabetic59',
    name: 'Complete Diabetic Care Profile',
    badge: 'Specialized Panel',
    badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    totalTests: '59 Tests + Renal Ratio',
    price: '₹2,999',
    original: '₹4,500',
    savings: 'Save ₹1,501',
    highlight: false,
    description: 'Targeted detection of microvascular damage, diabetic nephropathy, and early cardiac risk.',
    categories: [
      { name: 'Glycemic Control', items: ['Fasting Blood Sugar', 'Post Prandial (PP) Sugar', 'HbA1c Glycated Hemoglobin'] },
      { name: 'Renal & Microalbumin', items: ['Urine Microalbuminuria', 'Urine Albumin/Creatinine Ratio (ACR)', 'Serum Creatinine & Urea', 'Serum Electrolytes (Na/K/Cl)'] },
      { name: 'Cardiovascular Protection', items: ['Complete Lipid Profile', 'hs-CRP Inflammation Marker'] },
      { name: 'Hematology & General Health', items: ['Complete Hemogram with Peripheral Smear', 'Liver Enzymes Screen'] },
    ],
  },
]

export default function TransparentPackagesMatrix() {
  const [expandedPkg, setExpandedPkg] = useState(PACKAGES[0].id)

  return (
    <section className="py-16 md:py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles size={13} className="text-rose-600" />
            <span>Curated Health Checkups</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-nunito text-slate-900 tracking-tight leading-tight">
            Transparent Diagnostic Packages,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-red-500 to-sky-600">
              Zero Hidden Costs
            </span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            All checkups include free home sample collection anywhere in Midnapore, vacuum BD barcoded tubes, and dual pathologist verified digital WhatsApp reporting.
          </p>
        </div>

        {/* Packages Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-10">
          {PACKAGES.map((pkg) => {
            const isExpanded = expandedPkg === pkg.id
            return (
              <div
                key={pkg.id}
                className={`bg-white rounded-3xl border transition-all shadow-sm flex flex-col justify-between overflow-hidden relative ${
                  pkg.highlight
                    ? 'border-rose-400 ring-2 ring-rose-400/30 shadow-xl'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {pkg.highlight && (
                  <div className="bg-gradient-to-r from-rose-600 to-red-600 text-white text-[11px] font-black uppercase tracking-widest text-center py-1.5">
                    ★ Most Recommended by Physicians
                  </div>
                )}

                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${pkg.badgeStyle}`}>
                      {pkg.badge}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {pkg.totalTests}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black font-nunito text-slate-900 leading-tight mb-2">
                    {pkg.name}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    {pkg.description}
                  </p>

                  {/* Pricing Box */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block line-through">
                        Standard: {pkg.original}
                      </span>
                      <span className="text-3xl font-black font-nunito text-slate-900 leading-none">
                        {pkg.price}
                      </span>
                    </div>
                    <span className="text-xs font-black text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg">
                      {pkg.savings}
                    </span>
                  </div>

                  {/* Interactive Details Accordion Button */}
                  <button
                    onClick={() => setExpandedPkg(isExpanded ? null : pkg.id)}
                    className="w-full flex items-center justify-between text-xs font-bold text-slate-700 bg-slate-100/70 hover:bg-slate-100 px-4 py-2.5 rounded-xl transition-colors cursor-pointer mb-4"
                  >
                    <span>{isExpanded ? 'Hide Test Breakdown' : 'Inspect All Tests Inside'}</span>
                    <ChevronDown size={16} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Expandable Test Breakdown */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden space-y-3 mb-6 pt-1 text-xs"
                      >
                        {pkg.categories.map((cat, idx) => (
                          <div key={idx} className="border-t border-slate-100 pt-2">
                            <span className="font-bold text-slate-900 block mb-1">
                              {cat.name}
                            </span>
                            <div className="space-y-1">
                              {cat.items.map((it, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-slate-600">
                                  <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                                  <span className="truncate">{it}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer Action */}
                <div className="p-6 sm:p-8 pt-0">
                  <Link
                    to="/book-collection"
                    className={`w-full flex items-center justify-center gap-2 font-bold text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-95 ${
                      pkg.highlight
                        ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-600/30'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20'
                    }`}
                  >
                    <Home size={16} />
                    <span>Book Package Pickup</span>
                    <ArrowRight size={14} />
                  </Link>
                  <p className="text-[10px] text-center text-slate-400 mt-2 font-medium">
                    Free doorstep sample collection included
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Customization Callout */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 text-center max-w-2xl mx-auto shadow-2xs">
          <p className="text-xs sm:text-sm text-slate-700 font-medium">
            Need a specific test not listed above? We offer over <strong className="text-slate-900">250+ individual pathology & radiology tests</strong>.
          </p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <Link to="/diagnostics" className="text-xs font-bold text-rose-600 hover:underline">
              Browse Complete Test Catalog →
            </Link>
            <span className="text-slate-300">•</span>
            <a href="tel:09733525031" className="text-xs font-bold text-sky-600 hover:underline">
              Call Helpdesk: 097335 25031
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
