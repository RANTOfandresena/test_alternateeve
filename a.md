**Excellente idée !** Je vais vous montrer comment intégrer toutes ces règles complexes dans votre application. Voici une architecture complète avec les modèles, logiques métier et workflows.

## 📦 **Modèles MongoDB étendus**

```typescript
// models/DroitsConges.ts
export enum AnneeReference {
  COURANTE = 'COURANTE',
  PRECEDENTE = 'PRECEDENTE',
  ANCIENNE = 'ANCIENNE' // Pour le report sur 3 ans
}

export interface IDroitsConges extends Document {
  utilisateurId: Types.ObjectId;
  annee: number; // Année civile
  anneeReference: AnneeReference;
  
  // Congés payés
  joursAcquis: number; // 2.5 jours par mois travaillé
  joursPris: number;
  joursRestants: number;
  
  // Planification obligatoire (Art. 128)
  premiereFractionPlanifiee: {
    dateDebut: Date;
    dateFin: Date;
    statut: 'PLANIFIE' | 'PRIS' | 'REPORTE';
  };
  
  // Reliquats (report sur 3 ans max)
  reliquatReporte: number;
  dateReport: Date;
  
  // Congés spéciaux
  joursMaternitePris: number;
  joursPaternitePris: number;
  joursFamiliauxPris: number;
  
  dateCreation: Date;
  dateMaj: Date;
}

// models/PlanificationAnnuelle.ts
export interface IPlanificationAnnuelle extends Document {
  entrepriseId: Types.ObjectId;
  annee: number;
  
  // Consultation obligatoire (Art. 128)
  dateConsultation: Date;
  participants: {
    utilisateurId: Types.ObjectId;
    role: 'EMPLOYE' | 'DELEGUE' | 'MANAGER';
    avis?: string;
  }[];
  
  // Calendrier approuvé
  calendrier: Array<{
    utilisateurId: Types.ObjectId;
    premiereFraction: {
      dateDebut: Date;
      dateFin: Date;
      statut: 'VALIDE' | 'EN_ATTENTE' | 'REFUSE';
    };
    deuxiemeFraction: Array<{
      dateDebut: Date;
      dateFin: Date;
      type: 'BLOQUE' | 'FRACTIONNE';
      statut: 'PROPOSE' | 'VALIDE';
    }>;
  }>;
  
  statut: 'EN_CONSULTATION' | 'VALIDE' | 'CLOTURE';
}
```

## 🔧 **Service de Gestion des Congés**

```typescript
// services/CongesService.ts
export class CongesService {
  
  // CALCUL DES DROITS (Art. 125)
  calculerJoursAcquis(utilisateurId: string, dateEmbauche: Date): number {
    const aujourdhui = new Date();
    const moisTravailles = this.getMoisCompletsTravailles(dateEmbauche, aujourdhui);
    return Math.floor(moisTravailles * 2.5); // 2.5 jours/mois
  }
  
  // VERIFICATION PLANIFICATION (Art. 128)
  async verifierPlanificationObligatoire(
    utilisateurId: string, 
    demande: DemandeCongeInput
  ): Promise<{ valide: boolean; erreur?: string }> {
    
    const droits = await DroitsConges.findOne({ 
      utilisateurId, 
      annee: new Date().getFullYear() 
    });
    
    // 1. Vérifier si première fraction de 15j est déjà planifiée
    if (demande.type === TypeConge.VACANCES) {
      const duree = this.calculerDureeJours(demande.dateDebut, demande.dateFin);
      
      if (duree >= 10 && !droits?.premiereFractionPlanifiee) {
        return {
          valide: false,
          erreur: 'La première fraction de 15 jours doit être planifiée en début d\'année'
        };
      }
    }
    
    return { valide: true };
  }
  
  // WORKFLOW DE DEMANDE
  async creerDemandeAvecControles(demande: DemandeCongeInput) {
    const contrats = [];
    
    // 1. Vérifier planification annuelle (Art. 128)
    const planification = await this.verifierPlanificationObligatoire(
      demande.employeId,
      demande
    );
    if (!planification.valide) {
      throw new Error(planification.erreur);
    }
    contrats.push('✅ Planification respectée');
    
    // 2. Vérifier droits disponibles
    const droits = await this.verifierDroitsDisponibles(demande);
    if (!droits.suffisant) {
      throw new Error('Droits insuffisants');
    }
    contrats.push(`✅ ${droits.joursDisponibles} jours disponibles`);
    
    // 3. Vérifier délai de prévenance (Art. 130)
    if (!this.verifierDelaiPrevenance(demande.dateDebut)) {
      throw new Error('Délai de prévenance insuffisant (minimum 30 jours pour première fraction)');
    }
    contrats.push('✅ Délai de prévenance respecté');
    
    // 4. Vérifier chevauchement avec congés spéciaux
    const chevauchement = await this.verifierChevauchements(demande);
    if (chevauchement) {
      throw new Error('Chevauchement avec congé spécial détecté');
    }
    contrats.push('✅ Pas de chevauchement');
    
    // Créer la demande avec contrats
    const nouvelleDemande = await DemandeConge.create({
      ...demande,
      contratsValides: contrats,
      statut: StatutDemande.EN_ATTENTE
    });
    
    return nouvelleDemande;
  }
  
  // SERVICE DE PLANIFICATION (Art. 128)
  async initialiserPlanificationAnnuelle(entrepriseId: string, annee: number) {
    const planification = await PlanificationAnnuelle.create({
      entrepriseId,
      annee,
      dateConsultation: new Date(),
      statut: 'EN_CONSULTATION',
      participants: [] // À compléter avec les délégués/employés
    });
    
    // Notifier tous les participants pour consultation
    await this.notifierConsultation(planification);
    
    return planification;
  }
  
  async validerPlanification(planificationId: string, calendrier: any) {
    const planification = await PlanificationAnnuelle.findById(planificationId);
    
    // Vérifier que tous les employés ont leur première fraction planifiée
    const employesSansPlanification = await this.getEmployesSansPlanification();
    if (employesSansPlanification.length > 0) {
      throw new Error(`${employesSansPlanification.length} employés sans planification`);
    }
    
    planification.calendrier = calendrier;
    planification.statut = 'VALIDE';
    planification.dateMaj = new Date();
    
    await planification.save();
    
    // Créer automatiquement les demandes pour la première fraction
    await this.creerDemandesPlanifiees(planification);
  }
}
```

