import { Router } from 'express';
import mongoose from 'mongoose';
import RecoveryVehicle from '../models/RecoveryVehicle.js';
import Provider from '../models/Provider.js';
import { env } from '../config/env.js';
import { dbState } from '../config/db.js';
import { mockStore } from '../utils/mockStore.js';
import { allowRoles, requireAuth } from '../middleware/auth.js';

const router = Router();

function coords(latitude, longitude) {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

async function searchNearbyVehicles(latitude, longitude, radiusKm) {
  // If MongoDB is connected and ready, use geospatial aggregation
  if (dbState.mode === 'mongodb' && mongoose.connection.readyState === 1) {
    try {
      const vehicles = await RecoveryVehicle.aggregate([
        {
          $geoNear: {
            near: { type: 'Point', coordinates: [longitude, latitude] },
            key: 'currentLocation',
            distanceField: 'distanceMeters',
            maxDistance: radiusKm * 1000,
            spherical: true,
            query: {
              isActive: true,
              availabilityStatus: 'available'
            }
          }
        },
        {
          $lookup: {
            from: 'providers',
            localField: 'providerId',
            foreignField: '_id',
            as: 'provider'
          }
        },
        { $unwind: { path: '$provider', preserveNullAndEmptyArrays: true } },
        { $limit: 50 },
        {
          $project: {
            registrationNumber: 1,
            vehicleType: 1,
            make: 1,
            model: 1,
            capacity: 1,
            images: 1,
            baseFee: 1,
            pricePerKm: 1,
            availabilityStatus: 1,
            currentLocation: 1,
            distanceKm: { $round: [{ $divide: ['$distanceMeters', 1000] }, 1] },
            provider: {
              _id: 1,
              businessName: 1,
              phone: 1,
              averageRating: 1,
              verificationStatus: 1
            }
          }
        }
      ]);

      if (vehicles && vehicles.length > 0) {
        return vehicles.map((v) => ({
          ...v,
          estimatedMinutes: Math.max(5, Math.round((v.distanceKm || 5) * 2.2))
        }));
      }
    } catch (geoErr) {
      console.warn('[Vehicles] Geo query warning, falling back to in-memory store:', geoErr.message);
    }
  }

  // Fallback in-memory store
  return mockStore.getNearbyVehicles(latitude, longitude, radiusKm);
}

// Protected nearby search (used by authenticated customers and admins)
router.get('/nearby', requireAuth, allowRoles('customer', 'admin'), async (req, res, next) => {
  try {
    const latitude = Number(req.query.latitude);
    const longitude = Number(req.query.longitude);
    const radiusKm = Number(req.query.radiusKm || 50);

    if (!coords(latitude, longitude) || ![5, 10, 25, 50, 100].includes(radiusKm)) {
      return res.status(400).json({
        message: 'Valid coordinates and a radius of 5, 10, 25, 50, or 100 km are required.'
      });
    }

    const vehicles = await searchNearbyVehicles(latitude, longitude, radiusKm);
    return res.json({ vehicles });
  } catch (error) {
    next(error);
  }
});

// Emergency public search (for stranded drivers in sudden breakdowns or accidents before logging in)
router.get('/emergency-search', async (req, res, next) => {
  try {
    const latitude = Number(req.query.latitude);
    const longitude = Number(req.query.longitude);
    const radiusKm = Number(req.query.radiusKm || 50);

    if (!coords(latitude, longitude)) {
      return res.status(400).json({
        message: 'Valid coordinates (latitude and longitude) are required.'
      });
    }

    const vehicles = await searchNearbyVehicles(latitude, longitude, radiusKm);
    return res.json({ vehicles });
  } catch (error) {
    next(error);
  }
});

// Get provider vehicles
router.get('/', requireAuth, allowRoles('provider'), async (req, res, next) => {
  try {
    if (dbState.mode === 'mongodb' && mongoose.connection.readyState === 1) {
      const provider = await Provider.findOne({ userId: req.user._id });
      if (!provider) return res.status(404).json({ message: 'Provider profile not found.' });
      return res.json({ vehicles: await RecoveryVehicle.find({ providerId: provider._id }).sort({ createdAt: -1 }) });
    }
    return res.json({ vehicles: mockStore.vehicles });
  } catch (error) {
    next(error);
  }
});

// Update vehicle availability
router.patch('/:id/availability', async (req, res, next) => {
  try {
    const { availabilityStatus } = req.body;
    if (dbState.mode === 'mongodb' && mongoose.connection.readyState === 1) {
      const vehicle = await RecoveryVehicle.findByIdAndUpdate(
        req.params.id,
        {
          availabilityStatus,
          ...(availabilityStatus === 'available' ? { locationUpdatedAt: new Date() } : {})
        },
        { new: true }
      );
      if (vehicle) return res.json({ vehicle });
    }

    const updated = mockStore.updateVehicleAvailability(req.params.id, availabilityStatus);
    if (!updated) return res.status(404).json({ message: 'Vehicle not found.' });
    return res.json({ vehicle: updated });
  } catch (error) {
    next(error);
  }
});

// Update vehicle GPS location
router.patch('/:id/location', async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;
    if (!coords(Number(latitude), Number(longitude))) {
      return res.status(400).json({ message: 'Valid latitude and longitude are required.' });
    }

    if (dbState.mode === 'mongodb' && mongoose.connection.readyState === 1) {
      const vehicle = await RecoveryVehicle.findByIdAndUpdate(
        req.params.id,
        {
          currentLocation: { type: 'Point', coordinates: [Number(longitude), Number(latitude)] },
          locationUpdatedAt: new Date()
        },
        { new: true }
      );
      if (vehicle) return res.json({ vehicle });
    }

    const updated = mockStore.updateVehicleLocation(req.params.id, latitude, longitude);
    if (!updated) return res.status(404).json({ message: 'Vehicle not found.' });
    return res.json({ vehicle: updated });
  } catch (error) {
    next(error);
  }
});

export default router;
