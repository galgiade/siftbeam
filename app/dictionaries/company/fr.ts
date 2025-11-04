import type { CompanyProfileLocale } from './company.d.ts';

const fr: CompanyProfileLocale = {
  alert: {
    updateSuccess: "Informations de l'entreprise mises à jour.",
    updateFail: "Échec de la mise à jour.",
    networkError: "Erreur réseau : {message}",
    required: "\"{label}\" est requis.",
    fetchCustomerFailed: "Échec de la récupération des informations client",
    customerNotFound: "Informations client introuvables",
    customerDeleted: "Ce compte client a été supprimé",
    adminOnlyEditMessage: "Seuls les administrateurs peuvent modifier les informations de l'entreprise. Veuillez contacter un administrateur si vous devez apporter des modifications.",
    invalidEmail: "Veuillez saisir une adresse e-mail valide",
    invalidPhone: "Veuillez saisir un numéro de téléphone valide",
    invalidPostalCode: "Veuillez saisir un code postal valide",
    nameTooLong: "Le nom de l'entreprise doit contenir 100 caractères ou moins",
    addressTooLong: "L'adresse doit contenir 200 caractères ou moins",
    validationError: "Il y a des problèmes avec la saisie. Veuillez vérifier.",
    fieldUpdateSuccess: "{fieldName} a été mis à jour avec succès.",
    fieldUpdateFail: "Échec de la mise à jour de {fieldName}.",
    updateError: "Une erreur s'est produite lors du processus de mise à jour.",
    fieldRequired: "{fieldLabel} est requis.",
    invalidEmailFormat: "Veuillez saisir une adresse e-mail valide.",
    invalidPhoneFormat: "Veuillez saisir un numéro de téléphone valide.",
    invalidPostalCodeFormat: "Veuillez saisir un code postal valide.",
    invalidCountryFormat: "Veuillez sélectionner un pays valide.",
    countryRequired: "Le pays est requis.",
    errorTitle: "Erreur",
    fetchError: "Une erreur s'est produite lors de la récupération des informations de l'entreprise."
  },
  label: {
    title: "Informations de l'entreprise",
    country: "Pays",
    countryPlaceholder: "Rechercher et sélectionner un pays",
    postal_code: "Code postal",
    state: "État/Province",
    city: "Ville",
    line2: "Nom du bâtiment",
    line1: "Adresse",
    name: "Nom de l'entreprise",
    phone: "Numéro de téléphone",
    email: "Adresse e-mail de facturation",
    notSet: "Non défini",
    generalUserPermission: "Permission utilisateur général",
    adminPermission: "Permission administrateur",
    adminPermissionDescription: "Vous pouvez modifier tous les champs des informations de l'entreprise",
    selectPlaceholder: "Sélectionner {label}"
  },
  placeholder: {
    postal_code: "ex. 75001",
    state: "ex. Île-de-France",
    city: "ex. Paris",
    line2: "ex. Bureau 100 (optionnel)",
    line1: "ex. 123 Rue de la Paix",
    name: "ex. Entreprise Exemple SARL",
    phone: "ex. +33-1-23-45-67-89",
    email: "ex. contact@exemple.fr",
    phoneExample: "ex. 90-3706-7654"
  },
  button: {
    cancel: "Annuler"
  }
};

export default fr;