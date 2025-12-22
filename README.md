# test_alternateeve — README

## Prérequis
- Node.js >= 20 et npm
- MongoDB (local)
- Optionnel : compte Google OAuth si vous activez l’authentification Google

---
## Cloner le dépôt

1. Cloner le dépôt
```
git clone https://github.com/RANTOfandresena/test_alternateeve.git
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
DB_URL=mongodb://127.0.0.1:27017/test_alternateeve
JWT_SECRET=YOUR_JWT_SECRET 
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID # optionnel
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET # optionnel
URL_CLIENT=http://localhost:5173
EMAIL_USER=herimandrantofandresen@gmail.com #lors de l'inscription cette email est par defaut un MANAGER
```
Adapter les valeurs selon votre environnement (MongoDB Atlas, secrets, etc.). il y a une exemple dans le fichier `.exemple.env`

4. Lancer en développement
```
npm run dev
```
Serveur par défaut : http://localhost:3000

Documentation Swagger : http://localhost:3000/api-docs/ (tous les endpoint)

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