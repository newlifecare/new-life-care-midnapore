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
  X,
  Phone,
  ShieldCheck,
  Microscope,
  MapPin,
  Clock,
} from 'lucide-react'
import { getGallery } from '../services/api'

// Institutional affiliations from official flyers
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
  { title: 'Orthopedics & Spine Trauma', doctor: 'Dr. S. K. Das (AIIMS New Delhi)', color: 'text-[#07478f]' },
  { title: 'Advanced GI & Hepatology', doctor: 'Dr. Panchanan Panigrahi (BHU)', color: 'text-emerald-700' },
  { title: 'Obstetrics, High-Risk Pregnancy', doctor: 'Dr. Ayesha Sultana (MRCOG London)', color: 'text-rose-600' },
  { title: 'Neurology & Neuro-Diagnostics', doctor: 'Dr. Archisman Haldar (AIIMS)', color: 'text-[#07478f]' },
  { title: 'Head & Neck Oncosurgery', doctor: 'Dr. Samujjwal Das (Desun Hospital)', color: 'text-indigo-700' },
  { title: 'Neuropsychiatry & Behavioral Health', doctor: 'Dr. Konika Das (SSKM Hospital)', color: 'text-purple-700' },
  { title: 'General & Laparoscopic Surgery', doctor: 'Dr. Biswajit Panda (MS Laparoscopic)', color: 'text-rose-600' },
]

// High-impact curated exhibits with the Official Poster as #1
const PRIMARY_GALLERY_EXHIBITS = [
  {
    id: 'official-poster-card1',
    tabTitle: '⭐ Official Centre Poster',
    title: 'Our Advanced Laboratory Machines & Facility',
    subtitle: 'High-Precision Technology for Accurate & Reliable Reports',
    description: 'NABL Accredited & ISO 9001:2015 Certified Centre featuring our 4-story facility in Keranitola and automated lab testing machinery.',
    category: 'Accredited Centre',
    imageUrl: '/images/official-centre-poster.jpg',
    featuredTag: 'Official Brand Card',
  },
  {
    id: 'biochem-floor',
    tabTitle: '🔬 Advanced Lab Machines',
    title: 'Automated Biochemistry & Cell Counter Analyzers',
    subtitle: 'Robotic Liquid Sensing & 28-Parameter Hematology',
    description: 'High-throughput AutoQuant analyzer and computerized 5-part hematology cell counter ensuring standard deviation < 1.5%.',
    category: 'Diagnostic Suite',
    imageUrl: '/images/lab-packages-equipment.jpg',
    featuredTag: 'Precision Testing',
  },
  {
    id: 'building-exterior',
    tabTitle: '🏢 4-Story Centre',
    title: 'New Life Care Diagnostic Centre — Midnapore',
    subtitle: 'Keranitola, Paschim Medinipur (721101)',
    description: 'Multi-specialty diagnostic infrastructure with pathology floor, digital X-Ray, computerized ECG, ultrasound & doctor chambers.',
    category: 'Keranitola Facility',
    imageUrl: '/images/banner-main.jpg',
    featuredTag: 'Physical Centre',
  },
  {
    id: 'diagnostic-bay',
    tabTitle: '🩺 ECG & Oxygen Bay',
    title: 'Computerized ECG, Holter & 24/7 Oxygen Support',
    subtitle: 'Cardiology Care & Emergency Cylinder Supply',
    description: 'Dedicated diagnostic bay equipped with computerized 12-lead ECG, 24-hr Holter, PFT, EEG and emergency oxygen cylinders available 24/7.',
    category: 'Testing Bays',
    imageUrl: '/images/lab-equipment-oxygen.jpg',
    featuredTag: '24/7 Available',
  },
  {
    id: 'specialist-schedule',
    tabTitle: '👨‍⚕️ Visiting Doctors',
    title: 'Visiting Specialist Physicians Panel',
    subtitle: '19 Doctors from AIIMS, PGIMER, BHU, SSKM & Manipal',
    description: 'Regular outpatient consultation chambers across cardiology, neurology, gastroenterology, orthopedics, gynecology and surgery.',
    category: 'Specialist Chambers',
    imageUrl: '/images/poster-visiting-doctors.jpg',
    featuredTag: '19 Specialists',
  },
]

