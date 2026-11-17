import Course from '../models/Course.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';
import { writeAudit } from '../services/audit.js';

export const listPublicCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ isActive: true, registrationOpen: true })
    .select('-whatsappGroupLink').sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: courses });
});

export const getPublicCourse = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug, isActive: true })
    .select('-whatsappGroupLink').lean();
  if (!course) throw new HttpError(404, 'Course not found');
  res.json({ success: true, data: course });
});

export const listAdminCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find().select('+whatsappGroupLink').sort({ createdAt: -1 });
  res.json({ success: true, data: courses });
});

export const createCourse = asyncHandler(async (req, res) => {
  const course = await Course.create(req.body);
  await writeAudit(req, { action: 'CREATE', section: 'courses', targetId: course._id.toString(), after: course.toObject() });
  res.status(201).json({ success: true, data: course });
});

export const updateCourse = asyncHandler(async (req, res) => {
  const before = await Course.findById(req.params.id).select('+whatsappGroupLink');
  if (!before) throw new HttpError(404, 'Course not found');
  const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('+whatsappGroupLink');
  await writeAudit(req, { action: 'UPDATE', section: 'courses', targetId: updated._id.toString(), before: before.toObject(), after: updated.toObject() });
  res.json({ success: true, data: updated });
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new HttpError(404, 'Course not found');
  await Course.findByIdAndDelete(req.params.id);
  await writeAudit(req, { action: 'DELETE', section: 'courses', targetId: req.params.id, before: course.toObject() });
  res.json({ success: true, message: 'Course deleted' });
});
