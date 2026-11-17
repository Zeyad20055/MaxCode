import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import siteSettingsRoutes from './routes/siteSettingsRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import { uploadDir } from './config/uploadStorage.js';
import { connectDB } from './config/db.js';
import { bootstrapSuperAdmin } from './services/bootstrap.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();
let backendReady;

async function ensureBackendReady(req, res, next) {
  if (!process.env.VERCEL) return next();
  try {
    backendReady ??= Promise.resolve().then(async () => {
      await connectDB();
      await bootstrapSuperAdmin();
    }).catch(error => {
      backendReady = undefined;
      throw error;
    });
    await backendReady;
    next();
  } catch (error) {
    next(error);
  }
}

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));

// Vercel imports the Express app directly. Initialize MongoDB on demand so an
// environment or connection error returns an Express error response instead
// of terminating the whole Vercel Function during module startup.
app.use('/api', ensureBackendReady);
app.get('/api/health', (req, res) => res.json({ success: true, message: 'MAX CODE API is running' }));
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/super-admin', adminRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/site-settings', siteSettingsRoutes);
app.use('/api/students', studentRoutes);
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(uploadDir, { maxAge: '7d', immutable: true }));
app.use(notFound);
app.use(errorHandler);

export default app;
