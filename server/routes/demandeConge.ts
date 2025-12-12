import { Router } from 'express';
import DemandeConge, { StatutDemande, TypeConge } from '../models/DemandeConge';
import { requireAuth, requireRole } from '../middlewere/auth';
import { Role } from '../models/Utilisateur';

const router = Router();

// Créer une nouvelle demande de congé (par l'utilisateur connecté)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { type, dateDebut, dateFin, commentaire } = req.body;

    if (!type || !dateDebut || !dateFin) {
      return res.status(400).json({ message: 'Champs requis manquants' });
    }

    const demande = new DemandeConge({
      employeId: req.user!._id,
      type,
      dateDebut,
      dateFin,
      commentaire,
      statut: StatutDemande.EN_ATTENTE
    });

    await demande.save();

    res.status(201).json(demande);
  } catch (err: any) {
    res.status(500).json({ message: 'Erreur lors de la création de la demande', error: err.message });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const demandes = await DemandeConge.find({ employeId: req.user!._id }).sort({ dateCreation: -1 });
    res.json(demandes);
  } catch (err: any) {
    res.status(500).json({ message: 'Erreur lors de la récupération des demandes', error: err.message });
  }
});
// Get all demandes de congé (Manager)
router.get('/', requireAuth, requireRole(Role.MANAGER), async (req, res) => {
  try {
    const { statut, employeId } = req.query;
    const filter: any = {};
    if (statut && Object.values(StatutDemande).includes(statut as any)) {
      filter.statut = statut;
    }
    if (employeId) {
      filter.employeId = employeId;
    }
    const demandes = await DemandeConge.find(filter).sort({ dateCreation: -1 });
    res.json(demandes);
  } catch (err: any) {
    res.status(500).json({ message: 'Erreur lors de la récupération des demandes', error: err.message });
  }
});

// Accepter une demande de congé (Manager)
router.patch('/:id/accepter', requireAuth, requireRole(Role.MANAGER), async (req, res) => {
  try {
    const demande = await DemandeConge.findById(req.params.id);
    if (!demande) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }
    demande.statut = StatutDemande.ACCEPTE;
    await demande.save();
    res.json(demande);
  } catch (err: any) {
    res.status(500).json({ message: 'Erreur lors de l\'acceptation', error: err.message });
  }
});

// Refuser une demande de congé (Manager)
router.patch('/:id/refuser', requireAuth, requireRole(Role.MANAGER), async (req, res) => {
  try {
    const demande = await DemandeConge.findById(req.params.id);
    if (!demande) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }
    demande.statut = StatutDemande.REFUSE;
    await demande.save();
    res.json(demande);
  } catch (err: any) {
    res.status(500).json({ message: 'Erreur lors du refus', error: err.message });
  }
});

export default router;
