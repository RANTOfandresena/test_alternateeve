import { Schema, model, Document } from "mongoose";

export interface JourFerieDocument extends Document {
  year: number;
  date: string;
  name: string;
}

const JourFerieSchema = new Schema<JourFerieDocument>(
  {
    year: {
      type: Number,
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

JourFerieSchema.index({ year: 1, date: 1 }, { unique: true });

export const JourFerieModel = model<JourFerieDocument>(
  "JourFerie",
  JourFerieSchema
);