# test_alternateeve — README

## Prérequis
- Node.js >= 20 et npm
- MongoDB (local ou MongoDB Atlas)
- Optionnel : compte Google OAuth si vous activez l’authentification Google

---
## Cloner le dépôt

1. Cloner le dépôt
```
git clone https://github.com/rantofandresena/test_alternateeve.git
```
ou via SSH :
```
git clone git@github.com:rantofandresena/test_alternateeve.git
```

2. Se placer dans le dossier du projet
```
cd test_alternateeve
```

## Backend (server)

1. Se placer dans le dossier backend
```
cd server
```

2. Installer les dépendances
```
npm install
```

3. Créer le fichier d’environnement `.env` (exemple)
```
PORT=3000
DB_URL=mongodb://127.0.0.1:27017/test_alternateeve
JWT_SECRET=YOUR_JWT_SECRET
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
URL_CLIENT=http://localhost:5173
```
Adapter les valeurs selon votre environnement (MongoDB Atlas, secrets, etc.). il y a une exemple dans le exemple dans le `.exemple.env`

4. Lancer en développement
```
npm run dev
```
Serveur par défaut : http://localhost:3000

5. Endpoints exemples
- `/auth`
- `/utilisateur`
- `/demande-conge`
- `/jour-ferie`

Documentation Swagger : http://localhost:3000/api-docs

---

## Frontend (client)

1. Se placer dans le dossier frontend (nouveau terminal)
```
cd client
```

2. Installer les dépendances
```
npm install
```

3. Créer ou mettre à jour `.env` pour Vite
```
VITE_API_URL=http://localhost:3000
```

4. Lancer en développement
```
npm run dev
```
Front par défaut : http://localhost:5173 (ou l’URL affichée par Vite)

---

## Démarrage simultané (2 terminaux)
Terminal A — backend :
```
cd server && npm run dev
```
Terminal B — frontend :
```
cd client && npm run dev
```

---

## Commandes utiles
- Construire le frontend pour la production
```
cd client && npm run build
```
- Lancer le serveur en production
```
cd server && npm start
```

---

Notes : adapter les URLs et secrets pour votre environnement (Docker, déploiement, variables d’environnement CI/CD).
