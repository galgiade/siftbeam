export default {
  "table": {
    "id": "ID",
    "userName": "Benutzername",
    "policyName": "Richtlinienname",
    "usageAmountBytes": "Nutzung",
    "status": "Status",
    "errorDetail": "Fehler",
    "createdAt": "Startdatum",
    "updatedAt": "Aktualisierungsdatum",
    "download": "Herunterladen",
    "aiTraining": "KI-Schulung",
    "delete": "Löschen",
    "ariaLabel": "Datenverarbeitungshistorie-Tabelle"
  },
  "status": {
    "in_progress": "In Bearbeitung",
    "success": "Abgeschlossen",
    "failed": "Fehlgeschlagen",
    "canceled": "Abgebrochen",
    "deleted": "Gelöscht",
    "delete_failed": "Löschen fehlgeschlagen"
  },
  "notification": {
    "uploadSuccess": "Datei-Upload abgeschlossen. Die Datenverarbeitung wird gestartet.",
    "uploadError": "Upload fehlgeschlagen.",
    "uploadProcessingError": "Während der Upload-Verarbeitung ist ein Fehler aufgetreten.",
    "uploadFailed": "Datei-Upload fehlgeschlagen. Bitte versuchen Sie es erneut.",
    "fetchFailed": "Daten konnten nicht abgerufen werden.",
    "aiTrainingChanged": "KI-Schulungsberechtigung wurde geändert.",
    "deleteCompleted": "Dateilöschung abgeschlossen.",
    "uploadCompleted": "Upload abgeschlossen.",
    "uploadFailedGeneric": "Upload fehlgeschlagen.",
    "dataFetchFailed": "Daten konnten nicht abgerufen werden.",
    "notificationSent": "Benachrichtigungs-E-Mail erfolgreich gesendet.",
    "notificationFailed": "Benachrichtigung konnte nicht gesendet werden.",
    "notificationError": "Beim Senden der Benachrichtigung ist ein Fehler aufgetreten.",
    "dataUpdated": "Daten erfolgreich aktualisiert."
  },
  "filter": {
    "userName": {
      "placeholder": "Nach Benutzername suchen",
      "ariaLabel": "Benutzername-Suche"
    },
    "policyName": {
      "placeholder": "Nach Richtlinienname suchen",
      "ariaLabel": "Richtlinienname-Suche"
    },
    "dateRange": {
      "label": "Datumsbereich",
      "startDate": {
        "placeholder": "Startdatum",
        "ariaLabel": "Startdatum-Auswahl"
      },
      "endDate": {
        "placeholder": "Enddatum",
        "ariaLabel": "Enddatum-Auswahl"
      },
      "separator": "~"
    },
    "minUsage": {
      "label": "Min. Nutzung",
      "placeholder": "Min",
      "ariaLabel": "Minimale Nutzung"
    },
    "maxUsage": {
      "label": "Max. Nutzung",
      "placeholder": "Max",
      "ariaLabel": "Maximale Nutzung"
    },
    "reset": "Filter zurücksetzen",
    "rangeSeparator": "~",
    "refresh": "Daten aktualisieren",
    "deleteSelected": "Ausgewählte Elemente löschen"
  },
  "policy": {
    "select": "Richtlinie auswählen",
    "none": "Es wurden keine Richtlinien erstellt.",
    "create": "Richtlinie erstellen",
    "noPolicies": "Es wurden keine Richtlinien erstellt.",
    "createPolicy": "Richtlinie erstellen"
  },
  "deleteDialog": {
    "title": "Löschbestätigung",
    "warn1": "Die ausgewählten Dateien werden dauerhaft gelöscht.",
    "warn2": "Nach dem Löschen können verarbeitete Dateien nicht mehr heruntergeladen werden.",
    "warn3": "Außerdem können sie nicht mehr für die KI-Schulung verwendet werden.",
    "warn4": "Diese Aktion kann nicht rückgängig gemacht werden. Bitte seien Sie vorsichtig.",
    "confirm": "Sind Sie sicher, dass Sie löschen möchten? Bitte geben Sie 'LÖSCHEN' ein.",
    "cancel": "Abbrechen",
    "delete": "Löschen"
  },
  "limitUsage": {
    "title": "Nutzungslimit-Status",
    "status": {
      "normal": "Normal",
      "warning": "Warnung",
      "exceeded": "Überschritten"
    },
    "current": "Aktuell:",
    "limit": "Limit:",
    "noLimit": "Kein Limit",
    "exceedAction": {
      "notify": "Benachrichtigen",
      "restrict": "Einschränken"
    },
    "testNotification": "Test-Benachrichtigung senden",
    "limitTypes": {
      "usage": "Nutzungslimit",
      "amount": "Betragslimit"
    },
    "unknownCompany": "Unbekanntes Unternehmen"
  },
  "tableEmpty": "Keine Datenverarbeitungshistorie.",
  "pagination": {
    "prev": "Zurück",
    "next": "Weiter"
  },
  "displayCount": "Zeige {shown} von {total} (Alle {all})"
} as const;



