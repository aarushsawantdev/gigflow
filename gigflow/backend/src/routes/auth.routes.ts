import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { registerValidation, loginValidation } from '../middleware/validate';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);

export default router;
