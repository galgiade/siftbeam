import type TermsLocale from "./TermsLocale";

const fr: TermsLocale = {
  title: "Conditions d'utilisation (siftbeam)",
  intro:
    "Les présentes conditions d'utilisation (les 'Conditions') régissent l'utilisation d'siftbeam (le 'Service') fourni par Connect Tech Inc. (la 'Société'). En utilisant le Service, l'utilisateur accepte ces Conditions.",
  sections: {
    definitions: {
      title: "Définitions",
      items: [
        "Service : création/amélioration de modèles d'IA à partir de données fournies par l'utilisateur, prédiction/regroupement/classification, création de statistiques, export de résultats (ex. CSV).",
        "Données utilisateur : données fournies par l'utilisateur à la Société (données brutes, métadonnées, journaux, instructions, etc.).",
        "Données de sortie : résultats générés/traités par le Service (y compris les exports CSV).",
        "Modèle : modèles d'IA créés/exploités/améliorés par la Société (caractéristiques, poids entraînés, prompts, pipelines, métriques).",
        "Facturation à l'usage : facturation selon volumes d'ingestion/traitement/stockage, etc.",
      ],
    },
    scopeChanges: {
      title: "Champ d'application et modifications",
      paragraphs: [
        "Les présentes s'appliquent à toutes les relations entre la Société et l'utilisateur concernant le Service.",
        "La Société peut modifier les Conditions et notifier les changements importants. L'utilisation après notification vaut acceptation.",
      ],
    },
    account: {
      title: "Compte",
      items: [
        "Maintenir des informations d'inscription exactes et à jour ; gérer les identifiants en toute sécurité.",
        "La Société n'est pas responsable d'une utilisation non autorisée sauf en cas de faute intentionnelle ou négligence grave.",
      ],
    },
    services: {
      title: "Description du service",
      paragraphs: [
        "La Société crée des modèles d'IA selon les besoins et effectue prédiction/regroupement/classification, ou crée des statistiques.",
        "En cas de fourniture continue de données, la Société peut améliorer les modèles à l'aide de ces données.",
        "Résultats exportés en CSV, etc. (format/éléments/fréquence selon spécifications).",
        "Ajout/modification/suspension de fonctionnalités ; fonctions bêta possibles.",
      ],
    },
    dataHandling: {
      title: "Traitement des données",
      subsections: {
        ownership: {
          title: "Propriété",
          items: [
            "Droits sur les Données utilisateur : utilisateur.",
            "Droits sur les Données de sortie : utilisateur (garantie de non-violation de droits de tiers).",
            "PI sur modèles/algorithmes/savoir-faire/templates : Société ou concédants.",
          ],
        },
        license: {
          title: "Licence",
          paragraphs: [
            "Droit mondial, gratuit, non exclusif d'utiliser les Données utilisateur pour fournir le Service, améliorer la qualité, entraîner/évaluer/ajuster les modèles, créer des statistiques. Données personnelles selon la Politique de confidentialité.",
            "Statistiques/indicateurs non identifiants : création/publication/utilisation autorisées.",
          ],
        },
        storageDeletion: {
          title: "Stockage et suppression",
          paragraphs: [
            "Région de stockage par défaut : Japon (Tokyo). Modifications notifiées 30 jours à l'avance en principe (e-mail et/ou in-app), sauf urgence/exigence légale.",
            "Suppression individuelle possible ; après demande de suppression de compte : suppression logique puis définitive après 90 jours (sauvegardes potentiellement ultérieures).",
          ],
        },
        incidents: {
          title: "Incidents",
          paragraphs: [
            "Pour le dépannage, accès/utilisation minimaux avec contrôle d'accès et journalisation d'audit ; suppression/anonymisation rapide après résolution.",
          ],
        },
        learningOptOut: {
          title: "Exclusion d'apprentissage",
          paragraphs: [
            "Opt-out au niveau du compte ou du fichier traité ; peut affecter qualité/précision.",
          ],
        },
      },
    },
    privacy: {
      title: "Données personnelles (Japon)",
      paragraphs: [
        "La Société traite les données personnelles contenues dans les Données utilisateur conformément à l'APPI et aux lois/directives applicables.",
      ],
      items: [
        "Finalités : service, exploitation/maintenance, réponses, amélioration qualité, sécurité, conformité.",
        "Sous-traitants : AWS (infrastructure) et Stripe (paiements) ; pas d'autres sans consentement préalable (sauf maintenance/substitution inévitables avec garanties équivalentes et notification).",
        "Transferts transfrontaliers avec garanties légales nécessaires.",
        "Sécurité : contrôle d'accès, chiffrement, journaux, séparation des rôles, gestion des vulnérabilités.",
        "Demandes via procédures de la Société (vérification d'identité).",
        "Conservation : suppression dans un délai raisonnable après finalité atteinte/fin du contrat (voir section 5).",
      ],
    },
    prohibited: {
      title: "Activités interdites",
      items: [
        "Violations des lois/bonnes mœurs ; atteintes aux droits des tiers.",
        "Envoi de données personnelles/sensibles sans base légale.",
        "Accès non autorisé, rétro-ingénierie, charge excessive, spam, malware.",
        "Atteinte à la réputation, fausses déclarations.",
        "Construction de services concurrents sans consentement écrit préalable.",
      ],
    },
    serviceChange: {
      title: "Modifications/Suspension",
      paragraphs: [
        "La Société peut modifier/interrompre/mettre fin au Service (maintenance, pannes, conformité, sécurité, force majeure).",
        "Sauf urgence, notification préalable dans une mesure raisonnable.",
      ],
    },
    fees: {
      title: "Frais/Facturation/Paiement (à l'usage)",
      subsections: {
        currencyUnit: {
          title: "Devise/Unité",
          items: [
            "Devise : USD (cent US).",
            "Mesure par octet. Calculé par octet.",
          ],
        },
        unitPrices: {
          title: "Tarifs",
          items: [
            "Traitement : 0,001 cent US/B.",
            "Stockage : 0,0001 cent US/B par mois.",
            "Sans palier gratuit, frais minimum ou d'installation.",
          ],
        },
        measurementMethod: {
          title: "Mesure",
          items: [
            "Traitement : total des téléversements mensuels incluant expansions temporaires, intermédiaires et réessais.",
            "Stockage : moyenne quotidienne ou maximum mensuel (valeur la plus élevée).",
          ],
        },
        billingPayment: {
          title: "Facturation/Paiement",
          items: [
            "Clôture : fin de mois ; Paiement : le 5 de chaque mois.",
            "Paiement : carte bancaire (via Stripe).",
            "Arrondis selon précision/unité minimale Stripe (règles de la Société).",
            "Taxes ajoutées selon la loi.",
            "Pas de remboursement pour services déjà fournis (sauf obligation légale).",
            "Intérêts de retard : 14,6 %/an.",
          ],
        },
        priceChange: {
          title: "Changements tarifaires",
          paragraphs: [
            "Préavis raisonnable ; application après notification.",
          ],
        },
      },
    },
    ipAndDeliverables: {
      title: "Propriété intellectuelle et livrables",
      paragraphs: [
        "La Société conserve les droits de PI sur les modèles, templates, scripts et workflows.",
        "Pendant la durée du contrat, l'utilisateur peut utiliser les Données de sortie à des fins professionnelles de manière non exclusive.",
        "Pour les modèles personnalisés, la Société peut utiliser des insights/poids/caractéristiques non identifiants pour améliorer d'autres services (l'accord spécifique prévaut le cas échéant).",
      ],
    },
    representations: {
      title: "Déclarations et garanties",
      paragraphs: [
        "L'utilisateur déclare disposer des autorisations/consentements/droits nécessaires sur les Données utilisateur, ne pas porter atteinte aux droits de tiers et respecter les lois applicables.",
        "Compte tenu de la nature de l'IA, la Société n'offre aucune garantie sur l'exactitude, l'exhaustivité, l'utilité, l'adéquation ou la reproductibilité des résultats.",
      ],
    },
    disclaimer: {
      title: "Clause de non-responsabilité",
      paragraphs: [
        "La Société n'est pas responsable des dommages résultant d'événements hors de son contrôle (catastrophes, pannes réseau/cloud, changements légaux, actes illicites de tiers).",
        "Les fonctionnalités bêta/expérimentales, codes exemples et valeurs recommandées sont fournis en l'état.",
      ],
    },
    liabilityLimit: {
      title: "Limitation de responsabilité",
      paragraphs: [
        "Sauf faute intentionnelle ou négligence grave, la responsabilité de la Société est limitée au total versé par l'utilisateur sur les 12 derniers mois.",
        "Exclusions : blessures corporelles, atteinte intentionnelle aux droits de PI, violation de confidentialité.",
      ],
    },
    thirdParty: {
      title: "Services tiers",
      paragraphs: [
        "Les services/API tiers intégrés (ex. AWS, Stripe) sont soumis à leurs conditions ; leurs changements/suspensions peuvent affecter certaines fonctions.",
      ],
    },
    confidentiality: {
      title: "Confidentialité",
      paragraphs: [
        "Chaque partie traite comme confidentielles les informations non publiques de l'autre, sans divulgation à des tiers ni usage hors finalité ; obligation survivant à la fin du contrat.",
      ],
    },
    support: {
      title: "Support",
      items: [
        "Support uniquement par chat ; pas d'appels téléphoniques/vidéo.",
        "Objectif de réponse : sous 3 jours ouvrables ; pas d'engagement d'horaires.",
      ],
    },
    termTermination: {
      title: "Durée/Résiliation",
      items: [
        "La prise d'effet débute à la demande ; résiliation via la procédure définie par la Société (résiliation du mois en cours sous réserve d'échéance interne).",
        "En cas de manquement grave, impayé ou lien avec des organisations antisociales, suspension/résiliation sans préavis possible.",
      ],
    },
    antisocialForces: {
      title: "Exclusion des organisations antisociales",
      paragraphs: [
        "Chaque partie déclare ne pas appartenir à de telles organisations ; en cas de violation, résiliation immédiate sans préavis.",
      ],
    },
    assignment: {
      title: "Interdiction de cession",
      paragraphs: [
        "Sans accord écrit préalable de la Société, aucune cession/constitution de sûreté sur la position contractuelle ou les droits/obligations.",
      ],
    },
    severabilityEntire: {
      title: "Divisibilité/Accord intégral",
      paragraphs: [
        "Si une clause est invalide/inapplicable, les autres restent en vigueur.",
        "Les présentes constituent l'accord intégral ; en cas de contrat spécifique, celui-ci prévaut.",
      ],
    },
    governingLawJurisdiction: {
      title: "Droit applicable/Juridiction",
      paragraphs: [
        "Droit japonais.",
        "Compétence exclusive : tribunal de district de Hamamatsu (première instance).",
      ],
    },
    notices: {
      title: "Notifications",
      paragraphs: [
        "Notifications via l'application, e-mail ou autres moyens appropriés.",
        "Contact utilisateur : connectechceomatsui@gmail.com.",
      ],
    },
  },
  appendix: {
    lastUpdated: "14 août 2025",
    company: {
      name: "Connect Tech Inc.",
      address: "Dias Wago 202, 315-1485 Wago-cho, Chuo-ku, Hamamatsu, Shizuoka, Japon",
      representative: "Kazuaki Matsui",
      contact: "connectechceomatsui@gmail.com",
    },
  },
};
export default fr;