import { Helmet } from 'react-helmet-async'
import PageTransition from '../components/PageTransition'
import HeroSection from '../components/HeroSection'
import AccreditationRibbon from '../components/home/AccreditationRibbon'
import InteractiveHealthExplorer from '../components/home/InteractiveHealthExplorer'
import SmartTestFinder from '../components/home/SmartTestFinder'
import LabTechnologyShowcase from '../components/home/LabTechnologyShowcase'
import SampleJourneyVisualizer from '../components/home/SampleJourneyVisualizer'
import DoorstepCollectionWidget from '../components/home/DoorstepCollectionWidget'
import DoctorAffiliationSpotlight from '../components/home/DoctorAffiliationSpotlight'
import PatientTrustWall from '../components/home/PatientTrustWall'
import InteractiveFaq from '../components/home/InteractiveFaq'

export default function HomePage() {
  return (
    <PageTransition>
      <Helmet>
        <title>New Life Care Diagnostic Centre | NABL M(EL)T Accredited | Midnapore</title>
        <meta
          name="description"
          content="New Life Care Diagnostic Centre – Midnapore's premier NABL & ISO 9001:2015 accredited laboratory. Advanced automated pathology, digital X-Ray, computerized ECG, EEG, NCV, and 24/7 home sample collection in Keranitola."
        />
        <meta
          name="keywords"
          content="New Life Care Diagnostic Centre, NABL accredited pathology Midnapore, blood test home collection Midnapore, ECG Holter EEG NCV, AIIMS doctors chamber Midnapore, Keranitola diagnostic centre"
        />
      </Helmet>

      {/* ── 1. Advanced Animated Hero Section with 5-Second Gallery Slider ── */}
      <HeroSection />

      {/* ── 2. Official Accreditations & Quality Assurance Ribbon ────────────── */}
      <AccreditationRibbon />

      {/* ── 3. Interactive Clinical Department Explorer ─────────────────────── */}
      <InteractiveHealthExplorer />

      {/* ── 4. Smart Health Screener & Interactive Test Finder ───────────────── */}
      <SmartTestFinder />

      {/* ── 5. Engineering Behind Precision: Inside Our Automated Lab ────────── */}
      <LabTechnologyShowcase />

      {/* ── 6. The 6-Stage Diagnostic Pipeline: From Arm to Report ──────────── */}
      <SampleJourneyVisualizer />

      {/* ── 7. 24/7 Doorstep Collection & Emergency Oxygen Widget ───────────── */}
      <DoorstepCollectionWidget />

      {/* ── 8. Senior Medical Specialists Panel (AIIMS, Manipal, BHU, SSKM) ──── */}
      <DoctorAffiliationSpotlight />

      {/* ── 9. Community Trust Wall & Verified Google Reviews ───────────────── */}
      <PatientTrustWall />

      {/* ── 11. Patient Helpdesk & Frequently Asked Questions ────────────────── */}
      <InteractiveFaq />
    </PageTransition>
  )
}
