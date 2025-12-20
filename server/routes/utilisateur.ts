import { allUsers, getProfilController, getUsersFromIds, updateUserRole } from '../controllers/utilisateurController';
import { requireAuth, requireRole } from '../middlewere/auth';
import { Role } from '../models/Utilisateur';
import { Router } from 'express';

const router = Router();
router.get('/me', requireAuth, getProfilController);

router.get('/', requireAuth, requireRole(Role.MANAGER), allUsers);
router.put('/:id/role', requireAuth, requireRole(Role.MANAGER), updateUserRole);
router.post('/from-ids', getUsersFromIds);

export default router;