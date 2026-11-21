import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarDays,
  ArrowRight,
  Activity,
  CheckCircle2,
  Stethoscope,
  Award,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Building2,
  Star,
  Images,
  Maximize2,
} from 'lucide-react'
import { getGallery } from '../services/api'

// Institutional affiliations from the official flyers
const INSTITUTES = [
  { name: 'AIIMS New Delhi', badge: 'Orthopedic Surgery' },
  { name: 'Manipal Hospitals', badge: 'Cardiothoracic Surgery' },
  { name: 'AIIMS Bhubaneswar', badge: 'Neurology' },
  { name: 'PGIMER Chandigarh', badge: 'Pediatrics' },
  { name: 'SSKM Hospital / IPGMER', badge: 'Neuropsychiatry & Medicine' },
  { name: 'BHU Varanasi', badge: 'Surgical Gastroenterology' },
  { name: 'MRCOG London', badge: 'Obstetrics & Gynecology' },
  { name: 'Desun Hospital Kolkata', badge: 'Head & Neck Oncosurgery' },
  { name: 'NIMHANS Bangalore', badge: 'Senior Neurology' },
  { name: 'Midnapore Medical College', badge: 'Clinical Medicine' },
  { name: 'Asian Institute of Gastroenterology', badge: 'GI & Hepatology' },
]

const ROTATING_SPECIALTIES = [
  { title: 'Cardiothoracic & Vascular Surgery', doctor: 'Dr. Niket Arora (Manipal Hospitals)', color: 'text-rose-300' },
  { title: 'Orthopedics & Spine Trauma', doctor: 'Dr. S. K. Das (AIIMS New Delhi)', color: 'text-amber-300' },
  { title: 'Advanced GI & Hepatology', doctor: 'Dr. Panchanan Panigrahi (BHU)', color: 'text-emerald-300' },
  { title: 'Obstetrics, High-Risk Pregnancy', doctor: 'Dr. Ayesha Sultana (MRCOG London)', color: 'text-pink-300' },
  { title: 'Neurology & Neuro-Diagnostics', doctor: 'Dr. Archisman Haldar (AIIMS)', color: 'text-cyan-300' },
  { title: 'Head & Neck Oncosurgery', doctor: 'Dr. Samujjwal Das (Desun Hospital)', color: 'text-indigo-300' },
  { title: 'Neuropsychiatry & Behavioral Health', doctor: 'Dr. Konika Das (SSKM Hospital)', color: 'text-purple-300' },
  { title: 'General & Laparoscopic Surgery', doctor: 'Dr. Biswajit Panda (MS Laparoscopic)', color: 'text-sky-300' },
]

