import { Router } from 'express';
import { login, register } from '../controllers/authContriller';
import { loginGoogle } from '../controllers/authGoogleController';
import dotenv from 'dotenv';
dotenv.config()

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'cle';

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Créer un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               motDePasse:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [EMPLOYE, MANAGER]
 *             required: [nom, email, motDePasse]
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *       400:
 *         description: Erreur de validation
 */
// Register
router.post('/register', register);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authentifier un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               motDePasse:
 *                 type: string
 *             required: [email, motDePasse]
 *     responses:
 *       200:
 *         description: Token JWT retourné
 *       400:
 *         description: Identifiants invalides
 *       500:
 *         description: Erreur serveur
 */

router.post('/login', login);
router.post('/google',loginGoogle);
export default router;