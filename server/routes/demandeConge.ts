import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewere/auth';
import { Role } from '../models/Utilisateur';
import {
  createDemande,
  getMyDemandes,
  getAllDemandes,
  accepterDemande,
  refuserDemande,
} from '../controllers/demandeCongeController';

const router = Router();

// Créer une nouvelle demande de congé (par l'utilisateur connecté)
router.post('/', requireAuth, createDemande);

// Récupérer les demandes de l'utilisateur connecté
router.get('/me', requireAuth, getMyDemandes);

// Get all demandes de congé (Manager)
router.get('/', requireAuth, requireRole(Role.MANAGER), getAllDemandes);

// Accepter une demande de congé (Manager)
router.patch('/:id/accepter', requireAuth, requireRole(Role.MANAGER), accepterDemande);

// Refuser une demande de congé (Manager)
router.patch('/:id/refuser', requireAuth, requireRole(Role.MANAGER), refuserDemande);

export default router;
