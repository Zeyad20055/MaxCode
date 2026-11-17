import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { HttpError } from '../utils/httpError.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new HttpError(401, 'Authentication required', 'AUTH_REQUIRED');
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(payload.sub).populate('roleRef');
    if (!user || user.status !== 'active') throw new HttpError(401, 'Account unavailable', 'ACCOUNT_UNAVAILABLE');
    req.user = user;
    next();
  } catch (error) {
    next(error instanceof HttpError ? error : new HttpError(401, 'Invalid or expired token', 'INVALID_TOKEN'));
  }
}
