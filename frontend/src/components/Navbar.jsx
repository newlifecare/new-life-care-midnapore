import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { HeartPulse, Menu, X, Phone, Bell, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import NoticesModal from './NoticesModal'
import { getActiveNotices } from '../services/api'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Departments', to: '/departments' },
  { label: 'Doctors', to: '/doctors' },
  { label: 'Diagnostics', to: '/diagnostics' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Home Collection', to: '/book-collection' },
  { label: 'Reports', to: '/reports' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [noticesModalOpen, setNoticesModalOpen] = useState(false)
  const [activeNotices, setActiveNotices] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [navigate])

  // Fetch active notices for the bell indicator
  const loadNotices = async () => {
    try {
      const data = await getActiveNotices()
      if (Array.isArray(data)) {
        setActiveNotices(data)
      }
    } catch (_) {}
  }

  useEffect(() => {
    loadNotices()
    const interval = setInterval(loadNotices, 30000)
    return () => clearInterval(interval)
  }, [])

  const hasUrgentAlert = activeNotices.some((n) => n.type === 'alert')

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white/90 backdrop-blur-sm'
        }`}
      >
        {/* Top Info Bar */}
        <div className="bg-slate-900 text-white text-xs py-1.5 px-4 hidden md:flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              NABL M(EL)T Accredited & ISO 9001:2015 Certified
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">Keranitola, Station Road, Midnapore</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sky-300 font-semibold">24/7 Helpline:</span>
            <a href="tel:9733525031" className="flex items-center gap-1 text-white hover:text-sky-300 transition-colors font-bold">
              <Phone size={12} className="text-sky-400" />
              97335 25031
            </a>
            <a href="tel:9647393949" className="flex items-center gap-1 text-white hover:text-sky-300 transition-colors font-bold">
              <Phone size={12} className="text-sky-400" />
              96473 93949
            </a>
          </div>
        </div>

        {/* Main nav */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/images/logo.jpg"
                alt="New Life Care Diagnostic Centre Logo"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-[#d91d24] shadow-sm group-hover:scale-105 transition-transform bg-white p-0.5"
              />
              <div className="leading-tight">
                <span className="font-black text-[#07478f] text-base sm:text-lg font-nunito block leading-tight">
                  New Life Care
                </span>
                <span className="text-[11px] sm:text-xs font-black text-[#d91d24] tracking-wider block leading-none uppercase">
                  Diagnostic Centre
                </span>
              </div>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'text-rose-600 bg-rose-50 font-bold'
                        : 'text-slate-700 hover:text-rose-600 hover:bg-slate-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Actions: Bell button + Book Appointment CTA + mobile toggle */}
            <div className="flex items-center gap-2.5">
              {/* Notice Bell Indicator */}
              <button
                onClick={() => setNoticesModalOpen(true)}
                title="View Announcements & Urgent Alerts"
                className={`relative p-2.5 rounded-xl border transition-all cursor-pointer ${
                  hasUrgentAlert
                    ? 'bg-rose-50 border-rose-300 text-rose-600 hover:bg-rose-100 animate-pulse'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50'
                }`}
              >
                <Bell size={18} />
                {activeNotices.length > 0 && (
                  <span
                    className={`absolute -top-1 -right-1 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center text-white ${
                      hasUrgentAlert ? 'bg-rose-600' : 'bg-sky-600'
                    }`}
                  >
                    {activeNotices.length}
                  </span>
                )}
              </button>

              <Link
                to="/book-consultation"
                className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-rose-600/20 hover:shadow-lg hover:shadow-rose-600/30 active:scale-95"
              >
                Book Appointment
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-sky-50 transition-colors cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="lg:hidden bg-white border-t border-slate-100 overflow-hidden shadow-xl"
            >
              <div className="px-4 py-3 space-y-1">
                {/* Mobile alerts shortcut */}
                {activeNotices.length > 0 && (
                  <button
                    onClick={() => {
                      setMobileOpen(false)
                      setNoticesModalOpen(true)
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold mb-2 cursor-pointer ${
                      hasUrgentAlert
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-sky-50 text-sky-800 border border-sky-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Bell size={14} />
                      View Hospital Announcements & Alerts
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white text-slate-800 shadow-xs">
                      {activeNotices.length} Active
                    </span>
                  </button>
                )}

                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'text-sky-600 bg-sky-50 font-semibold'
                          : 'text-slate-700 hover:bg-sky-50 hover:text-sky-600'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}

                <div className="pt-2 pb-1">
                  <Link
                    to="/book-consultation"
                    onClick={() => setMobileOpen(false)}
                    className="block text-center bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold py-3 rounded-xl transition-colors shadow-md shadow-rose-600/20"
                  >
                    Book Appointment
                  </Link>
                </div>
                <div className="flex gap-3 pt-1 pb-2">
                  <a
                    href="tel:9733525031"
                    className="flex-1 text-center text-xs font-bold text-rose-600 border border-rose-200 rounded-xl py-2 hover:bg-rose-50 transition-colors"
                  >
                    📞 9733525031
                  </a>
                  <a
                    href="tel:9647393949"
                    className="flex-1 text-center text-xs font-bold text-sky-600 border border-sky-200 rounded-xl py-2 hover:bg-sky-50 transition-colors"
                  >
                    📞 9647393949
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hospital Notices & Urgent Alerts Modal */}
      <NoticesModal
        isOpen={noticesModalOpen}
        onClose={() => setNoticesModalOpen(false)}
        notices={activeNotices}
      />
    </>
  )
}
