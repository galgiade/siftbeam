import type { UsageLimitLocale } from './usage-limit.d.ts';

const fr: UsageLimitLocale = {
  label: {
    // Commun
    save: "Enregistrer",
    cancel: "Annuler",
    edit: "Modifier",
    delete: "Supprimer",
    back: "Retour",
    add: "Ajouter",
    create: "Créer",
    creating: "Enregistrement...",
    update: "Mettre à jour",
    
    // Page de création
    createUsageLimitTitle: "Créer une limite d'utilisation",
    createUsageLimitDescription: "Configurez des limites de volume de traitement de données ou de dépenses, et sélectionnez l'action à prendre en cas de dépassement.",
    usageLimitSettings: "Paramètres de limite d'utilisation",
    exceedActionTitle: "Action en cas de dépassement",
    selectAction: "Sélectionner une action",
    notifyOnlyOption: "Notifier uniquement",
    restrictOption: "Suspendre le service",
    notifyOnlyDescription: "Un e-mail de notification sera envoyé lorsque la limite est dépassée. Le service restera disponible.",
    restrictDescription: "Le service sera suspendu lorsque la limite est dépassée. Un e-mail de notification sera également envoyé.",
    limitTypeTitle: "Type de limite",
    dataLimitOption: "Limite de données",
    amountLimitOption: "Limite de montant",
    dataLimitDescription: "Définir une limite basée sur le volume de traitement de données (Mo/Go/To).",
    amountLimitDescription: "Définir une limite basée sur le coût de traitement (USD).",
    dataLimitTitle: "Valeur de limite de données",
    enterLimitValue: "Entrer la valeur limite (ex: 100)",
    unit: "Unité",
    monthlyDataLimitDescription: "L'action sera exécutée lorsque le volume mensuel de traitement de données dépasse cette valeur.",
    amountLimitTitle: "Valeur de limite de montant",
    enterAmountValue: "Entrer la valeur limite (ex: 50)",
    monthlyAmountLimitDescription: "L'action sera exécutée lorsque le coût mensuel de traitement dépasse ce montant.",
    notificationSettingsTitle: "Paramètres de notification",
    enterEmailPlaceholder: "Entrer l'adresse e-mail (ex: exemple@entreprise.com)",
    notificationEmailList: "Adresses e-mail de notification",
    notificationEmailCount: "Adresses e-mail de notification ({count})",
    notifyOnlyEmailDescription: "Lorsque la limite est dépassée, une notification sera envoyée aux adresses e-mail configurées ici.",
    restrictEmailDescription: "Lorsque la limite est dépassée, le service sera suspendu et une notification sera envoyée aux adresses e-mail configurées ici.",
    cancelButton: "Annuler",
    createNotifyLimit: "Créer une limite de notification",
    createRestrictLimit: "Créer une limite de restriction",
    processingFeeOnly: "frais de traitement uniquement",
    conversionApproximate: "≈",

    // Écran principal
    limitUsageTitle: "Limites d'utilisation",
    usageLimitManagement: "Gestion des limites d'utilisation",
    usageLimitDescription: "Définissez des limites pour l'utilisation des données et les montants, et gérez les actions en cas de dépassement.",
    createLimit: "Créer une limite",
    notificationTarget: "Destinataire de notification",
    detail: "Détails",
    createdAt: "Créé le",
    updatedAt: "Mis à jour le",
    limitValue: "Valeur limite",
    notificationRecipients: "Destinataires de notification",

    // Types de notification
    notify: "Notifier",
    restrict: "Suspendre",
    exceedAction: "Action en cas de dépassement",
    notifyOnly: "Notifier uniquement",
    notifyLimit: "Limite de notification",
    restrictLimit: "Limite de suspension",
    notifyLimitDescription: "Lorsqu'une limite est définie, une notification est envoyée en cas de dépassement.",
    restrictLimitDescription: "Lorsqu'une limite est définie, le service est suspendu en cas de dépassement.",
    noNotifyLimits: "Aucune limite de notification configurée",
    noRestrictLimits: "Aucune limite de suspension configurée",

    // Montant et utilisation
    amount: "Montant",
    usage: "Utilisation",
    editTarget: "Cible de modification",
    limitType: "Type de limite",
    selectLimitType: "Sélectionner un type de limite",
    dataLimitValue: "Valeur de limite de données",
    amountLimitValue: "Valeur de limite de montant (USD)",
    dataLimitPlaceholder: "ex: 100",
    amountLimitPlaceholder: "ex: 50",
    orSeparator: "ou",
    noLimit: "Aucune limite",

    // Gestion des destinataires
    recipients: "Destinataires",
    emailAddress: "Adresse e-mail",
    emailPlaceholder: "Entrer une adresse e-mail",
    noRecipientsRegistered: "Aucun destinataire enregistré",
    addEmailAddress: "Adresse e-mail de notification",
    minOneEmailRequired: "Au moins une adresse e-mail de notification est requise.",

    // Créer / Modifier
    usageNotification: "Notification d'utilisation",
    selectNotifyOrRestrict: "Sélectionner notification ou restriction",
    selectNotificationMethod: "Sélectionner la méthode de notification",
    amountBasedNotification: "Notification basée sur le montant",
    usageBasedNotification: "Notification basée sur l'utilisation",
    enterAmount: "Entrer le montant",
    enterUsage: "Entrer l'utilisation",
    addNewRecipient: "Ajouter un nouveau destinataire",
    usageConversion: "Conversion d'utilisation",
    amountConversion: "Conversion de montant",
    createNewLimit: "Créer une nouvelle limite d'utilisation",
    editLimit: "Modifier la limite d'utilisation",
    dataLimit: "Limite de données",
    amountLimit: "Limite de montant",

    // Unités
    yen: "JPY",
    unitKB: "Ko",
    unitMB: "Mo",
    unitGB: "Go",
    unitTB: "To",
    usd: "USD",

    // Écran d'erreur
    errorOccurred: "Une erreur s'est produite",
    contactSupport: "Si le problème persiste, veuillez contacter le support."
  },
  alert: {
    // Validation
    amountRequired: "Veuillez entrer le montant d'utilisation",
    usageRequired: "Veuillez entrer le volume d'utilisation",
    emailRequired: "Veuillez entrer une adresse e-mail",
    invalidEmail: "Veuillez entrer une adresse e-mail valide.",
    enterPositiveAmount: "Entrez un nombre supérieur ou égal à 0",
    enterValidUsage: "Entrez un nombre supérieur à 0 et inférieur à 1024",
    enterPositiveDataLimit: "La valeur de limite de données doit être supérieure à 0.",
    enterPositiveAmountLimit: "La valeur de limite de montant doit être supérieure à 0.",
    emailAlreadyAdded: "Cette adresse e-mail a déjà été ajoutée.",
    minOneEmail: "Au moins une adresse e-mail de notification est requise.",
    selectExceedAction: "Veuillez sélectionner une action en cas de dépassement.",
    selectLimitType: "Veuillez sélectionner un type de limite.",
    dataLimitValueRequired: "La valeur de limite de données doit être supérieure à 0.",
    dataLimitValueMax: "La valeur de limite de données doit être de 1 000 000 ou moins.",
    amountLimitValueRequired: "La valeur de limite de montant doit être supérieure à 0.",
    amountLimitValueMax: "La valeur de limite de montant doit être de 100 000 ou moins.",
    minOneEmailRequired: "Veuillez entrer au moins une adresse e-mail de notification.",
    notifyLimitCreated: "La limite de notification a été créée avec succès.",
    restrictLimitCreated: "La limite de restriction a été créée avec succès.",
    errorPrefix: "Erreur:",
    unexpectedError: "Une erreur inattendue s'est produite:",

    // Résultats d'opération
    createFailed: "Échec de la création de la limite d'utilisation.",
    updateFailed: "Échec de la mise à jour de la limite d'utilisation.",
    sendingError: "Une erreur s'est produite lors de l'envoi.",
    savingInProgress: "Enregistrement...",
    createSuccess: "La limite d'utilisation a été créée avec succès.",
    updateSuccess: "La limite d'utilisation a été mise à jour avec succès.",
    deleteSuccess: "La limite d'utilisation a été supprimée avec succès.",
    deleteConfirm: "Supprimer cette limite d'utilisation?",

    // Permissions
    adminOnlyCreateMessage: "Seuls les administrateurs peuvent créer des limites d'utilisation. Veuillez contacter un administrateur.",
    adminOnlyEditMessage: "Seuls les administrateurs peuvent modifier les limites d'utilisation. Vous n'avez pas la permission.",
    adminOnlyDeleteMessage: "Seuls les administrateurs peuvent supprimer les limites d'utilisation. Vous n'avez pas la permission.",

    // Erreurs
    loginRequired: "Connexion requise.",
    unknownError: "Une erreur inconnue s'est produite."
  }
};

export default fr;
