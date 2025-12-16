import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRouter from './routes/auth';
import utilisateurRouter from './routes/utilisateur';
import demandeConge from './routes/demandeConge'
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { swaggerOptions } from './doc/swagger';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect('mongodb://127.0.0.1:27017/test_alternateeve');

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});