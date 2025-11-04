import type { CommonLocale } from './common.d.ts';

const de: CommonLocale = {
  common: {
    navigation: {
      home: 'Startseite',
      about: 'Über uns',
      pricing: 'Preise',
      contact: 'Kontakt',
      signIn: 'Anmelden',
      signUp: 'Registrieren',
      signOut: 'Abmelden',
      dashboard: 'Dashboard',
      flow: 'Ablauf',
      announcement: 'Ankündigungen',
      services: 'Dienstleistungen',
      myPage: 'Meine Seite',
      supportCenter: 'Support-Center',
    },
    footer: {
      title: 'siftbeam',
      description:
        'Eine intelligente prädiktive Analyseplattform, die die Kraft der Daten freisetzt, um die Zukunft Ihres Unternehmens zu gestalten.',
      links: {
        terms: 'Nutzungsbedingungen',
        privacy: 'Datenschutzrichtlinie',
        legalDisclosures: 'Rechtliche Hinweise',
      },
      copyright: 'Connect Tech Inc.',
    },
    fileUploader: {
      dragAndDrop: 'Dateien per Drag & Drop',
      or: 'oder',
      selectFile: 'Dateien auswählen',
      maxFilesAndSize: 'Max. {maxFiles} Dateien, je {maxFileSize}MB',
      supportedFormats: 'Unterstützte Formate: Bilder, Videos, Audio, Dokumente',
      pendingFiles: 'Ausstehend ({count} Dateien)',
      uploadStart: 'Upload starten',
      uploading: 'Wird hochgeladen...',
      uploadedFiles: 'Hochgeladen ({count} Dateien)',
      uploadComplete: 'Upload abgeschlossen',
      uploadError: 'Upload-Fehler',
      uploadFailed: 'Upload fehlgeschlagen',
      maxFilesExceeded: 'Sie können bis zu {maxFiles} Dateien hochladen.',
      fileSizeExceeded: 'Die Dateigröße muss {maxFileSize}MB oder weniger betragen.\nZu große Dateien: {files}',
      oversizedFiles: 'Zu große Dateien',
    },
  },
};

export default de;
