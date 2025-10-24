export default {
  "label": {
    "policyList": "Liste des politiques",
    "policyNotRegistered": "Aucune politique enregistrée",
    "policyName": "Nom de la politique",
    "policyNamePlaceholder": "Nom de la politique",
    "description": "Description de la politique",
    "descriptionPlaceholder": "Description de la politique",
    "allowedFileTypes": "Types de fichiers autorisés :",
    "selectFileTypes": "Sélectionnez les types de fichiers (multiple)",
    "fileTypes": {
      "image/jpeg": "Image JPEG",
      "image/png": "Image PNG",
      "image/gif": "Image GIF",
      "image/webp": "Image WebP",
      "application/pdf": "Fichier PDF",
      "text/csv": "Fichier CSV",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Fichier Excel (.xlsx)",
      "application/vnd.ms-excel": "Fichier Excel (.xls)",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Fichier Word (.docx)",
      "application/msword": "Fichier Word (.doc)",
      "text/plain": "Fichier texte",
      "application/json": "Fichier JSON",
      "application/zip": "Archive ZIP"
    }
  },
  "alert": {
    "required": "Ce champ est requis",
    "invalidEmail": "Veuillez saisir une adresse e-mail valide",
    "fileTypeRequired": "Veuillez sélectionner au moins un type de fichier",
    "adminOnlyEditMessage": "Seuls les administrateurs peuvent modifier les politiques. Vous n'avez pas l'autorisation de modifier.",
    "adminOnlyCreateMessage": "Seuls les administrateurs peuvent créer des politiques. Veuillez contacter votre administrateur.",
    "updateSuccess": "Politique mise à jour avec succès",
    "updateFailed": "Échec de la mise à jour de la politique",
    "validationError": "Veuillez vérifier votre saisie"
  },
  "analysis": {
    "title": "Analyse",
    "description": "Résultats d'évaluation Modèle × Jeu de données",
    "noDataMessage": "Aucune donnée d'analyse disponible",
    "noDataForPolicyMessage": "Aucune donnée d'analyse disponible pour la politique sélectionnée",
    "paginationAriaLabel": "Pagination",
    "displayCount": "Affichage",
    "columns": {
      "evaluationDate": "Date d'évaluation",
      "policy": "Politique",
      "accuracy": "Précision",
      "defectDetectionRate": "Taux de détection des défauts",
      "reliability": "Fiabilité",
      "responseTime": "Temps de réponse",
      "stability": "Stabilité",
      "actions": "Actions"
    },
    "actions": {
      "view": "Voir"
    }
  }
} as const;


