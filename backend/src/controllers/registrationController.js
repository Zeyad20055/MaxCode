import { randomBytes } from 'node:crypto';
import mongoose from 'mongoose';
import { z } from 'zod';
import Course from '../models/Course.js';
import Registration from '../models/Registration.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';
import { writeAudit } from '../services/audit.js';
import { isWhatsAppGroupInvite } from '../utils/whatsapp.js';

const normalizeDigits = value => typeof value === 'string'
  ? value.replace(/[٠-٩]/g, digit => String(digit.charCodeAt(0) - 0x0660)).replace(/[۰-۹]/g, digit => String(digit.charCodeAt(0) - 0x06f0))
  : value;

const phoneSchema = z.preprocess(normalizeDigits, z.string().trim().regex(/^\+?[0-9\s()-]{8,20}$/));

const schema = z.object({
  fullName: z.string().trim().min(3).max(120),
  phone: phoneSchema,
  whatsapp: phoneSchema,
  email: z.string().trim().email().transform(value => value.toLowerCase()),
  age: z.preprocess(value => value === '' || value == null ? undefined : value, z.coerce.number().min(10).max(100).optional()),
  university: z.string().trim().max(160).optional(),
  experience: z.enum(['none', 'beginner', 'intermediate', 'advanced']).optional(),
  notes: z.string().max(1000).optional()
});

export const createRegistration = asyncHandler(async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Please check the registration fields');
  const courseKey = req.params.courseId;
  const courseRef = mongoose.isValidObjectId(courseKey) ? { _id: courseKey } : { slug: courseKey };
  const course = await Course.findOne({ ...courseRef, isActive: true, registrationOpen: true })
    .select('+whatsappGroupLink');
  if (!course) throw new HttpError(404, 'Course is unavailable');
  const existing = await Registration.findOne({ course: course._id, email: parsed.data.email.toLowerCase() });
  if (existing) throw new HttpError(409, 'You have already registered for this course');
  const count = await Registration.countDocuments({ course: course._id, status: { $ne: 'rejected' } });
  if (count >= course.capacity) throw new HttpError(409, 'Course capacity has been reached');

  const registration = await Registration.create({
    ...parsed.data,
    email: parsed.data.email.toLowerCase(),
    course: course._id,
    registrationCode: `MC-${Date.now().toString(36).toUpperCase()}-${randomBytes(3).toString('hex').toUpperCase()}`
  });

  // Invitation is returned only after MongoDB confirms the registration save.
  res.status(201).json({
    success: true,
    data: {
      registrationCode: registration.registrationCode,
      courseName: course.name,
      whatsappGroupLink: isWhatsAppGroupInvite(course.whatsappGroupLink) ? course.whatsappGroupLink : null
    }
  });
});

export const listRegistrations = asyncHandler(async (req, res) => {
  const { status, course } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (course) filter.course = course;
  const rows = await Registration.find(filter).populate('course', 'name slug').populate('group', 'name').sort({ createdAt: -1 });
  res.json({ success: true, data: rows });
});

export const updateRegistrationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'approved', 'rejected'].includes(status)) throw new HttpError(400, 'Invalid registration status');
  const before = await Registration.findById(req.params.id);
  if (!before) throw new HttpError(404, 'Registration not found');
  before.status = status;
  await before.save();
  await writeAudit(req, { action: 'STATUS_CHANGE', section: 'registrations', targetId: before._id.toString(), before: { status: 'previous' }, after: { status } });
  res.json({ success: true, data: before });
});