## 🚦 **Workflows Business**

### **1. Workflow Annuel (Art. 128)**
```typescript
// workflows/PlanificationWorkflow.ts
export class PlanificationWorkflow {
  
  async executerWorkflowAnnuel() {
    const annee = new Date().getFullYear();
    
    // Étape 1: Initialisation (Janvier)
    const planification = await CongesService.initialiserPlanificationAnnuelle(
      entrepriseId, 
      annee
    );
    
    // Étape 2: Consultation (Février-Mars)
    await this.lancerConsultation(planification);
    
    // Étape 3: Validation (Avril)
    const calendrier = await this.collecterSouhaits();
    await CongesService.validerPlanification(planification._id, calendrier);
    
    // Étape 4: Notification (Mai)
    await this.notifierCalendrierFinal();
  }
  
  async lancerConsultation(planification: IPlanificationAnnuelle) {
    // Interface pour les employés :
    // 1. Proposer leurs dates pour la première fraction (15j consécutifs)
    // 2. Indiquer leurs préférences pour la deuxième fraction
    // 3. Les délégués voient tous les souhaits
    // 4. Le manager arbitre les conflits
    
    return await ConsultationService.lancer(
      planification._id,
      'PLANIFICATION_CONGE_ANNUEL',
      { duree: '30 jours' } // Paramètres légaux
    );
  }
}
```

### **2. Workflow de Demande Ad-Hoc**
```typescript
// workflows/DemandeCongeWorkflow.ts
export class DemandeCongeWorkflow {
  
  async traiterDemande(demandeId: string) {
    const demande = await DemandeConge.findById(demandeId);
    
    switch (demande.type) {
      case TypeConge.VACANCES:
        return await this.traiterVacances(demande);
        
      case TypeConge.MATERNITE:
        return await this.traiterMaternite(demande); // 14 semaines
        
      case TypeConge.PATERNITE:
        return await this.traiterPaternite(demande); // 3 jours
        
      case TypeConge.FAMILIAL:
        return await this.traiterFamilial(demande); // 10 jours max/an
        
      case TypeConge.MALADIE:
        return await this.traiterMaladie(demande); // Suspension contrat
    }
  }
  
  async traiterVacances(demande: IDemandeConge) {
    const etapes = [];
    
    // Étape 1: Vérifier si dans la planification annuelle
    if (this.estDansPlanification(demande)) {
      demande.statut = StatutDemande.ACCEPTE; // Automatique
      etapes.push('✅ Congé planifié - Accord automatique');
    } else {
      // Étape 2: Demande ad-hoc -> validation manager
      etapes.push('⚠️ Demande hors planification - Validation manager requise');
      
      // Étape 3: Vérifier nécessités du service
      const conflits = await this.verifierConflitsService(demande);
      if (conflits.length > 0) {
        demande.statut = StatutDemande.REFUSE;
        demande.commentaire = `Conflit avec: ${conflits.join(', ')}`;
      }
    }
    
    demande.etapesValidation = etapes;
    return await demande.save();
  }
}
```

