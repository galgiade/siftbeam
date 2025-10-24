import type { FlowLocale } from './flow.d';

const fr: FlowLocale = {
  flow: {
    hero: {
      badge: 'Flux',
      title: 'Premiers pas – Étapes pour commencer',
      subtitle:
        'De l’inscription au téléchargement des données traitées, suivez ces 5 étapes simples.',
    },
    steps: {
      step1: {
        badge: 'ÉTAPE 1',
        tag: 'Commencer maintenant',
        title: 'Inscription',
        description:
          'Créez votre compte avec e‑mail et mot de passe. L’authentification est gérée de manière sécurisée.',
      },
      step2: {
        badge: 'ÉTAPE 2',
        tag: 'Nouvelle commande',
        title: 'Recueil des besoins',
        description:
          'Indiquez vos besoins d’analyse sur la page de nouvelle commande : objectifs, données utilisées, format de sortie.',
      },
      step3: {
        badge: 'ÉTAPE 3',
        tag: 'Environ 2 semaines',
        title: 'Paramétrage du traitement',
        description:
          'Nous concevons le flux de traitement optimal. Suivez l’avancement sur le tableau de bord.',
      },
      step4: {
        badge: 'ÉTAPE 4',
        tag: 'Après le paramétrage',
        title: 'Choisir le traitement et téléverser',
        description:
          'Sélectionnez le traitement souhaité et téléversez vos fichiers. Les gros fichiers sont pris en charge.',
      },
      step5: {
        badge: 'ÉTAPE 5',
        tag: 'Notification automatique',
        title: 'Terminé & téléchargement',
        description:
          'Vous serez notifié une fois le traitement terminé. Téléchargez les résultats ; une relance est possible si besoin.',
      },
    },
    notice:
      'Le délai est indicatif et peut varier selon la complexité et le volume des données. Votre interlocuteur vous guidera.',
    cta: {
      title: 'Commencer maintenant',
      description: 'Créez un compte et demandez votre analyse.',
      button: 'Aller à l’inscription',
    },
  },
};

export default fr;
