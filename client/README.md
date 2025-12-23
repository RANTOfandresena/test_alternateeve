# Structure du projet client (React + Vite + TypeScript)

Ce document décrit en détail l'architecture et les fichiers importants du dossier `client` de ce projet.

## Vue d'ensemble

Le client est une application React écrite en TypeScript et construite avec Vite. Elle utilise Tailwind CSS pour le style et PostCSS, et centralise l'état via un store (présence de `authSlice.ts` suggère Redux Toolkit). Le code est organisé pour séparer clairement les responsabilités : API, composants, pages, hooks, slices d'état et utilitaires.

## Commandes courantes (exécuter depuis `client/`)

- Installer les dépendances : `npm install`
- Lancer le serveur de développement : `npm run dev`
- Construire pour la production : `npm run build`

Consultez `package.json` pour la liste exacte des scripts disponibles.

## Fichiers racine importants

- `index.html` : page HTML d'entrée.
- `vite.config.ts` : configuration Vite (alias, plugins, proxy si présents).
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` : configuration TypeScript.
- `postcss.config.cjs` et `tailwind.config.js` : configuration Tailwind/PostCSS.
- `package.json` : dépendances et scripts.
- `public/` : fichiers statiques (ex: `vite.svg`).

## Structure détaillée du dossier `src/`

- `main.tsx`
  - Point d'entrée React. Monte l'application, injecte le `Provider` du store et démarre le router.

- `App.tsx`
  - Composant racine qui configure le routage et le layout global (Header, Nav, guards...).

- `index.css`
  - Styles globaux et import des directives Tailwind (`@tailwind base; @tailwind components; @tailwind utilities;`).

- `store.ts`
  - Configuration du store (ex: Redux Toolkit) et enregistrement des slices (ex: `authSlice`).

- `vite-env.d.ts`
  - Déclarations spécifiques à Vite pour TypeScript.

### `src/api/`

- Contient la logique d'accès au backend via Axios.
- `axiosInstance.ts` : instance Axios configurée (baseURL, interceptors pour JWT, gestion des erreurs).
- `auth.ts`, `demandeConge.ts`, `jourFerie.ts`, `utilisateur/utilisateur.ts` : foncteurs d'API pour chaque ressource.

Conseil : vérifier `axiosInstance.ts` pour connaître la variable d'environnement attendue (ex: `import.meta.env.VITE_API_URL`).

### `src/components/`

- Composants réutilisables et fragments d'UI :
  - `AppHeader.tsx`, `AppNav.tsx` — layout global
  - `AuthContainer.tsx` — wrapper pour les pages d'auth
  - `RouteGuard.tsx` — protection des routes selon l'auth/roles
  - `DemandeCongeForm.tsx`, `DemandeCongeList.tsx` — composants métier
  - `conge/` — composants dédiés au workflow des congés
  - `elements/` — petits composants UI (CalendrierConge, DataTable, Modal, LoadingOverlay, FilterBar, etc.)
  - `layout/` — layouts de pages (HomeLayout, PannelContainner, DetailCongeList)

Ces composants sont conçus pour être réutilisables et découplés du business logic.

### `src/features/`

- Contient les slices du store (ex : `authSlice.ts`) — logique d'état centralisée (utilisateur, token, statuts, actions asynchrones).

### `src/pages/`

- Pages routables de l'application :
  - Auth & profil : `Login.tsx`, `Register.tsx`, `GoogleAuth.tsx`, `ProfilUser.tsx`
  - Sous-dossiers `employe/` et `manager/` avec pages spécifiques (`Home.tsx`, `Demande.tsx`, `Calendrier.tsx`, `Profil.tsx`, `Regle.tsx`, `Employer.tsx`)
  - `RouterEmploye.tsx` — routeur spécifique pour les vues employé (si présent)

### `src/utils/`

- Helpers et utilitaires : `date.ts`, `statistiquesUtils.ts`, `type.ts` (types/interfaces partagées).

### `src/assets/`

- Images et ressources (ex : `react.svg`).

## Flux type d'une action utilisateur

1. L'utilisateur effectue une action dans l'UI (formulaire, bouton).
2. Le composant appelle une fonction d'API (`src/api/*`) ou dispatch une action Redux.
3. `axiosInstance` ajoute automatiquement le token et gère les erreurs via des interceptors.
4. Les données retournées sont dispatchées dans le store ou gérées localement.
5. Les composants se re-rendent selon l'état mis à jour.

## Variables d'environnement recommandées

- VITE_API_URL — URL de l'API backend
- VITE_GOOGLE_CLIENT_ID — client id Google si l'auth Google est utilisée
- AUTRES — vérifier `vite.config.ts` et `src/api/` pour d'autres usages

Il y a un fichier `.env.example` à la racine du `client/` listant ces variables.


