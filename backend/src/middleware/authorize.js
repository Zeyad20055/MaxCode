import { HttpError } from '../utils/httpError.js';

export function requirePermission(section, action) {
  return (req, res, next) => {
    if (!req.user) return next(new HttpError(401, 'Authentication required'));
    if (req.user.role === 'super_admin') return next();

    const permissions = req.user.roleRef?.permissions;
    const allowed = permissions instanceof Map
      ? permissions.get(section) || []
      : permissions?.[section] || [];

    if (!allowed.includes(action)) {
      return next(new HttpError(403, 'You do not have permission to perform this action', 'FORBIDDEN'));
    }
    next();
  };
}

export function superAdminOnly(req, res, next) {
  if (req.user?.role !== 'super_admin') return next(new HttpError(403, 'Super Admin access only'));
  next();
}
