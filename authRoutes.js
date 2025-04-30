import { Router } from 'express';
const router = Router();
import { signup, login, verifyEmail } from '../controllers/authController';

router.post('/signup', signup);
router.post('/verify-email', verifyEmail);
router.post('/login', login);

export default router;
