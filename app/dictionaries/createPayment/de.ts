export default {
  label: {
    back: "Zurück",
    submit: "Senden",
    loading: "Laden...",
    paymentSetupTitle: "Zahlungsmethode einrichten",
    cardInfoLabel: "Kartendaten",
    expiryLabel: "MM/JJ",
    cvcLabel: "Sicherheitscode",
    apply: "Übernehmen",
    processing: "Verarbeite...",
    goToMyPage: "Zur Übersichtsseite",
    accountCreation: "Kontoerstellung",
    companyInfo: "Unternehmensdaten",
    adminSetup: "Admin-Einrichtung",
    paymentSetup: "Zahlungsmethode",
    paymentMethodSaved: "✓ Zahlungsmethode erfolgreich gespeichert",
    defaultPaymentMethodSet: "Diese Karte wurde als Standard-Zahlungsmethode festgelegt.",
    subscriptionCreated: "✓ Abonnement erfolgreich erstellt",
    automaticBillingEnabled: "Automatische nutzungsbasierte Abrechnung ist jetzt aktiviert.",
    saveInfoDescription: "Informationen sicher speichern für zukünftige 1‑Klick‑Zahlungen",
    linkCompatibleStores: "Schnell zahlen bei mit Link kompatiblen Stores, inkl. Standard‑Soundbox.",
    cardInfoEncrypted: "Kartendaten werden verschlüsselt und sicher gespeichert.",
    billingBasedOnUsage: "Die tatsächliche Abrechnung erfolgt später basierend auf der Nutzung.",
    authenticationFlowDescription: "Aus Sicherheitsgründen kann eine Kartenauthentifizierung erforderlich sein.",
    authenticationFlowSteps: "Falls eine Authentifizierung erforderlich ist, wird der Authentifizierungsbildschirm Ihrer Bank angezeigt. Bitte schließen Sie die Authentifizierung ab.",
    agreeNoticePrefix: "Mit Abschluss der Registrierung stimmen Sie den ",
    and: " und der ",
    agreeNoticeSuffix: ".",
    terms: "Nutzungsbedingungen",
    privacy: "Datenschutzerklärung"
  },
  alert: {
    expiryRequired: "Bitte Ablaufdatum korrekt eingeben",
    cvcRequired: "Bitte Sicherheitscode korrekt eingeben",
    cardInfoRequired: "Kartendaten sind nicht eingegeben",
    setupIntentFailed: "Setup‑Intent konnte nicht erstellt werden",
    paymentMethodFailed: "Zahlungsmethode konnte nicht erstellt werden",
    unknownError: "Unbekannter Fehler ist aufgetreten",
    customerInfoNotFound: "Kundeninformationen konnten nicht abgerufen werden.",
    defaultPaymentMethodFailed: "Als Standard festlegen fehlgeschlagen, aber Kartenregistrierung abgeschlossen",
    authenticationRequired: "Kartenauthentifizierung ist erforderlich. Bitte schließen Sie die Authentifizierung ab.",
    authenticationFailed: "Kartenauthentifizierung fehlgeschlagen. Bitte versuchen Sie es erneut.",
    authenticationCancelled: "Kartenauthentifizierung wurde abgebrochen.",
    authenticationIncomplete: "Kartenauthentifizierung ist nicht abgeschlossen. Bitte schließen Sie die Authentifizierung ab."
  }
} as const;



