// Dans votre fichier de configuration Express

const express = require('express');
const { OAuth2Client } = require('google-auth-library');
import * as GoogleService from "../services/googleService";

const router = express.Router();

// Vos identifiants Google Cloud

export const loginGoogle = async (req, res) => {
    try {
        const { code } = req.body;
        const result = await GoogleService.login(code) 
        res.json(result);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

