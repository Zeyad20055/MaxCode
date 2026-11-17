import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { connectDB } from '../config/db.js';

const backendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
dotenv.config({ path: path.join(backendDir, '.env') });

function readHidden(prompt) {
  const input = process.stdin;
  if (!input.isTTY || typeof input.setRawMode !== 'function') {
    throw new Error('Run this command in an interactive terminal.');
  }

  return new Promise((resolve, reject) => {
    let value = '';
    const finish = (error) => {
      input.removeListener('data', onData);
      input.setRawMode(false);
      input.pause();
      process.stdout.write('\n');
      error ? reject(error) : resolve(value);
    };
    const onData = (chunk) => {
      for (const char of chunk) {
        if (char === '\u0003') return finish(new Error('Cancelled.'));
        if (char === '\r' || char === '\n') return finish();
        if (char === '\u0008' || char === '\u007f') {
          if (value.length) {
            value = value.slice(0, -1);
            process.stdout.write('\b \b');
          }
        } else if (char >= ' ') {
          value += char;
          process.stdout.write('*');
        }
      }
    };

    process.stdout.write(prompt);
    input.setEncoding('utf8');
    input.setRawMode(true);
    input.resume();
    input.on('data', onData);
  });
}

let exitCode = 0;
try {
  const email = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
  if (!email) throw new Error('SUPER_ADMIN_EMAIL is missing from backend/.env.');

  await connectDB();
  const admin = await User.findOne({ email, role: 'super_admin' });
  if (!admin) throw new Error('The configured Super Admin account was not found.');

  const password = await readHidden('New Super Admin password (at least 14 characters): ');
  if (password.length < 14) throw new Error('Password must be at least 14 characters.');
  const confirmation = await readHidden('Confirm new password: ');
  if (password !== confirmation) throw new Error('The passwords do not match.');

  admin.passwordHash = await bcrypt.hash(password, 12);
  await admin.save();
  console.log('Super Admin password updated. Sign in with the configured email and your new password.');
} catch (error) {
  exitCode = 1;
  console.error(error.message || 'Could not reset the Super Admin password.');
} finally {
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  process.exitCode = exitCode;
}
