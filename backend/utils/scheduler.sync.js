import cron from 'node-cron';
import { TestItem } from '../models/model.test.js';
import { fetchLifeCarePrices, isLifeCareConfigured } from './service.lifecareserver.js';

let syncState = {
  lastSyncTime: null,
  status: 'idle',
  totalItems: 0,
  lastMessage: 'Sync job initialized. Running every 24 hours.',
};

export const getSyncStatus = () => ({
  ...syncState,
  isLisConfigured: isLifeCareConfigured(),
});

/**
 * Clean department string from LIS (e.g. "DEPT HAEMATOLOGY TESTS" -> "Haematology")
 */
function normalizeCategory(deptName, type) {
  if (type === 'Package') return 'Packages';
  if (!deptName || !deptName.trim()) return type === 'Profile' ? 'Pathology' : 'General';
  const clean = deptName.replace(/^DEPT\s+/i, '').replace(/\s+TESTS?$/i, '').trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
}

/**
 * Execute sync of Test List & Packages from New Life Care LIS Server into local MongoDB.
 */
export const syncTestsFromLIS = async () => {
  syncState.status = 'syncing';
  console.log('[LIS Sync Scheduler] Fetching live test catalog from New Life Care LIS Server...');

  try {
    const res = await fetchLifeCarePrices();
    const rawList = res?.tests || res?.data || [];

    if (Array.isArray(rawList) && rawList.length > 0) {
      let count = 0;
      for (const item of rawList) {
        const testCode = String(item.TEST_ID || item.id || item.testCode || '').trim();
        const testName = String(item.TEST_NAME || item.name || '').trim();

        // Skip blank or placeholder items
        if (!testCode || !testName || testName === '-') continue;

        const price = Number(item.TEST_PRICE || item.price || 0);
        const type = String(item.Type || 'Test').trim();
        const deptName = String(item.Dept_Name || '').trim();
        const status = String(item.TEST_STATUS || 'Active').trim();
        const isPackage = type === 'Package';
        const category = normalizeCategory(deptName, type);

        await TestItem.findOneAndUpdate(
          { testCode },
          {
            $set: {
              name: testName,
              price,
              category,
              testType: type,
              deptName,
              status,
              isPackage,
              source: 'lis',
              lastSyncedAt: new Date(),
            },
          },
          { upsert: true, new: true }
        );
        count++;
      }

      syncState.lastSyncTime = new Date();
      syncState.status = 'success';
      syncState.totalItems = count;
      syncState.lastMessage = `Successfully synced ${count} live test(s) & packages from New Life Care LIS.`;
      console.log(`[LIS Sync Scheduler] ✅ Synced ${count} live tests from LIS.`);
      return { success: true, count, message: syncState.lastMessage };
    } else {
      console.warn('[LIS Sync Scheduler] ⚠️ No test list returned from LIS or format unexpected:', res);
      const dbCount = await TestItem.countDocuments().catch(() => 0);
      return { success: true, count: dbCount, message: 'Using existing test cache.' };
    }
  } catch (error) {
    syncState.status = 'error';
    syncState.lastMessage = `Sync failed: ${error.message}`;
    console.error('[LIS Sync Scheduler] ❌ Sync error:', error.message);
    return { success: false, message: error.message };
  }
};

/**
 * Initialize 24-hour recurring cron schedule (Runs every midnight at 00:00).
 */
export const startSyncScheduler = () => {
  // '0 0 * * *' = every day at midnight (every 24 hours)
  cron.schedule('0 0 * * *', async () => {
    console.log('[LIS Sync Scheduler] Triggering automatic 24-hour test list refresh...');
    await syncTestsFromLIS();
  });

  // Run initial sync check 4 seconds after server boots up
  setTimeout(async () => {
    await syncTestsFromLIS();
  }, 4000);

  console.log('⏰ 24-Hour Test Sync Scheduler registered (Runs every 24h)');
};
