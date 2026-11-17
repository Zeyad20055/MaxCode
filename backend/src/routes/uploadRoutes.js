import { Router } from 'express';
import multer from 'multer';
import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { requireAuth } from '../middleware/auth.js';
import { requirePermission } from '../middleware/authorize.js';
import { HttpError } from '../utils/httpError.js';

const router = Router();
const uploadDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../uploads');
mkdirSync(uploadDir, { recursive: true });

const extensions = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/avif': '.avif' };
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, done) => done(null, `${randomUUID()}${extensions[file.mimetype] || ''}`)
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, done) => {
    if (!extensions[file.mimetype]) return done(new HttpError(400, 'Choose a JPG, PNG, WebP, or AVIF image'));
    done(null, true);
  }
});

router.post('/image', requireAuth, requirePermission('courses', 'CREATE'), (req, res, next) => {
  upload.single('image')(req, res, error => {
    if (error) {
      if (error instanceof multer.MulterError) {
        const tooLarge = error.code === 'LIMIT_FILE_SIZE';
        return next(new HttpError(tooLarge ? 413 : 400, tooLarge ? 'Image must be 5 MB or smaller' : 'Upload one image at a time'));
      }
      return next(error);
    }
    if (!req.file) return next(new HttpError(400, 'Choose an image to upload'));
    const origin = process.env.PUBLIC_API_URL || `${req.protocol}://${req.get('host')}`;
    res.status(201).json({ success: true, data: { url: `${origin}/uploads/${req.file.filename}` } });
  });
});

export default router;
