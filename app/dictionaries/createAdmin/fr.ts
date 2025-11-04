import type { CreateAdminLocale } from './createAdmin.d.ts';

const fr: CreateAdminLocale = {
  label: {
    back: "Retour",
    submit: "Envoyer",
    loading: "Chargement…",
    createAdminTitle: "Créer un compte administrateur",
    userNameLabel: "Nom d’utilisateur",
    userNamePlaceholder: "John Doe",
    userNameDescription: "Veuillez saisir au moins 2 caractères",
    departmentLabel: "Service",
    departmentPlaceholder: "Service commercial",
    positionLabel: "Poste",
    positionPlaceholder: "Responsable",
    languageLabel: "Langue",
    languagePlaceholder: "Sélectionnez une langue",
    japanese: "Japonais",
    english: "Anglais",
    spanish: "Espagnol",
    french: "Français",
    german: "Allemand",
    korean: "Coréen",
    portuguese: "Portugais",
    indonesian: "Indonésien",
    chinese: "Chinois",
    createAdmin: "Créer un compte administrateur",
    creating: "Création…",
    accountCreation: "Création de compte",
    companyInfo: "Informations de l’entreprise",
    adminSetup: "Configuration administrateur",
    paymentSetup: "Configuration du paiement"
  },
  alert: {
    userNameRequired: "Veuillez saisir un nom d’utilisateur",
    userNameMinLength: "Le nom d’utilisateur doit contenir au moins 2 caractères",
    departmentRequired: "Veuillez saisir un service",
    positionRequired: "Veuillez saisir un poste",
    invalidAuthInfo: "Informations d’authentification invalides. Veuillez vous reconnecter.",
    adminCreationFailed: "Échec de la création du compte administrateur",
    networkError: "Une erreur réseau est survenue"
  }
};

export default fr;