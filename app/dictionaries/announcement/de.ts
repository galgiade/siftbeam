export const announcement = {
  locale: 'de',
  hero: {
    title: 'Ankündigungen',
    subtitle: 'Aktuelle Ankündigungen anzeigen',
  },
  table: {
    date: 'Datum',
    category: 'Kategorie',
    title: 'Titel',
    priority: 'Priorität',
    action: 'Aktion',
    viewDetails: 'Details anzeigen',
    noAnnouncements: 'Keine Ankündigungen verfügbar',
  },
  category: {
    price: 'Preis',
    feature: 'Funktion',
    other: 'Sonstiges',
  },
  priority: {
    high: 'Hohe Priorität',
    medium: 'Mittlere Priorität',
    low: 'Niedrige Priorität',
  },
  error: {
    fetchFailed: 'Fehler beim Abrufen der Ankündigungen',
    notFound: 'Ankündigung nicht gefunden',
  },
  detail: {
    backToList: 'Zurück zu Ankündigungen',
    noContent: 'Kein Inhalt verfügbar',
  },
  categoryDisplay: {
    price: 'Preis',
    feature: 'Funktion',
    other: 'Sonstiges',
  },
} as const;

export default announcement;
