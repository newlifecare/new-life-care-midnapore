import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Stethoscope,
  Building2,
  CalendarDays,
  ArrowRight,
  Sparkles,
  Award,
  CheckCircle2,
} from 'lucide-react'

const TOP_SPECIALISTS = [
  {
    name: 'Dr. S. K. Das',
    institute: 'AIIMS New Delhi',
    spec: 'Orthopedics & Joint Surgery',
    degree: 'MS (Ortho), (AIIMS) New Delhi',
    focus: 'Arthroscopy, Trauma Care, Joint Reconstruction & Spine Surgery',
    image: '/images/doctors/dr-sk-das.jpg',
    badge: 'AIIMS Faculty',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    schedule: 'Visiting Weekly Chamber',
  },
  {
    name: 'Dr. Niket Arora',
    institute: 'Manipal Hospitals',
    spec: 'Cardiothoracic & Vascular Surgery',
    degree: 'MBBS, DNB (Cardio Thoracic Surgery)',
    focus: 'Cardiovascular Surgery, Adult Cardiac Care, Member EACTS & IACTS',
    image: '/images/doctors/dr-niket-arora.jpg',
    badge: 'Senior Consultant',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
    schedule: 'Prior Appointment Mandatory',
  },
  {
    name: 'Dr. Panchanan Panigrahi',
    institute: 'BHU Varanasi',
    spec: 'Surgical Gastroenterology',
    degree: 'MCH Surgical Gastroenterology (BHU), FIAGES',
    focus: 'Advanced Endo, Laser, Laparoscopic & Complex GI Surgery',
    image: '/images/doctors/dr-panchanan-panigrahi.jpg',
    badge: 'MCH GI Surgery',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    schedule: 'Regular Weekly Chamber',
  },
  {
    name: 'Dr. Ayesha Sultana',
    institute: 'MRCOG London',
    spec: 'Gynecology & High-Risk Pregnancy',
    degree: 'MBBS, MS (G&O), DNB, MRCOG (London)',
    focus: 'High-Risk Pregnancy, Antenatal Diagnostics & Women’s Health',
    image: '/images/doctors/dr-ayesha-sultana.jpg',
    badge: 'MRCOG London',
    badgeColor: 'bg-pink-50 text-pink-700 border-pink-200',
    schedule: 'Visiting Consultant',
  },
  {
    name: 'Dr. Archisman Haldar',
    institute: 'AIIMS New Delhi / BBSR',
    spec: 'Neurology & Neuro-Diagnostics',
    degree: 'MBBS (AIIMS), MD (AIIMS Delhi), DM (AIIMS)',
    focus: 'Epilepsy, Seizures, Stroke, Migraines & Peripheral Neuropathies',
    image: '/images/doctors/dr-archisman-haldar.jpg',
    badge: 'AIIMS DM Neurology',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    schedule: 'Neurology Bay Supervision',
  },
  {
    name: 'Dr. Samujjwal Das',
    institute: 'Desun Hospital Kolkata',
    spec: 'Head & Neck Oncosurgery',
    degree: 'MBBS, MDS (Oral & Maxillofacial Surgery)',
    focus: 'Oral, Facial, Maxillofacial & Head-Neck Tumor Evaluation',
    image: '/images/doctors/dr-samujjwal-das.jpg',
    badge: 'Oncosurgery Panel',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    schedule: 'Scheduled Clinic',
  },
]

export default function DoctorAffiliationSpotlight() {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-black uppercase tracking-wider mb-3">
              <Award size={13} className="text-rose-600" />
              <span>Elite Specialist Medical Panel</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-nunito text-slate-900 tracking-tight leading-tight">
              Consult Specialists From{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-red-500 to-sky-600">
                Renowned Institutes
              </span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
              No need to travel to Kolkata or New Delhi for specialist medical opinions. Consult visiting surgeons and physicians from AIIMS, Manipal Hospitals, BHU, and SSKM right here in Keranitola, Midnapore.
            </p>
          </div>

          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 px-5 py-3 rounded-xl transition-all shadow-md shrink-0 self-start md:self-auto"
          >
            <span>View All 19 Specialists</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Specialists Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {TOP_SPECIALISTS.map((doc, idx) => (
            <motion.div
              key={doc.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-3xl p-6 transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                {/* Doctor Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-white shadow-md bg-white">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${doc.badgeColor}`}>
                        {doc.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-black font-nunito text-slate-900 group-hover:text-rose-600 transition-colors leading-tight">
                      {doc.name}
                    </h3>
                    <p className="text-xs font-bold text-sky-700 leading-tight mt-0.5">
                      {doc.spec}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                      {doc.degree}
                    </p>
                  </div>
                </div>

                {/* Clinical Focus */}
                <p className="text-xs text-slate-600 leading-relaxed mb-4 bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs">
                  <strong className="text-slate-800 font-bold block mb-0.5 text-[11px]">Specialist Focus:</strong>
                  {doc.focus}
                </p>
              </div>

              {/* Card Footer: Schedule & Action */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {doc.schedule}
                </span>

                <Link
                  to={`/book-consultation?doctor=${encodeURIComponent(doc.name)}`}
                  className="font-bold text-rose-600 hover:text-rose-700 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1"
                >
                  <span>Book Consultation</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Institution Affiliation Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <Building2 size={24} className="text-cyan-300" />
            </div>
            <div>
              <h4 className="font-extrabold text-base sm:text-lg">
                Official Visiting Chamber Schedule at Keranitola
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Chamber schedules are updated daily. Call reception at 097335 25031 / 96473 93949 to secure your consultation token.
              </p>
            </div>
          </div>

          <Link
            to="/doctors"
            className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-rose-600/30 shrink-0"
          >
            Check Complete Schedule
          </Link>
        </div>
      </div>
    </section>
  )
}
