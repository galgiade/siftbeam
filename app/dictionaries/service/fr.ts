import type { ServiceLocale } from './ServiceLocale.d.ts';

const fr: ServiceLocale = {
  page: {
    title: "Services",
    description:
      "Sélectionnez une politique, téléversez des fichiers et lancez le traitement. Les données traitées sont conservées gratuitement pendant un an.",
    loading: "Chargement..."
  },
  error: {
    title: "Une erreur est survenue",
    loginRequired: "Connexion requise.",
    processingHistoryFetchFailed: "Impossible de récupérer l'historique de traitement.",
    policiesFetchFailed: "Impossible de récupérer les politiques.",
    usageLimitsFetchFailed: "Impossible de récupérer les limites d'utilisation.",
    pageLoadFailed: "Impossible de charger la page de service.",
    suggestion1: "Veuillez recharger la page.",
    suggestion2: "Si le problème persiste, contactez le support."
  },
  limits: {
    notifyLimit: {
      title: "Limites de notification",
      limitValue: "Valeur limite :",
      exceedAction: "Action en cas de dépassement :",
      currentUsage: "Utilisation actuelle :",
      notSet: "Aucune limite de notification configurée",
      currentUsageLabel: "Utilisation actuelle :",
      settingsCount: "Limites de notification configurées : {count}",
      dataLimit: "Limite de données : {value} {unit} ({bytes})",
      amountLimit: "Limite de montant : ${amount}",
      noLimitValue: "Aucune valeur limite définie",
      amountConversionNote:
        "Remarque : la limite de montant est affichée convertie en utilisation de données (frais de traitement : 0,00001 $/octet, stockage d'un an inclus)."
    },
    restrictLimit: {
      title: "Limites de suspension",
      limitValue: "Valeur limite :",
      exceedAction: "Action en cas de dépassement :",
      currentUsage: "Utilisation actuelle :",
      notSet: "Aucune limite de suspension configurée",
      currentUsageLabel: "Utilisation actuelle :",
      settingsCount: "Limites de suspension configurées : {count}",
      dataLimit: "Limite de données : {value} {unit} ({bytes})",
      amountLimit: "Limite de montant : ${amount}",
      noLimitValue: "Aucune valeur limite définie",
      amountConversionNote:
        "Remarque : la limite de montant est affichée convertie en utilisation de données (frais de traitement : 0,00001 $/octet, stockage d'un an inclus)."
    },
    perMonth: "/mois",
    notifyAction: "Notifier",
    restrictAction: "Suspendre"
  },
  policySelection: {
    title: "Sélection de la politique",
    label: "Sélectionnez une politique de traitement",
    placeholder: "Sélectionner une politique",
    noPolicies: "Aucune politique disponible"
  },
  fileUpload: {
    title: "Téléversement de fichiers",
    selectPolicyFirst: "Veuillez d'abord sélectionner une politique",
    noPoliciesAvailable: "Aucune politique disponible",
    dragAndDrop: "Glissez-déposez les fichiers",
    orClickToSelect: "ou cliquez pour sélectionner",
    maxFiles: "Jusqu'à {max} fichiers, 100 Mo chacun",
    supportedFormats: "Formats pris en charge : utilisez les formats indiqués dans {formats}",
    selectedFiles: "Fichiers sélectionnés ({count}/{max})",
    deleteAll: "Tout supprimer",
    fileSizeLimit: "{name} est trop volumineux. Sélectionnez un fichier de 100 Mo ou moins.",
    pending: "En attente",
    uploading: "Téléversement en cours",
    completed: "Terminé",
    error: "Erreur",
    startProcessing: "Démarrer le traitement",
    processing: "Démarrage du traitement...",
    uploadComplete: "Téléversement terminé",
    uploadCompletedMessage: "{count} fichiers téléversés et traitement IA lancé !",
    uploadNotAllowed: "Téléversement non autorisé",
    notifyLimitReached: "Limite de notification atteinte",
    notifyLimitReachedMessage: "Limite de notification ({limit}) atteinte. {count} courriels de notification envoyés."
  },
  table: {
    id: "ID",
    userName: "Nom d'utilisateur",
    policyName: "Nom de la politique",
    usageAmountBytes: "Utilisation",
    status: "Statut",
    errorDetail: "Erreur",
    createdAt: "Date de début",
    updatedAt: "Date de mise à jour",
    download: "Télécharger",
    aiTraining: "Utilisation IA",
    delete: "Supprimer",
    ariaLabel: "Tableau de l'historique de traitement des données"
  },
  status: {
    in_progress: "En cours",
    success: "Terminé",
    failed: "Échec",
    canceled: "Annulé",
    deleted: "Supprimé",
    delete_failed: "Suppression échouée"
  },
  notification: {
    uploadSuccess: "Téléversement terminé. Le traitement des données va commencer.",
    uploadError: "Le téléversement a échoué.",
    uploadProcessingError: "Une erreur est survenue pendant le traitement du téléversement.",
    uploadFailed: "Échec du téléversement du fichier. Veuillez réessayer.",
    fetchFailed: "Impossible de récupérer les données.",
    aiTrainingChanged: "L'utilisation pour l'entraînement IA a été modifiée.",
    deleteCompleted: "Suppression du fichier terminée.",
    uploadCompleted: "Téléversement terminé.",
    uploadFailedGeneric: "Le téléversement a échoué.",
    dataFetchFailed: "Impossible de récupérer les données.",
    notificationSent: "Courriel de notification envoyé.",
    notificationFailed: "Échec de l'envoi de la notification.",
    notificationError: "Une erreur est survenue lors de l'envoi de la notification.",
    dataUpdated: "Données mises à jour."
  },
  filter: {
    userName: {
      placeholder: "Rechercher par nom d'utilisateur",
      ariaLabel: "Recherche par nom d'utilisateur"
    },
    policyName: {
      placeholder: "Rechercher par nom de politique",
      ariaLabel: "Recherche par nom de politique"
    },
    dateRange: {
      label: "Plage de dates",
      startDate: {
        placeholder: "Date de début",
        ariaLabel: "Sélection de la date de début"
      },
      endDate: {
        placeholder: "Date de fin",
        ariaLabel: "Sélection de la date de fin"
      },
      separator: "~"
    },
    minUsage: {
      label: "Utilisation minimale",
      placeholder: "Min",
      ariaLabel: "Utilisation minimale"
    },
    maxUsage: {
      label: "Utilisation maximale",
      placeholder: "Max",
      ariaLabel: "Utilisation maximale"
    },
    reset: "Réinitialiser les filtres",
    rangeSeparator: "~",
    refresh: "Actualiser les données",
    deleteSelected: "Supprimer les éléments sélectionnés"
  },
  policy: {
    select: "Sélectionner une politique",
    none: "Aucune politique n'a été créée.",
    create: "Créer une politique",
    noPolicies: "Aucune politique n'a été créée.",
    createPolicy: "Créer une politique"
  },
  deleteDialog: {
    title: "Confirmation de suppression",
    warn1: "Les fichiers sélectionnés seront supprimés de manière permanente.",
    warn2: "Une fois supprimés, les fichiers traités ne pourront plus être téléchargés.",
    warn3: "Ils ne pourront pas non plus être utilisés pour l'entraînement IA.",
    warn4: "Cette action est irréversible. Veuillez faire attention.",
    confirm: "Voulez-vous vraiment supprimer ? Saisissez \"DELETE\".",
    cancel: "Annuler",
    delete: "Supprimer"
  },
  limitUsage: {
    title: "État des limites d'utilisation",
    status: {
      normal: "Normal",
      warning: "Avertissement",
      exceeded: "Dépassé"
    },
    current: "Actuel :",
    limit: "Limite :",
    noLimit: "Aucune limite",
    exceedAction: {
      notify: "Notifier",
      restrict: "Restreindre"
    },
    testNotification: "Envoyer une notification de test",
    limitTypes: {
      usage: "Limite d'utilisation",
      amount: "Limite de montant"
    },
    unknownCompany: "Entreprise inconnue"
  },
  tableEmpty: "Aucun historique de traitement des données.",
  pagination: {
    prev: "Précédent",
    next: "Suivant"
  },
  displayCount: "Affichage de {shown} sur {total} (Total {all})",
  processingHistory: {
    title: "Historique de traitement",
    count: "({count} éléments)",
    refresh: "Actualiser",
    empty: "Aucun historique de traitement.",
    emptyDescription: "Téléversez des fichiers et lancez le traitement pour afficher l'historique ici.",
    noDownloadableFiles: "Aucun fichier téléchargeable.",
    noOutputFiles: "Aucun fichier de sortie téléchargeable.",
    downloadFailed: "Échec du téléchargement.",
    aiTrainingUpdateFailed: "Impossible de mettre à jour l'utilisation pour l'entraînement IA.",
    fileExpiredTooltip: "Le fichier a été supprimé car la période de stockage (1 an) est expirée.",
    unknownUser: "Utilisateur inconnu",
    allow: "Autoriser",
    deny: "Refuser",
    columns: {
      policy: "Politique",
      user: "Utilisateur",
      status: "Statut",
      startTime: "Heure de début",
      fileSize: "Taille du fichier",
      aiTraining: "Utilisation IA",
      errorDetail: "Détail de l'erreur",
      download: "Télécharger"
    }
  }
};

export default fr;