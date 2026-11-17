import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  actorName: { type: String, default: 'System' },
  actorRole: { type: String, default: 'system' },
  action: { type: String, required: true },
  section: { type: String, required: true },
  targetId: { type: String, default: '' },
  before: { type: mongoose.Schema.Types.Mixed, default: null },
  after: { type: mongoose.Schema.Types.Mixed, default: null },
  ip: { type: String, default: '' }
}, { timestamps: true });

auditLogSchema.pre(/^findOneAnd/, function() {
  throw new Error('Audit logs are append-only');
});
auditLogSchema.pre('deleteMany', function() {
  throw new Error('Audit logs are append-only');
});
auditLogSchema.pre('deleteOne', function() {
  throw new Error('Audit logs are append-only');
});

export default mongoose.model('AuditLog', auditLogSchema);
