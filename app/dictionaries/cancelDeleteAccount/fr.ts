import type { CancelDeleteAccountLocale } from './cancelDeleteAccount.d.ts';

const fr: CancelDeleteAccountLocale = {
  label: {
    back: "Retour",
    submit: "Envoyer",
    loading: "Chargement…",
    cancelDeleteTitle: "Annuler la demande de suppression de compte",
    signIn: "Se connecter",
    supportEmail: "connectechceomatsui@gmail.com",
    supportContact: "Si vous avez besoin d’assistance, veuillez nous contacter à l’adresse suivante :",
    cancelDelete: "Annuler la demande de suppression",
    accountDeleteRequested: "La suppression du compte a été demandée",
    requestedUser: "Utilisateur ayant demandé",
    requestDate: "Date de la demande",
    userNameNotFound: "Nom d’utilisateur introuvable",
    confirmationMessage: "Cette opération annulera la demande de suppression du compte.\nConfirmez-vous l’annulation ?"
  },
  alert: {
    authenticationFailed: "Échec de l’authentification.",
    insufficientPermissions: "Autorisations insuffisantes.",
    adminRequired: "Veuillez vous connecter avec un utilisateur disposant des droits d’administrateur.",
    cancelSuccess: "Annulation de la demande de suppression terminée.",
    cancelError: "Une erreur est survenue. Veuillez réessayer."
  }
};

export default fr;