const de = {
  hero: {
    title: "siftbeam",
    subtitle: "Eine Plattform für effiziente Datenverarbeitung und -verwaltung",
    contact: "Kontakt",
    buttons: {
      howTo: "So funktioniert es",
      pricing: "Preise ansehen",
    }
  },
  features: {
    title: "Drei Kernfunktionen der Datenverarbeitungsplattform",
    dataAnalysis: {
      title: "Flexible Datenverwaltung",
      description: "Dateien mit richtlinienbasierten Kontrollen hochladen und verwalten. Verarbeitungshistorie detailliert nachverfolgen.",
      points: [
        "Policyauswahl und Massen-Uploads",
        "Monatliche Nutzungsanzeige und Überschreitungswarnungen",
        "Filter nach Benutzer/Policy/Datum/Nutzung",
        "ZIP-Massendownload, Löschen, Lernberechtigung umschalten",
      ]
    },
    anomalyDetection: {
      title: "Nutzungsüberwachung und -kontrolle",
      description: "Datennutzung in Echtzeit überwachen und Benachrichtigungen oder automatische Einschränkungen basierend auf konfigurierten Limits ausführen.",
      points: [
        "Zwei Modi: Benachrichtigen oder Einschränken",
        "Schwellenwerte basierend auf Nutzung oder Kosten",
        "Benachrichtigen oder automatisch einschränken bei Überschreitung",
        "Automatische Anzeige geeigneter Limits basierend auf aktueller Nutzung",
      ]
    },
    customAI: {
      title: "Analyse der Verarbeitungsergebnisse und Berichte",
      description: "Detaillierte Analysedaten der Verarbeitungsergebnisse einsehen und für die Betriebsoptimierung nutzen.",
      points: [
        "Detaillierte Metriken der Verarbeitungsergebnisse prüfen",
        "Operative Leistungsindikatoren wie Latenz",
        "Detaillierte Berichte ansehen und validieren",
        "Nach Policy filtern und sortieren",
      ]
    }
  },
  steps: {
    title: "In 3 einfachen Schritten starten",
    step1: {
      title: "Policy-Einrichtung und Daten-Upload",
      description: "Policies erstellen, die erlaubte Dateiformate definieren, dann Daten per Drag & Drop oder API hochladen. Zwei-Faktor-Authentifizierung gewährleistet Sicherheit."
    },
    step2: {
      title: "Automatisierte Verarbeitungsausführung",
      description: "Hochgeladene Daten werden automatisch basierend auf der ausgewählten Policy verarbeitet. Verarbeitungsergebnisse werden ein Jahr lang gespeichert."
    },
    step3: {
      title: "Verwaltung der Verarbeitungshistorie und Leistungsbewertung",
      description: "Verarbeitungshistorie mit einem intuitiven Dashboard überprüfen. Leistungsmetriken des Verarbeitungsmodells in Echtzeit überwachen für optimalen Betrieb. Pay-as-you-go optimiert die Kosten."
    }
  },
  cta: {
    title: "Starten Sie jetzt effiziente Datenverarbeitung",
    description: "Verarbeitungsregeln mit Policies definieren und große Datenmengen effizient verwalten. Pay-as-you-go-Preise eliminieren unnötige Kosten.",
    button: "Kontakt",
    secondaryButton: "Zuerst die Einrichtungsschritte ansehen"
  }
} as const;

export default de;


