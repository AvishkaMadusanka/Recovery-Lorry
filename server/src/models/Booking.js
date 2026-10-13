import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({ address: String, latitude: { type: Number, min: -90, max: 90, required: true }, longitude: { type: Number, min: -180, max: 180, required: true } }, { _id: false });
const statusHistorySchema = new mongoose.Schema({ status: String, changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, changedAt: { type: Date, default: Date.now }, note: String }, { _id: false });
const bookingSchema = new mongoose.Schema({
  bookingReference: { type: String, unique: true, index: true }, customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true, index: true }, recoveryVehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'RecoveryVehicle', required: true },
  pickupLocation: { type: locationSchema, required: true }, destinationLocation: locationSchema, customerVehicleDetails: { type: String, trim: true }, issueDescription: { type: String, required: true, trim: true }, customerPhone: String,
  estimatedDistanceKm: { type: Number, min: 0, required: true }, estimatedPrice: { type: Number, min: 0, required: true }, finalPrice: { type: Number, min: 0 }, status: { type: String, enum: ['pending', 'accepted', 'rejected', 'on_the_way', 'arrived', 'in_progress', 'completed', 'cancelled'], default: 'pending', index: true }, cancellationReason: String, statusHistory: [statusHistorySchema], acceptedAt: Date, completedAt: Date
}, { timestamps: true });
bookingSchema.pre('validate', function(next) { if (!this.bookingReference) this.bookingReference = `RN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`; next(); });
export default mongoose.model('Booking', bookingSchema);
