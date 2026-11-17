import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['super_admin', 'admin', 'student'], default: 'student', index: true },
  roleRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', default: null },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  preferredLanguage: { type: String, enum: ['ar', 'en'], default: 'ar' }
}, { timestamps: true });

userSchema.index({ role: 1, email: 1 });
userSchema.pre('findOneAndUpdate', function(next) {
  // Prevent demoting/deactivating the owner through generic model updates.
  if (this.getQuery().role === 'super_admin') {
    const update = this.getUpdate() || {};
    const values = update.$set || update;
    if (values.role && values.role !== 'super_admin') return next(new Error('Super Admin is protected'));
    if (values.status && values.status !== 'active') return next(new Error('Super Admin is protected'));
  }
  next();
});

export default mongoose.model('User', userSchema);
