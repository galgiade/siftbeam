import type { APIKeyLocale } from './apiKey.d';

const de: APIKeyLocale = {
  title: 'API-Schlüssel Verwaltung',
  actions: {
    create: 'Erstellen',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    save: 'Speichern',
    cancel: 'Abbrechen',
    back: 'Zurück',
  },
  table: {
    apiName: 'API-Name',
    description: 'Beschreibung',
    createdAt: 'Erstellt am',
    endpoint: 'Endpunkt',
    actions: 'Aktionen',
  },
  modal: {
    title: 'API-Schlüssel Bearbeiten',
    apiName: 'API-Name',
    description: 'Beschreibung',
  },
  messages: {
    noData: 'Keine Daten',
    updateFailed: 'Aktualisierung fehlgeschlagen',
    deleteFailed: 'Löschung fehlgeschlagen',
    confirmDelete: 'Diesen API-Schlüssel löschen? Diese Aktion kann nicht rückgängig gemacht werden.',
    createFailed: 'Erstellung fehlgeschlagen',
    idRequired: 'id ist erforderlich',
    deleteSuccess: 'Erfolgreich gelöscht',
    functionNameNotSet: 'APIGW_KEY_ISSUER_FUNCTION_NAME ist nicht gesetzt',
    apiGatewayDeleteFailed: 'Fehler beim Löschen des API Gateway-Schlüssels',
    idAndApiNameRequired: 'id und apiName sind erforderlich',
    updateSuccess: 'Erfolgreich aktualisiert',
  },
  alerts: {
    adminOnlyCreate: 'Nur Administratoren können erstellen',
    adminOnlyEdit: 'Nur Administratoren können bearbeiten',
    adminOnlyDelete: 'Nur Administratoren können löschen',
  },
  create: {
    title: 'API-Schlüssel Ausstellen',
    fields: {
      apiName: 'API-Name',
      apiDescription: 'API-Beschreibung',
      policy: 'API-Typ (Richtlinie)',
    },
    submit: 'API-Schlüssel Ausstellen',
    issuedNote: 'Der Schlüssel wird nur einmal angezeigt. Speichern Sie ihn sicher.',
    endpointLabel: 'Upload-Endpunkt',
    instructions: 'Konfigurieren Sie Folgendes auf Ihrem Gerät.',
    apiKeyHeaderLabel: 'API-Schlüssel (Header x-api-key)',
    uploadExampleTitle: 'Upload-Beispiel (PowerShell / PNG)',
    csvNote: 'Für CSV setzen Sie Content-Type auf text/csv. Passen Sie für andere Dateitypen an.',
    filePathNote: 'Geben Sie den Pfad zu Ihrer Datei an',
  },
};

export default de;


