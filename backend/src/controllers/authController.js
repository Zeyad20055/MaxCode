import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User.js';
import { HttpError } from '../utils/httpError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const loginSchema = z.object({
  email: z.string().email().transform(v => v.toLowerCase()),
  password: z.string().min(1)
});

export const login = asyncHandler(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Enter a valid email and password');
  const user = await User.findOne({ email: parsed.data.email }).select('+passwordHash').populate('roleRef');
  if (!user || user.status !== 'active' || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
    throw new HttpError(401, 'Email or password is incorrect');
  }
  const token = jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
  res.json({
    success: true,
    data: {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, preferredLanguage: user.preferredLanguage }
    }
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: {
    id: req.user._id, name: req.user.name, email: req.user.email,
    role: req.user.role, preferredLanguage: req.user.preferredLanguage
  }});
});

export const updateLanguage = asyncHandler(async (req, res) => {
  const lang = req.body.language;
  if (!['ar', 'en'].includes(lang)) throw new HttpError(400, 'Unsupported language');
  req.user.preferredLanguage = lang;
  await req.user.save();
  res.json({ success: true, data: { language: lang } });
});
