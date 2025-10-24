export default {
  alert: {
    updateSuccess: "Unternehmensinformationen aktualisiert.",
    updateFail: "Aktualisierung fehlgeschlagen.",
    networkError: "Netzwerkfehler: {message}",
    required: '"{label}" ist erforderlich.',
    fetchCustomerFailed: "Kundeninformationen konnten nicht abgerufen werden",
    customerNotFound: "Kundeninformationen nicht gefunden",
    customerDeleted: "Dieses Kundenkonto wurde gelöscht",
    adminOnlyEditMessage: "Nur Administratoren können Unternehmensinformationen bearbeiten. Sie haben keine Bearbeitungsberechtigung.",
    invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
    invalidPhone: "Bitte geben Sie eine gültige Telefonnummer ein",
    invalidPostalCode: "Bitte geben Sie eine gültige Postleitzahl ein",
    nameTooLong: "Der Unternehmensname muss 100 Zeichen oder weniger haben",
    addressTooLong: "Die Adresse muss 200 Zeichen oder weniger haben",
    validationError: "Es gibt Probleme mit der Eingabe. Bitte überprüfen Sie."
  },
  label: {
    title: "Unternehmensinformationen",
    country: "Land",
    countryPlaceholder: "Land suchen und auswählen",
    postal_code: "Postleitzahl",
    state: "Bundesland/Region",
    city: "Stadt",
    line2: "Gebäudename",
    line1: "Straße",
    name: "Unternehmensname",
    phone: "Telefonnummer",
    email: "Rechnungs-E-Mail-Adresse"
  },
  placeholder: {
    postal_code: "z.B. 12345",
    state: "z.B. Bayern",
    city: "z.B. München",
    line2: "z.B. Suite 100 (optional)",
    line1: "z.B. Hauptstraße 123",
    name: "z.B. Musterfirma GmbH",
    phone: "z.B. +49-89-123456",
    email: "z.B. kontakt@beispiel.de"
  },
  button: {
    cancel: "Abbrechen"
  }
} as const;



