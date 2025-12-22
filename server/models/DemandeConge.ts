import { Schema, model, Document, Types } from 'mongoose';
import { JourFerieModel } from './JourFerie';
import { Utilisateur } from './Utilisateur';
import { EmployePeuple } from '../repository/demandeCongeRepository';

// Enum pour le type de congé
export enum TypeConge {
  VACANCES = 'VACANCES',
  MALADIE = 'MALADIE',
  ABSENCE = 'ABSENCE'
}

export enum StatutDemande {
  EN_ATTENTE = "EN_ATTENTE",
  ACCEPTE = "ACCEPTE",
  REFUSE = "REFUSE",
}


/** 🔹 INPUT = données de création */
export interface DemandeCongeInput {
  employeId: Types.ObjectId | EmployePeuple; 
  type: TypeConge;
  dateDebut: Date;
  dateFin: Date;
  commentaire?: string;
  statut: StatutDemande;
}
/** 🔹 DOCUMENT Mongo */
export interface IDemandeConge extends Document, DemandeCongeInput {
  nbJour:number;
  dateCreation: Date;
}


const DemandeCongeSchema = new Schema<IDemandeConge>({
  employeId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Utilisateur', 
    required: true 
  },
  type: { 
    type: String, 
    enum: Object.values(TypeConge), 
    required: true 
  },
  dateDebut: { 
    type: Date, 
    required: true 
  },
  dateFin: { 
    type: Date, 
    required: true 
  },
  commentaire: { 
    type: String 
  },
  statut: { 
    type: String, 
    enum: Object.values(StatutDemande), 
    required: true,
    default: StatutDemande.EN_ATTENTE
  },
  nbJour:{
    type: Number
  },
  dateCreation: { 
    type: Date, 
    required: true,
    default: Date.now
  }
});

DemandeCongeSchema.pre<IDemandeConge>('save', async function () {
  const start = new Date(this.dateDebut);
  const end = new Date(this.dateFin);

  let count = 0;
  const current = new Date(start);

  const years = Array.from(new Set([start.getFullYear(), end.getFullYear()]));
  const joursFeries = await JourFerieModel.find({
    year: { $in: years },
  }).lean();

  const joursFeriesSet = new Set(
    joursFeries.map(j => {
      const d = new Date(j.date);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    })
  );

  while (current <= end) {
    const day = current.getDay(); 
    const key = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`;

    if (day !== 0 && day !== 6 && !joursFeriesSet.has(key)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  const employe = await Utilisateur.findById(this.employeId).lean();
  if (!employe) {
    throw new Error("Employé introuvable");
  }

  if (employe.soldeConge - count < 0) {
    throw new Error("Solde de congé insuffisant");
  }

  this.nbJour = count;
});

DemandeCongeSchema.pre('findOneAndUpdate', async function() {
  const update: any = this.getUpdate();
  const query: any = this.getQuery(); 

  const dateDebut = update.dateDebut || update.$set?.dateDebut;
  const dateFin = update.dateFin || update.$set?.dateFin;
  const employeId = query.employeId;

  if (!dateDebut || !dateFin) return;

  const start = new Date(dateDebut);
  const end = new Date(dateFin);

  const years = Array.from(new Set([start.getFullYear(), end.getFullYear()]));
  const joursFeries = await JourFerieModel.find({
    year: { $in: years },
  }).lean();

  const joursFeriesSet = new Set(
    joursFeries.map(j => {
      const d = new Date(j.date);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    })
  );

  let count = 0;
  const current = new Date(start);

  while (current <= end) {
    const day = current.getDay();
    const key = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`;

    if (day !== 0 && day !== 6 && !joursFeriesSet.has(key)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  const employe = await Utilisateur.findById(employeId).lean();
  if (!employe) {
    throw new Error("Employé introuvable");
  }

  if (employe.soldeConge - count < 0) {
    throw new Error("Solde de congé insuffisant");
  }

  if (update.$set) {
    update.$set.nbJour = count;
  } else {
    update.nbJour = count;
  }

  this.setUpdate(update);
});

const DemandeConge = model<IDemandeConge>('DemandeConge', DemandeCongeSchema);
export default DemandeConge;