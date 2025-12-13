import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Utilisateur, Role } from '../models/Utilisateur';
const JWT_SECRET = process.env.JWT_SECRET || 'cle';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, motDePasse } = req.body;
    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) return res.status(400).json({ message: 'Email ou mot de passe incorrect' });

    const isMatch = await utilisateur.comparePassword(motDePasse);
    if (!isMatch) return res.status(400).json({ message: 'Email ou mot de passe incorrect' });

    const token = jwt.sign({ id: utilisateur._id }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: utilisateur._id, nom: utilisateur.nom, email: utilisateur.email,role: utilisateur.role } });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const register = async (req: Request, res: Response) => {
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
};