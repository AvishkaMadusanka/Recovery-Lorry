import { Router } from 'express';
import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Provider from '../models/Provider.js';
import RecoveryVehicle from '../models/RecoveryVehicle.js';
import Notification from '../models/Notification.js';
import Payment from '../models/Payment.js';
import { dbState } from '../config/db.js';
import { mockStore } from '../utils/mockStore.js';
import { getSocketIO } from '../utils/socket.js';

const router = Router();
const transitions = {
  pending: ['accepted', 'rejected', 'cancelled'],
  accepted: ['on_the_way', 'cancelled'],
  on_the_way: ['arrived', 'cancelled'],
  arrived: ['in_progress', 'cancelled'],
  in_progress: ['completed'],
  completed: [],
  cancelled: [],
  rejected: []
};

// Emergency Booking creation - works for both logged-in and guest emergency travelers
router.post('/', async (req, res, next) => {
  try {
    const {
      providerId,
      recoveryVehicleId,
      pickupLocation,
      destinationLocation,
      customerName,
      customerPhone,
      customerVehicleDetails,
      issueType,
      issueDescription,
      estimatedDistanceKm
    } = req.body;

    if (!pickupLocation || !pickupLocation.latitude || !pickupLocation.longitude) {
      return res.status(400).json({ message: 'Valid pickup coordinates are required.' });
    }

    const dist = Number(estimatedDistanceKm || 5);
    const vehicleInMock = mockStore.vehicles.find(v => v._id === recoveryVehicleId);
    const baseFee = vehicleInMock ? vehicleInMock.baseFee : 4000;
    const pricePerKm = vehicleInMock ? vehicleInMock.pricePerKm : 180;
    const estimatedPrice = Math.round(baseFee + dist * pricePerKm);

    // Try MongoDB if connected
    if (dbState.mode === 'mongodb' && mongoose.connection.readyState === 1) {
      try {
        const vehicle = await RecoveryVehicle.findById(recoveryVehicleId);
        if (vehicle) {
          await RecoveryVehicle.findByIdAndUpdate(recoveryVehicleId, { availabilityStatus: 'busy' });
        }

        const booking = await Booking.create({
          customerId: req.user ? req.user._id : new mongoose.Types.ObjectId(),
          providerId: providerId && mongoose.Types.ObjectId.isValid(providerId) ? providerId : new mongoose.Types.ObjectId(),
          recoveryVehicleId: recoveryVehicleId && mongoose.Types.ObjectId.isValid(recoveryVehicleId) ? recoveryVehicleId : new mongoose.Types.ObjectId(),
          pickupLocation,
          destinationLocation,
          customerVehicleDetails: customerVehicleDetails || 'Vehicle details provided by phone',
          issueDescription: `${issueType ? `[${issueType}] ` : ''}${issueDescription || 'Emergency roadside recovery'}`,
          customerPhone: customerPhone || '+94770000000',
          estimatedDistanceKm: dist,
          estimatedPrice,
          statusHistory: [{ status: 'pending' }]
        });

        // Emit socket alert if IO initialized
        const io = getSocketIO();
        if (io) {
          io.emit('new-booking-alert', { bookingId: booking._id, reference: booking.bookingReference });
        }

        return res.status(201).json({ booking });
      } catch (mongoErr) {
        console.warn('[Bookings] MongoDB insert failed, falling back to mock store:', mongoErr.message);
      }
    }

    // In-memory fallback
    const booking = mockStore.createBooking({
      providerId,
      recoveryVehicleId,
      customerName: customerName || 'Emergency Driver',
      customerPhone: customerPhone || '+94770000000',
      pickupLocation,
      destinationLocation,
      customerVehicleDetails: customerVehicleDetails || 'Breakdown vehicle',
      issueType: issueType || 'Breakdown',
      issueDescription: issueDescription || 'Immediate roadside assistance needed',
      estimatedDistanceKm: dist,
      estimatedPrice,
      vehicle: vehicleInMock
    });

    const io = getSocketIO();
    if (io) {
      io.emit('new-booking-alert', { bookingId: booking._id, reference: booking.bookingReference });
    }

    return res.status(201).json({ booking });
  } catch (error) {
    next(error);
  }
});

