import type { SignInLocale } from './signIn.d.ts';

const de: SignInLocale = {
  label: {
    back: "Zurück",
    submit: "Senden",
    loading: "Laden...",
    signInTitle: "Anmelden",
    signInSubtitle: "Bitte melden Sie sich bei Ihrem Konto an",
    emailLabel: "E-Mail-Adresse",
    emailPlaceholder: "beispiel@email.com",
    passwordLabel: "Passwort",
    passwordPlaceholder: "Passwort eingeben",
    passwordDescription: "Mindestens 8 Zeichen mit Groß-/Kleinbuchstaben, Zahlen und Symbolen",
    showPassword: "Passwort anzeigen",
    hidePassword: "Passwort verbergen",
    signIn: "Anmelden",
    signingIn: "Anmeldung...",
    signUp: "Konto erstellen",
    forgotPassword: "Passwort vergessen?",
    noAccount: "Noch kein Konto?",

    // 2FA
    verificationCodeLabel: "Bestätigungscode",
    verificationCodePlaceholder: "6-stelligen Code eingeben",
    verificationCodeDescription: "Geben Sie den an Ihre registrierte E-Mail gesendeten Code ein",
    verifyCode: "Code bestätigen",
    verifyingCode: "Wird überprüft...",
    resendCode: "Code erneut senden",
    resendingCode: "Wird erneut gesendet...",
    codeExpired: "Der Bestätigungscode ist abgelaufen",
    enterVerificationCode: "Bestätigungscode eingeben",
    twoFactorAuthTitle: "Zwei-Faktor-Authentifizierung",
    twoFactorAuthDescription: "Geben Sie den Bestätigungscode ein, der an {email} gesendet wurde",
    expirationTime: "Gültigkeitsdauer",
    attemptCount: "Versuche",
    verificationSuccess: "✅ Authentifizierung erfolgreich. Weiterleitung...",

    // Sonstiges
    orDivider: "oder",
    copyright: "© 2024 Alle Rechte vorbehalten."
  },
  alert: {
    emailRequired: "Bitte E-Mail-Adresse eingeben",
    passwordRequired: "Bitte Passwort eingeben",
    emailFormatInvalid: "Bitte eine gültige E-Mail-Adresse eingeben",
    passwordFormatInvalid: "Passwort: mind. 8 Zeichen, Groß-/Kleinbuchstaben, Zahl, Symbol",
    emailAndPasswordRequired: "Bitte E-Mail-Adresse und Passwort eingeben",
    signInFailed: "Anmeldung fehlgeschlagen",
    accountNotConfirmed: "Konto ist nicht bestätigt. Bitte E-Mail-Verifizierung abschließen",
    authCodeRequired: "Authentifizierungscode erforderlich",
    newPasswordRequired: "Neues Passwort erforderlich",
    passwordResetRequired: "Passwortzurücksetzung erforderlich",
    nextStepRequired: "Nächster Schritt erforderlich: {step}",
    
    // 2FA errors
    verificationCodeRequired: "Bitte Bestätigungscode eingeben",
    verificationCodeInvalid: "Der Bestätigungscode ist falsch",
    verificationCodeExpired: "Der Bestätigungscode ist abgelaufen. Bitte erneut senden",
    resendCodeFailed: "Erneutes Senden des Codes fehlgeschlagen",
    maxAttemptsReached: "Maximale Anzahl von Versuchen erreicht. Bitte fordern Sie einen neuen Code an.",
    emailSendFailed: "E-Mail-Versand fehlgeschlagen",
    verificationCodeNotFound: "Bestätigungscode nicht gefunden oder abgelaufen",
    remainingAttempts: "Verbleibende Versuche",
    authErrors: {
      notAuthorized: "E-Mail-Adresse oder Passwort ist falsch",
      userNotConfirmed: "Konto ist nicht bestätigt. Bitte E-Mail-Verifizierung abschließen",
      userNotFound: "Benutzer nicht gefunden",
      passwordResetRequired: "Passwortzurücksetzung erforderlich",
      invalidParameter: "Ungültiger Parameter",
      tooManyRequests: "Zu viele Versuche. Bitte später erneut versuchen"
    }
  }
};

export default de;