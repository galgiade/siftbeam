export default {
  label: {
    policyList: "Richtlinienliste",
    policyNotRegistered: "Keine Richtlinien registriert",
    policyName: "Richtlinienname",
    policyNamePlaceholder: "Richtlinienname",
    description: "Beschreibung",
    descriptionPlaceholder: "Beschreibung",
    allowedFileTypes: "Zulässige Dateitypen:",
    selectFileTypes: "Dateitypen auswählen (Mehrfach)",
    fileTypes: {
      'image/jpeg': 'JPEG-Bild',
      'image/png': 'PNG-Bild',
      'image/gif': 'GIF-Bild',
      'image/webp': 'WebP-Bild',
      'application/pdf': 'PDF-Datei',
      'text/csv': 'CSV-Datei',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel-Datei (.xlsx)',
      'application/vnd.ms-excel': 'Excel-Datei (.xls)',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word-Datei (.docx)',
      'application/msword': 'Word-Datei (.doc)',
      'text/plain': 'Textdatei',
      'application/json': 'JSON-Datei',
      'application/zip': 'ZIP-Archiv'
    }
  },
  alert: {
    required: "Dieses Feld ist erforderlich",
    invalidEmail: "Bitte eine gültige E-Mail-Adresse eingeben",
    fileTypeRequired: "Bitte mindestens einen Dateityp auswählen",
    adminOnlyEditMessage: "Nur Administratoren können Richtlinien bearbeiten. Sie haben keine Berechtigung zum Bearbeiten.",
    adminOnlyCreateMessage: "Nur Administratoren können Richtlinien erstellen. Bitte wenden Sie sich an Ihren Administrator.",
    updateSuccess: "Richtlinie erfolgreich aktualisiert",
    updateFailed: "Fehler beim Aktualisieren der Richtlinie",
    validationError: "Bitte überprüfen Sie Ihre Eingabe"
  },
  analysis: {
    title: "Analyse",
    description: "Modell × Datensatz Bewertungsergebnisse",
    noDataMessage: "Keine Analysedaten verfügbar",
    noDataForPolicyMessage: "Keine Analysedaten für die ausgewählte Richtlinie verfügbar",
    paginationAriaLabel: "Paginierung",
    displayCount: "Anzeige",
    columns: {
      evaluationDate: "Bewertungsdatum",
      policy: "Richtlinie",
      accuracy: "Genauigkeit",
      defectDetectionRate: "Fehlererkennungsrate",
      reliability: "Zuverlässigkeit",
      responseTime: "Antwortzeit",
      stability: "Stabilität",
      actions: "Aktionen"
    },
    actions: {
      view: "Anzeigen"
    }
  }
} as const;



