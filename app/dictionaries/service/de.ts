import type { ServiceLocale } from './ServiceLocale.d.ts';

const de: ServiceLocale = {
  page: {
    title: "Services",
    description:
      "Wählen Sie eine Richtlinie, laden Sie Dateien hoch und führen Sie die Verarbeitung aus. Verarbeitete Daten werden ein Jahr lang kostenlos gespeichert.",
    loading: "Wird geladen..."
  },
  error: {
    title: "Es ist ein Fehler aufgetreten",
    loginRequired: "Anmeldung erforderlich.",
    processingHistoryFetchFailed: "Verarbeitungshistorie konnte nicht abgerufen werden.",
    policiesFetchFailed: "Richtlinien konnten nicht abgerufen werden.",
    usageLimitsFetchFailed: "Nutzungslimits konnten nicht abgerufen werden.",
    pageLoadFailed: "Serviceseite konnte nicht geladen werden.",
    suggestion1: "Bitte laden Sie die Seite neu.",
    suggestion2: "Wenn das Problem weiterhin besteht, wenden Sie sich an den Support."
  },
  limits: {
    notifyLimit: {
      title: "Benachrichtigungslimits",
      limitValue: "Grenzwert:",
      exceedAction: "Aktion bei Überschreitung:",
      currentUsage: "Aktuelle Nutzung:",
      notSet: "Kein Benachrichtigungslimit konfiguriert",
      currentUsageLabel: "Aktuelle Nutzung:",
      settingsCount: "Konfigurierte Benachrichtigungslimits: {count}",
      dataLimit: "Datenlimit: {value} {unit} ({bytes})",
      amountLimit: "Betragslimit: ${amount}",
      noLimitValue: "Kein Grenzwert festgelegt",
      amountConversionNote:
        "Hinweis: Betragslimits werden als Datennutzung angezeigt (Verarbeitungsgebühr: $0,00001/Byte, inkl. 1 Jahr Speicherung)."
    },
    restrictLimit: {
      title: "Sperrlimits",
      limitValue: "Grenzwert:",
      exceedAction: "Aktion bei Überschreitung:",
      currentUsage: "Aktuelle Nutzung:",
      notSet: "Kein Sperrlimit konfiguriert",
      currentUsageLabel: "Aktuelle Nutzung:",
      settingsCount: "Konfigurierte Sperrlimits: {count}",
      dataLimit: "Datenlimit: {value} {unit} ({bytes})",
      amountLimit: "Betragslimit: ${amount}",
      noLimitValue: "Kein Grenzwert festgelegt",
      amountConversionNote:
        "Hinweis: Betragslimits werden als Datennutzung angezeigt (Verarbeitungsgebühr: $0,00001/Byte, inkl. 1 Jahr Speicherung)."
    },
    perMonth: "/Monat",
    notifyAction: "Benachrichtigen",
    restrictAction: "Sperren"
  },
  policySelection: {
    title: "Richtlinienauswahl",
    label: "Wählen Sie eine Verarbeitungsrichtlinie",
    placeholder: "Richtlinie auswählen",
    noPolicies: "Keine Richtlinien verfügbar"
  },
  fileUpload: {
    title: "Datei-Upload",
    selectPolicyFirst: "Bitte zuerst eine Richtlinie auswählen",
    noPoliciesAvailable: "Keine Richtlinien verfügbar",
    dragAndDrop: "Dateien per Drag & Drop ablegen",
    orClickToSelect: "oder zum Auswählen klicken",
    maxFiles: "Bis zu {max} Dateien, jeweils maximal 100 MB",
    supportedFormats: "Unterstützte Formate: Verwenden Sie die in {formats} angegebenen Formate",
    selectedFiles: "Ausgewählte Dateien ({count}/{max})",
    deleteAll: "Alle löschen",
    fileSizeLimit: "{name} ist zu groß. Bitte wählen Sie eine Datei mit höchstens 100 MB.",
    pending: "Ausstehend",
    uploading: "Upload läuft",
    completed: "Abgeschlossen",
    error: "Fehler",
    startProcessing: "Verarbeitung starten",
    processing: "Verarbeitung wird gestartet...",
    uploadComplete: "Upload abgeschlossen",
    uploadCompletedMessage: "{count} Dateien hochgeladen und KI-Verarbeitung gestartet!",
    uploadNotAllowed: "Upload nicht erlaubt",
    notifyLimitReached: "Benachrichtigungslimit erreicht",
    notifyLimitReachedMessage: "Benachrichtigungslimit ({limit}) erreicht. {count} Benachrichtigungs-E-Mails gesendet."
  },
  table: {
    id: "ID",
    userName: "Benutzername",
    policyName: "Richtlinienname",
    usageAmountBytes: "Nutzung",
    status: "Status",
    errorDetail: "Fehler",
    createdAt: "Startdatum",
    updatedAt: "Aktualisierungsdatum",
    download: "Herunterladen",
    aiTraining: "KI-Schulung",
    delete: "Löschen",
    ariaLabel: "Datenverarbeitungshistorie-Tabelle"
  },
  status: {
    in_progress: "In Bearbeitung",
    success: "Abgeschlossen",
    failed: "Fehlgeschlagen",
    canceled: "Abgebrochen",
    deleted: "Gelöscht",
    delete_failed: "Löschen fehlgeschlagen"
  },
  notification: {
    uploadSuccess: "Datei-Upload abgeschlossen. Die Datenverarbeitung wird gestartet.",
    uploadError: "Upload fehlgeschlagen.",
    uploadProcessingError: "Während der Upload-Verarbeitung ist ein Fehler aufgetreten.",
    uploadFailed: "Datei-Upload fehlgeschlagen. Bitte versuchen Sie es erneut.",
    fetchFailed: "Daten konnten nicht abgerufen werden.",
    aiTrainingChanged: "KI-Schulungsberechtigung wurde geändert.",
    deleteCompleted: "Dateilöschung abgeschlossen.",
    uploadCompleted: "Upload abgeschlossen.",
    uploadFailedGeneric: "Upload fehlgeschlagen.",
    dataFetchFailed: "Daten konnten nicht abgerufen werden.",
    notificationSent: "Benachrichtigungs-E-Mail gesendet.",
    notificationFailed: "Benachrichtigung konnte nicht gesendet werden.",
    notificationError: "Beim Senden der Benachrichtigung ist ein Fehler aufgetreten.",
    dataUpdated: "Daten aktualisiert."
  },
  filter: {
    userName: {
      placeholder: "Nach Benutzername suchen",
      ariaLabel: "Benutzernamenssuche"
    },
    policyName: {
      placeholder: "Nach Richtlinienname suchen",
      ariaLabel: "Richtliniennamenssuche"
    },
    dateRange: {
      label: "Datumsbereich",
      startDate: {
        placeholder: "Startdatum",
        ariaLabel: "Startdatum auswählen"
      },
      endDate: {
        placeholder: "Enddatum",
        ariaLabel: "Enddatum auswählen"
      },
      separator: "~"
    },
    minUsage: {
      label: "Minimale Nutzung",
      placeholder: "Min",
      ariaLabel: "Minimale Nutzung"
    },
    maxUsage: {
      label: "Maximale Nutzung",
      placeholder: "Max",
      ariaLabel: "Maximale Nutzung"
    },
    reset: "Filter zurücksetzen",
    rangeSeparator: "~",
    refresh: "Daten aktualisieren",
    deleteSelected: "Ausgewählte löschen"
  },
  policy: {
    select: "Richtlinie auswählen",
    none: "Es wurden keine Richtlinien erstellt.",
    create: "Richtlinie erstellen",
    noPolicies: "Es wurden keine Richtlinien erstellt.",
    createPolicy: "Richtlinie erstellen"
  },
  deleteDialog: {
    title: "Löschbestätigung",
    warn1: "Die ausgewählten Dateien werden dauerhaft gelöscht.",
    warn2: "Nach dem Löschen können verarbeitete Dateien nicht mehr heruntergeladen werden.",
    warn3: "Sie können auch nicht mehr für KI-Schulungen verwendet werden.",
    warn4: "Dieser Vorgang kann nicht rückgängig gemacht werden. Bitte seien Sie vorsichtig.",
    confirm: "Sind Sie sicher, dass Sie löschen möchten? Geben Sie \"DELETE\" ein.",
    cancel: "Abbrechen",
    delete: "Löschen"
  },
  limitUsage: {
    title: "Status der Nutzungslimits",
    status: {
      normal: "Normal",
      warning: "Warnung",
      exceeded: "Überschritten"
    },
    current: "Aktuell:",
    limit: "Limit:",
    noLimit: "Kein Limit",
    exceedAction: {
      notify: "Benachrichtigen",
      restrict: "Sperren"
    },
    testNotification: "Testbenachrichtigung senden",
    limitTypes: {
      usage: "Nutzungslimit",
      amount: "Betragslimit"
    },
    unknownCompany: "Unbekanntes Unternehmen"
  },
  tableEmpty: "Keine Datenverarbeitungshistorie.",
  pagination: {
    prev: "Zurück",
    next: "Weiter"
  },
  displayCount: "{shown} von {total} werden angezeigt (insgesamt {all})",
  processingHistory: {
    title: "Verarbeitungshistorie",
    count: "({count} Einträge)",
    refresh: "Aktualisieren",
    empty: "Keine Verarbeitungshistorie.",
    emptyDescription: "Laden Sie Dateien hoch und starten Sie die Verarbeitung, um hier Einträge zu sehen.",
    noDownloadableFiles: "Keine herunterladbaren Dateien.",
    noOutputFiles: "Keine herunterladbaren Ausgabedateien.",
    downloadFailed: "Download fehlgeschlagen.",
    aiTrainingUpdateFailed: "KI-Trainingsnutzung konnte nicht aktualisiert werden.",
    fileExpiredTooltip: "Die Datei wurde gelöscht, da die Speicherfrist (1 Jahr) abgelaufen ist.",
    unknownUser: "Unbekannter Benutzer",
    allow: "Zulassen",
    deny: "Ablehnen",
    columns: {
      policy: "Richtlinie",
      user: "Benutzer",
      status: "Status",
      startTime: "Startzeit",
      fileSize: "Dateigröße",
      aiTraining: "KI-Trainingsnutzung",
      errorDetail: "Fehlerdetails",
      download: "Download"
    }
  }
};

export default de;