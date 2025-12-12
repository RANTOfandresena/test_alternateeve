import { Request, Response, NextFunction } from 'express';
import { HydratedDocument } from 'mongoose';
import jwt from 'jsonwebtoken';
import { Utilisateur, Role, IUtilisateur } from '../models/Utilisateur';

declare module 'express-serve-static-core' {
  interface Request {
    user?: HydratedDocument<IUtilisateur>;
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'cle';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };

    const utilisateur = await Utilisateur.findById(payload.id);
    if (!utilisateur) return res.status(401).json({ message: 'Utilisateur introuvable' });

    req.user = utilisateur;
    next();
  } catch (err: any) {
    return res.status(401).json({ message: 'Token invalide', detail: err.message });
  }
};

export const requireRole = (roles: Role | Role[]) => {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Non authentifié' });
    if (!allowed.includes(user.role)) {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    next();
  };
};

