import { Router } from 'express';
import {
  verifyReportLookup,
  verifyReportOtp,
  getPatientReports,
  downloadReport,
} from '../controllers/controller.reports.js';

export const routeReports = Router();

// Primary LIS OTP Verification Endpoints
routeReports.post('/verify', verifyReportLookup);
routeReports.post('/verify-otp', verifyReportOtp);
routeReports.get('/lookup', verifyReportLookup);

// Backward-compatible endpoints
routeReports.get('/', getPatientReports);
routeReports.get('/download/:reportId', downloadReport);
