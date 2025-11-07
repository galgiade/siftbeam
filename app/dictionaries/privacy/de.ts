import type PrivacyLocale from "./PrivacyLocale";

const de: PrivacyLocale = {
  title: "Datenschutzerklärung (inkl. DPA) | siftbeam",
  intro:
    "Diese Datenschutzerklärung (die „Erklärung“) beschreibt, wie die Connect Tech Inc. (das „Unternehmen“) personenbezogene Informationen und personenbezogene Daten im Zusammenhang mit dem Dienst „siftbeam“ (der „Dienst“) verarbeitet. Sie entspricht dem japanischen Datenschutzrecht (APPI). Regelungen zur Auftragsverarbeitung (DPA) sind in den untenstehenden Anhängen enthalten.",
  sections: {
    definitions: {
      title: "Begriffe",
      items: [
        "Personenbezogene Informationen/Daten: Wie im APPI definiert.",
        "Nutzerdaten: Vom Nutzer dem Unternehmen bereitgestellte Daten (Rohdaten, Protokolle, Anweisungen, Metadaten usw.), ggf. einschließlich personenbezogener Daten.",
        "Ausgabedaten: Durch den Dienst erzeugte/verarbeitete Ergebnisse (einschließlich Exporte wie CSV).",
        "Verarbeitung: Jegliche Vorgänge wie Erhebung, Aufzeichnung, Bearbeitung, Speicherung, Nutzung, Bereitstellung, Löschung usw.",
        "Auftragsverarbeiter/Unterauftragsverarbeiter: Vom Unternehmen beauftragte Anbieter (z. B. AWS, Stripe).",
      ],
    },
    company: {
      title: "Unternehmensangaben",
      items: [
        "Name: Connect Tech Inc.",
        "Anschrift: Dias Wago 202, 315-1485 Wago-cho, Chuo-ku, Hamamatsu-shi, Shizuoka, Japan",
        "Vertretungsberechtigter: Kazuaki Matsui",
        "Kontakt: connectechceomatsui@gmail.com",
      ],
    },
    dataCollected: {
      title: "Kategorien der erhobenen Informationen",
      items: [
        "Kontoinformationen (Name, E-Mail, Organisation, Rolle usw.)",
        "Authentifizierungs- und Protokolldaten (Auth-ID, Zugriffsprotokolle, IP-Adresse, Geräteinformationen, Cookies/ähnliche Technologien)",
        "Zahlungsinformationen (über Stripe verarbeitet; Kartendaten werden von Stripe verwaltet)",
        "Nutzerdaten (Uploads, Daten für Verarbeitung/Lernen, Anweisungen)",
        "Support-Kommunikation (Chat-Inhalte)",
      ],
    },
    purposes: {
      title: "Zwecke der Verarbeitung",
      items: [
        "Bereitstellung, Betrieb, Funktionsverbesserung und Qualitätssteigerung des Dienstes (einschließlich Training, Bewertung und Tuning von Modellen)",
        "Authentifizierung, Sicherheit, Störungsbehebung und Protokollanalyse",
        "Abrechnung, Fakturierung und Betrugsprävention",
        "Support (Chat), Benachrichtigungen und Aktualisierungen von Richtlinien/AGB",
        "Erstellung und Veröffentlichung statistischer Informationen (nur in nicht identifizierbarer Form)",
        "Einhaltung gesetzlicher Vorschriften und Schutz von Rechten",
      ],
    },
    storageDeletion: {
      title: "Speicherort, Aufbewahrung und Löschung",
      paragraphs: [
        "Speicherregion: Grundsätzlich Japan (Region Tokio). Änderungen werden vorab angekündigt.",
        "Bei Regionsänderungen erfolgt grundsätzlich mindestens 30 Tage vorher eine Benachrichtigung per E-Mail und/oder im Produkt (außer in Notfällen/gesetzlich erforderlichen Fällen).",
        "Aufbewahrungsdauer: Verarbeitete Daten werden 1 Jahr gespeichert und anschließend automatisch gelöscht. Nutzer können Daten einzeln löschen.",
        "Abrechnung & Zahlung: Monatlicher Abschluss am Monatsende (Nutzung vom 1. bis zum letzten Tag des Monats). Rechnungsdatum: 1. des Folgemonats. Zahlungsfrist: 15. des Folgemonats.",
        "Kontolöschung: Logische Löschung auf Antrag und endgültige Löschung nach 90 Tagen (Backups können zusätzliche Zeit erfordern).",
        "Bei technischen Problemen: Zugriff/Nutzung der minimal erforderlichen Nutzerdaten zur Untersuchung/Behebung; nach Lösung werden Daten zügig gelöscht oder anonymisiert.",
      ],
    },
    thirdParties: {
      title: "Weitergabe an Dritte, gemeinsame Nutzung und Auftragsverarbeitung",
      items: [
        "Weitergabe an Dritte: Ohne Einwilligung nicht, es sei denn gesetzlich vorgeschrieben.",
        "Auftragsverarbeitung: Hauptauftragsverarbeiter sind AWS (Infrastruktur) und Stripe (Zahlungen). Angemessene Überwachung ist gewährleistet.",
        "Unterauftragsverarbeitung: Keine über das Vorstehende hinaus ohne vorherige Zustimmung des Nutzers (bei unvermeidbarer Wartung/Ersatz werden gleichwertige oder strengere Schutzmaßnahmen ergriffen und umgehend informiert).",
        "Internationale Übermittlungen: Aufgrund von Stripe o. ä. kann eine Speicherung/Verarbeitung außerhalb Japans (z. B. USA) erfolgen; gesetzliche Schutzmaßnahmen werden angewandt.",
      ],
      paragraphs: [
        "Bei internationalen Übermittlungen wendet das Unternehmen geeignete Schutzmechanismen an, z. B. EU-Standardvertragsklauseln (SCC), UK IDTA/UK SCC Addendum und das Schweizer FDPIC-Addendum (siehe Anhang B).",
      ],
    },
    learningOptOut: {
      title: "Lernnutzung und Opt-out",
      items: [
        "Nutzerdaten können zur Verbesserung von Modellen verwendet werden.",
        "Opt-out: Ausschluss auf Kontoebene oder für bestimmte „verarbeitete Dateien“ möglich. Dies kann die Qualität beeinflussen.",
      ],
    },
    security: {
      title: "Sicherheit",
      items: [
        "Umsetzung von Maßnahmen wie Zugriffskontrollen, Verschlüsselung bei Übertragung/Ruhe, Funktionstrennung, Audit-Logs und Schwachstellenmanagement.",
        "Vertraulichkeitsverpflichtungen und Schulungen für Mitarbeiter und Auftragsverarbeiter.",
        "Bei gravierenden Verstößen: Maßnahmen gemäß Gesetz, einschließlich Benachrichtigung von Behörden/Betroffenen.",
      ],
    },
    userRights: {
      title: "Rechte der Nutzer",
      paragraphs: [
        "Nutzer können Auskunft, Berichtigung, Ergänzung, Löschung, Nutzungsaussetzung oder Einstellung der Weitergabe verlangen (Identitätsprüfung erforderlich). Kontakt: connectechceomatsui@gmail.com",
      ],
    },
    legalBasisAndRoles: {
      title: "Rechtsgrundlagen und Rollen (Verantwortlicher/Auftragsverarbeiter)",
      items: [
        "Für personenbezogene Daten zu Kontoführung, Abrechnung und Betrieb handelt das Unternehmen als ‚Geschäftsbetreiber‘ (entspricht Verantwortlichem).",
        "Für vom Kunden anvertraute Nutzerdaten (innerhalb der Zwecke des Kunden) handelt das Unternehmen als ‚Auftragsverarbeiter‘.",
        "Soweit US-Bundesstaatenrecht (z. B. CCPA/CPRA) gilt, erfüllt das Unternehmen die Pflichten als ‚Service Provider/Processor‘ (siehe Anhang C).",
        "Diese Erklärung basiert auf japanischem Recht; soweit andere Rechtsordnungen (z. B. EU/EWR) einschlägig sind, werden erforderliche zusätzliche Maßnahmen (z. B. SCC) umgesetzt.",
      ],
    },
    cookies: {
      title: "Cookies und ähnliche Technologien",
      paragraphs: [
        "Zur Verbesserung der Nutzbarkeit, Sicherheit und Analyse können Cookies/ähnliche Technologien eingesetzt werden. Eine Deaktivierung im Browser ist möglich, kann jedoch Funktionen beeinträchtigen.",
      ],
    },
    minors: {
      title: "Personenbezogene Daten Minderjähriger",
      paragraphs: [
        "Grundsätzlich ist die Nutzung durch Minderjährige ohne Zustimmung der Erziehungsberechtigten nicht vorgesehen.",
      ],
    },
    policyChanges: {
      title: "Änderungen dieser Erklärung",
      paragraphs: [
        "Wesentliche Änderungen werden vorab mitgeteilt. Die fortgesetzte Nutzung nach Mitteilung gilt als Zustimmung.",
      ],
    },
    contact: {
      title: "Kontakt",
      paragraphs: [
        "Bei Fragen zur Verarbeitung personenbezogener Daten: connectechceomatsui@gmail.com. Support ausschließlich per Chat; Ziel: Antwort innerhalb von drei Werktagen.",
      ],
    },
  },
  annexes: {
    annexA_DPA: {
      title: "Anhang A | Auftragsverarbeitungsvereinbarung (DPA)",
      subsections: {
        roles: {
          title: "A-1. Rollen",
          paragraphs: [
            "Der Kunde ist Verantwortlicher; das Unternehmen ist Auftragsverarbeiter und verarbeitet Nutzerdaten gemäß den Weisungen des Kunden.",
          ],
        },
        scope: {
          title: "A-2. Zweck und Umfang",
          items: [
            "Zweck: Bereitstellung von siftbeam, Modellerstellung/-verbesserung, Generierung von Ausgaben, Wartung/Support, Sicherheit, Abrechnung.",
            "Betroffene Daten: Vom Kunden übermittelte personenbezogene Daten (z. B. Namen, Kennungen, Kontaktdaten, Attribute, Protokolle).",
            "Betroffene Personen: Kunden des Kunden, Nutzer, Mitarbeitende usw.",
          ],
        },
        processorDuties: {
          title: "A-3. Pflichten des Auftragsverarbeiters",
          items: [
            "Verarbeitung ausschließlich gemäß den schriftlichen (auch elektronischen) Weisungen des Kunden.",
            "Sicherstellung der Vertraulichkeit.",
            "Aufrechterhaltung angemessener technischer und organisatorischer Sicherheitsmaßnahmen.",
            "Bei direkt eingehenden Betroffenenanfragen unverzügliche Weiterleitung an und Zusammenarbeit mit dem Kunden.",
            "Bei Datenschutzvorfällen unverzügliche Benachrichtigung des Kunden und Unterstützung bei Abhilfemaßnahmen.",
            "Kooperation bei angemessenen Audits/Nachweispflichten des Kunden unter geeigneten Vertraulichkeits-/Sicherheitsauflagen.",
            "Nach Ende der Verarbeitung Löschung oder Rückgabe personenbezogener Daten nach Wahl des Kunden (sofern keine gesetzliche Aufbewahrungspflicht besteht).",
          ],
        },
        subProcessors: {
          title: "A-4. Unterauftragsverarbeiter",
          items: [
            "Bestehende Unterauftragsverarbeiter: AWS (Infrastruktur), Stripe (Zahlungen).",
            "Keine darüberhinausgehende Unterauftragsverarbeitung ohne vorherige Zustimmung des Kunden; bei unvermeidbarem Ersatz werden gleichwertige/strengere Schutzmaßnahmen gewährleistet und vorab informiert.",
            "Auferlegung gleichwertiger Datenschutzpflichten auf alle Unterauftragsverarbeiter.",
          ],
        },
        internationalTransfer: {
          title: "A-5. Internationale Übermittlungen",
          paragraphs: [
            "Bei Verarbeitung außerhalb Japans werden gesetzlich erforderliche Schutzmaßnahmen umgesetzt (z. B. vertragliche Klauseln, gesetzliche Mitteilungen).",
          ],
        },
        retentionDeletion: {
          title: "A-6. Aufbewahrung und Löschung",
          paragraphs: [
            "Nach Weisung des Kunden oder Vertragsende werden personenbezogene Daten innerhalb eines angemessenen Zeitraums gelöscht oder zurückgegeben; Backups werden sicher überschrieben/gelöscht.",
          ],
        },
        auditReporting: {
          title: "A-7. Audit und Berichte",
          paragraphs: [
            "Der Kunde kann Audits (z. B. Dokumentenprüfungen) mit angemessener Vorankündigung und im angemessenen Umfang durchführen; das Unternehmen kooperiert.",
          ],
        },
        liability: {
          title: "A-8. Haftung",
          paragraphs: [
            "Die Verantwortlichkeiten richten sich nach den Nutzungsbedingungen und dieser DPA. Bei Schäden infolge vorsätzlichen oder grob fahrlässigen Verhaltens (z. B. Verstoß gegen Sicherheitsanforderungen) ist die Haftung des Unternehmens gemäß den Nutzungsbedingungen beschränkt.",
          ],
        },
        learningInstruction: {
          title: "A-9. Vorgaben zur Lernnutzung",
          paragraphs: [
            "Der Kunde kann die Lernnutzung auf Konto- oder Dateiebene erlauben/untersagen; das Unternehmen befolgt diese Vorgaben.",
          ],
        },
      },
    },
    annexB_InternationalTransfer: {
      title: "Anhang B | Internationale Übermittlungen (SCC/UK/CH)",
      subsections: {
        applicability: {
          title: "B-1. Anwendbarkeit",
          paragraphs: [
            "Für Übermittlungen aus der EU/EWR werden die SCC (2021/914) angewandt.",
            "Module: Controller→Processor (Modul 2) und Processor→Processor (Modul 3), je nach Bedarf.",
            "Für das Vereinigte Königreich: UK IDTA oder UK SCC Addendum; für die Schweiz: FDPIC-Addendum.",
          ],
        },
        keyChoices: {
          title: "B-2. Zentrale Festlegungen",
          items: [
            "Klausel 7 (Docking Clause): anwendbar.",
            "Klausel 9 (Unterauftragsverarbeiter): allgemeine Genehmigung; aktuelle Unterauftragsverarbeiter (AWS, Stripe). Neue/Änderungen werden i. d. R. 15 Tage vorher angekündigt.",
            "Klausel 11 (Rechtsbehelf): nicht anwendbar (vorbehaltlich Gesetz).",
            "Klausel 17 (Anwendbares Recht): Irisches Recht.",
            "Klausel 18 (Gerichtsstand): Gerichte in Irland.",
          ],
        },
        dpa: {
          title: "B-3. Aufsichtsbehörde",
          paragraphs: [
            "Vorgesehene federführende Aufsichtsbehörde: Irish DPC, sofern nichts anderes vereinbart wird.",
          ],
        },
        annexI: {
          title: "B-4. Annex I (Übermittlungsdetails)",
          items: [
            "Parteien: Datenexporteur (Kunde), Datenimporteur (Unternehmen).",
            "Betroffene Personen: Kunden des Kunden, Endnutzer, Mitarbeitende usw.",
            "Datenkategorien: Kennungen, Kontaktdaten, Verhaltensprotokolle, Transaktionen, Anweisungen/Metadaten (entsprechend Kundenanweisungen).",
            "Besondere Kategorien: Grundsätzlich nicht vorgesehen; ggf. vorherige Vereinbarung erforderlich.",
            "Zwecke: Bereitstellung von siftbeam, Modellerstellung/-verbesserung (Opt-out möglich), Wartung/Sicherheit, Abrechnung, Support.",
            "Aufbewahrung: Bis zur Zweckerreichung; nach Vertragsende Löschung/Rückgabe (sofern keine gesetzliche Aufbewahrung besteht).",
            "Übermittlungsfrequenz: Kontinuierlich/bedarfsgesteuert.",
          ],
        },
        annexII: {
          title: "B-5. Annex II (Technische und organisatorische Maßnahmen)",
          items: [
            "Zugriffskontrollen (Least Privilege, MFA, Funktionstrennung)",
            "Verschlüsselung (TLS bei Übertragung, AES-256 in Ruhe)",
            "Schlüsselverwaltung (Rotation, KMS)",
            "Protokollierung/Audit (Manipulationsschutz, Alarme)",
            "Sichere Entwicklung/Betrieb (Secure SDLC, Schwachstellenmanagement, Abhängigkeitsüberwachung)",
            "Verfügbarkeit (Backups, Intra-Region-Redundanz, Notfallwiederherstellung)",
            "Lieferantenmanagement (Bewertung/Verträge der Unterauftragsverarbeiter)",
            "Prozesse für Betroffenenrechte",
            "Incident Response (Erkennung, Eindämmung, Ursachenanalyse, Benachrichtigung)",
          ],
        },
        annexIII: {
          title: "B-6. Annex III (Unterauftragsverarbeiter)",
          items: [
            "AWS (Infrastruktur/Hosting, primär Region Tokio)",
            "Stripe (Zahlungen)",
            "Bei Ergänzungen erfolgt eine Vorabinformation; gleichwertige/strengere Schutzmaßnahmen werden auferlegt.",
          ],
        },
        govRequests: {
          title: "B-7. Behördenanfragen",
          paragraphs: [
            "Soweit gesetzlich zulässig, unverzügliche Mitteilung an den Exporteur; rechtliche Prüfung und Minimierung des Umfangs; Transparenzberichte können bereitgestellt werden.",
          ],
        },
        tia: {
          title: "B-8. Transfer Impact Assessment (TIA)",
          paragraphs: [
            "Das Unternehmen kooperiert bei Bedarf in angemessenem Umfang mit dem TIA des Exporteurs und stellt relevante Informationen bereit.",
          ],
        },
      },
    },
    annexC_USStateLaw: {
      title: "Anhang C | Zusatz für US-Bundesstaaten (CCPA/CPRA usw.)",
      subsections: {
        c1: {
          title: "C-1. Rollen und Zweckbindung",
          paragraphs: [
            "Das Unternehmen handelt als ‚Service Provider/Processor‘ und verarbeitet personenbezogene Daten ausschließlich für Geschäftszwecke des Kunden.",
          ],
        },
        c2: {
          title: "C-2. Verbot von Verkauf/Weitergabe",
          paragraphs: [
            "Das Unternehmen ‚verkauft‘ oder ‚teilt‘ keine personenbezogenen Daten (einschließlich kontextübergreifender verhaltensbasierter Werbung).",
          ],
        },
        c3: {
          title: "C-3. Verbot der Zweitnutzung",
          paragraphs: [
            "Keine Nutzung personenbezogener Daten für eigene Zwecke des Unternehmens (außer statistisch/anonym, soweit rechtlich zulässig).",
          ],
        },
        c4: {
          title: "C-4. Sicherheit",
          paragraphs: [
            "Aufrechterhaltung angemessener Sicherheit und Benachrichtigung/Unterstützung des Kunden bei Vorfällen.",
          ],
        },
        c5: {
          title: "C-5. Zusammenarbeit bei Betroffenenrechten",
          paragraphs: [
            "Angemessene Kooperation bei Auskunfts-, Lösch-, Berichtigungs- und Opt-out-Anträgen; Beachtung von GPC-Signalen, soweit anwendbar.",
          ],
        },
        c6: {
          title: "C-6. Unterauftragsverarbeiter",
          paragraphs: [
            "Weitergabe gleichwertiger Pflichten an Unterauftragsverarbeiter und angemessene Vorabinformation bei Änderungen.",
          ],
        },
        c7: {
          title: "C-7. Aufzeichnungen und Audits",
          paragraphs: [
            "Führung notwendiger Aufzeichnungen zur CCPA/CPRA-Compliance und angemessene Kooperation bei Audits des Kunden.",
          ],
        },
      },
    },
  },
  appendix: {
    lastUpdated: "6. November 2025",
    company: {
      name: "Connect Tech Inc.",
      address: "Dias Wago 202, 315-1485 Wago-cho, Chuo-ku, Hamamatsu, Shizuoka, Japan",
      representative: "Kazuaki Matsui",
      contact: "connectechceomatsui@gmail.com",
    },
  },
};
export default de;