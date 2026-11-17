import { Router } from 'express';
import { z } from 'zod';
import SiteSettings from '../models/SiteSettings.js';
import { requireAuth } from '../middleware/auth.js';
import { superAdminOnly } from '../middleware/authorize.js';
import { writeAudit } from '../services/audit.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';

const router = Router();
const link = z.string().trim().max(500).refine(value => !value || /^https?:\/\//i.test(value), 'Enter a valid URL');

router.get('/public', asyncHandler(async (req, res) => {
  const settings = await SiteSettings.findOne({ key: 'global' }).lean();
  res.json({ success: true, data: settings?.contactLinks || { whatsapp: '', facebook: '', portfolio: '' } });
}));

router.patch('/contact', requireAuth, superAdminOnly, asyncHandler(async (req, res) => {
  const schema = z.object({ whatsapp: link, facebook: link, portfolio: link });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Please enter valid web links');
  const settings = await SiteSettings.findOneAndUpdate(
    { key: 'global' },
    { $set: { contactLinks: parsed.data }, $setOnInsert: { key: 'global' } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  await writeAudit(req, { action: 'UPDATE', section: 'website', targetId: settings._id.toString(), after: settings.contactLinks });
  res.json({ success: true, data: settings.contactLinks });
}));

export default router;