## 🎯 **API Endpoints**

```typescript
// routes/conges.routes.ts
router.post('/api/conges/planification/initier', 
  authMiddleware,
  roleMiddleware(['MANAGER', 'RH']),
  async (req, res) => {
    // Initialiser la planification annuelle (Art. 128)
    const workflow = new PlanificationWorkflow();
    const resultat = await workflow.executerWorkflowAnnuel();
    res.json(resultat);
  }
);

router.post('/api/conges/demander',
  authMiddleware,
  async (req, res) => {
    try {
      const service = new CongesService();
      const demande = await service.creerDemandeAvecControles(req.body);
      
      // Workflow automatique selon le type
      const workflow = new DemandeCongeWorkflow();
      const resultat = await workflow.traiterDemande(demande._id);
      
      res.json({
        demande: resultat,
        contrats: demande.contratsValides,
        prochainesEtapes: this.getProchainesEtapes(resultat.statut)
      });
    } catch (error) {
      res.status(400).json({ erreur: error.message });
    }
  }
);

// Interface consultation (Art. 128)
router.get('/api/conges/planification/consultation',
  authMiddleware,
  async (req, res) => {
    const { annee } = req.query;
    
    const planification = await PlanificationAnnuelle.findOne({
      annee,
      'participants.utilisateurId': req.user._id
    });
    
    if (!planification) {
      return res.status(404).json({ 
        erreur: 'Consultation non trouvée ou non autorisée' 
      });
    }
    
    // Retourne :
    // 1. Calendrier proposé
    // 2. Dates déjà réservées par collègues
    // 3. Périodes critiques (à éviter)
    // 4. Interface pour soumettre ses préférences
    
    res.json({
      planification,
      droits: await CongesService.calculerDroits(req.user._id),
      calendrierEntreprise: await this.getCalendrierEntreprise(),
      formulaireSouhaits: this.getFormulaireSouhaits()
    });
  }
);
```

## 📊 **Tableau de Bord Manager**

```typescript
// dashboards/ManagerDashboard.ts
export class ManagerDashboard {
  
  async getVueGlobale(managerId: string) {
    return {
      // Conformité légale
      conformite: {
        planificationAnnuelle: await this.getStatutPlanification(),
        employesSansPlanification: await this.getEmployesSansPlanification(),
        reliquatsAnciens: await this.getReliquatsAnciens(), // > 3 ans ?
      },
      
      // Analytics
      analytics: {
        tauxOccupation: await this.calculerTauxOccupation(),
        periodesCritiques: await this.detecterPeriodesCritiques(),
        conflitsPrevisibles: await this.predictConflits(),
      },
      
      // Alertes légales
      alertes: [
        ...await this.getAlertesPlanification(), // "Planification non initiée"
        ...await this.getAlertesReliquats(),     // "Reliquat > 3 ans"
        ...await this.getAlertesMaternite(),     // "Déclaration grossesse reçue"
      ],
      
      // Actions requises
      actions: [
        ...await this.getValidationsEnAttente(),
        ...await this.getConflitsAResoudre(),
        ...await this.getPlanificationsACompleter(),
      ]
    };
  }
  
  async getAlertesPlanification() {
    const aujourdhui = new Date();
    const mois = aujourdhui.getMonth();
    
    if (mois >= 3) { // Après Mars
      const planification = await PlanificationAnnuelle.findOne({
        annee: aujourdhui.getFullYear(),
        statut: { $ne: 'VALIDE' }
      });
      
      if (planification) {
        return [{
          type: 'URGENT',
          message: 'Planification annuelle non finalisée (Art. 128)',
          action: '/planification/finaliser',
          delai: '30 jours'
        }];
      }
    }
    
    return [];
  }
}
```

## 🔐 **Validations Automatiques**