export default function HeroSection() {
  const [specialtyIdx, setSpecialtyIdx] = useState(0)
  const [galleryItems, setGalleryItems] = useState(PRIMARY_GALLERY_EXHIBITS)
  const [slideIdx, setSlideIdx] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isPaused, setIsPaused] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  // Rotating specialty word ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setSpecialtyIdx((prev) => (prev + 1) % ROTATING_SPECIALTIES.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  // Auto-switch photo every 5.5 seconds unless paused
  useEffect(() => {
    if (isPaused || galleryItems.length <= 1) return
    const timer = setInterval(() => {
      setDirection(1)
      setSlideIdx((prev) => (prev + 1) % galleryItems.length)
    }, 5500)
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
      scale: 0.98,
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
      scale: 0.98,
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
    <>
      <section className="relative bg-gradient-to-br from-[#ebf5ff] via-[#e2f1fd] to-[#f2f8ff] text-slate-900 overflow-hidden min-h-screen flex flex-col justify-between pt-28 sm:pt-32 md:pt-36 lg:pt-38 pb-0">
        {/* Luminous Light Bluish Clinical Gradient Glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Soft sky-blue & azure luminous radial glow orbs */}
          <div className="absolute -top-28 -left-20 w-[600px] h-[600px] bg-sky-300/25 rounded-full blur-[140px]" />
          <div className="absolute top-1/4 -right-24 w-[650px] h-[650px] bg-blue-400/20 rounded-full blur-[150px]" />
          <div className="absolute top-1/2 left-1/3 w-[550px] h-[550px] bg-cyan-200/20 rounded-full blur-[140px]" />
          <div className="absolute -bottom-28 right-1/4 w-[600px] h-[600px] bg-sky-200/30 rounded-full blur-[150px]" />
          <div className="absolute top-20 left-1/2 w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-[120px]" />

          {/* Hexagonal Medical Geometry Overlay (From Card 1 Theme) */}
          <div className="absolute top-12 right-8 w-72 h-72 opacity-25 pointer-events-none hidden md:block">
            <svg viewBox="0 0 200 200" className="w-full h-full fill-none stroke-sky-500 stroke-[1.5]">
              <polygon points="100,10 130,28 130,62 100,80 70,62 70,28" />
              <polygon points="160,45 190,63 190,97 160,115 130,97 130,63" />
              <polygon points="100,80 130,98 130,132 100,150 70,132 70,98" />
              <polygon points="40,45 70,63 70,97 40,115 10,97 10,63" />
              <polygon points="160,115 190,133 190,167 160,185 130,167 130,133" />
            </svg>
          </div>

          {/* Micro precision dot grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #0369a1 1px, transparent 0)`,
              backgroundSize: '28px 28px',
            }}
          />
        </div>

        {/* Dynamic Heartbeat / ECG Wave Line across the background */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 opacity-[0.09] pointer-events-none select-none overflow-hidden">
          <svg viewBox="0 0 1200 120" className="w-full h-28" preserveAspectRatio="none">
            <path
              d="M 0,60 L 200,60 L 220,20 L 240,100 L 260,30 L 280,75 L 300,60 L 500,60 L 520,10 L 540,110 L 560,20 L 580,80 L 600,60 L 800,60 L 820,20 L 840,100 L 860,30 L 880,75 L 900,60 L 1200,60"
              fill="none"
              stroke="url(#ecgThemeGradient)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="ecgThemeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#07478f" />
                <stop offset="50%" stopColor="#d91d24" />
                <stop offset="100%" stopColor="#07478f" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Main Content Grid */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-6 sm:py-8 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* ── Left Column: Prominent Branding & Name (Styled like 1st Card) ── */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
              
              {/* Top Tag & Identity Row */}
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 mb-3.5"
              >
                <img
                  src="/images/logo.jpg"
                  alt="New Life Care Diagnostic Centre Official Logo"
                  className="w-13 h-13 sm:w-15 sm:h-15 rounded-full border-2 border-[#d91d24] shadow-md object-cover bg-white shrink-0 p-0.5"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#d91d24] bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full inline-block">
                      Govt. Regd. Lab • Reg. No. 02159
                    </span>
                    <span className="text-xs text-slate-500 font-bold italic hidden sm:inline-block">
                      "We care for you..."
                    </span>
                  </div>
                  <span className="text-xs text-slate-600 font-semibold flex items-center gap-1.5 mt-0.5">
                    <MapPin size={12} className="text-[#d91d24]" />
                    Keranitola, Paschim Medinipur - 721101
                  </span>
                </div>
              </motion.div>

              {/* ── PROMINENT HERO TITLE (Exact Match to 1st Card Theme) ── */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-3"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-nunito tracking-tight leading-[1.06]">
                  <span className="text-[#07478f] block">
                    New Life Care
                  </span>
                  <span className="text-[#d91d24] flex items-center gap-2 flex-wrap mt-1">
                    <span>Diagnostic Centre</span>
                    <svg
                      viewBox="0 0 90 24"
                      className="w-16 sm:w-20 h-6 text-[#d91d24] inline-block shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M0 12h20l5-9 6 18 5-13 4 8 5-4h45" />
                    </svg>
                  </span>
                </h1>

                {/* Card-Style Official Red Accreditation Ribbon */}
                <div className="mt-3.5 inline-flex items-center gap-2 bg-gradient-to-r from-[#d91d24] via-red-600 to-[#b91c1c] text-white font-black text-xs sm:text-sm px-4 py-2 rounded-xl shadow-md shadow-red-600/20">
                  <Award size={16} className="text-amber-300 shrink-0" />
                  <span>NABL M(EL)T Accredited & ISO 9001 : 2015 Certified Laboratory</span>
                </div>
              </motion.div>

              {/* ── Official Certificate Badges Strip (Home Screen Prominence) ── */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:p-3 shadow-xs mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 pl-1">
                    Quality Seals:
                  </span>
                  <img
                    src="/images/accreditations-strip.jpg"
                    alt="Accreditations: NABL LABS, ISO 9001:2015, IAF, KAB KAB-QC-88"
                    className="h-8 sm:h-9 object-contain"
                  />
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 shrink-0">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>Reports Valid Globally & at AIIMS</span>
                </div>
              </motion.div>

              {/* Services Strip from Card 1 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="mb-5"
              >
                <div className="flex items-center gap-1.5 text-xs font-black text-[#d91d24] uppercase tracking-wider mb-1.5">
                  <span>Our Services &gt;&gt;</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-slate-700">
                  {['Pathology', 'Digital X-Ray', 'ECG', 'Doctor Consultation', 'Health Check-Up Packages', 'Home Sample Collection'].map((svc, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/80 px-2.5 py-1 rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d91d24]" />
                      {svc}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Rotating Live Specialist Doctor Chamber Bar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-slate-50/80 border border-slate-200 rounded-2xl p-3 sm:p-4 mb-5 relative overflow-hidden group hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#07478f] to-blue-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-900/20">
                      <Stethoscope size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-[#d91d24] uppercase tracking-wider block">
                        Live Specialist Chamber Schedule
                      </span>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={curSpec.title}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p className={`text-sm sm:text-base font-bold font-nunito leading-tight ${curSpec.color}`}>
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
                    className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-slate-800 hover:text-white bg-white hover:bg-slate-900 px-3 py-1.5 rounded-xl transition-all border border-slate-200 shrink-0"
                  >
                    All 19 Doctors <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>

              {/* Action Buttons & Phone Hotlines */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 mb-5"
              >
                <Link
                  to="/book-consultation"
                  className="group inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#d91d24] via-red-600 to-[#b91c1c] hover:from-red-500 hover:to-red-700 text-white font-black text-sm sm:text-base px-6 py-3.5 rounded-2xl shadow-xl shadow-red-600/25 hover:shadow-red-600/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <CalendarDays size={18} />
                  <span>Book Doctor Appointment</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/book-collection"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800 font-bold text-sm sm:text-base px-5 py-3.5 rounded-2xl shadow-2xs hover:border-slate-300 transition-all"
                >
                  <Activity size={18} className="text-[#d91d24]" />
                  <span>24/7 Home Sample Collection</span>
                </Link>
              </motion.div>

              {/* Card 1 Phone Hotlines Strip */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-700 pt-3 border-t border-slate-200">
                <span className="font-extrabold text-[#d91d24] flex items-center gap-1">
                  <Phone size={13} />
                  <span>Direct Hotline:</span>
                </span>
                <a href="tel:9733525031" className="font-bold hover:text-[#07478f] transition-colors">
                  9733525031
                </a>
                <span className="text-slate-300">/</span>
                <a href="tel:9647393949" className="font-bold hover:text-[#07478f] transition-colors">
                  9647393949
                </a>
                <span className="text-slate-300">/</span>
                <a href="tel:8927790562" className="font-bold hover:text-[#07478f] transition-colors">
                  8927790562
                </a>
              </div>
            </div>

            {/* ── Right Column: High-End Diagnostic Centre & Gallery Showcase ── */}
            <div className="lg:col-span-6 xl:col-span-6 flex justify-center w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="w-full max-w-xl bg-white border-2 border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-2xl relative flex flex-col justify-between overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {/* Showcase Top Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Featured Diagnostic Facility & Lab
                    </span>
                  </div>

                  {/* Zoom Lightbox Trigger Button */}
                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 hover:bg-[#d91d24] hover:text-white text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                    title="Click to expand high-resolution view"
                  >
                    <Maximize2 size={13} />
                    <span>Zoom Fullscreen</span>
                  </button>
                </div>

                {/* Interactive Category Selector Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2.5 select-none">
                  {galleryItems.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setDirection(idx > slideIdx ? 1 : -1)
                        setSlideIdx(idx)
                      }}
                      className={`text-[11px] font-bold px-3 py-1 rounded-xl shrink-0 transition-all cursor-pointer ${
                        idx === slideIdx
                          ? 'bg-gradient-to-r from-[#d91d24] to-red-600 text-white shadow-sm scale-102'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60'
                      }`}
                    >
                      {item.tabTitle}
                    </button>
                  ))}
                </div>

                {/* Primary Sliding Viewport */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md group">
                  <div
                    onClick={() => setLightboxOpen(true)}
                    className="block relative h-72 sm:h-84 md:h-96 w-full overflow-hidden cursor-zoom-in select-none"
                    title="Click to enlarge"
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
                          className="w-full h-full object-cover sm:object-contain bg-slate-950 group-hover:scale-103 transition-transform duration-500 ease-out"
                        />

                        {/* Top Overlay Tag */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-slate-950/85 text-white border border-white/20 backdrop-blur-md shadow-md">
                            <Sparkles size={11} className="text-amber-400" />
                            {curSlide.featuredTag || curSlide.category}
                          </span>

                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#d91d24] text-white shadow-md">
                            <span>Inspect Image</span>
                          </span>
                        </div>

                        {/* Bottom Information Caption Overlay */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent pt-14 pb-3.5 px-4 sm:px-5 pointer-events-none">
                          <span className="text-[11px] font-black text-rose-400 uppercase tracking-wider block">
                            {curSlide.subtitle}
                          </span>
                          <h3 className="text-white font-extrabold text-sm sm:text-base leading-snug line-clamp-1 mt-0.5">
                            {curSlide.title}
                          </h3>
                          <p className="text-slate-300 text-xs mt-1 line-clamp-2 leading-relaxed font-normal">
                            {curSlide.description}
                          </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Animated Progress Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-20 overflow-hidden">
                      <motion.div
                        key={slideIdx}
                        initial={{ width: '0%' }}
                        animate={{ width: isPaused ? '0%' : '100%' }}
                        transition={{ duration: 5.5, ease: 'linear' }}
                        className="h-full bg-gradient-to-r from-[#d91d24] to-red-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Thumbnail Strip */}
                <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar py-1 select-none">
                  {galleryItems.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setDirection(idx > slideIdx ? 1 : -1)
                        setSlideIdx(idx)
                      }}
                      className={`relative w-14 h-10 sm:w-16 sm:h-11 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        idx === slideIdx
                          ? 'border-[#d91d24] ring-2 ring-red-500/40 scale-105'
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

                {/* Showcase Footer Controls */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrev}
                      aria-label="Previous slide"
                      className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-[#d91d24] hover:text-white text-slate-700 border border-slate-200 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-2xs"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={handleNext}
                      aria-label="Next slide"
                      className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-[#d91d24] hover:text-white text-slate-700 border border-slate-200 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-2xs"
                    >
                      <ChevronRight size={18} />
                    </button>
                    <span className="text-[11px] font-mono text-slate-600 ml-1 font-bold">
                      {slideIdx + 1} / {galleryItems.length}
                    </span>
                  </div>

                  <Link
                    to="/gallery"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#d91d24] text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
                  >
                    <Images size={14} />
                    <span>Open Full Gallery</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Infinite Animated Marquee of Hospital & Clinical Affiliations ── */}
        <div className="relative border-t border-slate-200 bg-white/95 backdrop-blur-md py-3.5 select-none overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 mb-1.5 flex items-center justify-between text-[11px] font-bold text-slate-600 uppercase tracking-widest">
            <span className="flex items-center gap-1.5 text-[#d91d24]">
              <Award size={13} className="text-[#d91d24]" />
              Specialists Affiliated With Premier Medical Institutes
            </span>
            <span className="hidden sm:inline-block text-slate-400 font-normal">
              New Life Care Diagnostic Centre • Keranitola, Midnapore
            </span>
          </div>

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
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d91d24]" />
                  <span className="text-slate-900 font-bold">{inst.name}</span>
                  <span className="text-slate-500 text-[10px]">({inst.badge})</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── High-Resolution Fullscreen Lightbox Modal ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col max-h-[92vh]"
            >
              {/* Modal Top Header */}
              <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-[#d91d24] text-white">
                    {curSlide.category}
                  </span>
                  <h3 className="text-white font-bold text-sm sm:text-base line-clamp-1">
                    {curSlide.title}
                  </h3>
                </div>
                <button
                  onClick={() => setLightboxOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Image Container */}
              <div className="relative flex-1 bg-black flex items-center justify-center overflow-auto p-2">
                <img
                  src={curSlide.imageUrl}
                  alt={curSlide.title}
                  className="max-h-[68vh] w-auto max-w-full object-contain rounded-xl"
                />
              </div>

              {/* Modal Bottom Bar */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
                <div>
                  <p className="font-semibold text-white">{curSlide.subtitle}</p>
                  <p className="text-slate-400 mt-0.5">{curSlide.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to="/book-collection"
                    onClick={() => setLightboxOpen(false)}
                    className="px-4 py-2 bg-[#d91d24] hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
                  >
                    Book Home Collection
                  </Link>
                  <Link
                    to="/gallery"
                    onClick={() => setLightboxOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors"
                  >
                    View All Gallery
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
