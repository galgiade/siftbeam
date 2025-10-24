import type TermsLocale from "./TermsLocale";

const de: TermsLocale = {
  title: "Nutzungsbedingungen (siftbeam)",
  intro:
    "Diese Nutzungsbedingungen (die 'Bedingungen') regeln die Nutzung von siftbeam (der 'Dienst'), bereitgestellt von Connect Tech Inc. (das 'Unternehmen'). Mit der Nutzung des Dienstes stimmen Nutzer diesen Bedingungen zu.",
  sections: {
    definitions: {
      title: "Begriffsbestimmungen",
      items: [
        "Dienst: Erstellt/verbessert KI-Modelle auf Basis nutzergelieferter Daten, führt Vorhersagen/Clustering/Klassifizierungen aus, erstellt Statistiken und exportiert Ergebnisse (z. B. CSV).",
        "Nutzerdaten: Vom Nutzer dem Unternehmen bereitgestellte Daten (Rohdaten, Metadaten, Protokolle, Anweisungen usw.).",
        "Ausgabedaten: Durch den Dienst generierte/verarbeitete Ergebnisse (inkl. CSV-Exporte).",
        "Modell: Vom Unternehmen erstellte/betriebene/verbesserte KI-Modelle (Features, trainierte Gewichte, Prompts, Pipelines, Metriken).",
        "Nutzungsabhängige Abrechnung: Abrechnung nach Aufnahme-/Verarbeitungs-/Speichervolumen usw.",
      ],
    },
    scopeChanges: {
      title: "Geltungsbereich & Änderungen",
      paragraphs: [
        "Diese Bedingungen gelten für alle Beziehungen zwischen Unternehmen und Nutzern hinsichtlich der Nutzung des Dienstes.",
        "Das Unternehmen kann Bedingungen anpassen; wesentliche Änderungen werden mitgeteilt. Fortgesetzte Nutzung gilt als Zustimmung.",
      ],
    },
    account: {
      title: "Konto",
      items: [
        "Registrierungsdaten korrekt und aktuell halten; Zugangsdaten sicher verwalten.",
        "Keine Haftung für unbefugte Kontonutzung außer bei Vorsatz/grober Fahrlässigkeit des Unternehmens.",
      ],
    },
    services: {
      title: "Leistungsbeschreibung",
      paragraphs: [
        "Unternehmen erstellt KI-Modelle gemäß Nutzeranforderungen und führt Vorhersagen/Clustering/Klassifikationen aus oder erstellt Statistiken.",
        "Bei fortlaufender Datenbereitstellung kann Modellverbesserung erfolgen.",
        "Ergebnisse werden u. a. als CSV exportiert (Formate/Elemente/Frequenz laut separater Spezifikation).",
        "Funktionen können ergänzt/geändert/ausgesetzt; Beta-Funktionen möglich.",
      ],
    },
    dataHandling: {
      title: "Datenverarbeitung",
      subsections: {
        ownership: {
          title: "Eigentum",
          items: [
            "Rechte an Nutzerdaten beim Nutzer.",
            "Rechte an Ausgabedaten grundsätzlich beim Nutzer (Sicherstellung fehlender Drittrechtsverletzungen durch Nutzer).",
            "IP-Rechte an Modellen/Algorithmen/Know-how/Templates beim Unternehmen oder Lizenzgebern.",
          ],
        },
        license: {
          title: "Lizenz",
          paragraphs: [
            "Weltweites, gebührenfreies, nicht-exklusives Nutzungsrecht an Nutzerdaten für Dienstleistung, Qualitätsverbesserung, Training/Evaluierung/Tuning sowie Statistik. Personenbezogene Daten gemäß Datenschutzerklärung.",
            "Erstellung/Veröffentlichung/Nutzung nicht-identifizierender Statistiken/Indikatoren möglich.",
          ],
        },
        storageDeletion: {
          title: "Speicherung & Löschung",
          paragraphs: [
            "Speicherregion Japan (Tokio) standardmäßig; Änderungen i. d. R. 30 Tage vorher per E-Mail und/oder In-App-Hinweis (Ausnahmen bei Notfällen/gesetzlichen Anforderungen).",
            "Individuelle Löschung durch Nutzer; nach Kontolöschungsantrag logische Löschung und endgültige Löschung nach 90 Tagen (Backups ggf. später).",
          ],
        },
        incidents: {
          title: "Störungen",
          paragraphs: [
            "Zur Fehlerbehebung minimaler Zugriff/Nutzung unter Zugriffskontrolle und Audit-Logs; anschließend zügige Löschung/Anonymisierung.",
          ],
        },
        learningOptOut: {
          title: "Training-Opt-out",
          paragraphs: [
            "Opt-out auf Konto- oder verarbeitete-Datei-Basis möglich; Qualität/Genauigkeit kann beeinflusst werden.",
          ],
        },
      },
    },
    privacy: {
      title: "Umgang mit personenbezogenen Daten (Japan)",
      paragraphs: [
        "Das Unternehmen verarbeitet personenbezogene Daten in Nutzerdaten gemäß APPI und einschlägigen Gesetzen/Leitlinien.",
      ],
      items: [
        "Zwecke: Bereitstellung, Betrieb/Wartung, Anfragen, Qualitätsverbesserung, Sicherheit, Rechtseinhaltung.",
        "Auftragsverarbeiter/Unterauftragsverarbeiter: AWS (Infrastruktur) und Stripe (Zahlungen); keine weiteren ohne vorherige Zustimmung (außer unvermeidbare Wartung/Ersatz mit gleichwertigen Schutzmaßnahmen und Mitteilung).",
        "Drittlandtransfer mit gesetzlichen Schutzmaßnahmen nach Bedarf.",
        "Sicherheit: Zugriffskontrolle, Verschlüsselung, Protokollierung, Funktionstrennung, Schwachstellenmanagement.",
        "Betroffenenrechteanträge nach Unternehmensverfahren (Identitätsprüfung).",
        "Aufbewahrung: Löschung innerhalb angemessener Frist nach Zweckerreichung/Vertragsende (vgl. Abschnitt 5).",
      ],
    },
    prohibited: {
      title: "Verbotene Handlungen",
      items: [
        "Gesetzes-/Sittenverstöße; Verletzung von Rechten Dritter.",
        "Übermittlung personenbezogener/sensibler Daten ohne Rechtsgrund.",
        "Unbefugter Zugriff, Reverse Engineering, übermäßige Last, Spam, Malware.",
        "Rufschädigung, Falschangaben.",
        "Aufbau konkurrierender Dienste ohne vorherige schriftliche Zustimmung.",
      ],
    },
    serviceChange: {
      title: "Änderungen/Aussetzung",
      paragraphs: [
        "Änderung/Unterbrechung/Beendigung ganz/teilweise aufgrund Wartung, Störungen, Compliance, Sicherheit oder höherer Gewalt möglich.",
        "Außer im Notfall vorherige Information im angemessenen Rahmen.",
      ],
    },
    fees: {
      title: "Gebühren/Abrechnung/Zahlung (Nutzungsbasiert)",
      subsections: {
        currencyUnit: {
          title: "Währung/Einheit",
          items: [
            "Währung: USD (US-Cent).",
            "Messung pro Byte. Berechnet pro Byte.",
          ],
        },
        unitPrices: {
          title: "Einheitspreise",
          items: [
            "Verarbeitung: 0,001 US-Cent/B.",
            "Speicherung: 0,0001 US-Cent/B pro Monat.",
            "Kein Gratis-Kontingent, keine Mindest- oder Einrichtungsgebühr.",
          ],
        },
        measurementMethod: {
          title: "Messung",
          items: [
            "Verarbeitung anhand monatlicher Upload-Gesamtmenge inkl. temporärer Expansion, Zwischenständen, Wiederholungen.",
            "Speicherung nach Tagesdurchschnitt oder Monatsmaximum (je höherer Wert).",
          ],
        },
        billingPayment: {
          title: "Abrechnung/Zahlung",
          items: [
            "Abschluss: Monatsende; Zahlung: 5. Tag des Monats.",
            "Zahlung: Kreditkarte (Stripe).",
            "Rundung gem. Stripe-Präzision/Mindesteinheit (Unternehmens-Regeln).",
            "Steuern gem. Gesetz zusätzlich.",
            "Keine Rückerstattung für bereits erbrachte Leistungen (außer gesetzlich erforderlich).",
            "Verzugszinsen: 14,6 % p. a.",
          ],
        },
        priceChange: {
          title: "Preisänderungen",
          paragraphs: [
            "Änderungen mit angemessener Vorankündigung; Anwendung auf Nutzung nach Mitteilung.",
          ],
        },
      },
    },
    ipAndDeliverables: {
      title: "Geistiges Eigentum und Ergebnisse",
      paragraphs: [
        "Das Unternehmen behält IP-Rechte an Modellen, Templates, Skripten und Workflows.",
        "Nutzer dürfen Ausgabedaten während der Vertragslaufzeit nicht-exklusiv für eigene Geschäftszwecke verwenden.",
        "Bei kundenspezifischen Modellen darf das Unternehmen nicht nutzeridentifizierende Erkenntnisse/Gewichte/Merkmale zur Verbesserung anderer Dienste verwenden (abweichende Individualverträge gehen vor).",
      ],
    },
    representations: {
      title: "Zusicherungen/Gewährleistungen",
      paragraphs: [
        "Nutzer sichern zu, (i) rechtmäßige Befugnisse/Einwilligungen/Vertragserlaubnisse an den Nutzerdaten zu besitzen, (ii) keine Rechte Dritter zu verletzen und (iii) keine Gesetze zu brechen.",
        "Aufgrund der Natur von KI übernimmt das Unternehmen keine Gewähr für Genauigkeit/Vollständigkeit/Nützlichkeit/Eignung/Reproduzierbarkeit der Ausgaben.",
      ],
    },
    disclaimer: {
      title: "Haftungsausschluss",
      paragraphs: [
        "Keine Haftung für Schäden durch außerhalb des Einflussbereichs liegende Ereignisse, z. B. höhere Gewalt, Netzwerk-/Cloud-Ausfälle, Gesetzesänderungen oder rechtswidrige Handlungen Dritter.",
        "Beta-/Testfunktionen, Beispielcode und empfohlene Werte werden wie besehen bereitgestellt.",
      ],
    },
    liabilityLimit: {
      title: "Haftungsbeschränkung",
      paragraphs: [
        "Außer bei Vorsatz/grober Fahrlässigkeit ist die Haftung des Unternehmens auf die in den vorangegangenen 12 Monaten gezahlte Gesamtsumme begrenzt.",
        "Ausgenommen sind Personenschäden, vorsätzliche IP-Verletzungen oder Verstöße gegen die Vertraulichkeit.",
      ],
    },
    thirdParty: {
      title: "Dienste Dritter",
      paragraphs: [
        "Für integrierte Drittanbieterdienste/APIs (z. B. AWS, Stripe) gelten deren Bedingungen; Änderungen/Ausfälle können Funktionen beeinflussen.",
      ],
    },
    confidentiality: {
      title: "Vertraulichkeit",
      paragraphs: [
        "Parteien behandeln nicht-öffentliche Informationen vertraulich, geben sie nicht an Dritte weiter und nutzen sie nicht zweckfremd; Pflicht gilt nach Vertragsende fort.",
      ],
    },
    support: {
      title: "Support",
      items: [
        "Support ausschließlich per Chat; keine Telefon-/Videoanrufe.",
        "Ziel: Antwort innerhalb von drei Werktagen; keine festen Zeiten/Zusagen.",
      ],
    },
    termTermination: {
      title: "Laufzeit/Kündigung",
      items: [
        "Nutzung startet am Antragstag; Kündigung nach Unternehmensvorgaben (für laufenden Monat fristgerecht beantragen).",
        "Bei schwerwiegenden Verstößen, Zahlungsverzug oder Bezug zu kriminellen Vereinigungen kann ohne Ankündigung gesperrt/gekündigt werden.",
      ],
    },
    antisocialForces: {
      title: "Ausschluss von kriminellen Vereinigungen",
      paragraphs: [
        "Beide Parteien versichern, nicht zu kriminellen Vereinigungen zu gehören; bei Verstoß ist fristlose Beendigung möglich.",
      ],
    },
    assignment: {
      title: "Abtretungsverbot",
      paragraphs: [
        "Ohne vorherige schriftliche Zustimmung des Unternehmens keine Abtretung oder Sicherungsübereignung von Rechten/Pflichten.",
      ],
    },
    severabilityEntire: {
      title: "Salvatorische Klausel/Gesamtvereinbarung",
      paragraphs: [
        "Ist eine Bestimmung unwirksam/undurchsetzbar, bleiben übrige wirksam.",
        "Diese Bedingungen bilden die Gesamtvereinbarung; abweichende Individualverträge gehen vor.",
      ],
    },
    governingLawJurisdiction: {
      title: "Recht/Gerichtsstand",
      paragraphs: [
        "Japanisches Recht gilt.",
        "Ausschließlicher Gerichtsstand: Bezirksgericht Hamamatsu (erste Instanz).",
      ],
    },
    notices: {
      title: "Mitteilungen",
      paragraphs: [
        "Mitteilungen per In-App-Hinweis, E-Mail oder andere geeignete Mittel.",
        "Nutzerkontakt: connectechceomatsui@gmail.com.",
      ],
    },
  },
  appendix: {
    lastUpdated: "14. August 2025",
    company: {
      name: "Connect Tech Inc.",
      address: "Dias Wago 202, 315-1485 Wago-cho, Chuo-ku, Hamamatsu, Shizuoka, Japan",
      representative: "Kazuaki Matsui",
      contact: "connectechceomatsui@gmail.com",
    },
  },
};
export default de;