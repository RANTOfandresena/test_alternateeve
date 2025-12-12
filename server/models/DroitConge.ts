import { Schema, model, Document } from 'mongoose';

// Enum pour le type de congé
export enum TypeConge {
  VACANCES = 'VACANCES',
  MALADIE = 'MALADIE',
  MATERNITE = 'MATERNITE',
  PATERNITE = 'PATERNITE',
  FAMILIAL = 'FAMILIAL',
}

// Enum pour l'unité de durée
export enum UniteDuree {
  JOUR = 'JOUR',
  SEMAINE = 'SEMAINE',
}

export interface IDroitConge extends Document {
  typeConge: TypeConge;
  unite: UniteDuree;
  dureeDroit: number;
  periodeReference: number;
}

const DroitCongeSchema = new Schema<IDroitConge>({
  typeConge: { 
    type: String, 
    enum: Object.values(TypeConge), 
    required: true 
  },
  unite: { 
    type: String, 
    enum: Object.values(UniteDuree), 
    required: true 
  },
  dureeDroit: { 
    type: Number, 
    required: true 
  },
  periodeReference: { 
    type: Number, 
    required: true 
  }
});

const DroitConge = model<IDroitConge>('DroitConge', DroitCongeSchema);
export default DroitConge;

