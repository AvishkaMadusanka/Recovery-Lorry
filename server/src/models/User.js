import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  phone: { type: String, required: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['customer', 'provider', 'admin'], default: 'customer', index: true },
  accountStatus: { type: String, enum: ['active', 'suspended'], default: 'active', index: true }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
