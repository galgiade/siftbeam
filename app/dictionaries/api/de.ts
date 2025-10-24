const de = {
  "errors": {
    "general": {
      "serverError": "Ein Serverfehler ist aufgetreten",
      "networkError": "Ein Netzwerkfehler ist aufgetreten",
      "unauthorized": "Authentifizierung erforderlich",
      "forbidden": "Zugriff verweigert",
      "notFound": "Ressource nicht gefunden",
      "validationError": "Ungültige Eingabedaten",
      "conflict": "Datenkonflikt aufgetreten",
      "unexpectedError": "Ein unerwarteter Fehler ist aufgetreten",
      "unknownError": "Ein unbekannter Fehler ist aufgetreten",
      "targetNotFound": "Ziel zum Aktualisieren nicht gefunden",
      "operationFailed": "Ausführung der Operation fehlgeschlagen",
      "processingError": "Fehler während der Verarbeitung",
      "relatedResourceDeleteError": "Fehler beim Löschen verknüpfter Ressourcen",
      "partialOperationFailed": "Einige Operationen sind fehlgeschlagen",
      "rollbackFailed": "Rollback fehlgeschlagen"
    },
    "auth": {
      "notAuthenticated": "Nicht authentifiziert",
      "insufficientPermissions": "Unzureichende Berechtigungen",
      "accessDenied": "Zugriff verweigert",
      "companyNotSet": "Unternehmensinformationen nicht gesetzt",
      "adminRightsRequired": "Administratorrechte erforderlich",
      "adminPermissionRequired": "Administratorberechtigung erforderlich",
      "codeIncorrect": "Bestätigungscode ist falsch",
      "codeExpired": "Bestätigungscode ist abgelaufen",
      "userNotFound": "Benutzer nicht gefunden",
      "signInFailed": "Anmeldung fehlgeschlagen",
      "credentialsIncorrect": "E‑Mail-Adresse oder Passwort ist falsch",
      "accountNotConfirmed": "Konto nicht bestätigt. Bitte E‑Mail-Verifizierung abschließen",
      "passwordResetRequired": "Passwortzurücksetzung erforderlich",
      "userNotAuthenticated": "Benutzer nicht authentifiziert",
      "getCurrentUserFailed": "Fehler beim Abrufen des aktuellen Benutzers",
      "missingParameters": "Erforderliche Parameter fehlen: userId, email",
      "check2FAStatusFailed": "Fehler beim Überprüfen des 2FA-Status",
      "missingEmailParameters": "Erforderliche Parameter fehlen: userId, newEmail, userPoolId",
      "invalidEmailFormat": "Ungültiges E-Mail-Format",
      "cognitoEmailUpdateSuccess": "Cognito-E-Mail erfolgreich aktualisiert",
      "cognitoEmailUpdateFailed": "Fehler beim Aktualisieren der Cognito-E-Mail",
      "userNotFoundInCognito": "Benutzer in Cognito nicht gefunden",
      "invalidEmailOrUserId": "Ungültiges E-Mail-Format oder Benutzer-ID",
      "notAuthorizedToUpdateUser": "Nicht berechtigt, Benutzer zu aktualisieren",
      "missingUsernameParameters": "Erforderliche Parameter fehlen: userId, newUsername, userPoolId",
      "invalidUsernameFormat": "Ungültiges Benutzername-Format",
      "cognitoUsernameUpdateSuccess": "Cognito-Benutzername erfolgreich aktualisiert",
      "cognitoUsernameUpdateFailed": "Fehler beim Aktualisieren des Cognito-Benutzernamens",
      "invalidUsernameOrUserId": "Ungültiges Benutzername-Format oder Benutzer-ID",
      "usernameAlreadyExists": "Benutzername existiert bereits",
      "missingVerificationParameters": "Erforderliche Parameter fehlen: userId, email, code, userPoolId",
      "verificationCodeNotFound": "Bestätigungscode nicht gefunden oder abgelaufen",
      "verificationCodeExpired": "Bestätigungscode ist abgelaufen",
      "tooManyFailedAttempts": "Zu viele fehlgeschlagene Versuche",
      "invalidVerificationCode": "Ungültiger Bestätigungscode",
      "emailVerificationSuccess": "E-Mail-Bestätigung erfolgreich und Cognito aktualisiert",
      "emailVerificationFailed": "E-Mail-Code-Bestätigung fehlgeschlagen",
      "missingStoreParameters": "Erforderliche Parameter fehlen: userId, email, code, userType",
      "verificationCodeStoredSuccess": "Bestätigungscode erfolgreich gespeichert",
      "verificationCodeStoreFailed": "Speichern des Bestätigungscodes fehlgeschlagen"
    },
    "validation": {
      "userIdRequired": "Benutzer-ID ist erforderlich",
      "customerIdRequired": "Kunden-ID ist erforderlich",
      "groupIdRequired": "Gruppen-ID ist erforderlich",
      "policyIdRequired": "Richtlinien-ID ist erforderlich",
      "supportRequestIdRequired": "Supportanfrage-ID ist erforderlich",
      "newOrderRequestIdRequired": "Anfrage-ID ist erforderlich",
      "statusRequired": "Status ist erforderlich",
      "userGroupIdRequired": "Benutzergruppen-ID ist erforderlich",
      "groupIdRequiredForValidation": "Gruppen-ID ist erforderlich",
      "userIdRequiredForValidation": "Benutzer-ID ist erforderlich",
      "fieldRequired": "Dieses Feld ist erforderlich",
      "validEmailRequired": "Bitte eine gültige E‑Mail-Adresse eingeben",
      "minLength": "Mindestens {count} Zeichen erforderlich",
      "maxLength": "Maximal {count} Zeichen erlaubt",
      "passwordMinLength": "Passwort muss mindestens 8 Zeichen lang sein",
      "passwordUppercase": "Mindestens ein Großbuchstabe erforderlich",
      "passwordLowercase": "Mindestens ein Kleinbuchstabe erforderlich",
      "passwordNumber": "Mindestens eine Zahl erforderlich",
      "passwordSpecialChar": "Mindestens ein Sonderzeichen erforderlich",
      "passwordMismatch": "Passwörter stimmen nicht überein",
      "userNameRequired": "Benutzername ist erforderlich",
      "emailRequired": "E‑Mail ist erforderlich",
      "companyIdRequired": "Unternehmens-ID ist erforderlich",
      "departmentRequired": "Abteilung ist erforderlich",
      "positionRequired": "Position ist erforderlich",
      "roleRequired": "Rolle ist erforderlich",
      "usageMinZero": "Nutzung muss 0 oder größer sein",
      "positiveNumber": "Muss ein positiver Wert sein",
      "nonNegativeNumber": "Muss 0 oder größer sein",
      "invalidEmail": "Bitte eine gültige E‑Mail-Adresse eingeben",
      "required": "Dieses Feld ist erforderlich",
      "policyIdsMinOne": "Bitte mindestens eine Richtlinie auswählen",
      "userIdsMinOne": "Bitte mindestens einen Benutzer auswählen",
      "emailsMinOne": "Bitte mindestens eine E‑Mail-Adresse angeben",
      "emailsValid": "Bitte eine gültige E‑Mail-Adresse eingeben",
      "invalidExceedAction": "Bitte Benachrichtigen oder Einschränken auswählen",
      "invalidNotifyType": "Bitte Betrag oder Nutzung als Benachrichtigungsmethode wählen",
      "invalidUnit": "Bitte KB, MB, GB oder TB auswählen",
      "invalidAiTrainingUsage": "Bitte Erlauben oder Verweigern wählen",
      "invalidStatus": "Bitte OPEN, IN_PROGRESS oder CLOSED auswählen",
      "invalidIssueType": "Bitte technical, account, billing oder other auswählen",
      "invalidAction": "Bitte READ, CREATE, UPDATE, DELETE, ATTACH oder DETACH auswählen",
      "invalidResource": "Ungültiger Ressourcentyp",
      "invalidDataType": "Bitte table, image oder text auswählen",
      "invalidModelType": "Bitte clustering, prediction oder classification auswählen",
      "notifyTypeAmountRequired": "Bitte entsprechend der Methode Betrag oder Nutzung eingeben",
      "notifyTypeUsageRequired": "Bei Nutzungsbenachrichtigung ist die Einheit (KB, MB, GB, TB) erforderlich",
      "usageUnitRequired": "Bei Nutzungsbenachrichtigung ist die Einheit erforderlich",
      "companyNameRequired": "Unternehmensname ist erforderlich",
      "stateRequired": "Bundesland/Region ist erforderlich",
      "cityRequired": "Stadt ist erforderlich",
      "streetAddressRequired": "Straßenadresse ist erforderlich",
      "groupNameRequired": "Gruppenname ist erforderlich",
      "policyNameRequired": "Richtlinienname ist erforderlich",
      "subjectRequired": "Betreff ist erforderlich",
      "descriptionRequired": "Beschreibung ist erforderlich",
      "messageRequired": "Nachricht ist erforderlich",
      "resourceNameRequired": "Ressourcenname ist erforderlich",
      "preferredUsernameRequired": "Benutzername ist erforderlich",
      "localeRequired": "Sprache ist erforderlich",
      "confirmationCodeRequired": "Bestätigungscode ist erforderlich",
      "challengeResponseRequired": "Challenge‑Antwort ist erforderlich",
      "limitUsageIdRequired": "Limit‑Usage‑ID ist erforderlich",
      "isStaffInvalid": "Mitarbeiter-Flag muss ein boolescher Wert sein"
    },
    "user": {
      "fetchFailed": "Abruf der Benutzerinformationen fehlgeschlagen",
      "accessDenied": "Zugriff auf diese Benutzerinformationen verweigert",
      "notFound": "Benutzer nicht gefunden",
      "companyAccessDenied": "Zugriff auf die Benutzerinformationen dieses Unternehmens verweigert",
      "batchFetchFailed": "Fehler beim Abrufen mehrerer Benutzerinformationen",
      "updateFailed": "Aktualisieren der Benutzerinformationen fehlgeschlagen",
      "createFailed": "Erstellen des Benutzers fehlgeschlagen",
      "deleteFailed": "Löschen des Benutzers fehlgeschlagen",
      "userGroupFetchFailed": "Abruf der Benutzergruppendaten fehlgeschlagen",
      "userGroupDeleteFailed": "Löschen der Benutzergruppe fehlgeschlagen",
      "rollbackFailed": "Rollback des Löschvorgangs fehlgeschlagen",
      "noUpdateFields": "Keine zu aktualisierenden Felder angegeben",
      "updateError": "Fehler beim Aktualisieren des Benutzers",
      "userNameEmpty": "Benutzername darf nicht leer sein",
      "emailEmpty": "E-Mail darf nicht leer sein",
      "departmentEmpty": "Abteilung darf nicht leer sein",
      "positionEmpty": "Position darf nicht leer sein",
      "roleEmpty": "Rolle darf nicht leer sein",
      "fieldRequired": "{field} ist erforderlich"
    },
    "policy": {
      "fetchFailed": "Abruf der Richtlinien fehlgeschlagen",
      "accessDenied": "Zugriff auf diese Richtlinie verweigert",
      "batchFetchFailed": "Fehler beim Abrufen mehrerer Kundenrichtlinien",
      "createFailed": "Erstellen der Richtlinie fehlgeschlagen",
      "updateFailed": "Aktualisieren der Richtlinie fehlgeschlagen",
      "deleteFailed": "Löschen der Richtlinie fehlgeschlagen",
      "idRequired": "Gültige Richtlinien-ID ist erforderlich",
      "notFound": "Angegebene Richtlinie nicht gefunden",
      "noUpdateFields": "Keine zu aktualisierenden Felder angegeben",
      "updateError": "Fehler beim Aktualisieren der Richtlinie"
    },
    "group": {
      "fetchFailed": "Abruf der Gruppe fehlgeschlagen",
      "accessDenied": "Zugriff verweigert",
      "listFetchFailed": "Abruf der Gruppenliste fehlgeschlagen",
      "updateFailed": "Aktualisieren der Gruppe fehlgeschlagen",
      "createFailed": "Erstellen der Gruppe fehlgeschlagen",
      "deleteFailed": "Löschen der Gruppe fehlgeschlagen",
      "userGroupDeleteFailed": "Löschen der Benutzergruppe fehlgeschlagen",
      "groupPolicyDeleteFailed": "Löschen der Gruppenrichtlinie fehlgeschlagen",
      "rollbackFailed": "Rollback des Löschvorgangs fehlgeschlagen"
    },
    "userGroup": {
      "fetchFailed": "Abruf der Benutzergruppendaten fehlgeschlagen",
      "accessDenied": "Zugriff verweigert",
      "batchFetchFailed": "Fehler beim Abrufen mehrerer Benutzergruppendaten",
      "companyFetchFailed": "Abruf der Benutzergruppendaten anhand der Kunden-ID fehlgeschlagen",
      "groupFetchFailed": "Abruf der Benutzergruppendaten anhand der Gruppen-ID fehlgeschlagen",
      "userFetchFailed": "Abruf der Benutzergruppendaten anhand der Benutzer-ID fehlgeschlagen",
      "membershipCheckFailed": "Überprüfen der Gruppenmitgliedschaft fehlgeschlagen",
      "createFailed": "Erstellen der Benutzergruppe fehlgeschlagen",
      "updateFailed": "Aktualisieren der Benutzergruppe fehlgeschlagen",
      "deleteFailed": "Löschen der Benutzergruppe fehlgeschlagen",
      "noUpdateFields": "Keine zu aktualisierenden Felder angegeben",
      "updateError": "Fehler beim Aktualisieren der Benutzergruppe"
    },
    "groupPolicy": {
      "fetchFailed": "Abruf der Gruppenrichtlinie fehlgeschlagen",
      "accessDenied": "Zugriff verweigert",
      "batchFetchFailed": "Fehler beim Abrufen mehrerer Gruppenrichtlinien",
      "policyFetchFailed": "Abruf anhand der Richtlinien-ID fehlgeschlagen",
      "groupFetchFailed": "Abruf anhand der Gruppen-ID fehlgeschlagen",
      "createFailed": "Erstellen der Gruppenrichtlinie fehlgeschlagen",
      "deleteFailed": "Löschen der Gruppenrichtlinie fehlgeschlagen"
    },
    "supportRequest": {
      "fetchFailed": "Abruf der Supportanfrage fehlgeschlagen",
      "accessDenied": "Zugriff verweigert",
      "notFound": "Supportanfrage mit angegebener ID nicht gefunden",
      "otherCompanyAccessDenied": "Zugriff auf Supportanfragen anderer Unternehmen verweigert",
      "userAccessDenied": "Zugriff auf Supportanfragen dieses Benutzers verweigert",
      "batchFetchFailed": "Fehler beim Abrufen mehrerer Supportanfragen",
      "statusBatchFetchFailed": "Fehler beim Abrufen mehrerer Status von Supportanfragen",
      "userBatchFetchFailed": "Fehler beim Abrufen mehrerer Benutzer-Supportanfragen",
      "customerBatchFetchFailed": "Fehler beim Abrufen mehrerer Kunden-Supportanfragen",
      "createFailed": "Supportanfrage konnte nicht erstellt werden",
      "updateFailed": "Supportanfrage konnte nicht aktualisiert werden",
      "deleteFailed": "Supportanfrage konnte nicht gelöscht werden",
      "validationError": "Problem mit der Eingabe der Supportanfrage",
      "updateError": "Fehler beim Aktualisieren der Supportanfrage",
      "noUpdateFields": "Keine zu aktualisierenden Felder angegeben"
    },
    "supportReply": {
      "fetchFailed": "Abruf der Supportantworten fehlgeschlagen",
      "accessDenied": "Zugriff verweigert",
      "createFailed": "Supportantwort konnte nicht erstellt werden",
      "updateFailed": "Supportantwort konnte nicht aktualisiert werden",
      "deleteFailed": "Supportantwort konnte nicht gelöscht werden",
      "notFound": "Supportantwort mit angegebener ID nicht gefunden",
      "updateError": "Fehler beim Aktualisieren der Supportantwort",
      "noUpdateFields": "Keine zu aktualisierenden Felder angegeben"
    },
    "newOrder": {
      "fetchFailed": "Abruf der Informationen zur neuen Anfrage fehlgeschlagen",
      "accessDenied": "Zugriff verweigert",
      "notFound": "Neue Anfrage mit angegebener ID nicht gefunden",
      "otherCompanyAccessDenied": "Zugriff auf neue Anfragen anderer Unternehmen verweigert",
      "batchFetchFailed": "Fehler beim Abrufen mehrerer neuer Anfragen",
      "customerBatchFetchFailed": "Fehler beim Abrufen mehrerer Kunden‑Anfragen"
    },
    "newOrderRequest": {
      "createFailed": "Neue Anfrage konnte nicht erstellt werden",
      "updateFailed": "Neue Anfrage konnte nicht aktualisiert werden",
      "deleteFailed": "Neue Anfrage konnte nicht gelöscht werden"
    },
    "newOrderReply": {
      "fetchFailed": "Abruf der Antworten zur neuen Anfrage fehlgeschlagen",
      "createFailed": "Antwort konnte nicht erstellt werden",
      "updateFailed": "Antwort konnte nicht aktualisiert werden",
      "deleteFailed": "Antwort konnte nicht gelöscht werden"
    },
    "auditLog": {
      "customerIdRequired": "Kunden-ID ist erforderlich",
      "userIdOrCustomerIdRequired": "Benutzer‑ oder Kunden-ID ist erforderlich",
      "resourceNameOrCustomerIdRequired": "Ressourcenname oder Kunden-ID ist erforderlich",
      "createFailed": "Audit‑Log konnte nicht erstellt werden",
      "validationFailed": "Audit‑Log‑Validierung fehlgeschlagen",
      "recordFailed": "Audit‑Log konnte nicht protokolliert werden"
    },
    "dataUsage": {
      "userIdRequired": "Benutzer-ID ist erforderlich",
      "customerIdRequired": "Kunden-ID ist erforderlich",
      "fetchFailed": "Abruf der Nutzungsdaten fehlgeschlagen",
      "createFailed": "Erstellen des Nutzungsdatensatzes fehlgeschlagen",
      "updateFailed": "Aktualisieren der Nutzungsdaten fehlgeschlagen",
      "noUpdateFields": "Keine zu aktualisierenden Felder angegeben",
      "updateFieldRequired": "Bitte mindestens ein Feld zum Aktualisieren angeben",
      "notFound": "Zu aktualisierender Nutzungsdatensatz nicht gefunden",
      "updateError": "Fehler beim Aktualisieren der Nutzungsdaten"
    },
    "limitUsage": {
      "createFailed": "Erstellen der Nutzungsbegrenzung fehlgeschlagen",
      "updateFailed": "Aktualisieren der Nutzungsbegrenzung fehlgeschlagen",
      "deleteFailed": "Löschen der Nutzungsbegrenzung fehlgeschlagen",
      "deleteOperationFailed": "Löschvorgang der Nutzungsbegrenzung fehlgeschlagen",
      "deleteProcessingError": "Fehler beim Löschen der Nutzungsbegrenzung",
      "unknownResource": "Unbekannt"
    },
    "recipient": {
      "fetchFailed": "Abruf der Empfängerdaten fehlgeschlagen",
      "accessDenied": "Zugriff verweigert",
      "notFound": "Empfänger nicht gefunden",
      "createFailed": "Erstellen des Empfängers fehlgeschlagen",
      "updateFailed": "Aktualisieren des Empfängers fehlgeschlagen",
      "deleteFailed": "Löschen des Empfängers fehlgeschlagen",
      "limitUsageIdRequired": "Limit‑Usage‑ID ist erforderlich",
      "noUpdateFields": "Keine zu aktualisierenden Felder angegeben",
      "updateError": "Fehler beim Aktualisieren des Empfängers",
      "createError": "Fehler beim Erstellen des Empfängers",
      "partialUpdateFailed": "Aktualisierung einiger Empfänger fehlgeschlagen"
    },
    "delete": {
      "userDeleteFailed": "Benutzer konnte nicht gelöscht werden",
      "cognitoUserDeleteFailed": "Cognito‑Benutzer konnte nicht gelöscht werden",
      "partialDeleteFailed": "Löschanfrage für einige/alle Benutzer konnte nicht storniert werden",
      "authDeleteFailed": "Löschen der Authentifizierungsinformationen fehlgeschlagen",
      "dbDeleteFailed": "Löschen des Datenbankbenutzers fehlgeschlagen",
      "cancelRequestFailed": "Fehler beim Stornieren der Löschanfrage",
      "cancelRequestProcessingError": "Fehler während der Stornierung",
      "userDeleteSuccess": "Benutzer erfolgreich gelöscht",
      "cognitoUserDeleteSuccess": "Cognito‑Benutzer erfolgreich gelöscht",
      "relatedResourceDeleteError": "Fehler beim Löschen verknüpfter Ressourcen",
      "userNotFoundForDeletion": "Zu löschender Benutzer nicht gefunden",
      "bulkDeleteNoTargets": "Keine Löschziele angegeben",
      "bulkDeletePartialFailure": "Löschen einiger Benutzer fehlgeschlagen",
      "cancelDeletionSuccess": "Stornierung der Löschanfrage für {count} Benutzer abgeschlossen",
      "cancelDeletionPartialFailure": "Erfolg: {successCount}, Fehlgeschlagen: {failCount}",
      "lastAdminDeleteNotAllowed": "Der letzte Administrator kann nicht gelöscht werden"
    },
    "cognito": {
      "usernameExists": "Benutzer bereits registriert",
      "invalidParameter": "Ungültiger Parameter",
      "invalidPassword": "Ungültiges Passwort",
      "confirmationCodeIncorrect": "Bestätigungscode ist falsch",
      "confirmationCodeExpired": "Bestätigungscode ist abgelaufen",
      "userCreationFailed": "Cognito‑Benutzer konnte nicht erstellt werden",
      "confirmationFailed": "Bestätigung der Registrierung fehlgeschlagen",
      "userNotFound": "Benutzer nicht gefunden",
      "emailSendFailed": "E‑Mail senden fehlgeschlagen",
      "signInFailed": "Anmeldung fehlgeschlagen",
      "passwordResetRequired": "Passwort zurücksetzen erforderlich",
      "accountNotConfirmed": "Konto nicht bestätigt. Bitte E‑Mail‑Verifizierung abschließen"
    },
    "stripe": {
      "customerCreationFailed": "Stripe‑Kunde konnte nicht erstellt werden",
      "customerNotFound": "Kunde nicht gefunden",
      "setupIntentCreationFailed": "Setup‑Intent konnte nicht erstellt werden",
      "paymentMethodNotFound": "Zahlungsmethode nicht gefunden",
      "paymentMethodDetachFailed": "Trennen der Zahlungsmethode fehlgeschlagen",
      "paymentHistoryFetchFailed": "Abruf der Zahlungshistorie fehlgeschlagen",
      "defaultPaymentMethodSetFailed": "Festlegen der Standard-Zahlungsmethode fehlgeschlagen",
      "addressUpdateFailed": "Aktualisieren der Adresse fehlgeschlagen",
      "invalidLocale": "Ungültige Sprache angegeben",
      "customerIdRequired": "Kunden-ID ist erforderlich",
      "paymentMethodIdRequired": "Zahlungsmethoden-ID ist erforderlich",
      "addressRequired": "Adresse ist erforderlich",
      "nameRequired": "Name ist erforderlich",
      "emailRequired": "E‑Mail ist erforderlich",
      "userAttributesRequired": "Benutzerattribute sind erforderlich",
      "invalidAddress": "Ungültiges Adressformat",
      "stripeError": "Stripe‑API‑Fehler aufgetreten",
      "updateFailed": "Aktualisierung fehlgeschlagen",
      "validationError": "Es gibt Probleme mit der Eingabe",
      "cardError": "Kartenfehler",
      "requestError": "Anfragefehler",
      "apiError": "API-Fehler",
      "connectionError": "Verbindungsfehler aufgetreten",
      "authenticationError": "Authentifizierungsfehler aufgetreten"
    },
    "api": {
      "invalidRequest": "Ungültige Anfrage",
      "missingParameters": "Erforderliche Parameter fehlen",
      "serverError": "Interner Serverfehler",
      "validationFailed": "Validierung der Anfrage fehlgeschlagen",
      "authenticationRequired": "Authentifizierung erforderlich",
      "accessDenied": "Zugriff verweigert",
      "notFound": "Ressource nicht gefunden",
      "methodNotAllowed": "Methode nicht erlaubt",
      "conflictError": "Ressourcenkonflikt",
      "rateLimitExceeded": "Ratenlimit überschritten"
    },
    "verificationEmail": {
      "sendFailed": "Senden der Bestätigungs-E-Mail fehlgeschlagen",
      "templateNotFound": "E-Mail-Vorlage nicht gefunden",
      "messageRejected": "E-Mail wurde abgelehnt (Zieladresse möglicherweise ungültig)",
      "sendingPaused": "E-Mail-Versand ist vorübergehend pausiert",
      "mailFromDomainNotVerified": "Mail-From-Domain ist nicht verifiziert",
      "configurationSetNotFound": "SES-Konfigurationssatz nicht gefunden",
      "invalidTemplate": "E-Mail-Vorlage ist ungültig",
      "invalidAwsCredentials": "AWS-Anmeldeinformationen sind ungültig",
      "invalidParameters": "Parameter sind ungültig"
    }
  },
  "fields": {
    "userName": "Benutzername",
    "email": "E-Mail",
    "department": "Abteilung",
    "position": "Position",
    "role": "Rolle"
  },
  "messages": {
    "dataUsage": {
      "createSuccess": "Nutzungsdatensatz erfolgreich erstellt",
      "updateSuccess": "Nutzungsdaten erfolgreich aktualisiert"
    },
    "policy": {
      "createSuccess": "Richtlinie erfolgreich erstellt",
      "updateSuccess": "Richtlinie erfolgreich aktualisiert",
      "deleteSuccess": "Richtlinie erfolgreich gelöscht"
    },
    "user": {
      "createSuccess": "Benutzer erfolgreich erstellt",
      "updateSuccess": "Benutzerinformationen erfolgreich aktualisiert",
      "deleteSuccess": "Benutzer erfolgreich gelöscht"
    },
    "group": {
      "createSuccess": "Gruppe erfolgreich erstellt",
      "updateSuccess": "Gruppe erfolgreich aktualisiert",
      "deleteSuccess": "Gruppe erfolgreich gelöscht"
    },
    "groupPolicy": {
      "createSuccess": "Gruppenrichtlinie erfolgreich erstellt",
      "deleteSuccess": "Gruppenrichtlinie erfolgreich gelöscht"
    },
    "userGroup": {
      "createSuccess": "Benutzergruppe erfolgreich erstellt",
      "updateSuccess": "Benutzergruppe erfolgreich aktualisiert",
      "deleteSuccess": "Benutzergruppe erfolgreich gelöscht"
    },
    "newOrderRequest": {
      "createSuccess": "Neue Anfrage erfolgreich erstellt",
      "updateSuccess": "Neue Anfrage erfolgreich aktualisiert",
      "deleteSuccess": "Neue Anfrage erfolgreich gelöscht"
    },
    "newOrderReply": {
      "createSuccess": "Antwort erfolgreich erstellt",
      "updateSuccess": "Antwort erfolgreich aktualisiert",
      "deleteSuccess": "Antwort erfolgreich gelöscht"
    },
    "supportRequest": {
      "createSuccess": "Supportanfrage erfolgreich erstellt",
      "updateSuccess": "Supportanfrage erfolgreich aktualisiert",
      "deleteSuccess": "Supportanfrage erfolgreich gelöscht"
    },
    "supportReply": {
      "createSuccess": "Supportantwort erfolgreich erstellt",
      "updateSuccess": "Supportantwort erfolgreich aktualisiert",
      "deleteSuccess": "Supportantwort erfolgreich gelöscht"
    },
    "limitUsage": {
      "createSuccess": "Nutzungsbegrenzung erfolgreich erstellt",
      "updateSuccess": "Nutzungsbegrenzung erfolgreich aktualisiert",
      "deleteSuccess": "Nutzungsbegrenzung erfolgreich gelöscht"
    },
    "recipient": {
      "createSuccess": "Empfänger erfolgreich erstellt",
      "updateSuccess": "Empfänger erfolgreich aktualisiert",
      "deleteSuccess": "Empfänger erfolgreich gelöscht",
      "bulkUpdateSuccess": "{count} Empfänger erfolgreich aktualisiert"
    },
    "auditLog": {
      "createSuccess": "Audit‑Log erfolgreich erstellt",
      "recordSuccess": "Audit‑Log erfolgreich protokolliert"
    },
    "stripe": {
      "customerCreateSuccess": "Kunde erfolgreich erstellt",
      "setupIntentCreateSuccess": "Setup‑Intent erfolgreich erstellt",
      "paymentMethodDeleteSuccess": "Zahlungsmethode erfolgreich gelöscht",
      "paymentHistoryFetchSuccess": "Zahlungshistorie erfolgreich abgerufen",
      "defaultPaymentMethodSetSuccess": "Standard‑Zahlungsmethode erfolgreich festgelegt",
      "addressUpdateSuccess": "Adresse erfolgreich aktualisiert"
    },
    "api": {
      "requestSuccess": "Anfrage erfolgreich abgeschlossen",
      "operationCompleted": "Vorgang erfolgreich abgeschlossen"
    },
    "verificationEmail": {
      "sendSuccess": "Bestätigungs-E-Mail wurde gesendet"
    },
    "cognito": {
      "emailVerificationCompleted": "E-Mail-Verifizierung abgeschlossen",
      "signInStarted": "Anmeldeprozess gestartet"
    }
  }
}

export default de;


