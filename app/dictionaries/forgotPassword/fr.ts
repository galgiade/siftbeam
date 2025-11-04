import type { ForgotPasswordLocale } from './forgotPassword.d.ts';

const fr: ForgotPasswordLocale = {
  label: {
    back: "Retour",
    submit: "Envoyer",
    loading: "Chargement…",
    forgotPasswordTitle: "Réinitialiser le mot de passe",
    emailLabel: "Adresse e-mail",
    emailPlaceholder: "Saisissez votre adresse e-mail",
    codeLabel: "Code de vérification",
    codePlaceholder: "Saisissez le code de vérification",
    newPasswordLabel: "Nouveau mot de passe",
    newPasswordPlaceholder: "Saisissez le nouveau mot de passe",
    sendCode: "Envoyer le code de vérification",
    updatePassword: "Mettre à jour le mot de passe",
    backToEmail: "Retour",
    resendCode: "Renvoyer un nouveau code",
    emailDescription: "Veuillez saisir votre adresse e-mail. Nous vous enverrons un code de vérification.",
    codeDescription: "Veuillez saisir le code envoyé par e-mail ainsi que votre nouveau mot de passe.",
    redirectingMessage: "Redirection vers la page de connexion…",
    codeExpiryTitle: "Expiration du code",
    remainingTime: "Temps restant : {time}",
    expiredMessage: "Expiré. Veuillez demander un nouveau code.",
    timeLimitMessage: "Veuillez saisir dans les 24 heures",
    expiredResendMessage: "Le code a expiré. Veuillez demander un nouveau code."
  },
  alert: {
    emailRequired: "Veuillez saisir votre adresse e-mail",
    codeRequired: "Veuillez saisir le code de vérification",
    newPasswordRequired: "Veuillez saisir un nouveau mot de passe",
    codeSent: "Le code de vérification a été envoyé à votre e-mail",
    passwordResetSuccess: "Le mot de passe a été réinitialisé avec succès",
    passwordUpdated: "Le mot de passe a été mis à jour avec succès !",
    codeExpired: "Expiré",
    authErrors: {
      notAuthorized: "Adresse e-mail ou mot de passe incorrect",
      userNotConfirmed: "Compte non confirmé. Veuillez terminer la vérification par e-mail",
      userNotFound: "Utilisateur introuvable",
      passwordResetRequired: "Réinitialisation du mot de passe requise",
      invalidParameter: "Paramètre invalide",
      tooManyRequests: "Trop de demandes. Veuillez réessayer plus tard",
      signInFailed: "Échec de la connexion"
    },
    passwordResetErrors: {
      codeMismatch: "Le code de vérification est incorrect. Veuillez réessayer.",
      expiredCode: "Le code de vérification a expiré. Veuillez en demander un nouveau.",
      invalidPassword: "Le mot de passe est invalide. Veuillez vérifier les exigences.",
      limitExceeded: "Limite de requêtes atteinte. Veuillez réessayer plus tard.",
      genericError: "Une erreur est survenue. Veuillez réessayer."
    }
  }
};

export default fr;