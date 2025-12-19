import { Router } from 'express';
import { getJoursFeriesController } from '../controllers/JourFerieController';

const router = Router();
router.get('/:year', getJoursFeriesController);

export default router;