import { Router, Request, Response } from 'express';
import { Utilisateur, Role } from '../models/Utilisateur';
import jwt from 'jsonwebtoken';

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
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { nom, email, motDePasse, role } = req.body;
    const utilisateur = new Utilisateur({
      nom,
      email,
      motDePasse,
      role: role ?? Role.EMPLOYE,
    });
    await utilisateur.save();
    res.status(201).json({ message: 'Utilisateur créé !' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, motDePasse } = req.body;
    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) return res.status(400).json({ message: 'Email ou mot de passe incorrect' });

    const isMatch = await utilisateur.comparePassword(motDePasse);
    if (!isMatch) return res.status(400).json({ message: 'Email ou mot de passe incorrect' });

    const token = jwt.sign({ id: utilisateur._id }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: utilisateur._id, nom: utilisateur.nom, email: utilisateur.email } });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

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

export default router;
