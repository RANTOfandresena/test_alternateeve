# Gestion des Congés

Ce projet permet de gérer les inscriptions des utilisateurs, les rôles (manager / employé) et les demandes de congés via une interface simple.

---

## Inscription et rôles

### Inscription du manager
- Le **manager** s’inscrit avec l’email défini dans le fichier `.env`.
- Cet utilisateur est **manager par défaut** après l’inscription.

### Activation des autres utilisateurs
- Les autres utilisateurs s’inscrivent normalement.
- Leur compte est **désactivé par défaut**.
- Pour activer un compte :
  - Aller dans le **menu Employés**
  - **Valider l’utilisateur** pour activer son compte

---

## Fonctionnalités côté Employé

Une fois connecté et activé, un employé peut :

- Faire une **demande de congé** si son solde est suffisant  
  - Les **week-ends** et **jours fériés** ne sont pas comptabilisés
- **Mettre à jour** une demande de congé
- **Annuler** une demande de congé
- Consulter le **calendrier** pour voir clairement toutes ses demandes de congé

---

## Fonctionnalités côté Manager

### Gestion des demandes
- Accéder au **menu Demandes**
- **Approuver ou refuser** les demandes de congé
- Utiliser des **filtres** pour faciliter la gestion

### Calendrier global
- Accéder au **menu Calendrier**
- Visualiser **toutes les demandes des employés**
- Identifier rapidement les jours avec trop de congés simultanés

### Gestion des employés
Dans le **menu Employés**, le manager peut :
- Ajouter du **solde de congé** à un employé si insuffisant
- Modifier les rôles :
  - Employé → Manager
  - Manager → Employé

---

## Objectif
Centraliser et simplifier la gestion des congés, avec une visibilité claire pour les employés et un contrôle total pour le manager.