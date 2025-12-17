import { Schema, model, Document, Types } from 'mongoose';

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
  employeId: Types.ObjectId | string; 
  type: TypeConge;
  dateDebut: Date;
  dateFin: Date;
  commentaire?: string;
  statut: StatutDemande;
}

/** 🔹 DOCUMENT Mongo */
export interface IDemandeConge extends Document, DemandeCongeInput {
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
  dateCreation: { 
    type: Date, 
    required: true,
    default: Date.now
  }
});

const DemandeConge = model<IDemandeConge>('DemandeConge', DemandeCongeSchema);
export default DemandeConge;

