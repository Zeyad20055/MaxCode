import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Role from '../models/Role.js';

const defaultPermissions = {
  courses: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
  registrations: ['VIEW', 'APPROVE', 'EXPORT'],
  students: ['VIEW', 'EDIT'],
  attendance: ['VIEW'],
  grades: ['VIEW'],
  website: ['VIEW'],
  reports: ['VIEW']
};

export async function bootstrapSuperAdmin() {
  const email = process.env.SUPER_ADMIN_EMAIL?.toLowerCase();
  const password = process.env.SUPER_ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn('Super Admin bootstrap skipped: set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD');
    return;
  }
  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role === 'super_admin') {
      console.log('Super Admin already initialized; existing credentials were not changed');
    } else {
      console.warn('Super Admin bootstrap skipped: configured email belongs to a non-Super Admin account');
    }
    return;
  }
  const count = await User.countDocuments({ role: 'super_admin' });
  if (count > 0) {
    console.log('Super Admin already exists; no additional account was created');
    return;
  }
  if (process.env.NODE_ENV === 'production' && (password.length < 14 || password.includes('ChangeThis'))) {
    throw new Error('Production Super Admin password must be changed and at least 14 characters');
  }
  let role = await Role.findOne({ name: 'Super Admin' });
  if (!role) role = await Role.create({ name: 'Super Admin', permissions: defaultPermissions, isSystem: true });
  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({
    name: process.env.SUPER_ADMIN_NAME || 'MAX CODE Owner',
    email, passwordHash, role: 'super_admin', roleRef: role._id
  });
  console.log('Initial Super Admin created');
}
