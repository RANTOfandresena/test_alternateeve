import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRouter from './routes/auth';
import utilisateurRouter from './routes/utilisateur';
import jourFerieRouter from './routes/JourFerie'
import demandeConge from './routes/demandeConge'
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { swaggerOptions } from './doc/swagger';

dotenv.config();

const app = express();
const mongoUrl = process.env.DB_URL;

if (!mongoUrl) {
  throw new Error("DB_URL is not defined in .env");
}
mongoose.connect(mongoUrl);

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('Erreur de connexion à MongoDB:', err);
});

db.once('open', () => {
  console.log('Connecté à MongoDB');
});

app.use(cors());
app.use(express.json());

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/auth', authRouter);
app.use('/utilisateur', utilisateurRouter);
app.use('/demande-conge',demandeConge)
app.use('/Jour-ferie',jourFerieRouter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});