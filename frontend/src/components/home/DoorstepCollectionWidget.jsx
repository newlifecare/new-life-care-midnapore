import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Home,
  Clock,
  ShieldCheck,
  PhoneCall,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MapPin,
  Flame,
} from 'lucide-react'

export default function DoorstepCollectionWidget() {
  const [fastTrackPhone, setFastTrackPhone] = useState('')
  const [fastTrackName, setFastTrackName] = useState('')

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white relative overflow-hidden">
      {/* Decorative Brand Ambient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Service Strengths */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-black uppercase tracking-wider mb-4 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
              <span>24/7 Doorstep Diagnostic Service</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-nunito tracking-tight text-white leading-tight mb-4">
              Skip The Queue.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-rose-400">
                Hospital-Grade Testing
              </span>{' '}
              At Your Home.
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              Whether for elderly parents, pregnant mothers, newborn babies, or busy professionals—our licensed phlebotomists arrive at your doorstep across Midnapore town with barcode-sealed, cold-chain preservation kits.
            </p>

            {/* Feature Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                { title: 'Gentle Pediatric & Geriatric Phlebotomy', desc: 'Single-prick precision with ultra-thin butterfly safety needles.' },
                { title: 'Vacuum Barcoded Vacutainers', desc: 'Specimen sealed in sterile BD tubes right in front of your eyes.' },
                { title: 'Digital Reports on WhatsApp', desc: 'Delivered directly as an official NABL signed PDF report.' },
                { title: '24/7 Emergency Oxygen Support', desc: 'Emergency medical oxygen cylinder delivery across Midnapore.' },
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">{feat.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Local Areas Covered */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <span className="font-bold text-sky-300 flex items-center gap-1">
                <MapPin size={13} className="text-rose-400" />
                Service Areas in Midnapore:
              </span>
              {['Keranitola', 'Rabindra Nagar', 'Station Road', 'Golbazar', 'Collectorate', 'Vidyasagar University', 'Habibpur', 'Battala', 'Kotwali'].map((area) => (
                <span key={area} className="bg-white/10 border border-white/15 px-2.5 py-0.5 rounded-full text-[11px]">
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Direct Fast Booking Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 border border-white/20 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-white/15 mb-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 block">
                    Fast-Track Request
                  </span>
                  <h3 className="text-xl font-black font-nunito text-white">
                    Book Home Collection Now
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center shadow-lg">
                  <Home size={20} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Link
                  to="/book-collection"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-sm py-3.5 px-6 rounded-2xl shadow-xl shadow-rose-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Calendar size={16} />
                  <span>Open Full At-Home Booking Form</span>
                  <ArrowRight size={16} />
                </Link>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-white/10" />
                  <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Or Reach Desk Directly
                  </span>
                  <div className="flex-grow border-t border-white/10" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="tel:09733525031"
                    className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white transition-all text-center group"
                  >
                    <PhoneCall size={18} className="text-sky-400 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] text-slate-400">Primary Phone</span>
                    <strong className="text-xs font-bold text-white">097335 25031</strong>
                  </a>

                  <a
                    href="tel:09647393949"
                    className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white transition-all text-center group"
                  >
                    <PhoneCall size={18} className="text-rose-400 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] text-slate-400">Alternate Line</span>
                    <strong className="text-xs font-bold text-white">096473 93949</strong>
                  </a>
                </div>

                <a
                  href="https://wa.me/919733525031?text=Hello%20New%20Life%20Care,%20I%20would%20like%20to%20request%20a%20home%20sample%20collection."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-2xl transition-all shadow-md"
                >
                  <span>Chat on WhatsApp (Instant Response)</span>
                  <ArrowRight size={14} />
                </a>
              </div>

              {/* Bottom Emergency Banner */}
              <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  Free Home Pickup On Packages
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Keranitola Central Hub
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
