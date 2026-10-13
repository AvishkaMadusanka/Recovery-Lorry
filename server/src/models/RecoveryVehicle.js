import mongoose from 'mongoose';

const pointSchema = new mongoose.Schema({
  type: { type: String, enum: ['Point'], required: true, default: 'Point' },
  coordinates: {
    type: [Number], required: true, validate: { validator: (value) => value.length === 2 && value[0] >= -180 && value[0] <= 180 && value[1] >= -90 && value[1] <= 90, message: 'Coordinates must be [longitude, latitude].' }
  }
}, { _id: false });

const vehicleSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true, index: true },
  registrationNumber: { type: String, required: true, trim: true, uppercase: true },
  vehicleType: { type: String, required: true, trim: true },
  make: String, model: String, capacity: String, images: [String],
  baseFee: { type: Number, required: true, min: 0 }, pricePerKm: { type: Number, required: true, min: 0 },
  availabilityStatus: { type: String, enum: ['available', 'busy', 'offline'], default: 'offline', index: true },
  currentLocation: pointSchema, locationUpdatedAt: Date,
  serviceAreas: [String], isActive: { type: Boolean, default: true, index: true }
}, { timestamps: true });
vehicleSchema.index({ currentLocation: '2dsphere' });
vehicleSchema.index({ registrationNumber: 1, providerId: 1 }, { unique: true });
export default mongoose.model('RecoveryVehicle', vehicleSchema);
