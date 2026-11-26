import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Images,
  Video,
  Play,
  Maximize2,
  X,
  Layers,
  Sparkles,
  Building2,
  Microscope,
  Stethoscope,
  Award,
  ChevronLeft,
  ChevronRight,
  Phone,
  CalendarDays,
  ShieldCheck,
  CheckCircle2,
  Activity,
  MapPin,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import PageHero from '../components/PageHero'
import { getGallery } from '../services/api'

const CATEGORIES = [
  { id: 'All', label: 'All Photos & Media', icon: Layers },
  { id: 'Equipment', label: 'Advanced Lab Machinery', icon: Microscope },
  { id: 'Facilities', label: 'Centre & Infrastructure', icon: Building2 },
  { id: 'Accreditation', label: 'Quality Certifications', icon: Award },
  { id: 'Doctors', label: 'Specialist Panels', icon: Stethoscope },
]

const CURATED_GALLERY = [
  {
    id: 'poster-card1',
    title: 'Our Advanced Laboratory Machines & 4-Story Diagnostic Centre',
    subtitle: 'High-Precision Technology for Accurate & Reliable Reports',
    description: 'Official master showcase of New Life Care Diagnostic Centre in Keranitola, featuring our dedicated 4-story facility, robotic biochemistry suite, 5-part hematology cell counter, automated ELISA, digital microscope, and international accreditations.',
    category: 'Equipment',
    imageUrl: '/images/official-centre-poster.jpg',
    featured: true,
    specs: ['AutoQuant Biochemistry', '5-Part Cell Counter', 'Digital Centrifuge', '4-Story Centre'],
  },
  {
    id: 'accreditation-banner',
    title: 'Government & International Quality Accreditations',
    subtitle: 'NABL M(EL)T Accredited & ISO 9001:2015 Certified Pathology',
    description: 'Official accreditation certification seals: NABL Medical Laboratories (Reg. No. 02159), ISO 9001:2015 Certified Pathology, IAF (International Accreditation Forum), and KAB (Korea Accreditation Board KAB-QC-88). Reports accepted worldwide.',
    category: 'Accreditation',
    imageUrl: '/images/header-banner.jpg',
    featured: true,
    specs: ['NABL M(EL)T Reg. 02159', 'ISO 9001:2015', 'IAF Multilateral', 'KAB-QC-88'],
  },
  {
    id: 'centre-building',
    title: 'New Life Care Diagnostic Centre — Physical Facility',
    subtitle: 'Keranitola, Paschim Medinipur - 721101',
    description: 'Modern 4-story healthcare building accommodating clinical pathology floor, digital X-Ray suite, computerized ECG, ultrasound rooms, emergency oxygen bank, and 19 visiting specialist chambers.',
    category: 'Facilities',
    imageUrl: '/images/banner-main.jpg',
    featured: true,
    specs: ['Keranitola Town Centre', '4 Floors Dedicated', 'Lift & Wheelchair Access', 'Emergency Oxygen Stock'],
  },
  {
    id: 'biochem-analyzers',
    title: 'Automated AutoQuant Biochemistry Suite & Cell Counters',
    subtitle: 'High-Throughput Robotic Liquid Pipetting',
    description: 'Automated spectrophotometric chemistry analyzer running up to 400 tests per hour alongside computerized 5-part laser flow cell counters. Guarantees CV < 1.5% and zero manual dilution error.',
    category: 'Equipment',
    imageUrl: '/images/lab-packages-equipment.jpg',
    featured: true,
    specs: ['400 Tests / Hour', 'Robotic Liquid Pipetting', 'Dual Daily Calibration', 'Bi-Directional LIS'],
  },
  {
    id: 'lab-floor-ncv-eeg',
    title: 'Computerized Pathology Floor & Neuro-Diagnostics Suite',
    subtitle: 'Digital Microscopy & Electrophysiology Station',
    description: 'Fully automated testing floor with digital Olympus microscopes, automated coagulation stations, and specialized 32-channel video EEG & NCV electrophysiology for brain and nerve disorders.',
    category: 'Equipment',
    imageUrl: '/images/lab-interior-ncv-eeg.jpg',
    featured: true,
    specs: ['32-Channel Digital EEG', 'Nerve Conduction (NCV)', 'Digital Microscopy', 'Pathologist Verification'],
  },
  {
    id: 'diagnostic-bay-oxygen',
    title: 'Cardiology Bay, Holter & 24/7 Medical Oxygen Support',
    subtitle: 'Emergency Oxygen Cylinders Available 24 Hours / 365 Days',
    description: 'Dedicated diagnostic bay equipped with computerized 12-lead digital ECG with instant automated rhythm analysis, 24-hr ambulatory Holter monitors, PFT spirometry, and 24/7 medical oxygen cylinder supply.',
    category: 'Facilities',
    imageUrl: '/images/lab-equipment-oxygen.jpg',
    featured: true,
    specs: ['12-Lead Computerized ECG', '24-Hour Ambulatory Holter', '24/7 Oxygen Supply', 'Bedside Monitoring'],
  },
  {
    id: 'specialist-schedule',
    title: 'Official Visiting Specialist Physicians Panel',
    subtitle: '19 Visiting Doctors from AIIMS, PGIMER, BHU, SSKM & Manipal',
    description: 'Comprehensive outpatient specialist chambers offering expert consultations across Cardiology, Neurology, Gastroenterology, Orthopedics, Obstetrics & Gynecology, Oncosurgery, and General Surgery.',
    category: 'Doctors',
    imageUrl: '/images/poster-visiting-doctors.jpg',
    featured: true,
    specs: ['AIIMS New Delhi', 'Manipal Hospitals', 'BHU Varanasi', 'SSKM Hospital'],
  },
]

