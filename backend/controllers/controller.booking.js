import { Booking } from '../models/model.booking.js';
import { sendLifeCareBooking, isLifeCareConfigured } from '../utils/service.lifecareserver.js';

// ─── Create Booking (Consultation or Home Sample Collection) ─────────────────
export const createBooking = async (req, res) => {
  try {
    const {
      type = 'sample_collection',
      fullName,
      patientName: rawPatientName,
      phone,
      mobile,
      mobile2,
      email,
      age,
      gender,
      department,
      doctor,
      doctorName: rawDoctorName,
      date,
      preferredDate: rawPreferredDate,
      timeSlot,
      preferredTimeSlot: rawPreferredTimeSlot,
      address,
      city,
      testsRequested: rawTests,
      tests,
      totalPrice,
      totalAmount,
      notes,
      instructions,
      prescriptionUrl,
      prescriptionExtension,
    } = req.body;

    // Normalize field names
    const patientName = (rawPatientName || fullName || '').trim();
    const primaryPhone = String(phone || mobile || '').trim();
    const preferredDate = rawPreferredDate || date;
    const preferredTimeSlot = rawPreferredTimeSlot || timeSlot || 'Morning Slot (8:00 AM – 11:00 AM)';
    const doctorName = rawDoctorName || doctor || null;
    const bookingNotes = notes || instructions || '';
    const fullAddress = address ? (city ? `${address}, ${city}` : address) : '';

    const candidateTests = rawTests || tests || [];
    const testsRequested = Array.isArray(candidateTests)
      ? candidateTests.map((t) => (typeof t === 'string' ? t : t.name || t.id || 'Diagnostic Test'))
      : [];

    if (!patientName || !primaryPhone) {
      return res.status(400).json({
        success: false,
        message: 'Patient name and phone number are required.',
      });
    }

    // 1. Save booking in local MongoDB database
    let bookingId = `NLC-${Date.now().toString().slice(-6)}`;
    let lisBookingId = `LIS-${Date.now().toString(36).toUpperCase()}`;

    try {
      const booking = new Booking({
        type,
        patientName,
        phone: primaryPhone,
        email: email || undefined,
        age: age ? Number(age) : undefined,
        gender: gender || undefined,
        department: department || undefined,
        doctorName: doctorName || undefined,
        preferredDate: preferredDate ? new Date(preferredDate) : new Date(),
        preferredTimeSlot,
        address: fullAddress,
        testsRequested,
        notes: bookingNotes,
        lisReferenceId: lisBookingId,
      });

      const savedBooking = await booking.save();
      bookingId = savedBooking._id.toString();
    } catch (dbErr) {
      console.warn('[Booking DB] Failed to save in MongoDB, continuing with memory reference:', dbErr.message);
    }

    // 2. Forward request to New Life Care LIS server via SEND_BOOKING
    if (isLifeCareConfigured()) {
      try {
        const formattedTests = Array.isArray(candidateTests) && candidateTests.length > 0
          ? candidateTests.map((t) => ({
              testId: String(t.testId || t.id || t.testCode || ''),
              name: String(t.name || (typeof t === 'string' ? t : 'Diagnostic Test')),
              price: String(t.price || '0'),
            }))
          : '';

        const lisPayload = {
          patientName,
          mobile: primaryPhone,
          mobile2: String(mobile2 || '').trim(),
          email: String(email || '').trim(),
          address: fullAddress,
          notes: bookingNotes,
          tests: formattedTests,
          totalAmount: String(totalAmount || totalPrice || '0'),
          prescriptionUrl: String(prescriptionUrl || ''),
          prescriptionExtension: String(prescriptionExtension || ''),
        };

        console.log('[Booking LIS] Forwarding SEND_BOOKING to LIS server:', lisPayload.patientName, lisPayload.mobile);
        const lisResponse = await sendLifeCareBooking(lisPayload);

        if (lisResponse?.bookingId) {
          lisBookingId = lisResponse.bookingId;
          try {
            await Booking.findByIdAndUpdate(bookingId, { lisReferenceId: lisBookingId });
          } catch (_) {}
          console.log('[Booking LIS] ✅ Confirmed LIS booking ID:', lisBookingId);
        }
      } catch (lisErr) {
        console.warn('[LIS Gateway] Could not forward booking to LIS server:', lisErr.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: type === 'sample_collection'
        ? 'Home sample collection booked successfully. Our team will contact you shortly!'
        : 'Doctor consultation scheduled successfully.',
      bookingId,
      lisBookingId,
      data: {
        patientName,
        phone: primaryPhone,
        type,
        date: preferredDate,
        timeSlot: preferredTimeSlot,
      },
    });
  } catch (error) {
    console.error('[createBooking]', error);
    return res.status(500).json({ success: false, message: 'Failed to process booking' });
  }
};

// ─── Get Booking by ID ────────────────────────────────────────────────────────
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    return res.json({ success: true, data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
