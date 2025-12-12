import { requireAuth, requireRole } from '../middlewere/auth';
import { Role } from '../models/Utilisateur';
import { Router } from 'express';

const router = Router();
router.get('/me', requireAuth, (req, res) => { 
    res.json(req.user);
});

router.post('/admin/only', requireAuth, requireRole(Role.MANAGER), (req, res) => { 
    res.json({ message: 'Accès réservé aux managers' });
});

export default router;