import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, Phone, ArrowRight, ShieldCheck } from 'lucide-react'

const FAQS = [
  {
    q: 'Are New Life Care NABL reports accepted at AIIMS and major hospitals in Kolkata?',
    a: 'Yes, absolutely. New Life Care Diagnostic Centre is NABL M(EL)T Accredited (Reg. No. 02159) and ISO 9001:2015 Certified. Our test reports follow international quality standards and are fully accepted by AIIMS New Delhi, AIIMS Bhubaneswar, SSKM, PGIMER, CMC Vellore, and corporate hospitals worldwide.',
  },
  {
    q: 'How does 24/7 home sample collection work in Midnapore?',
    a: 'You can request sample collection anytime online or via WhatsApp / Phone at 097335 25031 / 96473 93949. A certified, licensed phlebotomist visits your home with barcode-sealed BD Vacutainers and a temperature-controlled cold kit. The sample is transported straight to our Keranitola lab, and reports are sent to your WhatsApp.',
  },
  {
    q: 'How many hours of fasting are required for blood tests?',
    a: 'For Fasting Blood Glucose (FBS), 8 to 10 hours of overnight fasting is recommended. For Lipid Profile (Cholesterol / Triglycerides), 10 to 12 hours of fasting is required. You may drink plain water. Routine tests like CBC, Thyroid (TSH), HbA1c, Liver Function, and Kidney Function require no strict fasting unless specified by your doctor.',
  },
  {
    q: 'When and how will I receive my digital laboratory report?',
    a: 'Routine blood tests (such as CBC, Blood Sugar, LFT, KFT, Dengue NS1) are ready within 2 to 4 hours. You receive an official encrypted PDF directly on your WhatsApp, and you can also view or download it anytime from our online portal using your mobile number. Hard copies on official letterhead are always available at our reception.',
  },
  {
    q: 'How do I book an appointment with visiting doctors from AIIMS and Manipal?',
    a: 'Our visiting medical specialist panel consults on scheduled weekly chamber days. You can pre-book a consultation token on our Doctors page or call our reception directly at 097335 25031. Prior booking is strongly recommended to guarantee your appointment slot without waiting.',
  },
  {
    q: 'Are emergency oxygen cylinders and night testing available?',
    a: 'Yes. Emergency medical oxygen cylinders are stocked 24/7 at our Keranitola facility and can be dispatched immediately. Our laboratory also processes emergency urgent investigations (Troponin, ECG, critical CBCs) round-the-clock.',
  },
]

export default function InteractiveFaq() {
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#f0f7fe]/90 via-[#ebf5ff]/70 to-[#f0f7fe]/90 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-black uppercase tracking-wider mb-3">
            <HelpCircle size={13} className="text-sky-600" />
            <span>Patient Information Desk</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-nunito text-slate-900 tracking-tight leading-tight">
            Frequently Asked{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-red-500 to-sky-600">
              Questions
            </span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Everything you need to know about testing procedures, preparation, NABL validity, and report delivery.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3 mb-10">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-slate-900 hover:text-rose-600 transition-colors cursor-pointer gap-4"
                >
                  <span className="leading-snug">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 transition-transform ${isOpen ? 'rotate-180 bg-rose-50 text-rose-600' : 'text-slate-500'}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* Contact Strip */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xs">
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Have another clinical question or urgent inquiry?
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Our Keranitola desk is staffed 24/7 by trained medical receptionists.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:09733525031"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-md"
            >
              <Phone size={14} className="text-sky-400" />
              <span>097335 25031</span>
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-4 py-2.5 rounded-xl transition-all"
            >
              <span>Contact Page</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
