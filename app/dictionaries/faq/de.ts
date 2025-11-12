import type FAQLocale from './faq.d';

const de: FAQLocale = {
  title: 'Häufig gestellte Fragen (FAQ)',
  description: 'Finden Sie Antworten auf häufige Fragen zum siftbeam Datenverarbeitungsservice.',
  categories: {
    service: {
      title: 'Serviceübersicht',
      items: [
        {
          question: 'Was ist siftbeam?',
          answer: 'siftbeam ist ein B2B-Datenverarbeitungsservice für Unternehmen. Wir bieten anpassbare Datenverarbeitungs-Workflows für jeden Kunden und ermöglichen automatisierte Dateitransformation, -verarbeitung und -verwaltung auf sicherer Cloud-Infrastruktur.'
        },
        {
          question: 'Für welche Arten von Unternehmen ist es geeignet?',
          answer: [
            'Ideal für:',
            '• Unternehmen, die benutzerdefinierte Datenverarbeitung benötigen',
            '• Firmen mit komplexen Datentransformationsanforderungen',
            '• Organisationen, die skalierbare Datenverarbeitungslösungen suchen',
            '• Unternehmen, die sichere cloudbasierte Daten-Workflows benötigen'
          ]
        },
        {
          question: 'Wie unterscheidet sich siftbeam von anderen Datenverarbeitungsdiensten?',
          answer: [
            'Hauptmerkmale:',
            '• Kundenspezifische Anpassung: Im Gegensatz zu generischen Tools bietet siftbeam vollständig anpassbare Workflows',
            '• Zuverlässigkeit auf Unternehmensniveau: Aufgebaut auf bewährter Cloud-Infrastruktur',
            '• Keine Anbieterabhängigkeit: Standarddatenformate und offene APIs',
            '• Transparente Preisgestaltung: Zahlen Sie nur für das, was Sie nutzen'
          ]
        }
      ]
    },
    features: {
      title: 'Funktionen & Spezifikationen',
      items: [
        {
          question: 'Welche Funktionen sind verfügbar?',
          answer: [
            'Hauptfunktionen:',
            '• Flexibles Datenmanagement: Richtlinienbasiertes Datei-Upload und -Management',
            '• Nutzungsüberwachung und -kontrolle: Echtzeitüberwachung mit automatischen Benachrichtigungen und Einschränkungen',
            '• Analyse der Verarbeitungsergebnisse: Detaillierte Metriken und Berichte zur Betriebsoptimierung',
            '• Sichere Dateispeicherung: Verschlüsselte Dateiverarbeitung mit automatischer 1-Jahres-Aufbewahrung',
            '• Mehrsprachige Unterstützung: Verfügbar in 9 Sprachen (Japanisch, Englisch, Chinesisch, Koreanisch, Französisch, Deutsch, Spanisch, Portugiesisch, Indonesisch)'
          ]
        },
        {
          question: 'Wie lange werden Daten gespeichert?',
          answer: 'Hochgeladene Daten werden nach der Verarbeitung automatisch 1 Jahr lang gespeichert. Nach 1 Jahr werden die Daten automatisch gelöscht. Es fallen keine zusätzlichen Speichergebühren an.'
        },
        {
          question: 'Welche Datenformate werden unterstützt?',
          answer: 'Wir unterstützen wichtige Datenformate wie CSV, JSON und mehr. Da wir kundenspezifische Anpassungen anbieten, kontaktieren Sie uns bitte, wenn Sie Unterstützung für ein bestimmtes Format benötigen.'
        },
        {
          question: 'Wie anpassbar ist die Datenverarbeitung?',
          answer: 'Vollständig anpassbar für jeden Kunden. Sie können komplexe Datenverarbeitungs-Workflows erstellen und Verarbeitungsregeln flexibel mithilfe von Richtlinien definieren.'
        }
      ]
    },
    pricing: {
      title: 'Preise & Zahlung',
      items: [
        {
          question: 'Wie ist die Preisstruktur?',
          answer: [
            'Nutzungsbasierte Preisgestaltung:',
            '• Datenverarbeitungsgebühr: 0,00001 $ pro Byte (0,001 Cent pro Byte)',
            '• 1-Jahres-Speicherung inklusive: Keine zusätzlichen Gebühren',
            '• Keine Vorabkosten: Keine Einrichtungsgebühren oder Mindestgebühren',
            '• Monatliche Abrechnung: Nutzung vom 1. bis zum letzten Tag des Monats, Abrechnung am 1. des Folgemonats',
            '',
            'Preisbeispiele:',
            '• Kleine Datei (100B): 0,001 $',
            '• Große Datei (2MB × 3 Dateien = 6.291.456B): 62,91 $'
          ]
        },
        {
          question: 'Welche Zahlungsmethoden sind verfügbar?',
          answer: 'Nur Kreditkartenzahlung (über Stripe). Die Währung ist USD. Monatliche Gebühren werden automatisch am 1. jeden Monats für die Nutzung des Vormonats berechnet.'
        },
        {
          question: 'Gibt es eine kostenlose Testversion?',
          answer: 'Wir bieten derzeit keine kostenlose Testversion an. Mit unserer nutzungsbasierten Preisgestaltung zahlen Sie nur für das, was Sie nutzen. Es gibt keine Mindestnutzungsgebühren.'
        },
        {
          question: 'Können sich die Preise ändern?',
          answer: 'Die Preise können sich mit angemessener Vorankündigung ändern. Bitte überprüfen Sie die Preisseite für die neuesten Informationen.'
        }
      ]
    },
    security: {
      title: 'Sicherheit & Compliance',
      items: [
        {
          question: 'Wie wird die Datensicherheit gewährleistet?',
          answer: [
            'Wir implementieren folgende Sicherheitsmaßnahmen:',
            '• Authentifizierung: Sicheres Authentifizierungssystem mit Multi-Faktor-Authentifizierung (MFA)',
            '• Verschlüsselung: TLS für Daten während der Übertragung, AES-256 für ruhende Daten',
            '• Zugriffskontrolle: Rollenbasierte Zugriffskontrolle nach dem Prinzip der geringsten Rechte',
            '• Audit-Protokolle: Manipulationssichere Audit-Protokollierung',
            '• Schwachstellenmanagement: Kontinuierliche Sicherheitsüberwachung und Schwachstellenreaktion'
          ]
        },
        {
          question: 'Wo werden die Daten gespeichert?',
          answer: 'Daten werden auf einer Cloud-Infrastruktur auf Unternehmensniveau gespeichert. Alle Daten sind verschlüsselt und werden unter strengen Zugriffskontrollen verwaltet.'
        },
        {
          question: 'Was ist mit Compliance?',
          answer: [
            'Wir entsprechen folgenden Datenschutzbestimmungen:',
            '• DSGVO: Konform mit der EU-Datenschutz-Grundverordnung',
            '• CCPA/CPRA: Konform mit kalifornischen Datenschutzgesetzen',
            '• Japanisches Recht: Konform mit dem Gesetz zum Schutz personenbezogener Daten',
            '• Internationale Datenübertragung: Angemessene Schutzmaßnahmen wie EU-Standardvertragsklauseln (SCC)',
            '',
            'Wir stellen eine umfassende Datenschutzerklärung und Datenverarbeitungsvereinbarung (DPA) bereit. Weitere Einzelheiten finden Sie in unserer Datenschutzerklärung.'
          ]
        }
      ]
    },
    support: {
      title: 'Support & Sonstiges',
      items: [
        {
          question: 'Wie kann ich Unterstützung erhalten?',
          answer: [
            'Support-Optionen:',
            '• Kontaktmethode: Chat-Support (über das Service-Dashboard verfügbar)',
            '• Sprachen: Unterstützung in 9 Sprachen (Japanisch, Englisch, Chinesisch, Koreanisch, Französisch, Deutsch, Spanisch, Portugiesisch, Indonesisch)',
            '• Antwortzeit: Antwortet normalerweise innerhalb von 3 Werktagen',
            '• Geschäftszeiten: Japanische Standardzeit (JST)'
          ]
        },
        {
          question: 'Wie fange ich an?',
          answer: [
            'Beginnen Sie in 3 einfachen Schritten:',
            '1. Registrieren (https://siftbeam.com/de/signup/auth)',
            '2. Laden Sie Ihre Datendateien hoch',
            '3. Konfigurieren Sie Ihren Verarbeitungs-Workflow',
            '4. Überwachen Sie die Verarbeitung in Echtzeit',
            '5. Laden Sie verarbeitete Ergebnisse herunter'
          ]
        },
        {
          question: 'Wird eine API bereitgestellt?',
          answer: 'Ja, wir stellen APIs für Daten-Upload und Verarbeitungsverwaltung bereit. Detaillierte Dokumentation und Beispielcode sind nach der Registrierung verfügbar.'
        }
      ]
    }
  }
};

export default de;

