import type { CreateAdminLocale } from './createAdmin.d.ts';

const de: CreateAdminLocale = {
  label: {
    back: "Zurück",
    submit: "Senden",
    loading: "Laden...",
    createAdminTitle: "Admin-Konto erstellen",
    userNameLabel: "Benutzername",
    userNamePlaceholder: "Max Mustermann",
    userNameDescription: "Bitte mindestens 2 Zeichen eingeben",
    departmentLabel: "Abteilung",
    departmentPlaceholder: "Vertrieb",
    positionLabel: "Position",
    positionPlaceholder: "Manager",
    languageLabel: "Sprache",
    languagePlaceholder: "Wählen Sie eine Sprache",
    japanese: "日本語",
    english: "English",
    spanish: "Spanisch",
    french: "Französisch",
    german: "Deutsch",
    korean: "Koreanisch",
    portuguese: "Portugiesisch",
    indonesian: "Indonesisch",
    chinese: "Chinesisch",
    createAdmin: "Admin-Konto erstellen",
    creating: "Wird erstellt...",
    accountCreation: "Kontoerstellung",
    companyInfo: "Unternehmensdaten",
    adminSetup: "Admin-Einrichtung",
    paymentSetup: "Zahlungsmethode"
  },
  alert: {
    userNameRequired: "Bitte Benutzernamen eingeben",
    userNameMinLength: "Benutzername muss mindestens 2 Zeichen haben",
    departmentRequired: "Bitte Abteilung eingeben",
    positionRequired: "Bitte Position eingeben",
    invalidAuthInfo: "Ungültige Anmeldeinformationen. Bitte erneut anmelden.",
    adminCreationFailed: "Admin-Konto konnte nicht erstellt werden",
    networkError: "Netzwerkfehler ist aufgetreten"
  }
};

export default de;