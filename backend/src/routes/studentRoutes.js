import { Router } from 'express';
import { z } from 'zod';
import Course from '../models/Course.js';
import Registration from '../models/Registration.js';
import StudentGroup from '../models/StudentGroup.js';
import { requireAuth } from '../middleware/auth.js';
import { requirePermission } from '../middleware/authorize.js';
import { writeAudit } from '../services/audit.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';

const router = Router();
async function publicGroupData(group) {
  const students = await Registration.find({ group: group._id, status: 'approved', showInDirectory: true })
    .select('fullName photoUrl attendance averageGradePercent').sort({ fullName: 1 }).lean();
  const members = students.map(student => {
    const attendance = student.attendance || [];
    const present = attendance.filter(entry => entry.status === 'present').length;
    const absent = attendance.filter(entry => entry.status === 'absent').length;
    const total = present + absent;
    return { _id: student._id, fullName: student.fullName, photoUrl: student.photoUrl,
      averageGradePercent: student.averageGradePercent || 0,
      attendancePercent: total ? Math.round(present / total * 100) : 0,
      absencePercent: total ? Math.round(absent / total * 100) : 0,
      presentCount: present, absentCount: absent };
  });
  const settings = {
    showStudentCount: group.showStudentCount !== false,
    showPhotos: group.showPhotos !== false,
    showAttendance: group.showAttendance !== false,
    showAbsence: group.showAbsence !== false,
    showAverageGrade: group.showAverageGrade !== false
  };
  const studentCount = settings.showStudentCount
    ? await Registration.countDocuments({ group: group._id, status: 'approved' })
    : undefined;
  const publicStudents = members.map(student => ({
    _id: student._id,
    fullName: student.fullName,
    ...(settings.showPhotos ? { photoUrl: student.photoUrl } : {}),
    ...(settings.showAttendance ? { attendancePercent: student.attendancePercent, presentCount: student.presentCount } : {}),
    ...(settings.showAbsence ? { absencePercent: student.absencePercent, absentCount: student.absentCount } : {}),
    ...(settings.showAverageGrade ? { averageGradePercent: student.averageGradePercent } : {})
  }));
  return {
    _id: group._id, name: group.name, course: group.course, students: publicStudents, ...settings,
    ...(settings.showStudentCount ? { studentCount } : {})
  };
}

router.get('/directory/groups', asyncHandler(async (req, res) => {
  const groups = await StudentGroup.find({ isActive: true }).populate('course', 'name slug').sort({ name: 1 });
  res.json({ success: true, data: await Promise.all(groups.map(publicGroupData)) });
}));

router.get('/directory/groups/:groupId', asyncHandler(async (req, res) => {
  const group = await StudentGroup.findOne({ _id: req.params.groupId, isActive: true }).populate('course', 'name slug');
  if (!group) throw new HttpError(404, 'Group not found');
  res.json({ success: true, data: await publicGroupData(group) });
}));

router.get('/groups', requireAuth, requirePermission('students', 'VIEW'), asyncHandler(async (req, res) => {
  const groups = await StudentGroup.find().populate('course', 'name slug').sort({ createdAt: -1 });
  const counts = await Registration.aggregate([{ $match: { status: 'approved', group: { $ne: null } } }, { $group: { _id: '$group', count: { $sum: 1 } } }]);
  const countByGroup = new Map(counts.map(row => [row._id.toString(), row.count]));
  res.json({ success: true, data: groups.map(group => ({ ...group.toObject(), studentCount: countByGroup.get(group._id.toString()) || 0 })) });
}));

router.post('/groups', requireAuth, requirePermission('students', 'EDIT'), asyncHandler(async (req, res) => {
  const parsed = z.object({ name: z.string().trim().min(2).max(100), course: z.string().min(1) }).safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Enter a group name and choose a course');
  if (!await Course.exists({ _id: parsed.data.course })) throw new HttpError(404, 'Course not found');
  const group = await StudentGroup.create({ ...parsed.data, isActive: true });
  await writeAudit(req, { action: 'CREATE', section: 'students', targetId: group._id.toString(), after: group.toObject() });
  res.status(201).json({ success: true, data: group });
}));

