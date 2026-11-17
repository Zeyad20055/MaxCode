import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { connectDB } from './config/db.js';
import { bootstrapSuperAdmin } from './services/bootstrap.js';
import app from './app.js';

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const port = process.env.PORT || 5001;
try {
  await connectDB();
  await bootstrapSuperAdmin();
  app.listen(port, () => console.log(`MAX CODE API listening on port ${port}`));
} catch (error) {
  console.error('Startup failed:', error);
  process.exit(1);
}
