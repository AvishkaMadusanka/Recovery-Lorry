import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/db.js';
import User from '../models/User.js';
import Provider from '../models/Provider.js';
import RecoveryVehicle from '../models/RecoveryVehicle.js';

await connectDatabase();
const passwordHash = await bcrypt.hash('RescueNowDemo123!', 12);
const [customer] = await User.findOneAndUpdate({ email: 'demo.customer@rescuenow.test' }, { fullName: 'Demo Customer', email: 'demo.customer@rescuenow.test', phone: '+94770000001', passwordHash, role: 'customer' }, { upsert: true, new: true, setDefaultsOnInsert: true });
const providerUser = await User.findOneAndUpdate({ email: 'demo.provider@rescuenow.test' }, { fullName: 'Demo Recovery Team', email: 'demo.provider@rescuenow.test', phone: '+94770000002', passwordHash, role: 'provider' }, { upsert: true, new: true, setDefaultsOnInsert: true });
const provider = await Provider.findOneAndUpdate({ userId: providerUser._id }, { userId: providerUser._id, businessName: 'Demo Recovery Team', businessAddress: 'Kandy, Sri Lanka', description: 'Development-only sample provider.', serviceAreas: ['Kandy', 'Peradeniya'], verificationStatus: 'approved' }, { upsert: true, new: true, setDefaultsOnInsert: true });
await RecoveryVehicle.findOneAndUpdate({ providerId: provider._id, registrationNumber: 'DEMO-001' }, { providerId: provider._id, registrationNumber: 'DEMO-001', vehicleType: 'Flatbed recovery lorry', make: 'Development', model: 'Sample 01', capacity: 'Light vehicles', baseFee: 3500, pricePerKm: 180, availabilityStatus: 'available', currentLocation: { type: 'Point', coordinates: [80.6337, 7.2906] }, locationUpdatedAt: new Date(), serviceAreas: ['Kandy'], isActive: true }, { upsert: true, new: true, setDefaultsOnInsert: true });
console.log(`Seeded development records for ${customer.email} and ${providerUser.email}. Password: RescueNowDemo123!`);
await disconnectDatabase();
