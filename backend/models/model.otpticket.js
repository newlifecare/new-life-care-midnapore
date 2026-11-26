import mongoose from 'mongoose';

/**
 * OtpTicket — Temporary Lockbox Document for LIS Report OTP verification.
 * 
 * Flow:
 * 1. Created when LIS responds with REPORT_READY (contains otpHash + reportUrl).
 * 2. Only ticketId is returned to the client. The reportUrl and otpHash stay protected on server.
 * 3. On successful OTP verification, the document is deleted and reportUrl released with &otp=<otp>.
 * 4. Automatically expires via MongoDB TTL after 10 minutes.
 */
const OTP_TTL_SECONDS = 10 * 60; // 10 minutes

const otpTicketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  reportUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'REPORT_READY',
  },
  message: {
    type: String,
    default: '',
  },
  regNo: {
    type: String,
    default: '',
  },
  mobile: {
    type: String,
    default: '',
  },
  collectionDate: {
    type: String,
    default: '',
  },
  attempts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: OTP_TTL_SECONDS,
  },
});

export const OtpTicket = mongoose.model('OtpTicket', otpTicketSchema);
export default OtpTicket;
