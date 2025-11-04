import type { SupportCenterLocale } from './createSupportCenter.d.ts';

const de: SupportCenterLocale = {
  label: {
    pageTitle: "Support-Center",
    supportRequestList: "Supportanfragen",
    newRequest: "Neue Anfrage",
    noRequests: "Keine Supportanfragen gefunden",
    issueType: "Problemtyp",
    issueTypePlaceholder: "Bitte Problemtyp auswählen",
    technical: "Technisches Problem",
    account: "Kontoproblem",
    billing: "Abrechnungsproblem",
    other: "Sonstiges",
    subject: "Betreff",
    subjectPlaceholder: "Bitte Betreff eingeben",
    description: "Problembeschreibung",
    descriptionPlaceholder: "Bitte das Problem detailliert beschreiben",
    cancel: "Abbrechen",
    submit: "Senden",
    submitting: "Senden...",
    status: "Status",
    creator: "Erstellt von",
    createdAt: "Erstellt am",
    updatedAt: "Aktualisiert am",
    statusOpen: "Offen",
    statusInProgress: "In Bearbeitung",
    statusClosed: "Gelöst",
    back: "← Zurück",
    reply: "Antwort",
    replyContent: "Antwortinhalt",
    inquiryContent: "Anfrageinhalt",
    attachedFiles: "Anhänge",
    messagePlaceholder: "Bitte eine Nachricht eingeben",
    markResolved: "Als gelöst markieren",
    markUnresolved: "Als ungelöst markieren",
    staff: "Mitarbeiter",
    problemType: "Problemtyp",
    technicalIssue: "Technisches Problem",
    accountRelated: "Konto",
    billingRelated: "Abrechnung",
    deleteFile: "Datei löschen",
    fileRemoved: "Datei wurde gelöscht"
  },
  alert: {
    requestReceived: "Ihre Anfrage wurde entgegengenommen. Bitte warten Sie auf eine Rückmeldung.",
    submitFailed: "Supportanfrage konnte nicht gesendet werden",
    subjectRequired: "Bitte geben Sie einen Betreff ein",
    descriptionRequired: "Bitte geben Sie eine Beschreibung ein",
    messageRequired: "Bitte eine Nachricht eingeben",
    supportRequestError: "Fehler beim Abrufen der Supportanfrage:"
  }
};

export default de;