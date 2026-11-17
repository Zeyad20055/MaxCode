import AuditLog from '../models/AuditLog.js';

export async function writeAudit(req, { action, section, targetId = '', before = null, after = null }) {
  await AuditLog.create({
    actor: req.user?._id || null,
    actorName: req.user?.name || 'System',
    actorRole: req.user?.role || 'system',
    action, section, targetId, before, after,
    ip: req.ip || ''
  });
}
