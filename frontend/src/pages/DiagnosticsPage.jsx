import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FlaskConical,
  Heart,
  Scan,
  Wind,
  Package,
  Microscope,
  CheckCircle,
  ArrowRight,
  Clock,
  Beaker,
  Search,
  Layers,
  FileCheck,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { getTestCatalog, getHealthPackages } from '../services/api';
import PageTransition from '../components/PageTransition';
import PageHero from '../components/PageHero';

const TYPE_PILLS = [
  { key: 'All', label: 'All Tests & Profiles' },
  { key: 'Test', label: 'Single Diagnostic Tests' },
  { key: 'Profile', label: 'Test Panels & Profiles' },
  { key: 'Package', label: 'Health Checkup Packages' },
  { key: 'Template', label: 'Histopathology & Templates' },
];

const TABS = [
  { key: 'All', label: 'All Departments', icon: Microscope },
  { key: 'Haematology', label: 'Haematology', icon: FlaskConical },
  { key: 'Biochemistry', label: 'Biochemistry', icon: Beaker },
  { key: 'Pathology', label: 'Pathology', icon: FlaskConical },
  { key: 'Cardiology', label: 'Cardiology & ECG', icon: Heart },
  { key: 'Radiology', label: 'Digital X-Ray', icon: Scan },
  { key: 'Packages', label: 'Checkup Packages', icon: Package },
];

function typeBadge(type) {
  switch (type) {
    case 'Profile':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Package':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'Template':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    default:
      return 'bg-sky-100 text-[#07478f] border-sky-200';
  }
}

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100">
      {[...Array(5)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-slate-200 rounded animate-pulse w-full" />
        </td>
      ))}
    </tr>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-3 animate-pulse">
      <div className="h-5 bg-slate-200 rounded w-3/4" />
      <div className="h-4 bg-slate-100 rounded w-1/2" />
      <div className="space-y-2 mt-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-3 bg-slate-100 rounded w-full" />
        ))}
      </div>
      <div className="h-9 bg-slate-200 rounded-xl w-full mt-4" />
    </div>
  );
}

