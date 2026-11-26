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
  Phone,
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
  { title: 'Cardiothoracic & Vascular Surgery', doctor: 'Dr. Niket Arora (Manipal Hospitals)', color: 'text-rose-600' },
  { title: 'Orthopedics & Spine Trauma', doctor: 'Dr. S. K. Das (AIIMS New Delhi)', color: 'text-slate-900' },
  { title: 'Advanced GI & Hepatology', doctor: 'Dr. Panchanan Panigrahi (BHU)', color: 'text-emerald-700' },
  { title: 'Obstetrics, High-Risk Pregnancy', doctor: 'Dr. Ayesha Sultana (MRCOG London)', color: 'text-rose-600' },
  { title: 'Neurology & Neuro-Diagnostics', doctor: 'Dr. Archisman Haldar (AIIMS)', color: 'text-slate-900' },
  { title: 'Head & Neck Oncosurgery', doctor: 'Dr. Samujjwal Das (Desun Hospital)', color: 'text-indigo-700' },
  { title: 'Neuropsychiatry & Behavioral Health', doctor: 'Dr. Konika Das (SSKM Hospital)', color: 'text-purple-700' },
  { title: 'General & Laparoscopic Surgery', doctor: 'Dr. Biswajit Panda (MS Laparoscopic)', color: 'text-rose-600' },
]

