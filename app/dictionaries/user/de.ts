// 当面は英語を転用（将来の完全翻訳に備えてファイルを分離）
export const de = {
  alert: {
    updateSuccess: "Benutzerinformationen erfolgreich aktualisiert.",
    updateFail: "Fehler beim Aktualisieren der Benutzerinformationen.",
    emailSent: "Ein Bestätigungscode wurde an Ihre neue E-Mail-Adresse gesendet.",
    emailUpdateSuccess: "E-Mail-Adresse erfolgreich aktualisiert.",
    emailUpdateFail: "Fehler beim Aktualisieren der E-Mail-Adresse.",
    dbUpdateFail: "Fehler beim Aktualisieren der Datenbank.",
    dbUpdateError: "Datenbankaktualisierung fehlgeschlagen",
    confirmFail: "Der Bestätigungscode ist falsch oder die Datenbankaktualisierung ist fehlgeschlagen.",
    invalidConfirmationCode: "Der Bestätigungscode ist falsch. Bitte geben Sie den korrekten 6-stelligen Code ein.",
    expiredConfirmationCode: "Der Bestätigungscode ist abgelaufen. Bitte fordern Sie einen neuen Code an.",
    userAlreadyExists: "Diese E-Mail-Adresse ist bereits registriert. Bitte verwenden Sie eine andere E-Mail-Adresse.",
    usernameExists: "Dieser Benutzername wird bereits verwendet. Bitte verwenden Sie einen anderen Benutzernamen.",
    noEmailChange: "Keine Änderung der E-Mail-Adresse.",
    invalidEmailFormat: "Ungültiges E-Mail-Format. Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    emailChangeCancelled: "E-Mail-Adressenänderung wurde abgebrochen.",
    emailChangeCancelFailed: "Fehler beim Abbrechen der E-Mail-Adressenänderung.",
    emailChangeReset: "Unbestätigte E-Mail-Adressenänderung wurde zurückgesetzt.",
    noChange: "Keine Änderungen am Benutzernamen.",
    resendLimitExceeded: "Das Resend-Limit wurde überschritten. Bitte versuchen Sie es später erneut.",
    resendFailed: "Fehler beim erneuten Senden des Bestätigungscodes. Bitte versuchen Sie es erneut.",
    invalidConfirmationCodeFormat: "Bitte geben Sie einen 6-stelligen Bestätigungscode ein.",
    confirmationAttemptLimitExceeded: "Das Bestätigungsversuchslimit wurde überschritten. Bitte versuchen Sie es später erneut.",
    authenticationFailed: "Authentifizierung fehlgeschlagen. Bitte melden Sie sich erneut an und versuchen Sie es.",
    invalidUsernameFormat: "Ungültiges Benutzernamenformat. Bitte geben Sie einen gültigen Benutzernamen ein.",
    usernameChangeLimitExceeded: "Das Benutzernamenänderungslimit wurde überschritten. Bitte versuchen Sie es später erneut.",
    atLeastOneFieldRequired: "Mindestens ein Feld muss aktualisiert werden",
    verificationCodeNotFound: "Bestätigungscode nicht gefunden oder abgelaufen",
    remainingAttempts: "Verbleibende Versuche",
    verificationCodeStoreFailed: "Fehler beim Speichern des Bestätigungscodes. Bitte überprüfen Sie die IAM-Berechtigungen."
  },
  label: {
    title: "Benutzerinformationen",
    userName: "Benutzername",
    department: "Abteilung",
    position: "Position",
    email: "E-Mail-Adresse"
  },
  modal: {
    modalTitle: "E-Mail-Bestätigung",
    description: "Bitte geben Sie den Bestätigungscode ein, der an Ihre neue E-Mail-Adresse ({email}) gesendet wurde.",
    codeLabel: "Bestätigungscode",
    cancel: "Abbrechen",
    confirm: "Bestätigen",
    resend: "Erneut senden",
    verifying: "Bestätigung..."
  }
}

export default de;


