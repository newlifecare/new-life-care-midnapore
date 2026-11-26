/**
 * New Life Care Midnapore — LIS Main Server Gateway Service
 * 
 * Endpoints:
 * - GET_TEST_PRICE / API_GET_PRICING   → Live test catalog, types & pricing
 * - VERIFY_REPORT_DETAILS              → Verify report status via (regNo + date) or (mobile + date)
 * - SEND_BOOKING                       → Forward home sample collection bookings to LIS desk
 */

const API_TYPES = {
  GET_TEST_PRICE: 'GET_TEST_PRICE',
  API_GET_PRICING: 'API_GET_PRICING',
  VERIFY_REPORT_DETAILS: 'VERIFY_REPORT_DETAILS',
  API_VERIFY_REPORT: 'API_VERIFY_REPORT',
  SEND_BOOKING: 'SEND_BOOKING',
};

const TIMEOUT_MS = 15000;

export const isLifeCareConfigured = () => {
  const { endpoint, secret } = getLifeCareConfig();
  return Boolean(endpoint && secret);
};

export const getLifeCareConfig = () => {
  const endpoint = process.env.LIFECARE_SERVER_URL || process.env.LIS_BASE_URL || 'https://lis.newlifecaremidnapore.com/lifecare/web/api';
  const secret = process.env.LIFECARE_SERVER_SECRET_KEY || process.env.LIS_API_KEY || 'ki8is9ois3$1gs%73h$lo0@!lo';
  return { endpoint, secret };
};

/**
 * Core authenticated caller for New Life Care LIS server
 */
export async function callLifeCareServer(apiType, params = {}) {
  const { endpoint, secret } = getLifeCareConfig();

  const urlObj = new URL(endpoint);
  urlObj.searchParams.append('api_type', apiType);
  const targetUrl = urlObj.toString();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    let requestBody;
    let contentType = 'application/json';

    // VERIFY_REPORT_DETAILS requires x-www-form-urlencoded
    if (apiType === API_TYPES.VERIFY_REPORT_DETAILS || apiType === API_TYPES.API_VERIFY_REPORT) {
      contentType = 'application/x-www-form-urlencoded';
      const formParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          formParams.append(key, String(value).trim());
        }
      }
      requestBody = formParams.toString();
    } else {
      requestBody = JSON.stringify(params);
    }

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        'x-webhook-secret': secret,
      },
      body: requestBody,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { rawResponse: text };
    }

    if (!response.ok) {
      const error = new Error(`LIS server error: HTTP ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      const err = new Error('LIS server request timed out.');
      err.status = 504;
      throw err;
    }
    throw error;
  }
}

// ─── 1. Fetch Test Catalog & Live Pricing ────────────────────────────────────
export async function fetchLifeCarePrices() {
  try {
    const res = await callLifeCareServer(API_TYPES.GET_TEST_PRICE, {});
    if (res && res.status !== 'AUTH_FAIL' && (res.tests || res.data)) {
      return res;
    }
    // Fallback to API_GET_PRICING if needed
    return await callLifeCareServer(API_TYPES.API_GET_PRICING, {});
  } catch (err) {
    console.warn('[LifeCare LIS] fetchPrices error, trying alternate key:', err.message);
    return await callLifeCareServer(API_TYPES.GET_TEST_PRICE, {});
  }
}

// ─── 2. Verify Patient Diagnostic Report ─────────────────────────────────────
export async function verifyLifeCareReport({ regNo, mobile, collectionDate }) {
  const params = { collectionDate: collectionDate ? String(collectionDate).trim() : '' };
  if (regNo && String(regNo).trim()) {
    params.regNo = String(regNo).trim();
  }
  if (mobile && String(mobile).trim()) {
    params.mobile = String(mobile).trim();
  }
  return callLifeCareServer(API_TYPES.VERIFY_REPORT_DETAILS, params);
}

// ─── 3. Send Home Sample Collection Booking ──────────────────────────────────
export async function sendLifeCareBooking(bookingPayload) {
  return callLifeCareServer(API_TYPES.SEND_BOOKING, bookingPayload);
}

export { API_TYPES };
export default {
  callLifeCareServer,
  fetchLifeCarePrices,
  verifyLifeCareReport,
  sendLifeCareBooking,
  isLifeCareConfigured,
  API_TYPES,
};
