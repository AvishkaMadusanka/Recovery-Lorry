import mongoose from 'mongoose';
const schema = new mongoose.Schema({ recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }, title: String, message: String, isRead: { type: Boolean, default: false } }, { timestamps: true });
export default mongoose.model('Notification', schema);
