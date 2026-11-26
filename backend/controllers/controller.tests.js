import { TestItem } from '../models/model.test.js';
import { syncTestsFromLIS, getSyncStatus } from '../utils/scheduler.sync.js';
import { fetchLifeCarePrices, isLifeCareConfigured } from '../utils/service.lifecareserver.js';

// Fallback dummy tests if LIS server is ever unreachable on initial boot
const DUMMY_TESTS = [
  { testCode: 'CBC', id: 'CBC', name: 'Complete Blood Count (CBC)', category: 'Haematology', price: 250, turnaround: '4-6 hours', sampleType: 'Blood', testType: 'Test' },
  { testCode: 'LFT', id: 'LFT', name: 'Liver Function Test (LFT)', category: 'Biochemistry', price: 450, turnaround: '6-8 hours', sampleType: 'Blood', testType: 'Profile' },
  { testCode: 'KFT', id: 'KFT', name: 'Kidney Function Test (KFT)', category: 'Biochemistry', price: 500, turnaround: '6-8 hours', sampleType: 'Blood', testType: 'Profile' },
  { testCode: 'LIPID', id: 'LIPID', name: 'Lipid Profile', category: 'Biochemistry', price: 350, turnaround: '6-8 hours', sampleType: 'Blood', testType: 'Profile' },
  { testCode: 'THYROID', id: 'THYROID', name: 'Thyroid Function (T3, T4, TSH)', category: 'Biochemistry', price: 600, turnaround: '8-12 hours', sampleType: 'Blood', testType: 'Profile' },
  { testCode: 'SUGAR_F', id: 'SUGAR_F', name: 'Blood Sugar (Fasting)', category: 'Biochemistry', price: 80, turnaround: '1-2 hours', sampleType: 'Blood', testType: 'Test' },
  { testCode: 'HBA1C', id: 'HBA1C', name: 'HbA1c (Glycated Haemoglobin)', category: 'Biochemistry', price: 400, turnaround: '4-6 hours', sampleType: 'Blood', testType: 'Test' },
  { testCode: 'URINE_R', id: 'URINE_R', name: 'Urine Routine & Microscopy', category: 'Haematology', price: 120, turnaround: '2-4 hours', sampleType: 'Urine', testType: 'Template' },
  { testCode: 'ECG_12', id: 'ECG_12', name: 'Computerized ECG (12 Lead)', category: 'Cardiology', price: 150, turnaround: 'Immediate', sampleType: 'Non-invasive', testType: 'Test' },
  { testCode: 'HOLTER', id: 'HOLTER', name: '24-Hour Holter Monitoring', category: 'Cardiology', price: 2500, turnaround: '24 hours', sampleType: 'Wearable', testType: 'Test' },
  { testCode: 'XRAY_CHEST', id: 'XRAY_CHEST', name: 'Digital X-Ray Chest', category: 'Radiology', price: 300, turnaround: 'Immediate', sampleType: 'Digital X-Ray', testType: 'Test' },
  { testCode: 'EEG', id: 'EEG', name: 'Electroencephalogram (EEG)', category: 'Neurology', price: 1500, turnaround: 'Same day', sampleType: 'Digital Recording', testType: 'Test' },
  { testCode: 'NCV', id: 'NCV', name: 'Nerve Conduction Velocity (NCV)', category: 'Neurology', price: 2000, turnaround: 'Same day', sampleType: 'Electrophysiology', testType: 'Test' },
];

const DUMMY_PACKAGES = [
  {
    id: 'PKG_HEALTH_47',
    testCode: 'PKG_HEALTH_47',
    name: 'Health Checkup (47 Tests)',
    category: 'Packages',
    price: 1350,
    originalPrice: 2200,
    tests: ['CBC (Complete Blood Count)', 'Liver Function (LFT)', 'Kidney Function (KFT)', 'Lipid Profile', 'Fasting Blood Sugar', 'Urine Routine & Microscopy', 'ESR', 'Serum Electrolytes'],
    description: 'Comprehensive health screening covering 47 key diagnostic parameters for routine wellness.',
    popular: true,
    isPackage: true,
    testType: 'Package',
  },
  {
    id: 'PKG_HEALTH_ADV_12',
    testCode: 'PKG_HEALTH_ADV_12',
    name: 'Advanced Health Checkup (12 Tests)',
    category: 'Packages',
    price: 1999,
    originalPrice: 3200,
    tests: ['CBC', 'Liver Function', 'Kidney Function', 'Lipid Profile', 'Thyroid Profile (TSH)', 'HbA1c', 'ECG', 'Digital Chest X-Ray', 'Urine Routine', 'Serum Calcium', 'Blood Sugar'],
    description: 'Detailed clinical evaluation for chronic disease prevention and vital organ assessments.',
    popular: false,
    isPackage: true,
    testType: 'Package',
  },
];

/**
 * Seed initial test catalogue into MongoDB if empty
 */
