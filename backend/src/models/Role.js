import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  permissions: {
    type: Map,
    of: [String],
    default: {}
  },
  isSystem: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Role', roleSchema);
