import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  registrationCode: { type: String, required: true, unique: true, index: true },
  fullName: { type: String, required: true, trim: true, maxlength: 120 },
  phone: { type: String, required: true, trim: true },
  whatsapp: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  age: { type: Number, min: 10, max: 100 },
  university: { type: String, trim: true, maxlength: 160 },
  experience: { type: String, enum: ['none', 'beginner', 'intermediate', 'advanced'], default: 'none' },
  notes: { type: String, maxlength: 1000 },
  averageGradePercent: { type: Number, min: 0, max: 100, default: 0 },
  showInDirectory: { type: Boolean, default: false, index: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentGroup', default: null, index: true },
  photoUrl: { type: String, trim: true, default: '' },
  attendance: [{ date: { type: Date, required: true }, status: { type: String, enum: ['present', 'absent'], required: true } }],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true }
}, { timestamps: true });

registrationSchema.index({ course: 1, email: 1 }, { unique: true });

export default mongoose.model('Registration', registrationSchema);