export default function GalleryPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [modalIndex, setModalIndex] = useState(null) // index in displayItems

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true)
      try {
        const data = await getGallery(activeCategory === 'All' ? null : activeCategory)
        if (Array.isArray(data) && data.length > 0) {
          // Merge API data with curated items so official poster is always included
          const posterExists = data.some((i) => i.imageUrl?.includes('official-centre-poster'))
          const combined = posterExists ? data : [CURATED_GALLERY[0], ...data]
          setItems(combined)
        } else {
          setItems(CURATED_GALLERY)
        }
      } catch (err) {
        setItems(CURATED_GALLERY)
      } finally {
        setLoading(false)
      }
    }
    fetchGallery()
  }, [activeCategory])

  const displayItems = activeCategory === 'All'
    ? items
    : items.filter((item) => item.category === activeCategory)

  const activeModalItem = modalIndex !== null ? displayItems[modalIndex] : null

  const handleNextModal = () => {
    if (modalIndex === null) return
    setModalIndex((modalIndex + 1) % displayItems.length)
  }

  const handlePrevModal = () => {
    if (modalIndex === null) return
    setModalIndex(modalIndex === 0 ? displayItems.length - 1 : modalIndex - 1)
  }

  return (
    <PageTransition>
      <Helmet>
        <title>Diagnostic Centre & Lab Gallery | New Life Care - Keranitola, Midnapore</title>
        <meta
          name="description"
          content="Explore the high-precision laboratory machinery, 4-story centre building, computerized pathology floor, NABL certifications, and testing bays of New Life Care Diagnostic Centre in Keranitola."
        />
      </Helmet>

      {/* Page Hero Header */}
      <PageHero
        badge="Official Facility Tour"
        title="Inside Midnapore's Premier NABL Diagnostic Centre"
        subtitle="Explore our advanced automated laboratory machinery, 4-story facility, diagnostic testing bays, and international quality accreditations."
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        
        {/* ── TOP FEATURED EXHIBIT: The Official 1st Card Poster ── */}
        <section className="mb-14">
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-slate-800 shadow-2xl relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              {/* Poster Left Description */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-black uppercase tracking-widest text-rose-400">
                    Official Centre Showcase
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-nunito leading-tight mb-3">
                  <span className="text-blue-400">New Life Care</span>
                  <span className="block text-red-500">Diagnostic Centre</span>
                </h2>

                <div className="inline-block bg-[#d91d24] text-white font-black text-xs px-3.5 py-1.5 rounded-lg shadow-sm mb-4">
                  NABL M(EL)T Accredited & ISO 9001 : 2015 Certified Laboratory
                </div>

                <p className="text-slate-300 text-sm leading-relaxed mb-6 font-normal">
                  Our premier diagnostic facility situated at Keranitola, Paschim Medinipur. Powered by computerized high-precision machinery, dual pathologist verification, and 24/7 emergency home collection.
                </p>

                {/* Quality Seals Row */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 mb-6 flex items-center justify-between gap-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                    Quality Seals:
                  </span>
                  <img
                    src="/images/accreditations-strip.jpg"
                    alt="NABL, ISO, IAF, KAB"
                    className="h-8 object-contain"
                  />
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setModalIndex(0)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#d91d24] to-red-600 hover:from-red-500 hover:to-red-700 text-white font-black text-sm shadow-lg shadow-red-600/30 transition-all cursor-pointer"
                  >
                    <Maximize2 size={16} />
                    <span>Enlarge Full Poster</span>
                  </button>
                  <Link
                    to="/book-collection"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm border border-white/20 transition-all"
                  >
                    <CalendarDays size={16} />
                    <span>Book Home Test</span>
                  </Link>
                </div>
              </div>

              {/* Poster Right Image Card */}
              <div className="lg:col-span-7 flex justify-center">
                <div
                  onClick={() => setModalIndex(0)}
                  className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black cursor-zoom-in group max-w-2xl w-full"
                >
                  <img
                    src="/images/official-centre-poster.jpg"
                    alt="New Life Care Diagnostic Centre - Advanced Machines & Building"
                    className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#d91d24] text-white font-black text-xs shadow-lg">
                      <Maximize2 size={14} />
                      Click to View Full Resolution
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Category Filter Tabs ── */}
        <section aria-label="Media Category Filters" className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#d91d24] to-red-600 text-white shadow-md shadow-red-600/20 scale-102'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            )
          })}
        </section>

        {/* ── Gallery Cards Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-3xl border border-slate-200 p-4 space-y-3 animate-pulse">
                <div className="h-60 bg-slate-200 rounded-2xl" />
                <div className="h-4 bg-slate-200 rounded w-2/3" />
                <div className="h-3 bg-slate-100 rounded w-full" />
              </div>
            ))}
          </div>
        ) : displayItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
            <Images className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">No media found in this category</h3>
            <p className="text-slate-400 text-sm mt-1">Please select another category above.</p>
          </div>
        ) : (
          <motion.section
            aria-label="Diagnostic Centre Gallery Grid"
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {displayItems.map((item, idx) => (
              <motion.article
                key={item._id || item.id || idx}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-slate-300"
              >
                <div>
                  {/* Image Viewport */}
                  <div
                    onClick={() => setModalIndex(idx)}
                    className="relative h-64 sm:h-70 w-full overflow-hidden bg-slate-900 cursor-zoom-in"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover sm:object-contain bg-slate-950 group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-50 group-hover:opacity-75 transition-opacity" />

                    {/* Category Tag */}
                    <span className="absolute top-3.5 left-3.5 text-[10px] font-black uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#d91d24] px-3 py-1 rounded-full shadow-sm">
                      {item.category || 'Diagnostic'}
                    </span>

                    {/* Inspect Badge */}
                    <div className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#d91d24] text-white shadow-md">
                        <Maximize2 size={11} />
                        Zoom
                      </span>
                    </div>

                    {/* Subtitle Bar */}
                    {item.subtitle && (
                      <div className="absolute bottom-2.5 left-3.5 right-3.5 text-[11px] font-bold text-amber-300 truncate">
                        {item.subtitle}
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <h3 className="font-black text-slate-900 text-base leading-snug group-hover:text-[#07478f] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-xs mt-2 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>

                    {/* Spec Tags if available */}
                    {item.specs && item.specs.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
                        {item.specs.map((sp, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                          >
                            {sp}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100">
                  <button
                    onClick={() => setModalIndex(idx)}
                    className="text-xs font-bold text-[#d91d24] hover:text-red-700 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Maximize2 size={13} />
                    <span>Inspect Image</span>
                  </button>

                  <Link
                    to="/book-collection"
                    className="text-xs font-bold text-slate-700 hover:text-[#07478f] inline-flex items-center gap-1"
                  >
                    <span>Book Test</span>
                    <CheckCircle2 size={13} className="text-emerald-600" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.section>
        )}

        {/* ── Emergency Oxygen & Hotline Assistance Banner ── */}
        <section className="mt-16 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-rose-400 block mb-1">
              Direct Emergency & Booking Desk
            </span>
            <h3 className="text-xl sm:text-2xl font-black font-nunito">
              Need a Test Booking or Medical Oxygen Cylinder?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Our phlebotomists provide 24/7 doorstep home sample collection anywhere across Midnapore Town and adjoining areas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="tel:9733525031"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#d91d24] hover:bg-red-700 text-white font-black text-sm shadow-lg shadow-red-600/30 transition-all"
            >
              <Phone size={16} />
              <span>Call 97335 25031</span>
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
            >
              <span>Visit Us in Keranitola</span>
            </Link>
          </div>
        </section>
      </main>

      {/* ── Lightbox Modal with Full Zoom & Navigation ── */}
      <AnimatePresence>
        {activeModalItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalIndex(null)}
            className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col max-h-[94vh]"
            >
              {/* Header */}
              <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-[#d91d24] text-white">
                    {activeModalItem.category}
                  </span>
                  <h3 className="text-white font-bold text-sm sm:text-base line-clamp-1">
                    {activeModalItem.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 mr-2">
                    {modalIndex + 1} / {displayItems.length}
                  </span>
                  <button
                    onClick={() => setModalIndex(null)}
                    className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Image & Prev/Next Nav */}
              <div className="relative flex-1 bg-black flex items-center justify-center overflow-auto p-2">
                <img
                  src={activeModalItem.imageUrl}
                  alt={activeModalItem.title}
                  className="max-h-[66vh] w-auto max-w-full object-contain rounded-xl"
                />

                {/* Arrows */}
                <button
                  onClick={handlePrevModal}
                  aria-label="Previous"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-[#d91d24] text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={handleNextModal}
                  aria-label="Next"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-[#d91d24] text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              {/* Footer Info */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
                <div>
                  <p className="font-bold text-white text-sm">{activeModalItem.subtitle || activeModalItem.title}</p>
                  <p className="text-slate-400 mt-0.5 line-clamp-2">{activeModalItem.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to="/book-collection"
                    onClick={() => setModalIndex(null)}
                    className="px-4 py-2 bg-[#d91d24] hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
                  >
                    Book Home Collection
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