export const seedDefaultTests = async () => {
  try {
    const count = await TestItem.countDocuments().catch(() => 0);
    if (count === 0) {
      console.log('🧪 Seeding initial test cache and triggering live LIS sync...');
      await syncTestsFromLIS().catch((err) => console.warn('LIS initial sync warning:', err.message));
    }
  } catch (error) {
    console.warn('⚠️ seedDefaultTests warning:', error.message);
  }
};

/**
 * GET /api/tests
 * Query parameters:
 *  - search: string (matches test name, code, or department)
 *  - type: 'Test' | 'Profile' | 'Package' | 'Template' | 'All'
 *  - category: 'Pathology', 'Haematology', 'Biochemistry', etc.
 */
export const getTestCatalog = async (req, res) => {
  try {
    const { category, type, search } = req.query;

    const filter = {};

    // Filter by type: 'Test', 'Profile', 'Package', 'Template'
    if (type && type.toLowerCase() !== 'all') {
      filter.testType = new RegExp(`^${type}$`, 'i');
    }

    // Filter by category
    if (category && category.toLowerCase() !== 'all') {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    // Search by keyword
    if (search && search.trim()) {
      filter.$or = [
        { name: new RegExp(search.trim(), 'i') },
        { testCode: new RegExp(search.trim(), 'i') },
        { deptName: new RegExp(search.trim(), 'i') },
      ];
    }

    let dbTests = await TestItem.find(filter).sort({ name: 1 }).lean();

    // If database has 0 items (initial setup), attempt live sync immediately
    if (dbTests.length === 0 && (!search || search.length < 2)) {
      try {
        await syncTestsFromLIS();
        dbTests = await TestItem.find(filter).sort({ name: 1 }).lean();
      } catch (_) {}
    }

    if (dbTests.length > 0) {
      const formatted = dbTests.map((t) => ({
        _id: t._id,
        id: t.testCode || t._id,
        testCode: t.testCode,
        name: t.name,
        price: t.price,
        originalPrice: t.originalPrice,
        category: t.category,
        type: t.testType || (t.isPackage ? 'Package' : 'Test'),
        Type: t.testType || (t.isPackage ? 'Package' : 'Test'),
        deptName: t.deptName || '',
        status: t.status || 'Active',
        turnaround: t.turnaround || 'Same Day',
        sampleType: t.sampleType || 'Blood',
        description: t.description || '',
        includes: t.includes || [],
        isPackage: Boolean(t.isPackage),
      }));

      return res.json({
        success: true,
        count: formatted.length,
        data: formatted,
        source: 'database',
      });
    }

    // Fallback if DB completely empty
    return res.json({
      success: true,
      count: DUMMY_TESTS.length,
      data: DUMMY_TESTS,
      source: 'mock',
    });
  } catch (error) {
    console.error('[getTestCatalog] Error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching test catalog' });
  }
};

/**
 * GET /api/tests/packages
 * Returns Profiles and Packages
 */
export const getHealthPackages = async (req, res) => {
  try {
    const filter = {
      $or: [{ isPackage: true }, { testType: 'Package' }, { testType: 'Profile' }],
    };

    let pkgs = await TestItem.find(filter).sort({ price: -1 }).lean();

    if (pkgs.length > 0) {
      return res.json({
        success: true,
        count: pkgs.length,
        data: pkgs.map((p) => ({
          _id: p._id,
          id: p.testCode || p._id,
          testCode: p.testCode,
          name: p.name,
          price: p.price,
          originalPrice: p.originalPrice || Math.round(p.price * 1.3),
          description: p.description || '',
          tests: p.includes && p.includes.length > 0 ? p.includes : [p.name],
          type: p.testType || 'Package',
          Type: p.testType || 'Package',
        })),
        source: 'database',
      });
    }

    return res.json({ success: true, count: DUMMY_PACKAGES.length, data: DUMMY_PACKAGES, source: 'mock' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching packages' });
  }
};

/**
 * POST /api/tests/sync (Admin only or system trigger)
 */
export const triggerManualSync = async (req, res) => {
  try {
    const result = await syncTestsFromLIS();
    return res.json({
      success: true,
      message: result.message,
      data: result,
      status: getSyncStatus(),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSyncInfo = (req, res) => {
  return res.json({ success: true, data: getSyncStatus() });
};

export const createTestItem = async (req, res) => {
  try {
    const { name, category, price, testType, deptName } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name and price are required' });
    }
    const testCode = req.body.testCode || `T_${Date.now().toString(36).toUpperCase()}`;
    const item = new TestItem({
      ...req.body,
      testCode,
      price: Number(price),
      testType: testType || 'Test',
      deptName: deptName || '',
      source: 'manual',
    });
    await item.save();
    return res.status(201).json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTestItem = async (req, res) => {
  try {
    const item = await TestItem.findByIdAndUpdate(req.params.id, { ...req.body, lastSyncedAt: new Date() }, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    return res.json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTestItem = async (req, res) => {
  try {
    await TestItem.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