// Default verified clinic, lab & doctor photos for the Hero Gallery slider
const DEFAULT_HERO_GALLERY = [
  {
    title: 'NABL Accredited Pathology Laboratory Floor',
    description: 'Fully computerized floor featuring automated chemistry analyzers, digital microscopes, and neuro-diagnostics setup.',
    category: 'Lab Equipment',
    imageUrl: '/images/lab-interior-ncv-eeg.jpg',
  },
  {
    title: 'Automated Biochemistry & Cell Counter Analyzers',
    description: 'High-throughput AutoQuant analyzer and computerized 5-part hematology cell counter for precision blood diagnostics.',
    category: 'Diagnostic Suite',
    imageUrl: '/images/lab-packages-equipment.jpg',
  },
  {
    title: 'Diagnostic Testing Station & Oxygen Support',
    description: 'Specialized testing bay with computerized ECG, 24-hr Holter, PFT, EEG and emergency oxygen cylinders available 24/7.',
    category: 'Facilities',
    imageUrl: '/images/lab-equipment-oxygen.jpg',
  },
  {
    title: 'New Life Care Diagnostic Centre — Midnapore',
    description: 'NABL M(EL)T Accredited & ISO 9001:2015 Certified diagnostic facility situated in Keranitola, Midnapore Town.',
    category: 'Centre Facility',
    imageUrl: '/images/banner-main.jpg',
  },
  {
    title: 'Visiting Specialist Physicians & Surgeon Panel',
    description: 'Official panel of 19 experienced specialist doctors across cardiology, neurology, gastroenterology, orthopedics, and surgery.',
    category: 'Specialist Panel',
    imageUrl: '/images/poster-visiting-doctors.jpg',
  },
  {
    title: 'Orthopedic & Joint Surgery — Dr. S. K. Das',
    description: 'AIIMS New Delhi trained orthopedic surgeon specializing in arthroscopy, trauma care, and spine procedures.',
    category: 'Specialists',
    imageUrl: '/images/doctors/dr-sk-das.jpg',
  },
  {
    title: 'Cardiothoracic Surgery — Dr. Niket Arora',
    description: 'Senior Consultant from Manipal Hospitals for advanced cardiovascular and thoracic surgical advisories.',
    category: 'Specialists',
    imageUrl: '/images/doctors/dr-niket-arora.jpg',
  },
  {
    title: 'Surgical Gastroenterology — Dr. Panchanan Panigrahi',
    description: 'BHU trained GI, laser, endo, and laparoscopic surgery consultant.',
    category: 'Specialists',
    imageUrl: '/images/doctors/dr-panchanan-panigrahi.jpg',
  },
  {
    title: 'Gynecology & High-Risk Pregnancy — Dr. Ayesha Sultana',
    description: 'MRCOG London and DNB specialist providing comprehensive women healthcare and maternity advisory.',
    category: 'Specialists',
    imageUrl: '/images/doctors/dr-ayesha-sultana.jpg',
  },
  {
    title: 'Neurology & Brain Diagnostics — Dr. Archisman Haldar',
    description: 'AIIMS Delhi neurology specialist for epilepsy, stroke, migraine, and neuropathy evaluations.',
    category: 'Specialists',
    imageUrl: '/images/doctors/dr-archisman-haldar.jpg',
  },
  {
    title: 'Head & Neck Oncosurgery — Dr. Samujjwal Das',
    description: 'Desun Hospital specialist for maxillofacial, oral, and head & neck tumor evaluations.',
    category: 'Specialists',
    imageUrl: '/images/doctors/dr-samujjwal-das.jpg',
  },
  {
    title: 'Laparoscopic Surgery — Dr. Biswajit Panda',
    description: 'Minimally invasive laparoscopic surgeon for gallbladder, hernia, and abdominal procedures.',
    category: 'Specialists',
    imageUrl: '/images/doctors/dr-biswajit-panda.jpg',
  },
]

