# Structure du projet serveur (Express + TypeScript)

Ce document décrit en détail l'architecture et les fichiers principaux du dossier `server` de ce projet.

## Vue d'ensemble

Le serveur est une application Express écrite en TypeScript. Le point d'entrée est `app.ts`. Le code est structuré en couches : routes, contrôleurs, services (logique métier), repository (accès aux données), modèles (types / schémas) et middlewares. Des fichiers de documentation Swagger sont présents pour générer l'API docs.

## Commandes de base

- Installer les dépendances : `npm install` (exécuter depuis `server/`).
- Lancer en développement (vérifier le `package.json` pour le script exact) : `npm run dev` ou `npm start`.
- Compiler TypeScript : `npm run build` (si présent dans `package.json`).

Vérifier `package.json` pour les scripts exacts définis dans le projet.

## Fichiers et dossiers importants

- `app.ts`
  - Point d'entrée de l'application Express. Configure les middlewares globaux, les routes et la connexion éventuelle à la base de données.

- `package.json`, `tsconfig.json`
  - Configuration des dépendances et options TypeScript.

- `controllers/`
  - Contient les controllers Express qui reçoivent les requêtes HTTP, appellent les services et renvoient les réponses.
  - Fichiers présents :
    - `authController.ts` : logique des endpoints d'authentification (login/register, JWT, etc.).
    - `authGoogleController.ts` : endpoints relatifs à l'authentification Google (OAuth/Google Sign-In).
    - `demandeCongeController.ts` : endpoints liés aux demandes de congé.
    - `JourFerieController.ts` : endpoints pour gérer les jours fériés.
    - `utilisateurController.ts` : endpoints CRUD / gestion pour les utilisateurs.

- `routes/`
  - Définition des routes et association aux controllers.
  - Fichiers présents : `auth.ts`, `demandeConge.ts`, `JourFerie.ts`, `utilisateur.ts`.

- `services/`
  - Contient la logique métier (règles applicatives, validations complexes, orchestration entre repositories et autres services).
  - Fichiers présents : `demandeCongeService.ts`, `googleService.ts`, `JourFerieService.ts`, `utilisateurService.ts`.

- `repository/`
  - Accès aux données (queries / ORM wrappers). Centralise les opérations CRUD sur les modèles.
  - Fichiers présents : `demandeCongeRepository.ts`, `JourFerieRepository.ts`, `utilisateurRepository.ts`.

- `models/`
  - Définitions des entités / schémas (Types ou schémas ORM). Exemples : `DemandeConge.ts`, `JourFerie.ts`, `Utilisateur.ts`.

- `middlewere/` (orthographe dans le projet)
  - Middlewares Express réutilisables (ex : `auth.ts` pour protéger les routes, extraction de token, vérification des rôles).

- `doc/` et `swagger/`
  - `doc/swagger.ts` et `swagger/swaggerDefinitions.ts` : configuration et définitions pour la documentation OpenAPI/Swagger de l'API.

## Documentation API

La documentation interactive de tous les endpoints est disponible via Swagger à l'adresse suivante : http://localhost:3000/api-docs/. Utilisez cette interface pour explorer les routes, consulter les schémas des endpoints directement.

## Flux d'une requête (exemple)

1. Une requête arrive sur une route définie dans `routes/*.ts`.
2. La route délègue au contrôleur correspondant dans `controllers/`.
3. Le contrôleur applique validations simples, puis appelle un service dans `services/`.
4. Le service orchestre la logique métier et accède aux données via `repository/`.
5. Les `repository` effectuent les opérations sur la base de données (ORM ou requêtes directes).
6. Le résultat remonte au controller, qui construit la réponse HTTP.

