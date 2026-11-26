import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  FileText,
  CheckCircle2,
  Clock,
  Download,
  Loader2,
  AlertCircle,
  Phone,
  Lock,
  KeyRound,
  ShieldCheck,
  Calendar,
  CreditCard,
  RefreshCw,
  ExternalLink,
  ChevronRight,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { verifyReport, verifyReportOtp } from '../services/api'
import PageTransition from '../components/PageTransition'
import PageHero from '../components/PageHero'

const inputCls =
  'w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#07478f] focus:border-transparent transition-all bg-white shadow-2xs'

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

export default function ReportsPage() {
  // Search Mode: 'regNo' (Bill / Reg No) or 'mobile' (10-digit mobile)
  const [searchMode, setSearchMode] = useState('regNo')
  const [regNo, setRegNo] = useState('')
  const [mobile, setMobile] = useState('')
  const [collectionDate, setCollectionDate] = useState(todayStr())

  const [loading, setLoading] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)

  // OTP Lockbox State
  const [ticketId, setTicketId] = useState(null)
  const [otpValue, setOtpValue] = useState('')
  const [otpAttemptsLeft, setOtpAttemptsLeft] = useState(3)

  // Result state
  const [lookupResult, setLookupResult] = useState(null)
  const [verifiedReportUrl, setVerifiedReportUrl] = useState(null)

  // Step 1: Submit Details for Verification
  const handleLookup = async (e) => {
    e.preventDefault()
    setLookupResult(null)
    setVerifiedReportUrl(null)
    setTicketId(null)
    setOtpValue('')
    setOtpAttemptsLeft(3)

    if (searchMode === 'regNo' && !regNo.trim()) {
      toast.error('Please enter your Bill or Registration Number.')
      return
    }

    if (searchMode === 'mobile') {
      const cleanMobile = mobile.trim()
      if (!cleanMobile || cleanMobile.length < 10) {
        toast.error('Please enter a valid 10-digit registered mobile number.')
        return
      }
    }

    if (!collectionDate) {
      toast.error('Please select the sample collection date.')
      return
    }

    setLoading(true)

    try {
      const payload = {
        collectionDate,
        ...(searchMode === 'regNo' ? { regNo: regNo.trim() } : { mobile: mobile.trim() }),
      }

      const res = await verifyReport(payload)

      if (res?.success && res?.requiresOtp && res?.ticketId) {
        setTicketId(res.ticketId)
        setLookupResult({
          status: 'REPORT_READY',
          message: res.message || 'Your report is ready! An OTP has been sent via SMS to your registered mobile number.',
          qrSRC: res.qrSRC || '',
        })
        toast.success('Report found! Please enter the OTP sent to your phone.')
      } else {
        setLookupResult({
          status: res?.status || 'NOT_FOUND',
          message: res?.message || 'No record found matching details. Please verify date and registration number.',
          qrSRC: res?.qrSRC || '',
        })
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not connect to the diagnostic server. Please try again.'
      setLookupResult({
        status: 'TECH_FAIL',
        message: msg,
      })
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Submit OTP to Unlock Report URL
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (!otpValue.trim()) {
      toast.error('Please enter the verification OTP.')
      return
    }

    setOtpLoading(true)

    try {
      const res = await verifyReportOtp({
        ticketId,
        otp: otpValue.trim(),
      })

      if (res?.success && res?.data?.reportUrl) {
        setVerifiedReportUrl(res.data.reportUrl)
        toast.success('OTP verified successfully! Download link ready.')
        // Open PDF in new tab automatically
        window.open(res.data.reportUrl, '_blank')
      } else {
        toast.error(res?.message || 'OTP verification failed.')
      }
    } catch (err) {
      const remaining = err.response?.data?.attemptsRemaining
      if (remaining !== undefined) {
        setOtpAttemptsLeft(remaining)
      }
      const msg = err.response?.data?.message || 'Invalid OTP. Please check the code sent to your phone.'
      toast.error(msg)
    } finally {
      setOtpLoading(false)
    }
  }

  const resetSearch = () => {
    setLookupResult(null)
    setVerifiedReportUrl(null)
    setTicketId(null)
    setOtpValue('')
  }

  return (
    <PageTransition>
      <Helmet>
        <title>Download Diagnostic Reports | New Life Care Diagnostic Centre</title>
        <meta
          name="description"
          content="Download verified NABL laboratory diagnostic reports online from New Life Care Diagnostic Centre in Midnapore using Bill No. or registered mobile number with secure OTP verification."
        />
      </Helmet>

      <PageHero
        badge="LIS Patient Portal"
        title="Download Your Diagnostic Reports"
        subtitle="Secure 2-step OTP verified access to your clinical pathology, biochemistry, and imaging reports."
        breadcrumb={[{ label: 'Reports' }]}
      />

      <section className="py-14 bg-gradient-to-b from-[#ebf5fe]/40 via-white to-[#ebf5fe]/60 min-h-[75vh]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          
          {/* Official Quality Assurance Bar */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#07478f] border border-blue-200 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-[#d91d24]">
                  Official LIS Gateway
                </p>
                <p className="text-slate-900 font-extrabold text-xs sm:text-sm">
                  New Life Care Diagnostic Centre • NABL Accredited & ISO 9001:2015
                </p>
              </div>
            </div>
            <img
              src="/images/accreditations-strip.jpg"
              alt="Certifications"
              className="h-8 object-contain hidden sm:block"
            />
          </div>

          {/* ── Search Form Card ── */}
          <div className="bg-white rounded-3xl border-2 border-slate-200/80 shadow-xl p-6 sm:p-8 mb-8 relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#07478f] to-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-900/20">
                  <Lock size={18} />
                </div>
                <div>
                  <h2 className="font-extrabold text-base sm:text-lg text-slate-900 font-nunito">
                    Secure Patient Report Lookup
                  </h2>
                  <p className="text-slate-500 text-xs">
                    Search via your Registration/Bill number or 10-digit mobile number
                  </p>
                </div>
              </div>

              {lookupResult && (
                <button
                  onClick={resetSearch}
                  className="text-xs font-bold text-slate-600 hover:text-[#d91d24] flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={12} />
                  <span>New Search</span>
                </button>
              )}
            </div>

            <form onSubmit={handleLookup} className="space-y-5">
              {/* Search Mode Toggle Tabs */}
              <div className="flex p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setSearchMode('regNo')
                    resetSearch()
                  }}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    searchMode === 'regNo'
                      ? 'bg-white text-[#07478f] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🧾 By Bill / Registration No.
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchMode('mobile')
                    resetSearch()
                  }}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    searchMode === 'mobile'
                      ? 'bg-white text-[#07478f] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📱 By Registered Mobile
                </button>
              </div>

              {/* Input Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Search Identifier */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                    {searchMode === 'regNo' ? 'Registration / Bill Number' : 'Registered Mobile Number'}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  {searchMode === 'regNo' ? (
                    <input
                      type="text"
                      value={regNo}
                      onChange={(e) => setRegNo(e.target.value)}
                      placeholder="e.g. LC202611001 or bill number"
                      className={inputCls}
                      required
                    />
                  ) : (
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className={inputCls}
                      required
                    />
                  )}
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {searchMode === 'regNo' ? 'Printed on your receipt/slip' : 'Number given during sample collection'}
                  </span>
                </div>

                {/* Collection Date */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                    Sample Collection Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={collectionDate}
                      onChange={(e) => setCollectionDate(e.target.value)}
                      className={inputCls}
                      required
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Format: YYYY-MM-DD
                  </span>
                </div>
              </div>

              {/* Search Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#07478f] via-blue-700 to-[#07478f] hover:from-blue-700 hover:to-blue-800 text-white font-black text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-blue-900/20 transition-all cursor-pointer disabled:opacity-60"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                  <span>{loading ? 'Verifying with Lab Server...' : 'Find My Report'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* ── Step 2: OTP Verification Lockbox Card ── */}
          <AnimatePresence>
            {ticketId && lookupResult?.status === 'REPORT_READY' && !verifiedReportUrl && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50/80 rounded-3xl border-2 border-blue-200 p-6 sm:p-8 shadow-xl mb-8"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d91d24] to-red-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-red-500/20">
                    <KeyRound size={22} />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200 mb-1">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      Report Ready for Download
                    </span>
                    <h3 className="text-lg font-black text-slate-900 font-nunito">
                      Enter Verification OTP
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm mt-0.5 leading-relaxed">
                      {lookupResult.message}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleVerifyOtp} className="mt-5 space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                      SMS Verification Code (OTP) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 8))}
                      placeholder="Enter 4 or 6-digit OTP"
                      className="w-full border-2 border-blue-300 rounded-xl px-4 py-3 text-lg font-mono font-bold tracking-widest text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#07478f]"
                      autoFocus
                      required
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Attempts remaining: <span className="font-bold text-red-600">{otpAttemptsLeft}</span>
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={otpLoading}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#d91d24] to-red-600 hover:from-red-600 hover:to-red-700 text-white font-black text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-red-600/25 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {otpLoading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                    <span>{otpLoading ? 'Verifying OTP...' : 'Verify OTP & Download Report'}</span>
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Step 3: Verified Download Success Card ── */}
          <AnimatePresence>
            {verifiedReportUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 shadow-xl mb-8 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/25">
                  <CheckCircle2 size={30} />
                </div>
                <h3 className="text-xl font-black text-slate-900 font-nunito">
                  Diagnostic Report Verified & Ready
                </h3>
                <p className="text-slate-600 text-sm mt-1 mb-6 max-w-md mx-auto">
                  Your official NABL-accredited laboratory PDF report is ready for download.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={verifiedReportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-600/30 transition-all"
                  >
                    <Download size={18} />
                    <span>Download PDF Report Now</span>
                    <ExternalLink size={14} />
                  </a>

                  <button
                    onClick={resetSearch}
                    className="px-5 py-3.5 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all cursor-pointer"
                  >
                    Search Another Report
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Status Feedback (Pending, Payment, Not Found) ── */}
          <AnimatePresence>
            {lookupResult && lookupResult.status !== 'REPORT_READY' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-3xl border-2 p-6 sm:p-8 shadow-md mb-8 ${
                  lookupResult.status === 'REPORT_PENDING'
                    ? 'bg-amber-50/80 border-amber-200'
                    : lookupResult.status === 'PAYMENT_PENDING'
                    ? 'bg-orange-50/80 border-orange-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      lookupResult.status === 'REPORT_PENDING'
                        ? 'bg-amber-500 text-white'
                        : lookupResult.status === 'PAYMENT_PENDING'
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-400 text-white'
                    }`}
                  >
                    {lookupResult.status === 'REPORT_PENDING' ? (
                      <Clock size={20} />
                    ) : lookupResult.status === 'PAYMENT_PENDING' ? (
                      <CreditCard size={20} />
                    ) : (
                      <AlertCircle size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base">
                      {lookupResult.status === 'REPORT_PENDING'
                        ? 'Report Under Clinical Evaluation'
                        : lookupResult.status === 'PAYMENT_PENDING'
                        ? 'Billing / Payment Notice'
                        : 'No Matching Report Found'}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
                      {lookupResult.message}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                  <span>Need immediate assistance?</span>
                  <a
                    href="tel:9733525031"
                    className="inline-flex items-center gap-1.5 font-bold text-[#d91d24] hover:underline"
                  >
                    <Phone size={13} />
                    <span>Call Lab Reception: 97335 25031</span>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Helpdesk Notice */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200 p-5 text-xs text-slate-600 leading-relaxed flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="font-bold text-slate-900">Hospital LIS Helpdesk Support</p>
              <p className="text-slate-500 mt-0.5">
                Physical collection counter open 7:00 AM – 8:00 PM at Keranitola, Paschim Medinipur.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="tel:9733525031"
                className="font-bold text-[#07478f] hover:underline flex items-center gap-1"
              >
                <Phone size={13} /> 9733525031
              </a>
              <span className="text-slate-300">/</span>
              <a
                href="tel:9647393949"
                className="font-bold text-[#07478f] hover:underline flex items-center gap-1"
              >
                <Phone size={13} /> 9647393949
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
