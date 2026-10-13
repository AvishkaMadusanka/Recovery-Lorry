import mongoose from 'mongoose';
const schema = new mongoose.Schema({ customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }, subject: { type: String, required: true, trim: true }, description: { type: String, required: true, trim: true }, status: { type: String, enum: ['open', 'in_review', 'resolved'], default: 'open' }, adminNotes: String }, { timestamps: true });
export default mongoose.model('Complaint', schema);
