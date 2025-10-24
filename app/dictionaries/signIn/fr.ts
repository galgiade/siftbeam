export default {
  label: {
    back: "Retour",
    submit: "Envoyer",
    loading: "Chargement…",
    signInTitle: "Connexion",
    signInSubtitle: "Veuillez vous connecter à votre compte",
    emailLabel: "Adresse e-mail",
    emailPlaceholder: "example@email.com",
    passwordLabel: "Mot de passe",
    passwordPlaceholder: "Saisissez votre mot de passe",
    passwordDescription: "Au moins 8 caractères avec majuscules, minuscules, chiffres et symboles",
    signIn: "Se connecter",
    signingIn: "Connexion…",
    signUp: "Créer un compte",
    forgotPassword: "Mot de passe oublié ?",
    noAccount: "Pas de compte ?",

    // 2FA
    verificationCodeLabel: "Code de vérification",
    verificationCodePlaceholder: "Entrez le code à 6 chiffres",
    verificationCodeDescription: "Saisissez le code envoyé à votre e-mail enregistré",
    verifyCode: "Vérifier le code",
    verifyingCode: "Vérification…",
    resendCode: "Renvoyer le code",
    resendingCode: "Renvoi en cours…",
    codeExpired: "Le code de vérification a expiré",
    enterVerificationCode: "Saisissez le code de vérification",
    expirationTime: "Délai d'expiration",
    attemptCount: "Tentatives",
    verificationSuccess: "✅ Authentification réussie. Redirection..."
  },
  alert: {
    emailRequired: "Veuillez saisir votre adresse e-mail",
    passwordRequired: "Veuillez saisir votre mot de passe",
    emailFormatInvalid: "Veuillez saisir une adresse e-mail valide",
    passwordFormatInvalid: "Le mot de passe doit contenir au moins 8 caractères avec majuscules, minuscules, chiffres et symboles",
    emailAndPasswordRequired: "Veuillez saisir votre adresse e-mail et votre mot de passe",
    signInFailed: "Échec de la connexion",
    accountNotConfirmed: "Compte non confirmé. Veuillez terminer la vérification par e-mail",
    authCodeRequired: "Saisie du code d’authentification requise",
    newPasswordRequired: "Configuration d’un nouveau mot de passe requise",
    passwordResetRequired: "Réinitialisation du mot de passe requise",
    nextStepRequired: "Étape suivante requise : {step}",
    
    // 2FA errors
    verificationCodeRequired: "Veuillez saisir le code de vérification",
    verificationCodeInvalid: "Le code de vérification est incorrect",
    verificationCodeExpired: "Le code a expiré. Veuillez le renvoyer",
    resendCodeFailed: "Échec de l'envoi du code",
    maxAttemptsReached: "Nombre maximum de tentatives atteint. Veuillez demander un nouveau code.",
    emailSendFailed: "Échec de l'envoi de l'e-mail",
    verificationCodeNotFound: "Code de vérification introuvable ou expiré",
    remainingAttempts: "Tentatives restantes",
    authErrors: {
      notAuthorized: "Adresse e-mail ou mot de passe incorrect",
      userNotConfirmed: "Compte non confirmé. Veuillez terminer la vérification par e-mail",
      userNotFound: "Utilisateur introuvable",
      passwordResetRequired: "Réinitialisation du mot de passe requise",
      invalidParameter: "Paramètre invalide",
      tooManyRequests: "Trop de demandes. Veuillez réessayer plus tard"
    }
  }
} as const;


