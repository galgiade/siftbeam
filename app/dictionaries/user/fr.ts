// 当面は英語を転用（将来の完全翻訳に備えてファイルを分離）
export const fr = {
  alert: {
    updateSuccess: "Informations utilisateur mises à jour avec succès.",
    updateFail: "Échec de la mise à jour des informations utilisateur.",
    emailSent: "Un code de confirmation a été envoyé à votre nouvelle adresse e-mail.",
    emailUpdateSuccess: "Adresse e-mail mise à jour avec succès.",
    emailUpdateFail: "Échec de la mise à jour de l'adresse e-mail.",
    dbUpdateFail: "Échec de la mise à jour de la base de données.",
    dbUpdateError: "Échec de la mise à jour de la base de données",
    confirmFail: "Le code de confirmation est incorrect ou la mise à jour de la base de données a échoué.",
    invalidConfirmationCode: "Le code de confirmation est incorrect. Veuillez saisir le code à 6 chiffres correct.",
    expiredConfirmationCode: "Le code de confirmation a expiré. Veuillez demander un nouveau code.",
    userAlreadyExists: "Cette adresse e-mail est déjà enregistrée. Veuillez utiliser une adresse e-mail différente.",
    usernameExists: "Ce nom d'utilisateur est déjà utilisé. Veuillez utiliser un nom d'utilisateur différent.",
    noEmailChange: "Aucun changement d'adresse e-mail.",
    invalidEmailFormat: "Format d'e-mail invalide. Veuillez saisir une adresse e-mail valide.",
    emailChangeCancelled: "Le changement d'adresse e-mail a été annulé.",
    emailChangeCancelFailed: "Échec de l'annulation du changement d'adresse e-mail.",
    emailChangeReset: "Le changement d'adresse e-mail non confirmé a été réinitialisé.",
    noChange: "Aucun changement de nom d'utilisateur.",
    resendLimitExceeded: "La limite de renvoi a été dépassée. Veuillez réessayer plus tard.",
    resendFailed: "Échec du renvoi du code de confirmation. Veuillez réessayer.",
    invalidConfirmationCodeFormat: "Veuillez saisir un code de confirmation à 6 chiffres.",
    confirmationAttemptLimitExceeded: "La limite de tentatives de confirmation a été dépassée. Veuillez réessayer plus tard.",
    authenticationFailed: "L'authentification a échoué. Veuillez vous reconnecter et réessayer.",
    invalidUsernameFormat: "Format de nom d'utilisateur invalide. Veuillez saisir un nom d'utilisateur valide.",
    usernameChangeLimitExceeded: "La limite de changement de nom d'utilisateur a été dépassée. Veuillez réessayer plus tard.",
    atLeastOneFieldRequired: "Au moins un champ doit être mis à jour",
    verificationCodeNotFound: "Code de vérification introuvable ou expiré",
    remainingAttempts: "Tentatives restantes",
    verificationCodeStoreFailed: "Échec du stockage du code de vérification. Veuillez vérifier les permissions IAM."
  },
  label: {
    title: "Informations utilisateur",
    userName: "Nom d'utilisateur",
    department: "Département",
    position: "Poste",
    email: "Adresse e-mail"
  },
  modal: {
    modalTitle: "Confirmation e-mail",
    description: "Veuillez saisir le code de confirmation envoyé à votre nouvelle adresse e-mail ({email}).",
    codeLabel: "Code de confirmation",
    cancel: "Annuler",
    confirm: "Confirmer",
    resend: "Renvoyer",
    verifying: "Vérification..."
  }
}

export default fr;


