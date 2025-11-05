import type { UsageLimitLocale } from './usage-limit.d.ts';

const de: UsageLimitLocale = {
  label: {
    // Allgemein
    save: "Speichern",
    cancel: "Abbrechen",
    edit: "Bearbeiten",
    delete: "Löschen",
    back: "Zurück",
    add: "Hinzufügen",
    create: "Erstellen",
    creating: "Speichern...",
    update: "Aktualisieren",
    
    // Erstellungsseite
    createUsageLimitTitle: "Nutzungslimit erstellen",
    createUsageLimitDescription: "Konfigurieren Sie Limits für Datenverarbeitungsvolumen oder Ausgaben und wählen Sie die Aktion bei Überschreitung.",
    usageLimitSettings: "Nutzungslimit-Einstellungen",
    exceedActionTitle: "Aktion bei Überschreitung",
    selectAction: "Aktion auswählen",
    notifyOnlyOption: "Nur benachrichtigen",
    restrictOption: "Dienst aussetzen",
    notifyOnlyDescription: "Eine Benachrichtigungs-E-Mail wird gesendet, wenn das Limit überschritten wird. Der Dienst bleibt verfügbar.",
    restrictDescription: "Der Dienst wird ausgesetzt, wenn das Limit überschritten wird. Eine Benachrichtigungs-E-Mail wird ebenfalls gesendet.",
    limitTypeTitle: "Limit-Typ",
    dataLimitOption: "Datenlimit",
    amountLimitOption: "Betragslimit",
    dataLimitDescription: "Limit basierend auf Datenverarbeitungsvolumen (MB/GB/TB) festlegen.",
    amountLimitDescription: "Limit basierend auf Verarbeitungskosten (USD) festlegen.",
    dataLimitTitle: "Datenlimit-Wert",
    enterLimitValue: "Limit-Wert eingeben (z.B.: 100)",
    unit: "Einheit",
    monthlyDataLimitDescription: "Die Aktion wird ausgeführt, wenn das monatliche Datenverarbeitungsvolumen diesen Wert überschreitet.",
    amountLimitTitle: "Betragslimit-Wert",
    enterAmountValue: "Limit-Wert eingeben (z.B.: 50)",
    monthlyAmountLimitDescription: "Die Aktion wird ausgeführt, wenn die monatlichen Verarbeitungskosten diesen Betrag überschreiten.",
    notificationSettingsTitle: "Benachrichtigungseinstellungen",
    enterEmailPlaceholder: "E-Mail-Adresse eingeben (z.B.: beispiel@firma.com)",
    notificationEmailList: "Benachrichtigungs-E-Mail-Adressen",
    notificationEmailCount: "Benachrichtigungs-E-Mail-Adressen ({count})",
    notifyOnlyEmailDescription: "Wenn das Limit überschritten wird, wird eine Benachrichtigung an die hier konfigurierten E-Mail-Adressen gesendet.",
    restrictEmailDescription: "Wenn das Limit überschritten wird, wird der Dienst ausgesetzt und eine Benachrichtigung an die hier konfigurierten E-Mail-Adressen gesendet.",
    cancelButton: "Abbrechen",
    createNotifyLimit: "Benachrichtigungslimit erstellen",
    createRestrictLimit: "Einschränkungslimit erstellen",
    processingFeeOnly: "nur Verarbeitungsgebühr",
    conversionApproximate: "≈",

    // Hauptbildschirm
    limitUsageTitle: "Nutzungslimits",
    usageLimitManagement: "Nutzungslimit-Verwaltung",
    usageLimitDescription: "Legen Sie Limits für Datennutzung und Beträge fest und verwalten Sie Aktionen bei Überschreitung.",
    createLimit: "Limit erstellen",
    notificationTarget: "Benachrichtigungsempfänger",
    detail: "Details",
    createdAt: "Erstellt am",
    updatedAt: "Aktualisiert am",
    limitValue: "Limit-Wert",
    notificationRecipients: "Benachrichtigungsempfänger",

    // Benachrichtigungstypen
    notify: "Benachrichtigen",
    restrict: "Aussetzen",
    exceedAction: "Aktion bei Überschreitung",
    notifyOnly: "Nur benachrichtigen",
    notifyLimit: "Benachrichtigungslimit",
    restrictLimit: "Aussetzungslimit",
    notifyLimitDescription: "Wenn ein Limit festgelegt ist, wird bei Überschreitung eine Benachrichtigung gesendet.",
    restrictLimitDescription: "Wenn ein Limit festgelegt ist, wird der Dienst bei Überschreitung ausgesetzt.",
    noNotifyLimits: "Keine Benachrichtigungslimits konfiguriert",
    noRestrictLimits: "Keine Aussetzungslimits konfiguriert",

    // Betrag und Nutzung
    amount: "Betrag",
    usage: "Nutzung",
    editTarget: "Bearbeitungsziel",
    limitType: "Limit-Typ",
    selectLimitType: "Limit-Typ auswählen",
    dataLimitValue: "Datenlimit-Wert",
    amountLimitValue: "Betragslimit-Wert (USD)",
    dataLimitPlaceholder: "z.B.: 100",
    amountLimitPlaceholder: "z.B.: 50",
    orSeparator: "oder",
    noLimit: "Kein Limit",

    // Empfängerverwaltung
    recipients: "Empfänger",
    emailAddress: "E-Mail-Adresse",
    emailPlaceholder: "E-Mail-Adresse eingeben",
    noRecipientsRegistered: "Keine Empfänger registriert",
    addEmailAddress: "Benachrichtigungs-E-Mail-Adresse",
    minOneEmailRequired: "Mindestens eine Benachrichtigungs-E-Mail-Adresse ist erforderlich.",

    // Erstellen / Bearbeiten
    usageNotification: "Nutzungsbenachrichtigung",
    selectNotifyOrRestrict: "Benachrichtigung oder Einschränkung auswählen",
    selectNotificationMethod: "Benachrichtigungsmethode auswählen",
    amountBasedNotification: "Betragsbasierte Benachrichtigung",
    usageBasedNotification: "Nutzungsbasierte Benachrichtigung",
    enterAmount: "Betrag eingeben",
    enterUsage: "Nutzung eingeben",
    addNewRecipient: "Neuen Empfänger hinzufügen",
    usageConversion: "Nutzungsumrechnung",
    amountConversion: "Betragsumrechnung",
    createNewLimit: "Neues Nutzungslimit erstellen",
    editLimit: "Nutzungslimit bearbeiten",
    dataLimit: "Datenlimit",
    amountLimit: "Betragslimit",

    // Einheiten
    yen: "JPY",
    unitKB: "KB",
    unitMB: "MB",
    unitGB: "GB",
    unitTB: "TB",
    usd: "USD",

    // Fehlerbildschirm
    errorOccurred: "Ein Fehler ist aufgetreten",
    errorDetails: "Fehlerdetails",
    reloadPage: "Seite neu laden",
    backToAccount: "Zurück zum Konto",
    contactSupport: "Wenn das Problem weiterhin besteht, wenden Sie sich bitte an den Support."
  },
  alert: {
    // Validierung
    amountRequired: "Bitte geben Sie den Nutzungsbetrag ein",
    usageRequired: "Bitte geben Sie das Nutzungsvolumen ein",
    emailRequired: "Bitte geben Sie eine E-Mail-Adresse ein",
    invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    enterPositiveAmount: "Geben Sie eine Zahl größer oder gleich 0 ein",
    enterValidUsage: "Geben Sie eine Zahl größer als 0 und kleiner als 1024 ein",
    enterPositiveDataLimit: "Der Datenlimit-Wert muss größer als 0 sein.",
    enterPositiveAmountLimit: "Der Betragslimit-Wert muss größer als 0 sein.",
    emailAlreadyAdded: "Diese E-Mail-Adresse wurde bereits hinzugefügt.",
    minOneEmail: "Mindestens eine Benachrichtigungs-E-Mail-Adresse ist erforderlich.",
    selectExceedAction: "Bitte wählen Sie eine Aktion bei Überschreitung aus.",
    selectLimitType: "Bitte wählen Sie einen Limit-Typ aus.",
    dataLimitValueRequired: "Der Datenlimit-Wert muss größer als 0 sein.",
    dataLimitValueMax: "Der Datenlimit-Wert muss 1.000.000 oder weniger sein.",
    amountLimitValueRequired: "Der Betragslimit-Wert muss größer als 0 sein.",
    amountLimitValueMax: "Der Betragslimit-Wert muss 100.000 oder weniger sein.",
    minOneEmailRequired: "Bitte geben Sie mindestens eine Benachrichtigungs-E-Mail-Adresse ein.",
    notifyLimitCreated: "Das Benachrichtigungslimit wurde erfolgreich erstellt.",
    restrictLimitCreated: "Das Einschränkungslimit wurde erfolgreich erstellt.",
    errorPrefix: "Fehler:",
    unexpectedError: "Ein unerwarteter Fehler ist aufgetreten:",

    // Operationsergebnisse
    createFailed: "Fehler beim Erstellen des Nutzungslimits.",
    updateFailed: "Fehler beim Aktualisieren des Nutzungslimits.",
    sendingError: "Beim Senden ist ein Fehler aufgetreten.",
    savingInProgress: "Speichern...",
    createSuccess: "Das Nutzungslimit wurde erfolgreich erstellt.",
    updateSuccess: "Das Nutzungslimit wurde erfolgreich aktualisiert.",
    deleteSuccess: "Das Nutzungslimit wurde erfolgreich gelöscht.",
    deleteConfirm: "Dieses Nutzungslimit löschen?",

    // Berechtigungen
    adminOnlyCreateMessage: "Nur Administratoren können Nutzungslimits erstellen. Bitte wenden Sie sich an einen Administrator.",
    adminOnlyEditMessage: "Nur Administratoren können Nutzungslimits bearbeiten. Sie haben keine Berechtigung.",
    adminOnlyDeleteMessage: "Nur Administratoren können Nutzungslimits löschen. Sie haben keine Berechtigung.",

    // Fehler
    loginRequired: "Anmeldung erforderlich.",
    unknownError: "Ein unbekannter Fehler ist aufgetreten.",
    accessDenied: "Sie haben keine Berechtigung, auf diese Seite zuzugreifen. Nur für Administratoren zugänglich.",
    fetchFailed: "Fehler beim Abrufen der Nutzungslimitdaten."
  }
};

export default de;
