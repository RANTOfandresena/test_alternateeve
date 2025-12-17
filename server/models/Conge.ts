import { Schema, model, Document } from 'mongoose';

export type TypeConge = 'DROIT_ACQUIS' | 'CONGE_CONJOINT' | 'CONGE_MATERNITE' | 'CONGE_EDUCATION';

export interface IConges extends Document {
  type: TypeConge;
  description: string;
  duree: number;
  details?: Record<string, any>;
}

const CongesSchema = new Schema<IConges>(
  {
    type: {
      type: String,
      enum: ['DROIT_ACQUIS', 'CONGE_CONJOINT', 'CONGE_MATERNITE', 'CONGE_EDUCATION'],
      required: true,
    },
    description: { type: String, required: true },
    duree: { type: Number, required: true },
    details: { type: Object, default: {} },
  },
  { timestamps: true }
);

const Conges = model<IConges>('Conges', CongesSchema);

// Données par défaut
export const defaultConges: IConges[] = [
  new Conges({
    type: 'DROIT_ACQUIS',
    description: '2,5 jours calendaires par mois de service effectif',
    duree: 2.5,
  }),
  new Conges({
    type: 'CONGE_CONJOINT',
    description: '3 jours pour le conjoint de la femme qui accouche',
    duree: 3,
  }),
  new Conges({
    type: 'CONGE_MATERNITE',
    description: '14 semaines consécutives (dont 8 après l\'accouchement), prolongeable de 4 semaines maximum pour raisons médicales',
    duree: 14 * 7, // 14 semaines = 98 jours
    details: { prolongationMax: 4 * 7 }, // 4 semaines = 28 jours
  }),
  new Conges({
    type: 'CONGE_EDUCATION',
    description: 'Congé éducation-formation (Art. 343-344)',
    duree: 12, // 12 jours ouvrables
    details: { horsDelaiRoute: true },
  }),
];

export default Conges;