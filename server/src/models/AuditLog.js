import mongoose from 'mongoose';
const schema = new mongoose.Schema({ actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, action: String, entityType: String, entityId: mongoose.Schema.Types.ObjectId, metadata: mongoose.Schema.Types.Mixed }, { timestamps: true });
export default mongoose.model('AuditLog', schema);
