import { Router } from 'express';
import { createRegistration, listRegistrations, updateRegistrationStatus } from '../controllers/registrationController.js';
import { requireAuth } from '../middleware/auth.js';
import { requirePermission } from '../middleware/authorize.js';
const router = Router();
router.post('/course/:courseId', createRegistration);
router.get('/', requireAuth, requirePermission('registrations', 'VIEW'), listRegistrations);
router.patch('/:id/status', requireAuth, requirePermission('registrations', 'APPROVE'), updateRegistrationStatus);
export default router;
