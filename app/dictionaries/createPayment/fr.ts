import type { CreatePaymentLocale } from './createPayment.d.ts';

const fr: CreatePaymentLocale = {
  label: {
    back: "Retour",
    submit: "Envoyer",
    loading: "Chargement…",
    paymentSetupTitle: "Configuration du moyen de paiement",
    cardInfoLabel: "Informations de carte",
    expiryLabel: "MM/AA",
    cvcLabel: "Cryptogramme visuel",
    apply: "Appliquer",
    processing: "Traitement…",
    goToMyPage: "Aller à Ma page",
    accountCreation: "Création de compte",
    companyInfo: "Informations de l'entreprise",
    adminSetup: "Configuration administrateur",
    paymentSetup: "Configuration du paiement",
    paymentMethodSaved: "✓ Moyen de paiement enregistré avec succès",
    defaultPaymentMethodSet: "Cette carte a été définie comme moyen de paiement par défaut.",
    subscriptionCreated: "✓ Abonnement créé avec succès",
    automaticBillingEnabled: "La facturation automatique basée sur l'utilisation est maintenant activée.",
    saveInfoDescription: "Enregistrez vos informations en toute sécurité pour des achats en un clic à l'avenir",
    linkCompatibleStores: "Payez rapidement dans les boutiques compatibles Link, y compris Soundbox par défaut.",
    cardInfoEncrypted: "Les informations de carte sont chiffrées et stockées en toute sécurité.",
    billingBasedOnUsage: "La facturation réelle aura lieu ultérieurement en fonction de l'utilisation.",
    dataRetentionNotice: "Les données traitées seront stockées gratuitement pendant 1 an puis automatiquement supprimées",
    authenticationFlowDescription: "Pour des raisons de sécurité, l'authentification de la carte peut être requise.",
    authenticationFlowSteps: "Si l'authentification est requise, l'écran d'authentification de votre banque s'affichera. Veuillez terminer l'authentification.",
    agreeNoticePrefix: "En validant l'inscription, vous acceptez les ",
    and: " et la ",
    agreeNoticeSuffix: ".",
    terms: "Conditions d'utilisation",
    privacy: "Politique de confidentialité"
  },
  alert: {
    expiryRequired: "Veuillez saisir correctement la date d'expiration",
    cvcRequired: "Veuillez saisir correctement le cryptogramme visuel",
    cardInfoRequired: "Les informations de carte ne sont pas saisies",
    setupIntentFailed: "Échec de la création du Setup Intent",
    paymentMethodFailed: "Échec de la création du moyen de paiement",
    unknownError: "Une erreur inconnue est survenue",
    customerInfoNotFound: "Impossible de récupérer les informations client.",
    defaultPaymentMethodFailed: "Échec de la définition par défaut, mais l'enregistrement de la carte est terminé",
    authenticationRequired: "L'authentification de la carte est requise. Veuillez terminer l'authentification.",
    authenticationFailed: "L'authentification de la carte a échoué. Veuillez réessayer.",
    authenticationCancelled: "L'authentification de la carte a été annulée.",
    authenticationIncomplete: "L'authentification de la carte n'est pas terminée. Veuillez terminer l'authentification."
  }
};

export default fr;