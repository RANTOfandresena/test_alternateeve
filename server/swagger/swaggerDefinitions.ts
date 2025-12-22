/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Utilisateur:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         nom:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [EMPLOYE, MANAGER]
 *         isActive:
 *           type: boolean
 *         soldeConge:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - nom
 *         - email
 *         - role
 * 
 *     DemandeConge:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         employeId:
 *           type: string
 *         dateDebut:
 *           type: string
 *           format: date
 *         dateFin:
 *           type: string
 *           format: date
 *         typeConge:
 *           type: string
 *           enum: [PAYE, SANS_SOLDE, MALADIE, MATERNITE, PATERNITE, AUTRE]
 *         statut:
 *           type: string
 *           enum: [EN_ATTENTE, ACCEPTE, REFUSE]
 *         motif:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     JourFerie:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *         nom:
 *           type: string
 *         pays:
 *           type: string
 * 
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 * 
 *   responses:
 *     UnauthorizedError:
 *       description: Accès non autorisé
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *     NotFoundError:
 *       description: Ressource non trouvée
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 * 
 * tags:
 *   - name: Auth
 *     description: Authentification des utilisateurs
 *   - name: Utilisateur
 *     description: Gestion des utilisateurs
 *   - name: DemandeConge
 *     description: Gestion des demandes de congé
 *   - name: JourFerie
 *     description: Jours fériés
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Créer un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               motDePasse:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [EMPLOYE, MANAGER]
 *             required: [nom, email, motDePasse]
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Utilisateur'
 *       400:
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authentifier un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               motDePasse:
 *                 type: string
 *             required: [email, motDePasse]
 *     responses:
 *       200:
 *         description: Token JWT retourné
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Identifiants invalides
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Authentification avec Google
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token JWT retourné
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Code invalide
 */

/**
 * @swagger
 * /utilisateur/me:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     tags: [Utilisateur]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Utilisateur'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /utilisateur:
 *   get:
 *     summary: Récupérer la liste des utilisateurs (Manager uniquement)
 *     tags: [Utilisateur]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numéro de la page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filtrer par rôle
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Rechercher par nom ou email
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filtrer par statut actif/inactif
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Utilisateur'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       403:
 *         description: Accès interdit (rôle non autorisé)
 */

/**
 * @swagger
 * /utilisateur/{id}/role:
 *   put:
 *     summary: Mettre à jour le rôle d'un utilisateur (Manager uniquement)
 *     tags: [Utilisateur]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [EMPLOYE, MANAGER]
 *             required: [role]
 *     responses:
 *       200:
 *         description: Rôle mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Utilisateur'
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /utilisateur/{id}:
 *   patch:
 *     summary: Mettre à jour un utilisateur (Manager uniquement)
 *     tags: [Utilisateur]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               update:
 *                 type: object
 *                 properties:
 *                   role:
 *                     type: string
 *                     enum: [EMPLOYE, MANAGER]
 *                   isActive:
 *                     type: boolean
 *                   soldeConge:
 *                     type: number
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Utilisateur'
 *       400:
 *         description: Erreur de validation
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /demande-conge:
 *   post:
 *     summary: Créer une nouvelle demande de congé
 *     tags: [DemandeConge]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DemandeConge'
 *             example:
 *               dateDebut: "2024-12-01"
 *               dateFin: "2024-12-05"
 *               typeConge: "PAYE"
 *               motif: "Vacances"
 *     responses:
 *       201:
 *         description: Demande créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DemandeConge'
 *       400:
 *         description: Erreur de validation
 */

/**
 * @swagger
 * /demande-conge/me:
 *   get:
 *     summary: Récupérer les demandes de congé de l'utilisateur connecté
 *     tags: [DemandeConge]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des demandes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DemandeConge'
 */

/**
 * @swagger
 * /demande-conge:
 *   get:
 *     summary: Récupérer toutes les demandes de congé (Manager uniquement)
 *     tags: [DemandeConge]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de toutes les demandes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DemandeConge'
 *       403:
 *         description: Accès interdit
 */

/**
 * @swagger
 * /demande-conge/{id}/accepter:
 *   patch:
 *     summary: Accepter une demande de congé (Manager uniquement)
 *     tags: [DemandeConge]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la demande
 *     responses:
 *       200:
 *         description: Demande acceptée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DemandeConge'
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Demande non trouvée
 */

/**
 * @swagger
 * /demande-conge/{id}/refuser:
 *   patch:
 *     summary: Refuser une demande de congé (Manager uniquement)
 *     tags: [DemandeConge]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la demande
 *     responses:
 *       200:
 *         description: Demande refusée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DemandeConge'
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Demande non trouvée
 */

/**
 * @swagger
 * /demande-conge/{id}:
 *   patch:
 *     summary: Mettre à jour une demande de congé
 *     tags: [DemandeConge]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la demande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dateDebut:
 *                 type: string
 *                 format: date
 *               dateFin:
 *                 type: string
 *                 format: date
 *               typeConge:
 *                 type: string
 *               motif:
 *                 type: string
 *     responses:
 *       200:
 *         description: Demande mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DemandeConge'
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Demande non trouvée
 */

/**
 * @swagger
 * /demande-conge/{id}:
 *   delete:
 *     summary: Supprimer une demande de congé
 *     tags: [DemandeConge]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la demande
 *     responses:
 *       204:
 *         description: Demande supprimée
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Demande non trouvée
 */

/**
 * @swagger
 * /demande-conge/dashboard-stats:
 *   get:
 *     summary: Récupérer les statistiques du tableau de bord (Manager uniquement)
 *     tags: [DemandeConge]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques du tableau de bord
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalDemandes:
 *                   type: integer
 *                 demandesEnAttente:
 *                   type: integer
 *                 demandesAcceptees:
 *                   type: integer
 *                 demandesRefusees:
 *                   type: integer
 *       403:
 *         description: Accès interdit
 */

/**
 * @swagger
 * /Jour-ferie/{year}:
 *   get:
 *     summary: Récupérer les jours fériés pour une année donnée
 *     tags: [JourFerie]
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: Année pour laquelle récupérer les jours fériés
 *     responses:
 *       200:
 *         description: Liste des jours fériés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/JourFerie'
 *       400:
 *         description: Année invalide
 *       500:
 *         description: Erreur serveur
 */