import { Router } from 'express';
import { login, register } from '../controllers/authContriller';
import { loginGoogle } from '../controllers/authGoogleController';
import dotenv from 'dotenv';
dotenv.config()

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'cle';

router.post('/register', register);
router.post('/login', login);
router.post('/google',loginGoogle);
export default router;