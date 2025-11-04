import type { ForgotPasswordLocale } from './forgotPassword.d.ts';

const de: ForgotPasswordLocale = {
  label: {
    back: "Zurück",
    submit: "Senden",
    loading: "Laden...",
    forgotPasswordTitle: "Passwort zurücksetzen",
    emailLabel: "E-Mail-Adresse",
    emailPlaceholder: "E-Mail-Adresse eingeben",
    codeLabel: "Bestätigungscode",
    codePlaceholder: "Bestätigungscode eingeben",
    newPasswordLabel: "Neues Passwort",
    newPasswordPlaceholder: "Neues Passwort eingeben",
    sendCode: "Code senden",
    updatePassword: "Passwort aktualisieren",
    backToEmail: "Zurück zur E-Mail",
    resendCode: "Code erneut senden",
    emailDescription: "Bitte geben Sie Ihre E-Mail-Adresse ein. Wir senden einen Bestätigungscode.",
    codeDescription: "Bitte geben Sie den zugesandten Bestätigungscode und Ihr neues Passwort ein.",
    redirectingMessage: "Weiterleitung zur Anmeldeseite...",
    codeExpiryTitle: "Ablauf des Codes",
    remainingTime: "Verbleibende Zeit: {time}",
    expiredMessage: "Abgelaufen. Bitte neuen Code anfordern.",
    timeLimitMessage: "Bitte innerhalb von 24 Stunden eingeben",
    expiredResendMessage: "Der Code ist abgelaufen. Bitte neuen Code anfordern."
  },
  alert: {
    emailRequired: "Bitte E-Mail-Adresse eingeben",
    codeRequired: "Bitte Bestätigungscode eingeben",
    newPasswordRequired: "Bitte neues Passwort eingeben",
    codeSent: "Bestätigungscode wurde per E-Mail gesendet",
    passwordResetSuccess: "Passwort wurde erfolgreich zurückgesetzt",
    passwordUpdated: "Passwort wurde erfolgreich aktualisiert!",
    codeExpired: "Abgelaufen",
    authErrors: {
      notAuthorized: "E-Mail-Adresse oder Passwort ist falsch",
      userNotConfirmed: "Konto ist nicht bestätigt. Bitte E-Mail-Verifizierung abschließen",
      userNotFound: "Benutzer nicht gefunden",
      passwordResetRequired: "Passwortzurücksetzung erforderlich",
      invalidParameter: "Ungültiger Parameter",
      tooManyRequests: "Zu viele Anfragen. Bitte später erneut versuchen",
      signInFailed: "Anmeldung fehlgeschlagen"
    },
    passwordResetErrors: {
      codeMismatch: "Bestätigungscode ist falsch. Bitte erneut versuchen.",
      expiredCode: "Bestätigungscode ist abgelaufen. Bitte neuen Code anfordern.",
      invalidPassword: "Passwort ungültig. Bitte Anforderungen prüfen.",
      limitExceeded: "Anfragelimit erreicht. Bitte später erneut versuchen.",
      genericError: "Ein Fehler ist aufgetreten. Bitte erneut versuchen."
    }
  }
};

export default de;