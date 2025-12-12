import { Schema, model, Document, Types } from 'mongoose';

// Enum pour le type de congé
export enum TypeConge {
  VACANCES = 'VACANCES',
  MALADIE = 'MALADIE',
  MATERNITE = 'MATERNITE',
  PATERNITE = 'PATERNITE',
  FAMILIAL = 'FAMILIAL',
}

// Enum pour le statut de la demande
export enum StatutDemande {
  EN_ATTENTE = 'EN_ATTENTE',
  ACCEPTE = 'ACCEPTE',
  REFUSE = 'REFUSE',
}

export interface IDemandeConge extends Document {
  employeId: Types.ObjectId;
  type: TypeConge;
  dateDebut: Date;
  dateFin: Date;
  commentaire: string;
  statut: StatutDemande;
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

