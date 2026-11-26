import { Star, ShieldCheck, HeartHandshake, CheckCircle2, MessageSquare, ExternalLink } from 'lucide-react'

const REVIEWS = [
  {
    name: 'Tapas Kumar',
    tag: 'Verified Patient',
    badge: 'Accurate Testing',
    badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    date: 'Keranitola, Midnapore',
    text: 'I got the best service in NEW LIFE CARE DIAGNOSTIC LABORATORY. The automated machines give immediate results and the staff is very caring.',
  },
  {
    name: 'Anirban Roy',
    tag: 'Emergency Night Case',
    badge: 'Late Night Service',
    badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
    date: 'Midnapore Town',
    text: 'Very helpful people! At night 9 pm they stayed and processed our emergency blood report so the doctor could start treatment without delay.',
  },
  {
    name: 'Subrata Maity',
    tag: 'Local Resident',
    badge: 'Courteous Staff',
    badgeStyle: 'bg-sky-50 text-sky-700 border-sky-200',
    date: 'Station Road, Midnapore',
    text: 'The lab owner and all technicians are polite and attentive. Clean premises, sterile needles, and completely painless blood collection.',
  },
  {
    name: 'Arpita Mondal',
    tag: 'Home Collection Patient',
    badge: 'Doorstep Pickup',
    badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    date: 'Rabindra Nagar, Midnapore',
    text: 'Technician arrived within 30 minutes of calling. The digital NABL PDF report was delivered on my WhatsApp before 2 pm. Truly unmatched service.',
  },
  {
    name: 'Sourav Ghosh',
    tag: 'Annual Health Check',
    badge: 'Full Health Package',
    badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    date: 'Collectorate Area',
    text: 'Did the 47-test full body package. Every single parameter was thoroughly explained. Much more economical than Kolkata diagnostic chains.',
  },
  {
    name: 'Priya Dey',
    tag: 'Maternity Care',
    badge: 'Consultant Advisory',
    badgeStyle: 'bg-pink-50 text-pink-700 border-pink-200',
    date: 'Battala, Midnapore',
    text: 'Very hygienic and modern diagnostic facility. The consulting specialist doctors provide genuine advice without unnecessary medication.',
  },
]

export default function PatientTrustWall() {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-black uppercase tracking-wider mb-3">
            <HeartHandshake size={13} className="text-rose-600" />
            <span>Community Trust & Google Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-nunito text-slate-900 tracking-tight leading-tight">
            Loved By Families Across{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-red-500 to-sky-600">
              Midnapore Town
            </span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Rated 4.9★ across 163+ authentic Google Reviews. Here is what local patients say about our accuracy, speed, and emergency night support.
          </p>

          {/* Rating Summary Bar (ZERO yellow/amber - uses crimson red & sky blue) */}
          <div className="inline-flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl px-5 py-2.5 mt-6 shadow-2xs">
            <div className="flex text-rose-600">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="currentColor" />
              ))}
            </div>
            <span className="text-xs sm:text-sm font-black text-slate-900">
              4.9 / 5.0 Rating
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-semibold text-slate-600">
              163+ Verified Patient Reviews
            </span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {REVIEWS.map((rev, idx) => (
            <article
              key={idx}
              className="bg-slate-50 border border-slate-200/90 rounded-3xl p-6 transition-all hover:shadow-lg hover:border-slate-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex text-rose-600">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${rev.badgeStyle}`}>
                    {rev.badge}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">{rev.name}</h4>
                  <span className="text-[11px] text-slate-400 block">{rev.date}</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {rev.tag}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Location & Google Map CTA */}
        <div className="text-center">
          <a
            href="https://maps.google.com/?q=New+Life+Care+Diagnostic+centre+Keranitola+Midnapore"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-5 py-3 rounded-2xl transition-all"
          >
            <span>View Verified Reviews on Google Maps</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}