router.patch('/groups/:groupId/settings', requireAuth, requirePermission('students', 'EDIT'), asyncHandler(async (req, res) => {
  const schema = z.object({
    showStudentCount: z.boolean(), showPhotos: z.boolean(), showAttendance: z.boolean(),
    showAbsence: z.boolean(), showAverageGrade: z.boolean()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Choose which group details are public');
  const group = await StudentGroup.findByIdAndUpdate(req.params.groupId, { $set: parsed.data }, { new: true, runValidators: true });
  if (!group) throw new HttpError(404, 'Group not found');
  await writeAudit(req, { action: 'PUBLIC_SETTINGS', section: 'students', targetId: group._id.toString(), after: parsed.data });
  res.json({ success: true, data: group });
}));

router.get('/groups/:groupId/students', requireAuth, requirePermission('students', 'VIEW'), asyncHandler(async (req, res) => {
  const group = await StudentGroup.findById(req.params.groupId);
  if (!group) throw new HttpError(404, 'Group not found');
  const students = await Registration.find({ group: group._id, status: 'approved' }).select('fullName email phone photoUrl attendance averageGradePercent showInDirectory').sort({ fullName: 1 }).lean();
  res.json({ success: true, data: students.map(student => ({ ...student, attendanceSummary: {
    present: (student.attendance || []).filter(item => item.status === 'present').length,
    absent: (student.attendance || []).filter(item => item.status === 'absent').length
  } })) });
}));

router.patch('/registrations/:registrationId/group', requireAuth, requirePermission('students', 'EDIT'), asyncHandler(async (req, res) => {
  const student = await Registration.findById(req.params.registrationId);
  if (!student) throw new HttpError(404, 'Student not found');
  if (student.status !== 'approved') throw new HttpError(400, 'Approve the registration before assigning a group');
  if (req.body.group && !await StudentGroup.exists({ _id: req.body.group, course: student.course, isActive: true })) throw new HttpError(400, 'Choose an active group for this course');
  student.group = req.body.group || null;
  await student.save();
  await writeAudit(req, { action: 'GROUP_ASSIGNMENT', section: 'students', targetId: student._id.toString(), after: { group: student.group?.toString() || null } });
  res.json({ success: true, data: student });
}));

router.post('/registrations/:registrationId/attendance', requireAuth, requirePermission('students', 'EDIT'), asyncHandler(async (req, res) => {
  const parsed = z.object({ date: z.coerce.date(), status: z.enum(['present', 'absent']) }).safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Enter a valid attendance date and status');
  const student = await Registration.findOne({ _id: req.params.registrationId, status: 'approved', group: { $ne: null } });
  if (!student) throw new HttpError(404, 'Grouped student not found');
  const date = parsed.data.date;
  const existing = student.attendance.find(item => item.date.toDateString() === date.toDateString());
  if (existing) existing.status = parsed.data.status;
  else student.attendance.push(parsed.data);
  await student.save();
  await writeAudit(req, { action: 'ATTENDANCE', section: 'students', targetId: student._id.toString(), after: parsed.data });
  res.json({ success: true, data: student.attendance });
}));

router.patch('/registrations/:registrationId/photo', requireAuth, requirePermission('students', 'EDIT'), asyncHandler(async (req, res) => {
  const parsed = z.object({ photoUrl: z.string().trim().max(1000).refine(value => !value || /^https?:\/\//i.test(value)) }).safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Enter a valid student photo URL');
  const student = await Registration.findOneAndUpdate({ _id: req.params.registrationId, status: 'approved' }, { $set: { photoUrl: parsed.data.photoUrl } }, { new: true, runValidators: true });
  if (!student) throw new HttpError(404, 'Student not found');
  res.json({ success: true, data: student });
}));

router.patch('/registrations/:registrationId/profile', requireAuth, requirePermission('students', 'EDIT'), asyncHandler(async (req, res) => {
  const schema = z.object({ averageGradePercent: z.coerce.number().min(0).max(100), showInDirectory: z.boolean() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Enter a grade from 0 to 100');
  const student = await Registration.findOneAndUpdate({ _id: req.params.registrationId, status: 'approved' }, { $set: parsed.data }, { new: true, runValidators: true });
  if (!student) throw new HttpError(404, 'Student not found');
  await writeAudit(req, { action: 'PROFILE_UPDATE', section: 'students', targetId: student._id.toString(), after: parsed.data });
  res.json({ success: true, data: student });
}));

export default router;
