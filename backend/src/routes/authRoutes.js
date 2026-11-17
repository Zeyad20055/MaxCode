import { Router } from 'express';
import { login, me, updateLanguage } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
router.post('/login', login);
router.get('/me', requireAuth, me);
router.patch('/me/language', requireAuth, updateLanguage);
export default router;
