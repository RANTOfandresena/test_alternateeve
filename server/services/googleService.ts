import { OAuth2Client } from "google-auth-library";
import { findOrCreateByEmail } from "../repository/utilisateurRepository";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "cle";
export const auth_2_client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID, 
    process.env.GOOGLE_CLIENT_SECRET, 
    process.env.URL_CLIENT,//'postmessage'
);

export const login = async (code: string) => {
  try {
    const { tokens } = await auth_2_client.getToken(code);

    const ticket = await auth_2_client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      throw new Error("Email Google introuvable");
    }

    const utilisateur = await findOrCreateByEmail(
      payload.email,
      payload.name
    );
    if (!utilisateur.isActive) throw new Error("Le compte n'est pas actif. Veuillez contacter l'administrateur.");

    const token = jwt.sign({ id: utilisateur._id }, JWT_SECRET);

    return {
      token,
      user: utilisateur
    };

  } catch (error) {
    console.error(error);
    throw new Error("Échec de l’authentification Google");
  }
};