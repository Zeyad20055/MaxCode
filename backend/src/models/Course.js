import mongoose from 'mongoose';
import { isWhatsAppGroupInvite } from '../utils/whatsapp.js';

const localized = {
  ar: { type: String, required: true, trim: true },
  en: { type: String, required: true, trim: true }
};

const courseSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: localized,
  shortDescription: localized,
  description: localized,
  objectives: { ar: [String], en: [String], default: { ar: [], en: [] } },
  curriculum: { ar: [String], en: [String], default: { ar: [], en: [] } },
  requirements: { ar: [String], en: [String], default: { ar: [], en: [] } },
  instructorName: { type: String, default: 'MAX CODE' },
  level: { ar: String, en: String },
  duration: { ar: String, en: String },
  price: { type: Number, min: 0, default: 0 },
  imageUrl: { type: String, default: '' },
  capacity: { type: Number, min: 1, default: 30 },
  whatsappGroupLink: {
    type: String,
    default: '',
    trim: true,
    select: false,
    validate: { validator: value => !value || isWhatsAppGroupInvite(value), message: 'Enter a WhatsApp group invitation URL from chat.whatsapp.com' }
  },
  isActive: { type: Boolean, default: true, index: true },
  registrationOpen: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
