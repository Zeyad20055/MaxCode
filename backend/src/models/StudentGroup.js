import mongoose from 'mongoose';

const studentGroupSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  startsAt: { type: Date },
  isActive: { type: Boolean, default: true },
  showStudentCount: { type: Boolean, default: true },
  showPhotos: { type: Boolean, default: true },
  showAttendance: { type: Boolean, default: true },
  showAbsence: { type: Boolean, default: true },
  showAverageGrade: { type: Boolean, default: true }
}, { timestamps: true });

studentGroupSchema.index({ name: 1, course: 1 }, { unique: true });
export default mongoose.model('StudentGroup', studentGroupSchema);
