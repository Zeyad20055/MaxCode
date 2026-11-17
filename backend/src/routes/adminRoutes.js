import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requirePermission, superAdminOnly } from '../middleware/authorize.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import Registration from '../models/Registration.js';
import Course from '../models/Course.js';
import Role from '../models/Role.js';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { HttpError } from '../utils/httpError.js';
import { writeAudit } from '../services/audit.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const router = Router();
router.use(requireAuth);

router.get('/overview', requirePermission('students', 'VIEW'), asyncHandler(async (req, res) => {
  const [students, admins, courses, registrations, pending, logs] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'admin' }),
    Course.countDocuments(),
    Registration.countDocuments(),
    Registration.countDocuments({ status: 'pending' }),
    AuditLog.countDocuments()
  ]);
  res.json({ success: true, data: { students, admins, courses, registrations, pending, auditEvents: logs } });
}));

router.get('/admins', superAdminOnly, asyncHandler(async (req, res) => {
  const admins = await User.find({ role: 'admin' }).select('name email status createdAt roleRef').populate('roleRef', 'name');
  res.json({ success: true, data: admins });
}));

router.post('/admins', superAdminOnly, asyncHandler(async (req, res) => {
  const schema = z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().transform(value => value.toLowerCase()),
    password: z.string().min(8).max(128)
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Enter a valid name, email, and password of at least 8 characters');
  if (await User.exists({ email: parsed.data.email })) throw new HttpError(409, 'An account with this email already exists');

  let role = await Role.findOne({ name: 'Academy Admin' });
  if (!role) role = await Role.create({
    name: 'Academy Admin',
    permissions: {
      courses: ['VIEW', 'CREATE', 'EDIT'],
      registrations: ['VIEW', 'APPROVE'],
      students: ['VIEW', 'EDIT'],
      website: ['VIEW']
    },
    isSystem: true
  });
  else {
    role.permissions.set('students', ['VIEW', 'EDIT']);
    await role.save();
  }
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const admin = await User.create({
    name: parsed.data.name,
    email: parsed.data.email,
    passwordHash,
    role: 'admin',
    roleRef: role._id
  });
  await writeAudit(req, { action: 'CREATE', section: 'admins', targetId: admin._id.toString(), after: { name: admin.name, email: admin.email, role: admin.role } });
  res.status(201).json({ success: true, data: { id: admin._id, name: admin.name, email: admin.email, role: admin.role, status: admin.status, createdAt: admin.createdAt } });
}));

router.get('/audit-logs', superAdminOnly, asyncHandler(async (req, res) => {
  const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(200);
  res.json({ success: true, data: logs });
}));

export default router;