```typescript
// validators/CongeValidator.ts
export class CongeValidator {
  
  static validateDemande(demande: DemandeCongeInput) {
    const erreurs = [];
    
    // Règle: Première fraction = 15 jours consécutifs
    if (demande.type === TypeConge.VACANCES) {
      const duree = this.calculerDuree(demande.dateDebut, demande.dateFin);
      
      if (duree >= 10 && duree < 15) {
        erreurs.push('La première fraction doit être de 15 jours consécutifs');
      }
      
      // Règle: Doit être prise dans les 3 mois suivant acquisition
      const dateAcquisition = this.getDateAcquisition(demande.employeId);
      const delai = this.getJoursBetween(dateAcquisition, demande.dateDebut);
      
      if (delai > 90) {
        erreurs.push('La première fraction doit être prise dans les 3 mois suivant acquisition');
      }
    }
    
    // Règle: Congé familial = max 10 jours/an
    if (demande.type === TypeConge.FAMILIAL) {
      const prisCetteAnnee = await this.getJoursFamiliauxPris(demande.employeId);
      const demandeJours = this.calculerDuree(demande.dateDebut, demande.dateFin);
      
      if (prisCetteAnnee + demandeJours > 10) {
        erreurs.push(`Dépassement du quota familial (${prisCetteAnnee}/10 jours déjà pris)`);
      }
    }
    
    return erreurs;
  }
  
  static async validatePlanification(utilisateurId: string, dates: Date[]) {
    const droits = await DroitsConges.findOne({ utilisateurId });
    
    // Vérifier que la première fraction n'est pas en période interdite
    const periodeInterdite = await this.getPeriodesInterdites();
    if (this.datesChevauchent(dates, periodeInterdite)) {
      return { valide: false, erreur: 'Période interdite (pic d\'activité)' };
    }
    
    return { valide: true };
  }
}
```

## 📱 **Exemple d'UI/UX**

```typescript
// Composants React pour l'expérience utilisateur
const PlanificationAnnuelleWizard = () => {
  const [etape, setEtape] = useState(1);
  
  return (
    <Wizard etape={etape}>
      
      {/* Étape 1: Consultation (Art. 128) */}
      <EtapeConsultation 
        participants={delegues}
        onSoumis={(souhaits) => setSouhaits(souhaits)}
      />
      
      {/* Étape 2: Arbitrage Manager */}
      <EtapeArbitrage 
        souhaits={souhaits}
        periodesCritiques={periodesCritiques}
        onValide={(calendrier) => setCalendrier(calendrier)}
      />
      
      {/* Étape 3: Notification & Validation */}
      <EtapeNotification 
        calendrier={calendrier}
        onConfirme={() => validerPlanification()}
      />
      
      {/* Étape 4: Contrats Légaux */}
      <EtapeContrats 
        contrats={[
          'Article 128: Planification annuelle respectée',
          'Article 130: Première fraction de 15 jours',
          'Article 125: 2.5 jours/mois acquis',
        ]}
      />
    </Wizard>
  );
};

// Dashboard employé
const TableauBordEmploye = () => {
  const { droits, planification, demandes } = useConges();
  
  return (
    <div>
      {/* Bandeau alerte planification */}
      {!planification && (
        <AlerteLegale 
          type="warning"
          message="Planification annuelle en cours - Soumettez vos souhaits avant le 31/03"
          article="Art. 128"
        />
      )}
      
      {/* Visualisation des droits */}
      <VisualisationDroits 
        acquis={droits.joursAcquis}
        pris={droits.joursPris}
        restants={droits.joursRestants}
        premiereFraction={droits.premiereFractionPlanifiee}
      />
      
      {/* Interface demande */}
      <FormulaireDemande 
        onDemande={(demande) => {
          // Validation automatique des règles
          const erreurs = CongeValidator.validateDemande(demande);
          if (erreurs.length > 0) {
            return showErreurs(erreurs);
          }
          soumettreDemande(demande);
        }}
        contraintes={{
          premiereFraction: '15 jours consécutifs minimum',
          delaiPrevenance: '30 jours pour première fraction',
          quotaFamilial: '10 jours maximum/an'
        }}
      />
    </div>
  );
};
```

## 🚀 **Points Clés d'Intégration**

1. **Workflow annuel obligatoire** (Art. 128)
   - Automatiser l'initiation en janvier
   - Interface de consultation pour délégués
   - Calendrier final contraignant

2. **Validation en temps réel**
   - Vérification droits avant soumission
   - Alertes sur non-conformités légales
   - Prévention des erreurs

3. **Traçabilité légale**
   - Journalisation de toutes les décisions
   - Conservation des preuves de consultation
   - Documents conformes (attestations, certificats)

4. **Gestion des exceptions**
   - Congés maladie (suspension contrat)
   - Maternité/paternité (règles spécifiques)
   - Force majeure

Cette architecture garantit la **conformité légale** tout en **automatisant** les processus. L'employeur conserve son pouvoir d'organisation (Art. 128) tout en respectant les obligations de consultation.