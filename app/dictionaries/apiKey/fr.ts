import type { APIKeyLocale } from './apiKey.d';

const fr: APIKeyLocale = {
  title: 'Gestion des Clés API',
  actions: {
    create: 'Créer',
    edit: 'Modifier',
    delete: 'Supprimer',
    save: 'Enregistrer',
    cancel: 'Annuler',
    back: 'Retour',
  },
  table: {
    apiName: 'Nom API',
    description: 'Description',
    createdAt: 'Créé le',
    endpoint: 'Point de terminaison',
    actions: 'Actions',
  },
  modal: {
    title: 'Modifier la Clé API',
    apiName: 'Nom API',
    description: 'Description',
  },
  messages: {
    noData: 'Aucune donnée',
    updateFailed: 'Échec de la mise à jour',
    deleteFailed: 'Échec de la suppression',
    confirmDelete: 'Supprimer cette clé API ? Cette action ne peut pas être annulée.',
    createFailed: 'Échec de la création',
    idRequired: 'id est requis',
    deleteSuccess: 'Supprimé avec succès',
    functionNameNotSet: 'APIGW_KEY_ISSUER_FUNCTION_NAME n\'est pas défini',
    apiGatewayDeleteFailed: 'Échec de la suppression de la clé API Gateway',
    idAndApiNameRequired: 'id et apiName sont requis',
    updateSuccess: 'Mis à jour avec succès',
  },
  alerts: {
    adminOnlyCreate: 'Seuls les administrateurs peuvent créer',
    adminOnlyEdit: 'Seuls les administrateurs peuvent modifier',
    adminOnlyDelete: 'Seuls les administrateurs peuvent supprimer',
  },
  create: {
    title: 'Émettre une Clé API',
    fields: {
      apiName: 'Nom API',
      apiDescription: 'Description API',
      policy: 'Type API (Politique)',
    },
    submit: 'Émettre la Clé API',
    issuedNote: 'La clé n\'est affichée qu\'une seule fois. Sauvegardez-la en toute sécurité.',
    endpointLabel: 'Point de Terminaison de Téléchargement',
    instructions: 'Configurez ce qui suit sur votre appareil.',
    apiKeyHeaderLabel: 'Clé API (en-tête x-api-key)',
    uploadExampleTitle: 'Exemple de téléchargement (PowerShell / PNG)',
    csvNote: 'Pour CSV, définissez Content-Type sur text/csv. Ajustez pour d\'autres types de fichiers.',
    filePathNote: 'Spécifiez le chemin vers votre fichier',
  },
};

export default fr;


