import type FAQLocale from './faq.d';

const fr: FAQLocale = {
  title: 'Foire Aux Questions (FAQ)',
  description: 'Trouvez des réponses aux questions courantes sur le service de traitement de données siftbeam.',
  categories: {
    service: {
      title: 'Aperçu du Service',
      items: [
        {
          question: 'Qu\'est-ce que siftbeam?',
          answer: 'siftbeam est un service B2B de traitement de données pour les entreprises. Nous fournissons des flux de travail de traitement de données personnalisables pour chaque client, permettant la transformation, le traitement et la gestion automatisés des fichiers sur une infrastructure cloud sécurisée.'
        },
        {
          question: 'À quels types d\'entreprises convient-il?',
          answer: [
            'Idéal pour:',
            '• Les entreprises nécessitant un traitement de données personnalisé',
            '• Les sociétés ayant des besoins complexes de transformation de données',
            '• Les organisations recherchant des solutions évolutives de traitement de données',
            '• Les entreprises nécessitant des flux de travail de données sécurisés basés sur le cloud'
          ]
        },
        {
          question: 'En quoi siftbeam diffère-t-il des autres services de traitement de données?',
          answer: [
            'Caractéristiques principales:',
            '• Personnalisation par client: Contrairement aux outils génériques, siftbeam offre des flux de travail entièrement personnalisables',
            '• Fiabilité de niveau entreprise: Construit sur une infrastructure cloud éprouvée',
            '• Pas de verrouillage fournisseur: Formats de données standard et API ouvertes',
            '• Tarification transparente: Payez uniquement ce que vous utilisez'
          ]
        }
      ]
    },
    features: {
      title: 'Fonctionnalités et Spécifications',
      items: [
        {
          question: 'Quelles fonctionnalités sont disponibles?',
          answer: [
            'Fonctionnalités principales:',
            '• Gestion flexible des données: Téléchargement et gestion de fichiers basés sur des politiques',
            '• Surveillance et contrôle de l\'utilisation: Surveillance en temps réel avec notifications et restrictions automatiques',
            '• Analyse des résultats de traitement: Métriques détaillées et rapports pour l\'optimisation opérationnelle',
            '• Stockage sécurisé des fichiers: Traitement de fichiers cryptés avec conservation automatique d\'1 an',
            '• Support multilingue: Disponible en 9 langues (japonais, anglais, chinois, coréen, français, allemand, espagnol, portugais, indonésien)'
          ]
        },
        {
          question: 'Combien de temps les données sont-elles stockées?',
          answer: 'Les données téléchargées sont automatiquement stockées pendant 1 an après le traitement. Les données sont automatiquement supprimées après 1 an. Aucun frais de stockage supplémentaire ne s\'applique.'
        },
        {
          question: 'Quels formats de données sont pris en charge?',
          answer: 'Nous prenons en charge les principaux formats de données, notamment CSV, JSON, etc. Comme nous offrons une personnalisation par client, veuillez nous contacter si vous avez besoin d\'un support de format spécifique.'
        },
        {
          question: 'Dans quelle mesure le traitement des données est-il personnalisable?',
          answer: 'Entièrement personnalisable pour chaque client. Vous pouvez créer des flux de travail de traitement de données complexes et définir de manière flexible les règles de traitement à l\'aide de politiques.'
        }
      ]
    },
    pricing: {
      title: 'Tarification et Paiement',
      items: [
        {
          question: 'Quelle est la structure tarifaire?',
          answer: [
            'Tarification à l\'usage:',
            '• Frais de traitement des données: 0,00001 $ par octet (0,001 cent par octet)',
            '• Stockage d\'1 an inclus: Aucun frais supplémentaire',
            '• Pas de frais initiaux: Pas de frais de configuration ni de frais minimum',
            '• Facturation mensuelle: Utilisation du 1er au dernier jour du mois, facturée le 1er du mois suivant',
            '',
            'Exemples de tarification:',
            '• Petit fichier (100B): 0,001 $',
            '• Gros fichier (2 Mo × 3 fichiers = 6 291 456 B): 62,91 $'
          ]
        },
        {
          question: 'Quels modes de paiement sont disponibles?',
          answer: 'Paiement par carte de crédit uniquement (via Stripe). La devise est USD. Les frais mensuels sont automatiquement facturés le 1er de chaque mois pour l\'utilisation du mois précédent.'
        },
        {
          question: 'Y a-t-il un essai gratuit?',
          answer: 'Nous n\'offrons actuellement pas d\'essai gratuit. Avec notre tarification à l\'usage, vous ne payez que ce que vous utilisez. Il n\'y a pas de frais d\'utilisation minimum.'
        },
        {
          question: 'Les prix peuvent-ils changer?',
          answer: 'Les prix peuvent changer avec un préavis raisonnable. Veuillez consulter la page de tarification pour les dernières informations.'
        }
      ]
    },
    security: {
      title: 'Sécurité et Conformité',
      items: [
        {
          question: 'Comment la sécurité des données est-elle assurée?',
          answer: [
            'Nous mettons en œuvre les mesures de sécurité suivantes:',
            '• Authentification: Système d\'authentification sécurisé avec support de l\'authentification multifacteur (MFA)',
            '• Chiffrement: TLS pour les données en transit, AES-256 pour les données au repos',
            '• Contrôle d\'accès: Contrôle d\'accès basé sur les rôles selon le principe du moindre privilège',
            '• Journaux d\'audit: Enregistrement de journaux d\'audit inviolables',
            '• Gestion des vulnérabilités: Surveillance continue de la sécurité et réponse aux vulnérabilités'
          ]
        },
        {
          question: 'Où les données sont-elles stockées?',
          answer: 'Les données sont stockées sur une infrastructure cloud de niveau entreprise. Toutes les données sont cryptées et gérées sous des contrôles d\'accès stricts.'
        },
        {
          question: 'Qu\'en est-il de la conformité?',
          answer: [
            'Nous nous conformons aux réglementations suivantes sur la protection des données:',
            '• RGPD: Conforme au Règlement Général sur la Protection des Données de l\'UE',
            '• CCPA/CPRA: Conforme aux lois californiennes sur la confidentialité',
            '• Loi japonaise: Conforme à la loi sur la protection des informations personnelles',
            '• Transfert international de données: Mesures de protection appropriées telles que les clauses contractuelles types (CCT) de l\'UE',
            '',
            'Nous fournissons une politique de confidentialité complète et un accord de traitement des données (DPA). Veuillez consulter notre politique de confidentialité pour plus de détails.'
          ]
        }
      ]
    },
    support: {
      title: 'Support et Autres',
      items: [
        {
          question: 'Comment puis-je obtenir de l\'aide?',
          answer: [
            'Options de support:',
            '• Méthode de contact: Support par chat (disponible via le tableau de bord du service)',
            '• Langues: Support en 9 langues (japonais, anglais, chinois, coréen, français, allemand, espagnol, portugais, indonésien)',
            '• Temps de réponse: Répond généralement dans les 3 jours ouvrables',
            '• Heures d\'ouverture: Heure standard du Japon (JST)'
          ]
        },
        {
          question: 'Comment commencer?',
          answer: [
            'Commencez en 3 étapes simples:',
            '1. Inscrivez-vous (https://siftbeam.com/fr/signup/auth)',
            '2. Téléchargez vos fichiers de données',
            '3. Configurez votre flux de travail de traitement',
            '4. Surveillez le traitement en temps réel',
            '5. Téléchargez les résultats traités'
          ]
        },
        {
          question: 'Une API est-elle fournie?',
          answer: 'Oui, nous fournissons des API pour le téléchargement de données et la gestion du traitement. Une documentation détaillée et des exemples de code sont disponibles après l\'inscription.'
        }
      ]
    }
  }
};

export default fr;

