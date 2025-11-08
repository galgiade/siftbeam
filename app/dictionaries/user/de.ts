import type { UserProfileLocale } from './user.d.ts';

// 当面は英語を転用（将来の完全翻訳に備えてファイルを分離）
const de: UserProfileLocale = {
  alert: {
    updateSuccess: "Benutzerinformationen erfolgreich aktualisiert.",
    updateFail: "Fehler beim Aktualisieren der Benutzerinformationen.",
    updateError: "Bei der Aktualisierung ist ein Fehler aufgetreten.",
    fieldUpdateSuccess: "{field} wurde erfolgreich aktualisiert.",
    fieldUpdateFail: "Aktualisierung von {field} fehlgeschlagen.",
    emailSent: "Ein Bestätigungscode wurde an Ihre neue E-Mail-Adresse gesendet.",
    emailUpdateSuccess: "E-Mail-Adresse erfolgreich aktualisiert.",
    emailUpdateFail: "Fehler beim Aktualisieren der E-Mail-Adresse.",
    dbUpdateFail: "Fehler beim Aktualisieren der Datenbank.",
    dbUpdateError: "Datenbankaktualisierung fehlgeschlagen",
    confirmFail: "Der Bestätigungscode ist falsch oder die Datenbankaktualisierung ist fehlgeschlagen.",
    invalidConfirmationCode: "Der Bestätigungscode ist falsch. Bitte geben Sie den korrekten 6-stelligen Code ein.",
    expiredConfirmationCode: "Der Bestätigungscode ist abgelaufen. Bitte fordern Sie einen neuen Code an.",
    noEmailChange: "Keine Änderung der E-Mail-Adresse.",
    invalidEmailFormat: "Ungültiges E-Mail-Format. Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    noChange: "Keine Änderungen am Benutzernamen.",
    invalidConfirmationCodeFormat: "Bitte geben Sie einen 6-stelligen Bestätigungscode ein.",
    verificationCodeNotFound: "Bestätigungscode nicht gefunden oder abgelaufen",
    remainingAttempts: "Verbleibende Versuche",
    verificationCodeStoreFailed: "Fehler beim Speichern des Bestätigungscodes. Bitte überprüfen Sie die IAM-Berechtigungen.",
    codeStoreFailed: "Code konnte nicht gespeichert werden.",
    adminOnlyEdit: "Nur Administratoren können dieses Feld bearbeiten.",
    validEmailRequired: "Bitte geben Sie eine gültige E-Mail-Adresse ein."
  },
  label: {
    title: "Benutzerinformationen",
    userName: "Benutzername",
    department: "Abteilung",
    position: "Position",
    email: "E-Mail-Adresse",
    locale: "Sprache",
    role: "Rolle",
    edit: "Bearbeiten",
    save: "Speichern",
    cancel: "Abbrechen",
    adminOnly: "(Nur Admin)",
    readOnly: "(Nicht änderbar)",
    editableFields: "Bearbeitbar: Benutzername, Sprache",
    adminOnlyFields: "Nur Admin: E-Mail, Abteilung, Position",
    allFieldsEditable: "Alle Felder sind bearbeitbar",
    newEmailSent: "Bestätigungscode an neue E-Mail \"{email}\" gesendet.",
    roleAdmin: "Administrator",
    roleUser: "Benutzer",
    lastAdminRestriction: "Rollenänderung ist eingeschränkt, wenn Sie der letzte Administrator sind",
    lastAdminNote: "※ Wenn es nur einen Administrator in der Organisation gibt, kann die Rolle nicht in einen regulären Benutzer geändert werden.",
    generalUserPermission: "Allgemeine Benutzerberechtigung",
    adminPermission: "Administratorberechtigung",
    verifyAndUpdate: "Verifizieren und Aktualisieren",
    verificationCodePlaceholder: "Bestätigungscode (6 Ziffern)",
    retryAfter: "Wiederholung verfügbar nach"
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


