import type PrivacyLocale from "./PrivacyLocale";

const fr: PrivacyLocale = {
  title: "Politique de confidentialité (incluant DPA) | siftbeam",
  intro:
    "La présente politique de confidentialité (la « Politique ») décrit la manière dont Connect Tech Inc. (la « Société ») traite les informations et données personnelles dans le cadre du service « siftbeam » (le « Service »). Elle est conforme au droit japonais, y compris la loi APPI. Les dispositions relatives à l'accord de traitement des données (DPA) figurent dans les annexes ci-dessous.",
  sections: {
    definitions: {
      title: "Définitions",
      items: [
        "Informations/données personnelles : telles que définies par l'APPI.",
        "Données utilisateur : données fournies par l'utilisateur à la Société (données brutes, journaux, instructions, métadonnées, etc.), pouvant inclure des informations personnelles.",
        "Données de sortie : résultats générés/traités par le Service (y compris les exports CSV).",
        "Traitement : toute opération telle que collecte, enregistrement, modification, conservation, utilisation, fourniture, suppression, etc.",
        "Sous-traitants/sous-traitants ultérieurs : prestataires mandatés par la Société (ex. : AWS, Stripe).",
      ],
    },
    company: {
      title: "Informations sur la Société",
      items: [
        "Dénomination : Connect Tech Inc.",
        "Adresse : Dias Wago 202, 315-1485 Wago-cho, Chuo-ku, Hamamatsu-shi, Shizuoka, Japon",
        "Représentant : Kazuaki Matsui",
        "Contact : connectechceomatsui@gmail.com",
      ],
    },
    dataCollected: {
      title: "Catégories de données collectées",
      items: [
        "Informations de compte (nom, e-mail, organisation, fonction, etc.)",
        "Authentification et journaux (ID d'authentification, journaux d'accès, adresse IP, informations sur l'appareil, cookies/technologies similaires)",
        "Informations de paiement (traitées via Stripe ; les données de carte sont gérées par Stripe)",
        "Données utilisateur (téléversements, données pour traitement/apprentissage, instructions)",
        "Échanges de support (contenu de chat)",
      ],
    },
    purposes: {
      title: "Finalités d'utilisation",
      items: [
        "Fourniture, exploitation, amélioration des fonctionnalités et de la qualité du Service (y compris entraînement, évaluation et réglage des modèles)",
        "Authentification, sécurité, traitement des incidents et analyse des journaux",
        "Facturation, émission de factures et prévention de la fraude",
        "Support (chat), notifications et mises à jour des politiques/conditions",
        "Création et publication de statistiques (uniquement sous une forme non identifiante)",
        "Conformité légale et protection des droits",
      ],
    },
    storageDeletion: {
      title: "Lieu de stockage, durée de conservation et suppression",
      paragraphs: [
        "Région de stockage : en principe, Japon (région de Tokyo). Les changements seront notifiés à l'avance.",
        "En cas de changement de région, notification au moins 30 jours à l'avance par e-mail et/ou via le service (sauf urgence/exigence légale).",
        "Durée de conservation : les données traitées sont conservées pendant 1 an puis supprimées automatiquement. L'utilisateur peut supprimer des données individuellement.",
        "Facturation & Paiement : Clôture mensuelle en fin de mois (utilisation du 1er au dernier jour du mois). Date d'émission de la facture : 1er du mois suivant. Date d'échéance du paiement : 15 du mois suivant.",
        "Suppression de compte : suppression logique sur demande et suppression définitive après 90 jours (sauvegardes susceptibles de nécessiter un délai supplémentaire).",
        "En cas d'incident technique : accès/utilisation des données limité au strict nécessaire pour l'analyse et la résolution ; suppression ou anonymisation rapide après résolution.",
      ],
    },
    thirdParties: {
      title: "Communication à des tiers, utilisation conjointe et sous-traitance",
      items: [
        "Communication à des tiers : pas sans consentement, sauf obligation légale.",
        "Sous-traitance : principaux sous-traitants AWS (infrastructure) et Stripe (paiements). Supervision appropriée assurée.",
        "Sous-traitance ultérieure : pas au-delà de ce qui précède sans l'autorisation préalable de l'utilisateur (en cas de maintenance/substitution inévitable, mesures de protection équivalentes ou plus strictes et notification rapide).",
        "Transferts internationaux : en raison notamment de Stripe, des traitements peuvent avoir lieu hors du Japon (par ex. États-Unis) ; des garanties légales seront appliquées.",
      ],
      paragraphs: [
        "En cas de transferts internationaux, la Société met en place des garanties appropriées telles que les clauses contractuelles types (SCC) de l'UE, l'IDTA/addendum SCC du Royaume-Uni et l'addendum FDPIC suisse (voir Annexe B).",
      ],
    },
    learningOptOut: {
      title: "Utilisation pour l'apprentissage et opt-out",
      items: [
        "Les données utilisateur peuvent être utilisées pour l'amélioration des modèles.",
        "Opt-out : exclusion possible au niveau du compte ou par « fichier traité ». Cela peut affecter la qualité.",
      ],
    },
    security: {
      title: "Sécurité",
      items: [
        "Mise en œuvre de mesures telles que contrôle d'accès, chiffrement en transit/au repos, séparation des rôles, journaux d'audit et gestion des vulnérabilités.",
        "Obligations de confidentialité et formation du personnel et des sous-traitants.",
        "En cas de violation grave, mesures prises et notification aux autorités/personnes concernées conformément à la loi.",
      ],
    },
    userRights: {
      title: "Droits des utilisateurs",
      paragraphs: [
        "Droit de demander l'accès, la rectification, l'ajout, la suppression, la suspension d'utilisation et l'arrêt de fourniture à des tiers (vérification d'identité requise). Contact : connectechceomatsui@gmail.com",
      ],
    },
    legalBasisAndRoles: {
      title: "Base légale et rôles (Responsable/Sous-traitant)",
      items: [
        "Pour les informations personnelles liées à la gestion de compte, à la facturation et à l'exploitation du Service, la Société agit en tant que « responsable » (équivalent).",
        "Pour les Données utilisateur confiées par le client (traitées dans le cadre des finalités du client), la Société agit en tant que « sous-traitant ».",
        "Lorsque les lois des États américains (CCPA/CPRA, etc.) s'appliquent, la Société respecte ses obligations en tant que « prestataire/sous-traitant » (voir Annexe C).",
        "Cette Politique est régie par le droit japonais ; lorsque des juridictions telles que l'UE/EEE s'appliquent, des mesures supplémentaires (ex. SCC) sont mises en œuvre si nécessaire.",
      ],
    },
    cookies: {
      title: "Cookies, analyses et surveillance des performances",
      paragraphs: [
        "Nous pouvons utiliser des cookies/technologies similaires pour l'ergonomie, la sécurité et l'analyse. Ils peuvent être désactivés dans le navigateur, mais certaines fonctionnalités peuvent être affectées.",
        "[Google Analytics] Nous utilisons Google Analytics pour améliorer notre service. Google Analytics utilise des cookies pour collecter des données sur le comportement des utilisateurs. Les données collectées sont gérées conformément à la politique de confidentialité de Google et les adresses IP sont anonymisées. Les informations collectées incluent les pages vues, la durée des sessions, le type d'appareil, le navigateur, le système d'exploitation, la localisation géographique (pays/ville) et le référent. Pour désactiver la collecte de données par Google Analytics, vous pouvez installer le module complémentaire de navigateur fourni par Google (https://tools.google.com/dlpage/gaoptout). Pour plus de détails, consultez la politique de confidentialité de Google (https://policies.google.com/privacy).",
        "[Vercel Analytics / Speed Insights] Nous utilisons Vercel Analytics et Vercel Speed Insights pour l'analyse d'accès et la mesure des performances respectueuses de la vie privée. Ces outils n'utilisent pas de cookies et ne collectent pas d'informations permettant d'identifier personnellement les utilisateurs (comme les adresses IP). Les informations collectées incluent le nombre de pages vues, le type d'appareil, la localisation géographique approximative (niveau pays), les informations de référent, le temps de chargement des pages et le temps de réponse aux interactions. Ces informations sont utilisées uniquement à des fins d'analyse statistique et ne peuvent pas identifier les individus. Ces outils sont conformes au RGPD et au CCPA.",
      ],
    },
    minors: {
      title: "Données des mineurs",
      paragraphs: [
        "En principe, l'utilisation du Service par des mineurs sans consentement parental n'est pas envisagée.",
      ],
    },
    policyChanges: {
      title: "Modifications de la Politique",
      paragraphs: [
        "Les modifications importantes seront notifiées à l'avance. L'utilisation continue après notification vaut acceptation des modifications.",
      ],
    },
    contact: {
      title: "Contact",
      paragraphs: [
        "Pour toute question relative au traitement des données personnelles : connectechceomatsui@gmail.com. Support par chat uniquement ; objectif : réponse sous trois jours ouvrables.",
      ],
    },
  },
  annexes: {
    annexA_DPA: {
      title: "Annexe A | Clauses de l'accord de traitement des données (DPA)",
      subsections: {
        roles: {
          title: "A-1. Rôles",
          paragraphs: [
            "Le client est le responsable ; la Société est le sous-traitant et traite les Données utilisateur conformément aux instructions du client.",
          ],
        },
        scope: {
          title: "A-2. Objet et portée",
          items: [
            "Objet : fourniture d'siftbeam, création/amélioration de modèles, génération de sorties, maintenance/support, sécurité, facturation.",
            "Données concernées : données personnelles soumises par le client (noms, identifiants, coordonnées, attributs, journaux, etc.).",
            "Personnes concernées : clients du client, utilisateurs, employés, etc.",
          ],
        },
        processorDuties: {
          title: "A-3. Obligations du sous-traitant",
          items: [
            "Traiter uniquement conformément aux instructions écrites (y compris électroniques) du client.",
            "Garantir la confidentialité.",
            "Maintenir des mesures de sécurité techniques et organisationnelles appropriées.",
            "En cas de demande reçue directement d'une personne concernée, transférer rapidement au client et coopérer.",
            "Notifier le client sans retard injustifié en cas de violation et coopérer aux mesures correctives.",
            "Coopérer aux audits/exigences de responsabilité du client dans des conditions de confidentialité/sécurité appropriées.",
            "À la fin du traitement, supprimer ou restituer les données personnelles selon le choix du client (sauf obligation légale de conservation).",
          ],
        },
        subProcessors: {
          title: "A-4. Sous-traitants ultérieurs",
          items: [
            "Sous-traitants existants : AWS (infrastructure), Stripe (paiements).",
            "Pas d'autres sous-traitants sans l'autorisation préalable du client ; en cas de substitution inévitable, garanties équivalentes/renforcées et notification préalable.",
            "Imposer des obligations de protection des données équivalentes à tous les sous-traitants.",
          ],
        },
        internationalTransfer: {
          title: "A-5. Transferts internationaux",
          paragraphs: [
            "En cas de traitement hors du Japon, la Société met en œuvre les garanties requises par la loi applicable (clauses contractuelles, notifications légales, etc.).",
          ],
        },
        retentionDeletion: {
          title: "A-6. Conservation et suppression",
          paragraphs: [
            "À la demande du client ou à la fin du contrat, suppression ou restitution des données personnelles dans un délai raisonnable ; écrasement/suppression sécurisée des sauvegardes.",
          ],
        },
        auditReporting: {
          title: "A-7. Audit et reporting",
          paragraphs: [
            "Le client peut réaliser des audits (revues documentaires, etc.) avec préavis raisonnable et dans un périmètre adapté ; la Société coopère.",
          ],
        },
        liability: {
          title: "A-8. Responsabilité",
          paragraphs: [
            "Le partage des responsabilités suit les Conditions d'utilisation et le présent DPA. En cas de faute intentionnelle ou de négligence grave (ex. : manquement de sécurité), la responsabilité de la Société est limitée conformément aux Conditions.",
          ],
        },
        learningInstruction: {
          title: "A-9. Instructions d'apprentissage",
          paragraphs: [
            "Le client peut préciser l'autorisation d'usage à des fins d'apprentissage au niveau du compte ou du fichier ; la Société s'y conforme.",
          ],
        },
      },
    },
    annexB_InternationalTransfer: {
      title: "Annexe B | Clauses de transfert international (SCC/Royaume-Uni/Suisse)",
      subsections: {
        applicability: {
          title: "B-1. Applicabilité",
          paragraphs: [
            "Pour les transferts depuis l'UE/EEE, adoption des SCC (2021/914).",
            "Modules : Responsable→Sous-traitant (Module 2) et Sous-traitant→Sous-traitant (Module 3), selon le besoin.",
            "Pour le Royaume-Uni : IDTA ou addendum SCC du Royaume-Uni ; pour la Suisse : addendum FDPIC.",
          ],
        },
        keyChoices: {
          title: "B-2. Choix clés (dans le texte des SCC)",
          items: [
            "Clause 7 (Docking Clause) : applicable.",
            "Clause 9 (Sous-traitant) : autorisation générale ; sous-traitants actuels (AWS, Stripe). Nouveaux/modifications notifiés ~15 jours à l'avance en principe.",
            "Clause 11 (Recours) : non applicable (sous réserve de la loi).",
            "Clause 17 (Droit applicable) : droit irlandais.",
            "Clause 18 (Juridiction) : tribunaux irlandais.",
          ],
        },
        dpa: {
          title: "B-3. Autorité de contrôle",
          paragraphs: [
            "Autorité chef de file envisagée : DPC irlandaise, sauf accord contraire.",
          ],
        },
        annexI: {
          title: "B-4. Annexe I (Détails du transfert)",
          items: [
            "Parties : exportateur de données (client), importateur de données (Société).",
            "Personnes concernées : clients du client, utilisateurs finaux, employés, etc.",
            "Catégories de données : identifiants, coordonnées, journaux comportementaux, transactions, instructions/métadonnées (selon les instructions du client).",
            "Catégories particulières : en principe non prévues ; accord préalable requis si applicable.",
            "Finalités : fourniture d'siftbeam, création/amélioration de modèles (opt-out possible), maintenance/sécurité, facturation, support.",
            "Durée de conservation : jusqu'à l'atteinte des finalités ; suppression/restitution après fin du contrat (sauf conservation légale).",
            "Fréquence : continue/ad hoc.",
          ],
        },
        annexII: {
          title: "B-5. Annexe II (Mesures techniques et organisationnelles)",
          items: [
            "Contrôles d'accès (moindre privilège, MFA, séparation des fonctions)",
            "Chiffrement (TLS en transit, AES-256 au repos)",
            "Gestion des clés (rotation, KMS)",
            "Journaux/audits (résistance à la falsification, alertes)",
            "Développement/Exploitation sécurisés (SDLC sécurisé, gestion des vulnérabilités, surveillance des dépendances)",
            "Disponibilité (sauvegardes, redondance intra-région, reprise après sinistre)",
            "Gestion des fournisseurs (évaluation/contrats des sous-traitants)",
            "Processus pour les droits des personnes concernées",
            "Réponse aux incidents (détection, confinement, analyse des causes, notification)",
          ],
        },
        annexIII: {
          title: "B-6. Annexe III (Sous-traitants)",
          items: [
            "AWS (infrastructure/hébergement, région de Tokyo principalement)",
            "Stripe (paiements)",
            "Ajouts : notification préalable et garanties équivalentes/renforcées.",
          ],
        },
        govRequests: {
          title: "B-7. Demandes gouvernementales",
          paragraphs: [
            "Sauf interdiction légale, notification rapide à l'exportateur ; examen de la légalité et minimisation de la portée ; rapports de transparence possibles.",
          ],
        },
        tia: {
          title: "B-8. TIA (évaluation de l'impact des transferts)",
          paragraphs: [
            "Le cas échéant, la Société coopère raisonnablement avec le TIA de l'exportateur et fournit les informations pertinentes.",
          ],
        },
      },
    },
    annexC_USStateLaw: {
      title: "Annexe C | Addendum droit des États américains (CCPA/CPRA, etc.)",
      subsections: {
        c1: {
          title: "C-1. Rôles et limitation de finalité",
          paragraphs: [
            "La Société agit en tant que « service provider/processor » et traite les informations personnelles uniquement aux fins commerciales du client.",
          ],
        },
        c2: {
          title: "C-2. Interdiction de vente/partage",
          paragraphs: [
            "La Société ne « vend » ni ne « partage » les informations personnelles (y compris la publicité comportementale inter-contexte).",
          ],
        },
        c3: {
          title: "C-3. Interdiction d'usage secondaire",
          paragraphs: [
            "Pas d'utilisation des informations personnelles à des fins propres à la Société (sauf usage statistique/anonyme autorisé).",
          ],
        },
        c4: {
          title: "C-4. Sécurité",
          paragraphs: [
            "Maintien d'une sécurité raisonnable et notification/assistance du client en cas de violation.",
          ],
        },
        c5: {
          title: "C-5. Coopération aux droits des consommateurs",
          paragraphs: [
            "Coopération raisonnable pour les demandes d'accès, de suppression, de rectification et d'opt-out ; respect des signaux GPC lorsque applicable.",
          ],
        },
        c6: {
          title: "C-6. Sous-traitants",
          paragraphs: [
            "Transfert des obligations équivalentes aux sous-traitants et notification raisonnable des changements.",
          ],
        },
        c7: {
          title: "C-7. Registres et audits",
          paragraphs: [
            "Tenue des registres nécessaires à la conformité CCPA/CPRA et coopération raisonnable aux audits du client.",
          ],
        },
      },
    },
  },
  appendix: {
    lastUpdated: "9 novembre 2025",
    company: {
      name: "Connect Tech Inc.",
      address: "Dias Wago 202, 315-1485 Wago-cho, Chuo-ku, Hamamatsu, Shizuoka, Japon",
      representative: "Kazuaki Matsui",
      contact: "connectechceomatsui@gmail.com",
    },
  },
};
export default fr;