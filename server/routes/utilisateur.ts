import { allUsers, updateUserRole } from '../controllers/utilisateurController';
import { requireAuth, requireRole } from '../middlewere/auth';
import { Role } from '../models/Utilisateur';
import { Router } from 'express';

const router = Router();
router.get('/me', requireAuth, (req, res) => { 
    res.json(req.user);
});

router.get('/', requireAuth, requireRole(Role.MANAGER), allUsers);
router.put('/:id/role', requireAuth, requireRole(Role.MANAGER), updateUserRole);

export default router;