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
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();
const uploadDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../uploads');
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));

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