// Default verified clinic & laboratory photos for the Hero Gallery slider
const DEFAULT_HERO_GALLERY = [
  {
    id: 'lab-floor',
    title: 'NABL Accredited Pathology Laboratory Floor',
    description: 'Fully computerized floor featuring automated chemistry analyzers, digital microscopes, and neuro-diagnostics setup.',
    category: 'Pathology Lab',
    imageUrl: '/images/lab-interior-ncv-eeg.jpg',
  },
  {
    id: 'biochem-analyzers',
    title: 'Automated Biochemistry & 5-Part Cell Counter',
    description: 'High-throughput AutoQuant analyzer and computerized 5-part hematology cell counter for precision diagnostics.',
    category: 'Diagnostic Suite',
    imageUrl: '/images/lab-packages-equipment.jpg',
  },
  {
    id: 'diagnostic-bay',
    title: 'Computerized ECG, Holter & Oxygen Support',
    description: 'Dedicated diagnostic testing bay with computerized ECG, 24-hr Holter, PFT, EEG and emergency oxygen cylinders available 24/7.',
    category: 'Testing Bays',
    imageUrl: '/images/lab-equipment-oxygen.jpg',
  },
  {
    id: 'centre-main',
    title: 'New Life Care Diagnostic Centre — Midnapore',
    description: 'NABL M(EL)T Accredited & ISO 9001:2015 Certified diagnostic facility situated in Keranitola, Midnapore Town.',
    category: 'Accredited Centre',
    imageUrl: '/images/banner-main.jpg',
  },
  {
    id: 'specialist-schedule',
    title: 'Official Visiting Specialist Physicians Panel',
    description: 'Chamber schedule of 19 visiting specialists and surgeons from AIIMS, PGIMER, BHU, SSKM, and Manipal Hospitals.',
    category: 'Specialist Chambers',
    imageUrl: '/images/poster-visiting-doctors.jpg',
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
          const valid = data.filter((item) => item.imageUrl && item.category !== 'Doctors')
          if (valid.length > 0) {
            setGalleryItems(valid)
          } else {
            const anyValid = data.filter((item) => item.imageUrl)
            if (anyValid.length > 0) setGalleryItems(anyValid)
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
      scale: 0.97,
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
      scale: 0.97,
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
    <section className="relative bg-gradient-to-b from-slate-50/90 via-white to-slate-50/60 text-slate-900 overflow-hidden min-h-screen flex flex-col justify-between pt-28 sm:pt-32 md:pt-36 lg:pt-40 pb-0">
      {/* Subtle Luminous Brand Ambient Glows (Crimson Red & Warm Platinum) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-24 w-[500px] h-[500px] bg-rose-500/4 rounded-full blur-[130px]" />
        <div className="absolute -bottom-24 left-1/3 w-[600px] h-[600px] bg-slate-300/20 rounded-full blur-[140px]" />

        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Elegant SVG Heartbeat / ECG Line across background */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 opacity-[0.06] pointer-events-none select-none overflow-hidden">
        <svg viewBox="0 0 1200 120" className="w-full h-24" preserveAspectRatio="none">
          <path
            d="M 0,60 L 200,60 L 220,20 L 240,100 L 260,30 L 280,75 L 300,60 L 500,60 L 520,10 L 540,110 L 560,20 L 580,80 L 600,60 L 800,60 L 820,20 L 840,100 L 860,30 L 880,75 L 900,60 L 1200,60"
            fill="none"
            stroke="url(#ecgRedGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="ecgRedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e11d48" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Action Matrix */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Accreditation & Location Pills */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap items-center gap-2 mb-4 select-none"
            >
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-2xs">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <span>NABL M(EL)T Accredited & ISO 9001:2015</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                <Building2 size={13} className="text-slate-600" />
                <span>Keranitola, Midnapore Town (721101)</span>
              </div>
              <div className="inline-flex items-center gap-1 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold px-3 py-1.5 rounded-full">
                <Star size={13} className="text-rose-600 fill-rose-600" />
                <span>4.9★ (163+ Google Reviews)</span>
              </div>
            </motion.div>

            {/* Main Headline with Brand Crimson Red Typography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="/images/logo.jpg"
                  alt="New Life Care Diagnostic Centre Logo"
                  className="w-12 h-12 rounded-full border-2 border-slate-200 shadow-md object-cover bg-white shrink-0"
                />
                <div>
                  <span className="text-[11px] uppercase tracking-widest font-black text-rose-600 block leading-tight">
                    Government Registered Medical Diagnostic Lab
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    Reg. No. 02159 • Slogan: "We care for you..."
                  </span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-nunito tracking-tight leading-[1.12] mb-3 text-slate-900">
                New <span className="text-rose-600">LIFE CARE</span>
                <span className="block text-slate-900">
                  Diagnostic Centre
                </span>
                <span className="block text-lg sm:text-2xl md:text-3xl font-extrabold text-slate-700 mt-2 font-nunito">
                  Premier NABL Certified Pathology & Diagnostics in Midnapore
                </span>
              </h1>

              {/* Bengali Official Title */}
              <p className="text-slate-600 text-xs sm:text-sm font-medium tracking-wide mb-5 flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500" />
                নিউ লাইফ কেয়ার ডায়াগনস্টিক সেন্টার — নির্ভুল রিপোর্ট ও অভিজ্ঞ বিশেষজ্ঞ চিকিৎসক
              </p>
            </motion.div>

            {/* Rotating Specialty Highlight Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm mb-6 relative overflow-hidden group hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-600 to-red-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-600/20">
                    <Stethoscope size={22} />
                  </div>
                  <div>
                    <span className="text-[11px] font-black text-rose-600 uppercase tracking-wider block">
                      Live Specialist Chamber
                    </span>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={curSpec.title}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className={`text-base sm:text-lg font-bold font-nunito leading-tight ${curSpec.color}`}>
                          {curSpec.title}
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5 font-medium">
                          {curSpec.doctor}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                <Link
                  to="/doctors"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-white bg-slate-100 hover:bg-slate-900 px-3.5 py-2 rounded-xl transition-all border border-slate-200"
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
              className="flex flex-wrap items-center gap-3.5 mb-7"
            >
              <Link
                to="/book-consultation"
                className="group relative inline-flex items-center gap-2.5 bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-2xl shadow-xl shadow-rose-600/25 hover:shadow-rose-600/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <CalendarDays size={18} />
                <span>Book Doctor Appointment</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/book-collection"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800 font-bold text-sm sm:text-base px-5 py-3.5 rounded-2xl shadow-2xs hover:border-slate-300 transition-all"
              >
                <Activity size={18} className="text-rose-600" />
                <span>24/7 Home Sample Collection</span>
              </Link>
            </motion.div>

            {/* Trust Points Matrix */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200"
            >
              {[
                { label: 'Blood, Urine, Stool, Semen', sub: 'Complete Pathology' },
                { label: 'EEG & NCV Testing', sub: 'Neurological Lab' },
                { label: '24-Hr Holter & ECG', sub: 'Cardiology Care' },
                { label: 'Oxygen Cylinders', sub: 'Available 24x7' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-tight">{item.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Diagnostic Gallery Section (Requested by User) */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 25 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xl relative flex flex-col justify-between"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Gallery Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shadow-xs">
                    <Images size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        Diagnostic & Lab Gallery
                      </span>
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block leading-tight">
                      Photo Tour • Switches every 5 seconds
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                    {String(slideIdx + 1).padStart(2, '0')} / {String(galleryItems.length).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Sliding Photo Viewport (Linked directly to /gallery) */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md group">
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
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-950/80 text-white border border-white/20 backdrop-blur-md shadow-md">
                          <Sparkles size={11} className="text-rose-400" />
                          {curSlide.category || 'Diagnostic Centre'}
                        </span>

                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/20 text-white backdrop-blur-md border border-white/20 group-hover:bg-rose-600 transition-colors">
                          <Maximize2 size={11} />
                          <span>View Gallery</span>
                        </span>
                      </div>

                      {/* Bottom Caption Overlay */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pt-12 pb-3.5 px-4 sm:px-5 pointer-events-none">
                        <h3 className="text-white font-bold text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-rose-300 transition-colors">
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
                  <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-20 overflow-hidden">
                    <motion.div
                      key={slideIdx}
                      initial={{ width: '0%' }}
                      animate={{ width: isPaused ? '0%' : '100%' }}
                      transition={{ duration: 5, ease: 'linear' }}
                      className="h-full bg-gradient-to-r from-rose-500 to-red-600"
                    />
                  </div>
                </Link>
              </div>

              {/* Interactive Thumbnail Carousel Strip */}
              <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar py-1 select-none">
                {galleryItems.map((item, idx) => (
                  <button
                    key={item.id || item._id || idx}
                    onClick={() => {
                      setDirection(idx > slideIdx ? 1 : -1)
                      setSlideIdx(idx)
                    }}
                    className={`relative w-12 h-9 sm:w-14 sm:h-10 rounded-lg overflow-hidden shrink-0 border transition-all cursor-pointer ${
                      idx === slideIdx
                        ? 'border-rose-600 ring-2 ring-rose-600/40 scale-105'
                        : 'border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-400'
                    }`}
                    title={item.title}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Bottom Arrows & Gallery Actions (As Requested) */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                {/* Arrow Controls at the Bottom */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous photo"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-700 border border-slate-200 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-2xs"
                    title="Previous photo"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next photo"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-700 border border-slate-200 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-2xs"
                    title="Next photo"
                  >
                    <ChevronRight size={20} />
                  </button>

                  <span className="text-[11px] font-mono text-slate-600 ml-1 font-bold">
                    {slideIdx + 1} / {galleryItems.length}
                  </span>
                </div>

                {/* Direct Link to Gallery Section */}
                <Link
                  to="/gallery"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-600/20 transition-all active:scale-95"
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
      <div className="relative border-t border-slate-200 bg-white/90 backdrop-blur-md py-3.5 select-none overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-1.5 flex items-center justify-between text-[11px] font-bold text-slate-600 uppercase tracking-widest">
          <span className="flex items-center gap-1.5 text-rose-700">
            <Award size={13} className="text-rose-600" />
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
                className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:border-slate-400 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span className="text-slate-900 font-bold">{inst.name}</span>
                <span className="text-slate-500 text-[10px]">({inst.badge})</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