function PackageCard({ pkg, idx }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.08, duration: 0.4 }}
      className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm hover:shadow-xl transition-all p-6 flex flex-col justify-between group hover:border-slate-300"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
              {pkg.type || pkg.Type || 'Health Package'}
            </span>
            <h3 className="text-slate-900 font-extrabold text-lg leading-tight group-hover:text-[#07478f] transition-colors">
              {pkg.name}
            </h3>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl px-4 py-2 text-center shrink-0">
            <p className="text-[#07478f] font-black text-xl">₹{pkg.price}</p>
            <p className="text-slate-400 text-[10px] font-semibold">Live Price</p>
          </div>
        </div>

        {pkg.description && (
          <p className="text-slate-600 text-xs leading-relaxed mb-4">{pkg.description}</p>
        )}

        {pkg.tests && pkg.tests.length > 0 && (
          <div>
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">
              Parameters / Includes:
            </p>
            <ul className="space-y-1.5">
              {pkg.tests.slice(0, 6).map((t, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{t}</span>
                </li>
              ))}
              {pkg.tests.length > 6 && (
                <li className="text-[11px] text-slate-400 font-medium pl-5.5">
                  + {pkg.tests.length - 6} more tests included
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
        <Link
          to={`/book-collection?test=${encodeURIComponent(pkg.name)}`}
          className="w-full flex items-center justify-center gap-2 bg-[#d91d24] hover:bg-red-700 text-white font-black text-xs sm:text-sm py-3 rounded-2xl shadow-md shadow-red-600/20 transition-all"
        >
          <span>Book Home Sample Collection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.article>
  );
}

export default function DiagnosticsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [tests, setTests] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pkgLoading, setPkgLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      try {
        const data = await getTestCatalog();
        setTests(Array.isArray(data) ? data : []);
      } catch {
        setTests([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchPackages = async () => {
      setPkgLoading(true);
      try {
        const data = await getHealthPackages();
        setPackages(Array.isArray(data) ? data : []);
      } catch {
        setPackages([]);
      } finally {
        setPkgLoading(false);
      }
    };

    fetchTests();
    fetchPackages();
  }, []);

  // Filtered tests based on Search, Department Tab, and LIS Type Pill
  const filteredTests = useMemo(() => {
    return tests.filter((t) => {
      // 1. Filter by LIS Type
      if (selectedType !== 'All') {
        const itemType = t.type || t.Type || '';
        if (itemType.toLowerCase() !== selectedType.toLowerCase()) return false;
      }

      // 2. Filter by Department Tab
      if (activeTab !== 'All' && activeTab !== 'Packages') {
        const cat = (t.category || '').toLowerCase();
        const dept = (t.deptName || '').toLowerCase();
        const tabLower = activeTab.toLowerCase();
        if (!cat.includes(tabLower) && !dept.includes(tabLower)) return false;
      }

      // 3. Filter by Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const name = (t.name || '').toLowerCase();
        const code = (t.testCode || t.id || '').toLowerCase();
        const dept = (t.deptName || '').toLowerCase();
        if (!name.includes(q) && !code.includes(q) && !dept.includes(q)) return false;
      }

      return true;
    });
  }, [tests, selectedType, activeTab, searchQuery]);

  return (
    <PageTransition>
      <Helmet>
        <title>Diagnostic Tests & Live Pricing | New Life Care Midnapore</title>
        <meta
          name="description"
          content="Browse 380+ live diagnostic tests, profiles, and health checkup packages with instant pricing from New Life Care Diagnostic Centre in Keranitola, Midnapore."
        />
      </Helmet>

      <main className="overflow-x-hidden bg-gradient-to-b from-[#ebf5fe]/40 via-white/50 to-[#ebf5fe]/60 min-h-screen">
        <PageHero
          badge="Live LIS Price Catalog"
          title="Diagnostic Tests, Profiles & Packages"
          subtitle="Explore 380+ accredited diagnostic investigations with live pricing synced directly from our laboratory main server."
          breadcrumb={[{ label: 'Diagnostics' }]}
        />

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          
          {/* ── Search & Filter Controls Card ── */}
          <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm mb-8 space-y-4">
            
            {/* Top Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 380+ tests, profiles, or packages (e.g. CBC, Lipid, HbA1c, Thyroid)..."
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#07478f] focus:bg-white transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* LIS Type Filter Pills */}
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block mb-2">
                Filter By Test Type:
              </span>
              <div className="flex flex-wrap gap-2">
                {TYPE_PILLS.map((pill) => {
                  const isSel = selectedType === pill.key;
                  return (
                    <button
                      key={pill.key}
                      onClick={() => setSelectedType(pill.key)}
                      className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        isSel
                          ? 'bg-[#07478f] text-white border-[#07478f] shadow-xs scale-102'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {pill.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Department Filter Tabs */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#d91d24] to-red-600 text-white border-red-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between gap-4 mb-4 text-xs text-slate-600">
            <span className="font-bold">
              Showing {activeTab === 'Packages' ? packages.length : filteredTests.length} item(s)
            </span>
            <span className="text-slate-400 flex items-center gap-1">
              <ShieldCheck size={14} className="text-emerald-600" />
              Live LIS Verified Pricing
            </span>
          </div>

          {/* Tab Content Display */}
          <AnimatePresence mode="wait">
            {activeTab === 'Packages' ? (
              <motion.div
                key="packages"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {pkgLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                ) : packages.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 text-slate-400">
                    <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p className="font-medium text-slate-600">No health packages found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packages.map((pkg, idx) => (
                      <PackageCard key={pkg.id || pkg._id || idx} pkg={pkg} idx={idx} />
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key={activeTab + selectedType + searchQuery}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {loading ? (
                  <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white p-4">
                    <table className="min-w-full">
                      <tbody>
                        {[...Array(6)].map((_, i) => (
                          <SkeletonRow key={i} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : filteredTests.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 text-slate-400">
                    <Microscope className="w-10 h-10 mx-auto mb-3 opacity-40 text-slate-300" />
                    <p className="font-bold text-slate-700 text-base">No matching diagnostic tests found.</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Try adjusting your search keywords or switching to "All Types".
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto rounded-3xl border-2 border-slate-200/80 bg-white shadow-sm">
                      <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-[#f0f7fe]">
                          <tr>
                            <th className="px-5 py-3.5 text-left text-xs font-black text-[#07478f] uppercase tracking-wider">
                              Test Name & Code
                            </th>
                            <th className="px-5 py-3.5 text-left text-xs font-black text-[#07478f] uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-5 py-3.5 text-left text-xs font-black text-[#07478f] uppercase tracking-wider">
                              Department
                            </th>
                            <th className="px-5 py-3.5 text-left text-xs font-black text-[#07478f] uppercase tracking-wider">
                              Live Price
                            </th>
                            <th className="px-5 py-3.5 text-right text-xs font-black text-[#07478f] uppercase tracking-wider">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredTests.map((test, idx) => {
                            const tType = test.type || test.Type || 'Test';
                            return (
                              <tr key={test.id || test._id || idx} className="hover:bg-slate-50 transition-colors">
                                <td className="px-5 py-3.5">
                                  <div className="font-bold text-slate-900 text-sm">
                                    {test.name}
                                  </div>
                                  <span className="text-[11px] font-mono font-semibold text-slate-400">
                                    Code: {test.testCode || test.id}
                                  </span>
                                </td>
                                <td className="px-5 py-3.5">
                                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${typeBadge(tType)}`}>
                                    {tType}
                                  </span>
                                </td>
                                <td className="px-5 py-3.5 text-xs text-slate-600 font-semibold">
                                  {test.deptName || test.category || 'Pathology'}
                                </td>
                                <td className="px-5 py-3.5">
                                  <span className="text-[#07478f] font-black text-base">
                                    {test.price ? `₹${test.price}` : 'On Inquiry'}
                                  </span>
                                </td>
                                <td className="px-5 py-3.5 text-right">
                                  <Link
                                    to={`/book-collection?test=${encodeURIComponent(test.name)}`}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#d91d24] hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                                  >
                                    <span>Book Test</span>
                                    <ArrowRight size={12} />
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card List */}
                    <div className="md:hidden grid grid-cols-1 gap-3">
                      {filteredTests.map((test, idx) => {
                        const tType = test.type || test.Type || 'Test';
                        return (
                          <div
                            key={test.id || test._id || idx}
                            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-2.5"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border inline-block mb-1 ${typeBadge(tType)}`}>
                                  {tType}
                                </span>
                                <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                                  {test.name}
                                </h4>
                                <span className="text-[10px] font-mono text-slate-400">
                                  Code: {test.testCode || test.id}
                                </span>
                              </div>
                              <span className="text-base font-black text-[#07478f] shrink-0">
                                {test.price ? `₹${test.price}` : 'Inquire'}
                              </span>
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                              <span className="text-slate-500 font-medium">
                                {test.deptName || test.category || 'Pathology'}
                              </span>
                              <Link
                                to={`/book-collection?test=${encodeURIComponent(test.name)}`}
                                className="font-bold text-[#d91d24] hover:underline inline-flex items-center gap-1"
                              >
                                <span>Book Collection</span>
                                <ArrowRight size={11} />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </PageTransition>
  );
}