// Get user bookings
router.get('/my-bookings', async (req, res, next) => {
  try {
    if (dbState.mode === 'mongodb' && mongoose.connection.readyState === 1 && req.user) {
      const bookings = await Booking.find({ customerId: req.user._id }).sort({ createdAt: -1 });
      return res.json({ bookings });
    }
    return res.json({ bookings: mockStore.getAllBookings() });
  } catch (error) {
    next(error);
  }
});

// Get provider requests
router.get('/provider-requests', async (req, res, next) => {
  try {
    if (dbState.mode === 'mongodb' && mongoose.connection.readyState === 1 && req.user) {
      const provider = await Provider.findOne({ userId: req.user._id });
      if (provider) {
        const bookings = await Booking.find({ providerId: provider._id }).sort({ createdAt: -1 });
        return res.json({ bookings });
      }
    }
    return res.json({ bookings: mockStore.getAllBookings() });
  } catch (error) {
    next(error);
  }
});

// Get specific booking details
router.get('/:id', async (req, res, next) => {
  try {
    if (dbState.mode === 'mongodb' && mongoose.connection.readyState === 1) {
      try {
        const booking = await Booking.findOne({
          $or: [
            { _id: mongoose.Types.ObjectId.isValid(req.params.id) ? req.params.id : null },
            { bookingReference: req.params.id }
          ]
        });
        if (booking) return res.json({ booking });
      } catch (err) {
        // pass through to mock
      }
    }

    const booking = mockStore.getBookingById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    return res.json({ booking });
  } catch (error) {
    next(error);
  }
});

// Update status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status, note } = req.body;
    if (dbState.mode === 'mongodb' && mongoose.connection.readyState === 1) {
      try {
        const booking = await Booking.findById(req.params.id);
        if (booking) {
          booking.status = status;
          booking.statusHistory.push({ status, changedAt: new Date(), note });
          if (status === 'accepted') booking.acceptedAt = new Date();
          if (status === 'completed') booking.completedAt = new Date();
          await booking.save();

          if (['rejected', 'cancelled', 'completed'].includes(status)) {
            await RecoveryVehicle.findByIdAndUpdate(booking.recoveryVehicleId, { availabilityStatus: 'available' });
          }

          const io = getSocketIO();
          if (io) {
            io.to(`booking:${booking._id}`).emit('booking-status-updated', { bookingId: booking._id, status });
          }
          return res.json({ booking });
        }
      } catch (err) {
        // pass through to mock
      }
    }

    const updated = mockStore.updateBookingStatus(req.params.id, status, note);
    if (!updated) return res.status(404).json({ message: 'Booking not found.' });

    const io = getSocketIO();
    if (io) {
      io.emit('booking-status-updated', { bookingId: updated._id, status });
    }
    return res.json({ booking: updated });
  } catch (error) {
    next(error);
  }
});

// Convenient progression endpoint for demo / quick simulation
router.post('/:id/advance-step', async (req, res, next) => {
  try {
    const booking = mockStore.getBookingById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    const flow = ['pending', 'accepted', 'on_the_way', 'arrived', 'in_progress', 'completed'];
    const currentIndex = flow.indexOf(booking.status);
    if (currentIndex >= 0 && currentIndex < flow.length - 1) {
      const nextStatus = flow[currentIndex + 1];
      const updated = mockStore.updateBookingStatus(booking._id, nextStatus, `Advanced automatically to ${nextStatus}`);
      return res.json({ booking: updated, nextStatus });
    }
    return res.json({ booking, message: 'Already completed or terminal status' });
  } catch (error) {
    next(error);
  }
});

export default router;
