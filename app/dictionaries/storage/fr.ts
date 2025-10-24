export default {
  "table": {
    "id": "ID",
    "userName": "Nom d'utilisateur",
    "policyName": "Nom de la politique",
    "usageAmountBytes": "Utilisation",
    "status": "Statut",
    "errorDetail": "Erreur",
    "createdAt": "Date de début",
    "updatedAt": "Date de mise à jour",
    "download": "Télécharger",
    "aiTraining": "Formation IA",
    "delete": "Supprimer",
    "ariaLabel": "Tableau d'historique de traitement des données"
  },
  "status": {
    "in_progress": "En cours",
    "success": "Terminé",
    "failed": "Échoué",
    "canceled": "Annulé",
    "deleted": "Supprimé",
    "delete_failed": "Échec de la suppression"
  },
  "notification": {
    "uploadSuccess": "Téléchargement de fichier terminé. Le traitement des données va commencer.",
    "uploadError": "Échec du téléchargement.",
    "uploadProcessingError": "Une erreur s'est produite lors du traitement du téléchargement.",
    "uploadFailed": "Échec du téléchargement de fichier. Veuillez réessayer.",
    "fetchFailed": "Échec de la récupération des données.",
    "aiTrainingChanged": "L'autorisation de formation IA a été modifiée.",
    "deleteCompleted": "Suppression de fichier terminée.",
    "uploadCompleted": "Téléchargement terminé.",
    "uploadFailedGeneric": "Échec du téléchargement.",
    "dataFetchFailed": "Échec de la récupération des données.",
    "notificationSent": "E-mail de notification envoyé avec succès.",
    "notificationFailed": "Échec de l'envoi de la notification.",
    "notificationError": "Une erreur s'est produite lors de l'envoi de la notification.",
    "dataUpdated": "Données mises à jour avec succès."
  },
  "filter": {
    "userName": {
      "placeholder": "Rechercher par nom d'utilisateur",
      "ariaLabel": "Recherche par nom d'utilisateur"
    },
    "policyName": {
      "placeholder": "Rechercher par nom de politique",
      "ariaLabel": "Recherche par nom de politique"
    },
    "dateRange": {
      "label": "Plage de dates",
      "startDate": {
        "placeholder": "Date de début",
        "ariaLabel": "Sélection de la date de début"
      },
      "endDate": {
        "placeholder": "Date de fin",
        "ariaLabel": "Sélection de la date de fin"
      },
      "separator": "~"
    },
    "minUsage": {
      "label": "Utilisation min.",
      "placeholder": "Min",
      "ariaLabel": "Utilisation minimale"
    },
    "maxUsage": {
      "label": "Utilisation max.",
      "placeholder": "Max",
      "ariaLabel": "Utilisation maximale"
    },
    "reset": "Réinitialiser les filtres",
    "rangeSeparator": "~",
    "refresh": "Actualiser les données",
    "deleteSelected": "Supprimer les éléments sélectionnés"
  },
  "policy": {
    "select": "Sélectionner une politique",
    "none": "Aucune politique n'a été créée.",
    "create": "Créer une politique",
    "noPolicies": "Aucune politique n'a été créée.",
    "createPolicy": "Créer une politique"
  },
  "deleteDialog": {
    "title": "Confirmation de suppression",
    "warn1": "Les fichiers sélectionnés seront définitivement supprimés.",
    "warn2": "Une fois supprimés, les fichiers traités ne peuvent plus être téléchargés.",
    "warn3": "De plus, ils ne peuvent plus être utilisés pour la formation IA.",
    "warn4": "Cette action ne peut pas être annulée. Veuillez faire attention.",
    "confirm": "Êtes-vous sûr de vouloir supprimer ? Veuillez taper 'SUPPRIMER'.",
    "cancel": "Annuler",
    "delete": "Supprimer"
  },
  "limitUsage": {
    "title": "Statut de limite d'utilisation",
    "status": {
      "normal": "Normal",
      "warning": "Avertissement",
      "exceeded": "Dépassé"
    },
    "current": "Actuel :",
    "limit": "Limite :",
    "noLimit": "Aucune limite",
    "exceedAction": {
      "notify": "Notifier",
      "restrict": "Restreindre"
    },
    "testNotification": "Envoyer une notification de test",
    "limitTypes": {
      "usage": "Limite d'utilisation",
      "amount": "Limite de montant"
    },
    "unknownCompany": "Entreprise inconnue"
  },
  "tableEmpty": "Aucun historique de traitement de données.",
  "pagination": {
    "prev": "Précédent",
    "next": "Suivant"
  },
  "displayCount": "Affichage de {shown} sur {total} (Tous {all})"
} as const;


