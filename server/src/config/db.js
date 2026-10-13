import mongoose from 'mongoose';
import { env } from './env.js';
import User from '../models/User.js';
import Provider from '../models/Provider.js';
import RecoveryVehicle from '../models/RecoveryVehicle.js';
import { initialProviders, initialVehicles } from '../utils/mockStore.js';
import bcrypt from 'bcryptjs';

export const dbState = {
  connected: false,
  mode: 'disconnected', // 'mongodb' | 'fallback'
  uri: env.mongoUri,
  error: null,
  databaseName: 'rescuenow'
};

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    dbState.connected = true;
    dbState.mode = 'mongodb';
    return mongoose.connection;
  }

  try {
    console.log(`[Database] Attempting connection to MongoDB at: ${env.mongoUri}`);
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000
    });
    dbState.connected = true;
    dbState.mode = 'mongodb';
    dbState.error = null;
    console.log('[Database] Connected successfully to MongoDB!');

    // Auto-seed if vehicles are empty
    try {
      const vehicleCount = await RecoveryVehicle.countDocuments();
      if (vehicleCount === 0) {
        console.log('[Database] Empty database detected. Auto-seeding initial Sri Lankan recovery lorries...');
        await seedDatabase();
      }
    } catch (seedErr) {
      console.warn('[Database] Seed check warning:', seedErr.message);
    }

    return mongoose.connection;
  } catch (err) {
    dbState.connected = false;
    dbState.mode = 'fallback';
    dbState.error = err.message;
    console.warn(`[Database] Notice: MongoDB connection failed (${err.message}).`);
    console.log('[Database] RescueNow will run seamlessly in In-Memory Development Store mode.');
    console.log('[Database] To connect MongoDB Atlas or local MongoDB, set MONGODB_URI in server/.env');
    return null;
  }
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    dbState.connected = false;
  }
}

async function seedDatabase() {
  const passwordHash = await bcrypt.hash('RescueNow123!', 10);

  // Seed Customer
  const customer = await User.findOneAndUpdate(
    { email: 'customer@rescuenow.lk' },
    {
      fullName: 'Kamal Gunawardena',
      email: 'customer@rescuenow.lk',
      phone: '+94778899001',
      passwordHash,
      role: 'customer',
      accountStatus: 'active'
    },
    { upsert: true, new: true }
  );

  // Seed Providers and their lorries
  for (let i = 0; i < initialProviders.length; i++) {
    const p = initialProviders[i];
    const provUser = await User.findOneAndUpdate(
      { email: `provider${i + 1}@rescuenow.lk` },
      {
        fullName: p.businessName,
        email: `provider${i + 1}@rescuenow.lk`,
        phone: p.phone,
        passwordHash,
        role: 'provider',
        accountStatus: 'active'
      },
      { upsert: true, new: true }
    );

    const providerDoc = await Provider.findOneAndUpdate(
      { userId: provUser._id },
      {
        userId: provUser._id,
        businessName: p.businessName,
        businessAddress: p.businessAddress,
        description: p.description,
        serviceAreas: p.serviceAreas,
        operatingHours: p.operatingHours,
        verificationStatus: p.verificationStatus,
        averageRating: p.averageRating
      },
      { upsert: true, new: true }
    );

    const vehicleData = initialVehicles[i] || initialVehicles[0];
    await RecoveryVehicle.findOneAndUpdate(
      { registrationNumber: vehicleData.registrationNumber },
      {
        providerId: providerDoc._id,
        registrationNumber: vehicleData.registrationNumber,
        vehicleType: vehicleData.vehicleType,
        make: vehicleData.make,
        model: vehicleData.model,
        capacity: vehicleData.capacity,
        images: vehicleData.images,
        baseFee: vehicleData.baseFee,
        pricePerKm: vehicleData.pricePerKm,
        availabilityStatus: vehicleData.availabilityStatus,
        currentLocation: vehicleData.currentLocation,
        locationUpdatedAt: new Date(),
        serviceAreas: vehicleData.serviceAreas,
        isActive: true
      },
      { upsert: true, new: true }
    );
  }
  console.log('[Database] Auto-seeding completed successfully.');
}
