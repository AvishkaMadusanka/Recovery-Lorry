import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  businessName: { type: String, required: true, trim: true },
  businessAddress: { type: String, required: true, trim: true },
  description: { type: String, trim: true, maxlength: 1000 },
  serviceAreas: [{ type: String, trim: true }],
  operatingHours: { type: String, trim: true },
  verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected', 'suspended'], default: 'pending', index: true },
  verificationDocuments: [{ type: String }],
  averageRating: { type: Number, min: 0, max: 5, default: 0 }
}, { timestamps: true });

export default mongoose.model('Provider', providerSchema);