export default function HeroSection() {
  const [specialtyIdx, setSpecialtyIdx] = useState(0)
  const [galleryItems, setGalleryItems] = useState(DEFAULT_HERO_GALLERY)
  const [slideIdx, setSlideIdx] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isPaused, setIsPaused] = useState(false)

  // Rotating specialty words every 3.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setSpecialtyIdx((prev) => (prev + 1) % ROTATING_SPECIALTIES.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  // Fetch real gallery items from backend API
  useEffect(() => {
    const loadGallery = async () => {
      try {
        const data = await getGallery()
        if (Array.isArray(data) && data.length > 0) {
          const valid = data.filter((item) => item.imageUrl)
          if (valid.length > 0) {
            setGalleryItems(valid)
          }
        }
      } catch (_) {}
    }
    loadGallery()
  }, [])

  // Auto-switch photo every 5 seconds (5000ms)
  useEffect(() => {
    if (isPaused || galleryItems.length <= 1) return
    const timer = setInterval(() => {
      setDirection(1)
      setSlideIdx((prev) => (prev + 1) % galleryItems.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isPaused, galleryItems.length])

  const handleNext = () => {
    setDirection(1)
    setSlideIdx((prev) => (prev + 1) % galleryItems.length)
  }

  const handlePrev = () => {
    setDirection(-1)
    setSlideIdx((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1))
  }

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 28 },
        opacity: { duration: 0.35 },
        scale: { duration: 0.35 },
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.96,
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 28 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      },
    }),
  }

  const curSpec = ROTATING_SPECIALTIES[specialtyIdx]
  const curSlide = galleryItems[slideIdx] || galleryItems[0]

  return (
    <section className="relative bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900 text-white overflow-hidden min-h-screen flex flex-col justify-between pt-32 sm:pt-36 md:pt-40 lg:pt-44 pb-12">
      {/* Background Animated Gradients & Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-sky-500/15 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-1/3 -right-32 w-[550px] h-[550px] bg-cyan-500/15 rounded-full blur-[130px]" />
        <div className="absolute -bottom-32 left-1/3 w-[650px] h-[650px] bg-indigo-500/15 rounded-full blur-[150px]" />
        
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* SVG Animated Heartbeat / ECG Line across the background */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 opacity-[0.08] pointer-events-none select-none overflow-hidden">
        <svg viewBox="0 0 1200 120" className="w-full h-28" preserveAspectRatio="none">
          <path
            d="M 0,60 L 200,60 L 220,20 L 240,100 L 260,30 L 280,75 L 300,60 L 500,60 L 520,10 L 540,110 L 560,20 L 580,80 L 600,60 L 800,60 L 820,20 L 840,100 L 860,30 L 880,75 L 900,60 L 1200,60"
            fill="none"
            stroke="url(#ecgGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Action Matrix */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Accreditation & Location Pills */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap items-center gap-2.5 mb-5 select-none"
            >
              <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-sm">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                NABL M(EL)T Accredited & ISO 9001:2015
              </div>
              <div className="inline-flex items-center gap-1.5 bg-sky-500/15 border border-sky-400/30 text-sky-200 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-md">
                <Building2 size={13} className="text-sky-400" />
                Keranitola, Midnapore Town (721101)
              </div>
              <div className="hidden sm:inline-flex items-center gap-1 bg-amber-500/15 border border-amber-400/30 text-amber-200 text-xs font-bold px-3 py-1.5 rounded-full">
                <Star size={13} className="text-amber-400 fill-amber-400" />
                4.9★ (163+ Reviews)
              </div>
            </motion.div>

            {/* Main Headline with Bengali Accent */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-nunito tracking-tight leading-[1.12] mb-4">
                Premier Specialists.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-200 to-emerald-300">
                  NABL Certified
                </span>
                Diagnostics In Midnapore.
              </h1>

              {/* Bengali Official Title */}
              <p className="text-slate-300 text-sm font-medium tracking-wide mb-5 flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400" />
                নিউ লাইফ কেয়ার ডায়াগনস্টিক সেন্টার — নির্ভুল রিপোর্ট ও অভিজ্ঞ বিশেষজ্ঞ চিকিৎসক
              </p>
            </motion.div>

            {/* Rotating Specialty Highlight Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-xl mb-6 relative overflow-hidden group hover:border-sky-500/40 transition-colors"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center shrink-0 shadow-lg shadow-sky-500/20">
                    <Stethoscope size={20} className="text-white" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block">
                      Live Specialist Chamber
                    </span>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={curSpec.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className={`text-base sm:text-lg font-bold font-nunito leading-tight ${curSpec.color}`}>
                          {curSpec.title}
                        </p>
                        <p className="text-xs text-slate-300 mt-0.5">
                          {curSpec.doctor}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                <Link
                  to="/doctors"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl transition-all border border-white/10"
                >
                  All 19 Doctors <ArrowRight size={13} />
                </Link>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3.5 mb-8"
            >
              <Link
                to="/book-consultation"
                className="group relative inline-flex items-center gap-2.5 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-2xl shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <CalendarDays size={18} />
                <span>Book Doctor Appointment</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/book-collection"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm sm:text-base px-5 py-3.5 rounded-2xl backdrop-blur-md transition-all hover:border-white/30"
              >
                <Activity size={18} className="text-emerald-400" />
                <span>24/7 Home Sample Collection</span>
              </Link>
            </motion.div>

            {/* Trust Points Matrix */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10"
            >
              {[
                { label: 'Blood, Urine, Stool, Semen', sub: 'Complete Pathology' },
                { label: 'EEG & NCV Testing', sub: 'Neurological Lab' },
                { label: '24-Hr Holter & ECG', sub: 'Cardiology Care' },
                { label: 'Oxygen Cylinders', sub: 'Available 24x7' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-100 leading-tight">{item.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Gallery Section (Only the Gallery) */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="w-full max-w-lg bg-gradient-to-b from-white/15 to-white/5 border border-white/20 rounded-3xl p-5 sm:p-6 backdrop-blur-2xl shadow-2xl relative flex flex-col justify-between"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Gallery Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/30 flex items-center justify-center shadow-inner">
                    <Images size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Diagnostic & Lab Gallery
                      </span>
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block leading-tight">
                      Photo Tour • Switches every 5 seconds
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-sky-200 bg-black/40 px-2.5 py-1 rounded-lg border border-white/10">
                    {String(slideIdx + 1).padStart(2, '0')} / {String(galleryItems.length).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Sliding Photo Viewport (Linked directly to /gallery) */}
              <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-slate-900 shadow-xl group">
                <Link
                  to="/gallery"
                  className="block relative h-64 sm:h-72 md:h-80 w-full overflow-hidden cursor-pointer select-none"
                  title="Click to explore the Full Gallery"
                >
                  <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                      key={slideIdx}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="absolute inset-0 w-full h-full"
                    >
                      <img
                        src={curSlide.imageUrl}
                        alt={curSlide.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-950/75 text-cyan-300 border border-white/20 backdrop-blur-md shadow-md">
                          <Sparkles size={11} className="text-cyan-400" />
                          {curSlide.category || 'Diagnostic Centre'}
                        </span>

                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/20 text-white backdrop-blur-md border border-white/20 group-hover:bg-sky-500 transition-colors">
                          <Maximize2 size={11} />
                          <span>View Gallery</span>
                        </span>
                      </div>

                      {/* Bottom Caption Overlay */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pt-12 pb-3.5 px-4 sm:px-5 pointer-events-none">
                        <h3 className="text-white font-bold text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-sky-300 transition-colors">
                          {curSlide.title}
                        </h3>
                        {curSlide.description && (
                          <p className="text-slate-300 text-xs mt-1 line-clamp-2 leading-relaxed">
                            {curSlide.description}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* 5-Second Animated Progress Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-20 overflow-hidden">
                    <motion.div
                      key={slideIdx}
                      initial={{ width: '0%' }}
                      animate={{ width: isPaused ? '0%' : '100%' }}
                      transition={{ duration: 5, ease: 'linear' }}
                      className="h-full bg-gradient-to-r from-sky-400 to-cyan-300"
                    />
                  </div>
                </Link>
              </div>

              {/* Bottom Arrows & Gallery Actions (As Requested) */}
              <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between gap-3">
                {/* Arrow Controls at the Bottom */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous photo"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-sky-500 text-white border border-white/15 hover:border-sky-400 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-md"
                    title="Previous photo"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next photo"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-sky-500 text-white border border-white/15 hover:border-sky-400 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-md"
                    title="Next photo"
                  >
                    <ChevronRight size={20} />
                  </button>

                  {/* Dot / Slide indicators */}
                  <div className="hidden xs:flex items-center gap-1.5 ml-2">
                    {galleryItems.slice(0, 6).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setDirection(idx > slideIdx ? 1 : -1)
                          setSlideIdx(idx)
                        }}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          idx === slideIdx % 6
                            ? 'w-6 bg-sky-400'
                            : 'w-2 bg-white/20 hover:bg-white/40'
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                    {galleryItems.length > 6 && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        +{galleryItems.length - 6}
                      </span>
                    )}
                  </div>
                </div>

                {/* Direct Link to Gallery Section */}
                <Link
                  to="/gallery"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs sm:text-sm font-bold shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all active:scale-95"
                >
                  <span>Open Gallery</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Infinite Animated Marquee of Hospital & Clinic Affiliations */}
      <div className="relative border-t border-white/10 bg-slate-950/70 backdrop-blur-md py-3.5 select-none overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-1.5 flex items-center justify-between text-[11px] font-bold text-sky-300 uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <Award size={13} className="text-amber-400" />
            Specialists Affiliated With Renowned Hospitals & Institutes
          </span>
          <span className="hidden sm:inline-block text-slate-400 font-normal">
            New Life Care Diagnostic Centre • Midnapore Town
          </span>
        </div>

        {/* Marquee Track */}
        <div className="flex overflow-hidden relative">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
            className="flex items-center gap-6 whitespace-nowrap shrink-0"
          >
            {[...INSTITUTES, ...INSTITUTES].map((inst, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-200 hover:border-sky-400/50 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="text-white font-bold">{inst.name}</span>
                <span className="text-slate-400 text-[10px]">({inst.badge})</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

