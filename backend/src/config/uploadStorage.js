import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

// Vercel's deployed filesystem is read-only except for /tmp. Local uploads stay
// in backend/uploads for development, while hosted uploads use temporary storage.
export const uploadDir = process.env.VERCEL
  ? path.join('/tmp', 'max-code-academy-uploads')
  : path.join(backendRoot, 'uploads');

mkdirSync(uploadDir, { recursive: true });
