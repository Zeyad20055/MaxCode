import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  key: { type: String, default: 'global', unique: true },
  contactLinks: {
    whatsapp: { type: String, default: '' },
    facebook: { type: String, default: '' },
    portfolio: { type: String, default: '' }
  }
}, { timestamps: true });

export default mongoose.model('SiteSettings', siteSettingsSchema);
