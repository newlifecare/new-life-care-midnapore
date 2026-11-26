import crypto from 'crypto';
import { OtpTicket } from '../models/model.otpticket.js';
import { verifyLifeCareReport } from '../utils/service.lifecareserver.js';

const MAX_OTP_ATTEMPTS = 3;

const STATUS_MESSAGES = {
  REPORT_READY: 'Your report is ready! An OTP has been sent to your registered mobile number.',
  REPORT_PENDING: 'Your report is being processed in our automated laboratory. Please check back later.',
  PAYMENT_PENDING: 'Payment information pending. Please contact New Life Care reception at 9733525031.',
  NOT_FOUND: 'No record found matching the details. Please double-check your Registration / Mobile number and collection date.',
  MULTIPLE_FOUND: 'Multiple patient records match these details. Please contact the laboratory reception at 9733525031.',
  REQUEST_EMPTY: 'Please provide either Registration Number or 10-digit Mobile number and Collection Date.',
  AUTH_FAIL: 'Authentication error connecting to LIS server. Please contact reception.',
  TECH_FAIL: 'The laboratory server encountered a temporary technical issue. Please try again shortly.',
};

/**
 * Step 1: Verify patient report details with LIS Main Server.
 * POST /api/reports/verify or GET /api/reports/lookup
 */
export const verifyReportLookup = async (req, res) => {
  try {
    const data = req.method === 'POST' ? req.body : req.query;
    const { regNo, mobile, phone, patientId, collectionDate: rawDate } = data;

    const resolvedRegNo = regNo || patientId;
    const resolvedMobile = mobile || phone;

    if (!resolvedRegNo && !resolvedMobile) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either your Bill / Registration Number or 10-digit Mobile Number.',
      });
    }

    if (!rawDate || !rawDate.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Collection Date is required (format: YYYY-MM-DD).',
      });
    }

    const collectionDate = rawDate.trim();
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(collectionDate)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Please select date in YYYY-MM-DD format (e.g. 2026-11-25).',
      });
    }

    // Call New Life Care LIS server
    const lisResponse = await verifyLifeCareReport({
      regNo: resolvedRegNo ? String(resolvedRegNo).trim() : undefined,
      mobile: resolvedMobile ? String(resolvedMobile).trim() : undefined,
      collectionDate,
    });

    const status = lisResponse?.status || 'NOT_FOUND';
    const fallbackMessage = STATUS_MESSAGES[status] || STATUS_MESSAGES.TECH_FAIL;
    const message = lisResponse?.message && lisResponse.message.trim() ? lisResponse.message : fallbackMessage;

    // ── REPORT_READY: Secure OTP Lockbox ─────────────────────────────────────
    if (status === 'REPORT_READY') {
      const otpHash = lisResponse?.otpHash ? String(lisResponse.otpHash).trim() : null;
      const reportUrl = lisResponse?.reportUrl ? String(lisResponse.reportUrl).trim() : null;

      if (!otpHash || !reportUrl) {
        console.error('[verifyReport] LIS returned REPORT_READY but otpHash or reportUrl missing.');
        return res.status(502).json({
          success: false,
          message: 'The laboratory server confirmed your report is ready, but secure download data was missing. Please contact reception at 9733525031.',
        });
      }

      // Generate a one-time random ticket ID
      const ticketId = crypto.randomBytes(24).toString('hex');

      await OtpTicket.create({
        ticketId,
        otp: otpHash,
        reportUrl,
        status: 'REPORT_READY',
        message,
        regNo: resolvedRegNo || '',
        mobile: resolvedMobile || '',
        collectionDate,
      });

      console.log(`[OTP Lockbox] Ticket created for ${resolvedRegNo || resolvedMobile} -> ticketId: ${ticketId}`);

      // Return ONLY ticketId. reportUrl and otpHash NEVER leave the server.
      return res.json({
        success: true,
        status: 'REPORT_READY',
        requiresOtp: true,
        ticketId,
        message,
        qrSRC: lisResponse?.qrSRC || '',
      });
    }

    // ── Other statuses: pass through user-friendly status message ────────────
    return res.json({
      success: false,
      status,
      message,
      qrSRC: lisResponse?.qrSRC || '',
      requiresOtp: false,
    });
  } catch (error) {
    console.error('[verifyReportLookup] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Could not connect to the diagnostic server. Please try again or call reception at 9733525031.',
    });
  }
};

/**
 * Step 2: Verify Patient OTP & Release Report URL.
 * POST /api/reports/verify-otp
 * Body: { ticketId, otp }
 */
export const verifyReportOtp = async (req, res) => {
  try {
    const { ticketId, otp } = req.body;

    if (!ticketId || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Ticket ID and OTP are required.',
      });
    }

    const ticket = await OtpTicket.findOne({ ticketId });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'This OTP verification session has expired. Please lookup your report again.',
        code: 'TICKET_EXPIRED',
      });
    }

    if (ticket.attempts >= MAX_OTP_ATTEMPTS) {
      await OtpTicket.deleteOne({ ticketId });
      return res.status(403).json({
        success: false,
        message: 'Too many incorrect OTP attempts. Session locked for security. Please lookup your report again.',
        code: 'TICKET_LOCKED',
      });
    }

    // Hash entered OTP with SHA-256
    const enteredOtp = String(otp).trim();
    const enteredHash = crypto.createHash('sha256').update(enteredOtp).digest('hex');

    if (enteredHash.toLowerCase() !== String(ticket.otp).trim().toLowerCase()) {
      ticket.attempts += 1;
      await ticket.save();

      const remaining = MAX_OTP_ATTEMPTS - ticket.attempts;
      return res.status(400).json({
        success: false,
        message: remaining > 0
          ? `Incorrect OTP. You have ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
          : 'Incorrect OTP. You have exceeded maximum attempts.',
        attemptsRemaining: remaining,
        code: 'OTP_MISMATCH',
      });
    }

    // OTP Verified! Release Report URL with &otp=<otp>
    let finalDownloadUrl = ticket.reportUrl;
    if (finalDownloadUrl.includes('?')) {
      finalDownloadUrl += `&otp=${encodeURIComponent(enteredOtp)}`;
    } else {
      finalDownloadUrl += `?otp=${encodeURIComponent(enteredOtp)}`;
    }

    // Delete ticket immediately (one-time use)
    await OtpTicket.deleteOne({ ticketId });

    console.log(`[OTP Lockbox] ✅ OTP verified for ${ticket.mobile || ticket.regNo}. Released download URL.`);

    return res.json({
      success: true,
      message: 'OTP verified successfully. Your verified diagnostic report is ready for download.',
      data: {
        reportUrl: finalDownloadUrl,
      },
    });
  } catch (error) {
    console.error('[verifyReportOtp] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'OTP verification failed. Please try again.',
    });
  }
};

/**
 * Legacy GET /api/reports route proxy
 */
export const getPatientReports = async (req, res) => {
  return verifyReportLookup(req, res);
};

export const downloadReport = async (req, res) => {
  res.status(403).json({
    success: false,
    message: 'Direct report downloads are secured via LIS OTP verification. Please lookup your report on the Reports page.',
  });
};
