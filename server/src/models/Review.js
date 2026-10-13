import mongoose from 'mongoose';
const schema = new mongoose.Schema({ bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true }, customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true }, rating: { type: Number, min: 1, max: 5, required: true }, comment: { type: String, trim: true, maxlength: 1000 } }, { timestamps: true });
export default mongoose.model('Review', schema);
