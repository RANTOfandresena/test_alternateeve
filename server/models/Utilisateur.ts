import { Schema, model, Document, Model, HydratedDocument } from 'mongoose';
import bcrypt from 'bcryptjs';

export enum Role {
  EMPLOYE = 'EMPLOYE',
  MANAGER = 'MANAGER',
}
export enum Genre {
  MASCULIN = 'MASCULIN',
  FEMININ = 'FEMININ',
}

export interface IUtilisateur extends Document {
  nom: string;
  email: string;
  motDePasse: string;
  genre: Genre;
  role: Role;
}

export interface IUtilisateurMethods {
  comparePassword: (password: string) => Promise<boolean>;
}

type UtilisateurModel = Model<IUtilisateur, {}, IUtilisateurMethods>;

const UtilisateurSchema = new Schema<IUtilisateur, UtilisateurModel>({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  motDePasse: { type: String, required: true },
  genre: { type: String, enum: Object.values(Genre),default: Genre.MASCULIN, required: true },
  role: { type: String, enum: Object.values(Role), required: true },
});

UtilisateurSchema.pre('save', async function (this: HydratedDocument<IUtilisateur>) {
  if (!this.isModified('motDePasse')) return;
  const salt = await bcrypt.genSalt(10);
  this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
});

UtilisateurSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.motDePasse;
    return ret;
  }
});

UtilisateurSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.motDePasse);
};

export const Utilisateur = model<IUtilisateur, UtilisateurModel>('Utilisateur', UtilisateurSchema);
