const fr = {
  "errors": {
    "general": {
      "serverError": "Une erreur de serveur s’est produite",
      "networkError": "Une erreur réseau s’est produite",
      "unauthorized": "Authentification requise",
      "forbidden": "Accès refusé",
      "notFound": "Ressource introuvable",
      "validationError": "Données de saisie invalides",
      "conflict": "Un conflit de données s’est produit",
      "unexpectedError": "Une erreur inattendue s’est produite",
      "unknownError": "Une erreur inconnue s’est produite",
      "targetNotFound": "Cible de mise à jour introuvable",
      "operationFailed": "Échec de l’exécution de l’opération",
      "processingError": "Une erreur est survenue lors du traitement",
      "relatedResourceDeleteError": "Une erreur est survenue lors de la suppression des ressources associées",
      "partialOperationFailed": "Certaines opérations ont échoué",
      "rollbackFailed": "Échec du processus d’annulation"
    },
    "auth": {
      "notAuthenticated": "Non authentifié",
      "insufficientPermissions": "Autorisations insuffisantes",
      "accessDenied": "Accès refusé",
      "companyNotSet": "Informations de l'entreprise non définies",
      "adminRightsRequired": "Droits d'administrateur requis",
      "adminPermissionRequired": "Permission d'administrateur requise",
      "codeIncorrect": "Le code de vérification est incorrect",
      "codeExpired": "Le code de vérification a expiré",
      "userNotFound": "Utilisateur introuvable",
      "signInFailed": "Échec de la connexion",
      "credentialsIncorrect": "Adresse e‑mail ou mot de passe incorrect",
      "accountNotConfirmed": "Compte non confirmé. Veuillez terminer la vérification par e‑mail",
      "passwordResetRequired": "Réinitialisation du mot de passe requise",
      "userNotAuthenticated": "Utilisateur non authentifié",
      "getCurrentUserFailed": "Échec de la récupération de l'utilisateur actuel",
      "missingParameters": "Paramètres requis manquants: userId, email",
      "check2FAStatusFailed": "Échec de la vérification du statut 2FA",
      "missingEmailParameters": "Paramètres requis manquants: userId, newEmail, userPoolId",
      "invalidEmailFormat": "Format d'email invalide",
      "cognitoEmailUpdateSuccess": "Email Cognito mis à jour avec succès",
      "cognitoEmailUpdateFailed": "Échec de la mise à jour de l'email Cognito",
      "userNotFoundInCognito": "Utilisateur non trouvé dans Cognito",
      "invalidEmailOrUserId": "Format d'email invalide ou ID utilisateur",
      "notAuthorizedToUpdateUser": "Non autorisé à mettre à jour l'utilisateur",
      "missingUsernameParameters": "Paramètres requis manquants: userId, newUsername, userPoolId",
      "invalidUsernameFormat": "Format de nom d'utilisateur invalide",
      "cognitoUsernameUpdateSuccess": "Nom d'utilisateur Cognito mis à jour avec succès",
      "cognitoUsernameUpdateFailed": "Échec de la mise à jour du nom d'utilisateur Cognito",
      "invalidUsernameOrUserId": "Format de nom d'utilisateur invalide ou ID utilisateur",
      "usernameAlreadyExists": "Le nom d'utilisateur existe déjà",
      "missingVerificationParameters": "Paramètres requis manquants: userId, email, code, userPoolId",
      "verificationCodeNotFound": "Code de vérification introuvable ou expiré",
      "verificationCodeExpired": "Le code de vérification a expiré",
      "tooManyFailedAttempts": "Trop de tentatives échouées",
      "invalidVerificationCode": "Code de vérification invalide",
      "emailVerificationSuccess": "Vérification d'email réussie et Cognito mis à jour",
      "emailVerificationFailed": "Échec de la vérification du code email",
      "missingStoreParameters": "Paramètres requis manquants: userId, email, code, userType",
      "verificationCodeStoredSuccess": "Code de vérification stocké avec succès",
      "verificationCodeStoreFailed": "Échec du stockage du code de vérification"
    },
    "validation": {
      "userIdRequired": "L’ID utilisateur est requis",
      "customerIdRequired": "L’ID client est requis",
      "groupIdRequired": "L’ID de groupe est requis",
      "policyIdRequired": "L’ID de politique est requis",
      "supportRequestIdRequired": "L’ID de la demande d’assistance est requis",
      "newOrderRequestIdRequired": "L’ID de la demande de nouvelle commande est requis",
      "statusRequired": "Le statut est requis",
      "userGroupIdRequired": "L’ID du groupe d’utilisateurs est requis",
      "groupIdRequiredForValidation": "L’ID de groupe est requis",
      "userIdRequiredForValidation": "L’ID utilisateur est requis",
      "fieldRequired": "Ce champ est requis",
      "validEmailRequired": "Veuillez saisir une adresse e‑mail valide",
      "minLength": "Au moins {count} caractères requis",
      "maxLength": "Au maximum {count} caractères autorisés",
      "passwordMinLength": "Le mot de passe doit contenir au moins 8 caractères",
      "passwordUppercase": "Doit inclure des lettres majuscules",
      "passwordLowercase": "Doit inclure des lettres minuscules",
      "passwordNumber": "Doit inclure des chiffres",
      "passwordSpecialChar": "Doit inclure des caractères spéciaux",
      "passwordMismatch": "Les mots de passe ne correspondent pas",
      "userNameRequired": "Le nom d’utilisateur est requis",
      "emailRequired": "L’e‑mail est requis",
      "companyIdRequired": "L’ID de l’entreprise est requis",
      "departmentRequired": "Le service est requis",
      "positionRequired": "Le poste est requis",
      "roleRequired": "Le rôle est requis",
      "usageMinZero": "L’utilisation doit être supérieure ou égale à 0",
      "positiveNumber": "Doit être une valeur positive",
      "nonNegativeNumber": "Doit être supérieure ou égale à 0",
      "invalidEmail": "Veuillez saisir une adresse e‑mail valide",
      "required": "Ce champ est requis",
      "policyIdsMinOne": "Veuillez sélectionner au moins une politique",
      "userIdsMinOne": "Veuillez sélectionner au moins un utilisateur",
      "emailsMinOne": "Veuillez indiquer au moins une adresse e‑mail",
      "emailsValid": "Veuillez saisir une adresse e‑mail valide",
      "invalidExceedAction": "Veuillez sélectionner notifier ou restreindre pour l’action en cas de dépassement",
      "invalidNotifyType": "Veuillez sélectionner montant ou utilisation pour la méthode de notification",
      "invalidUnit": "Veuillez sélectionner KB, MB, GB ou TB pour l’unité",
      "invalidAiTrainingUsage": "Veuillez sélectionner allow ou deny pour l’utilisation de l’apprentissage IA",
      "invalidStatus": "Veuillez sélectionner OPEN, IN_PROGRESS ou CLOSED pour le statut",
      "invalidIssueType": "Veuillez sélectionner technical, account, billing ou other pour le type de problème",
      "invalidAction": "Veuillez sélectionner READ, CREATE, UPDATE, DELETE, ATTACH ou DETACH pour l’action",
      "invalidResource": "Type de ressource invalide",
      "invalidDataType": "Veuillez sélectionner table, image ou text pour le type de données",
      "invalidModelType": "Veuillez sélectionner clustering, prediction ou classification pour le type de modèle",
      "notifyTypeAmountRequired": "Veuillez saisir un montant ou une utilisation selon la méthode de notification",
      "notifyTypeUsageRequired": "La sélection d’unité (KB, MB, GB, TB) est requise lors de la sélection d’une notification d’utilisation",
      "usageUnitRequired": "La sélection d’unité (KB, MB, GB, TB) est requise lors de la sélection d’une notification d’utilisation",
      "companyNameRequired": "Le nom de l’entreprise est requis",
      "stateRequired": "L’État est requis",
      "cityRequired": "La ville est requise",
      "streetAddressRequired": "L’adresse est requise",
      "groupNameRequired": "Le nom du groupe est requis",
      "policyNameRequired": "Le nom de la politique est requis",
      "subjectRequired": "L’objet est requis",
      "descriptionRequired": "La description est requise",
      "messageRequired": "Le message est requis",
      "resourceNameRequired": "Le nom de la ressource est requis",
      "preferredUsernameRequired": "Le nom d’utilisateur est requis",
      "localeRequired": "La langue est requise",
      "confirmationCodeRequired": "Le code de confirmation est requis",
      "challengeResponseRequired": "La réponse au challenge est requise",
      "limitUsageIdRequired": "L’ID de limite d’utilisation est requis",
      "isStaffInvalid": "Le drapeau staff doit être une valeur booléenne"
    },
    "user": {
      "fetchFailed": "Échec de la récupération des informations utilisateur",
      "accessDenied": "Accès refusé à ces informations utilisateur",
      "notFound": "Utilisateur introuvable",
      "companyAccessDenied": "Accès refusé aux informations utilisateur de cette entreprise",
      "batchFetchFailed": "Une erreur est survenue lors de la récupération de plusieurs informations utilisateur",
      "updateFailed": "Échec de la mise à jour des informations utilisateur",
      "createFailed": "Échec de la création de l’utilisateur",
      "deleteFailed": "Échec de la suppression de l’utilisateur",
      "userGroupFetchFailed": "Échec de la récupération des informations de groupe d’utilisateurs",
      "userGroupDeleteFailed": "Échec de la suppression du groupe d’utilisateurs",
      "rollbackFailed": "Échec du processus d’annulation de suppression",
      "noUpdateFields": "Aucun champ de mise à jour spécifié",
      "updateError": "Une erreur est survenue lors de la mise à jour de l'utilisateur",
      "userNameEmpty": "Le nom d'utilisateur ne peut pas être vide",
      "emailEmpty": "L'email ne peut pas être vide",
      "departmentEmpty": "Le département ne peut pas être vide",
      "positionEmpty": "Le poste ne peut pas être vide",
      "roleEmpty": "Le rôle ne peut pas être vide",
      "fieldRequired": "{field} est requis"
    },
    "policy": {
      "fetchFailed": "Échec de la récupération des informations de politique",
      "accessDenied": "Accès refusé à ces informations de politique",
      "batchFetchFailed": "Une erreur est survenue lors de la récupération de plusieurs informations de politique client",
      "createFailed": "Échec de la création de la politique",
      "updateFailed": "Échec de la mise à jour de la politique",
      "deleteFailed": "Échec de la suppression de la politique",
      "idRequired": "Un ID de politique valide est requis",
      "notFound": "Politique spécifiée introuvable",
      "noUpdateFields": "Aucun champ de mise à jour spécifié",
      "updateError": "Une erreur est survenue lors de la mise à jour de la politique"
    },
    "group": {
      "fetchFailed": "Échec de la récupération du groupe",
      "accessDenied": "Accès refusé",
      "listFetchFailed": "Échec de la récupération de la liste des groupes",
      "updateFailed": "Échec de la mise à jour du groupe",
      "createFailed": "Échec de la création du groupe",
      "deleteFailed": "Échec de la suppression du groupe",
      "userGroupDeleteFailed": "Échec de la suppression du groupe d’utilisateurs",
      "groupPolicyDeleteFailed": "Échec de la suppression de la politique de groupe",
      "rollbackFailed": "Échec du processus d’annulation"
    },
    "userGroup": {
      "fetchFailed": "Échec de la récupération des informations du groupe d’utilisateurs",
      "accessDenied": "Accès refusé à ces informations de groupe d’utilisateurs",
      "batchFetchFailed": "Une erreur est survenue lors de la récupération de plusieurs informations de groupe d’utilisateurs",
      "companyFetchFailed": "Échec de la récupération des informations de groupe d’utilisateurs par ID client",
      "groupFetchFailed": "Échec de la récupération des informations de groupe d’utilisateurs par ID de groupe",
      "userFetchFailed": "Échec de la récupération des informations de groupe d’utilisateurs par ID utilisateur",
      "membershipCheckFailed": "Échec de la vérification de l’appartenance au groupe d’utilisateurs",
      "createFailed": "Échec de la création du groupe d’utilisateurs",
      "updateFailed": "Échec de la mise à jour du groupe d’utilisateurs",
      "deleteFailed": "Échec de la suppression du groupe d’utilisateurs",
      "noUpdateFields": "Aucun champ de mise à jour spécifié",
      "updateError": "Une erreur est survenue lors de la mise à jour du groupe d’utilisateurs"
    },
    "groupPolicy": {
      "fetchFailed": "Échec de la récupération des informations de politique de groupe",
      "accessDenied": "Accès refusé à ces informations de politique de groupe",
      "batchFetchFailed": "Une erreur est survenue lors de la récupération de plusieurs informations de politique de groupe",
      "policyFetchFailed": "Échec de la récupération des informations de politique de groupe par ID de politique",
      "groupFetchFailed": "Échec de la récupération des informations de politique de groupe par ID de groupe",
      "createFailed": "Échec de la création de la politique de groupe",
      "deleteFailed": "Échec de la suppression de la politique de groupe"
    },
    "supportRequest": {
      "fetchFailed": "Échec de la récupération des informations de demande d’assistance",
      "accessDenied": "Accès refusé à ces informations de demande d’assistance",
      "notFound": "Demande d’assistance avec l’ID spécifié introuvable",
      "otherCompanyAccessDenied": "Accès refusé aux informations de demande d’assistance d’une autre entreprise",
      "userAccessDenied": "Accès refusé aux informations de demande d’assistance de cet utilisateur",
      "batchFetchFailed": "Une erreur est survenue lors de la récupération de plusieurs demandes d’assistance",
      "statusBatchFetchFailed": "Une erreur est survenue lors de la récupération de plusieurs statuts de demandes d’assistance",
      "userBatchFetchFailed": "Une erreur est survenue lors de la récupération de plusieurs demandes d’assistance utilisateur",
      "customerBatchFetchFailed": "Une erreur est survenue lors de la récupération de plusieurs demandes d’assistance client",
      "createFailed": "Échec de la création de la demande d’assistance",
      "updateFailed": "Échec de la mise à jour de la demande d’assistance",
      "deleteFailed": "Échec de la suppression de la demande d’assistance",
      "validationError": "Un problème est survenu avec la saisie de la demande d’assistance",
      "updateError": "Une erreur est survenue lors de la mise à jour de la demande d’assistance",
      "noUpdateFields": "Aucun champ de mise à jour spécifié"
    },
    "supportReply": {
      "fetchFailed": "Échec de la récupération des réponses d’assistance",
      "accessDenied": "Accès refusé à ces réponses d’assistance",
      "createFailed": "Échec de la création de la réponse d’assistance",
      "updateFailed": "Échec de la mise à jour de la réponse d’assistance",
      "deleteFailed": "Échec de la suppression de la réponse d’assistance",
      "notFound": "Réponse d’assistance avec l’ID spécifié introuvable",
      "updateError": "Une erreur est survenue lors de la mise à jour de la réponse d’assistance",
      "noUpdateFields": "Aucun champ de mise à jour spécifié"
    },
    "newOrder": {
      "fetchFailed": "Échec de la récupération des informations de nouvelle commande",
      "accessDenied": "Accès refusé à ces informations de nouvelle commande",
      "notFound": "Nouvelle commande avec l’ID spécifié introuvable",
      "otherCompanyAccessDenied": "Accès refusé aux informations de nouvelle commande d’une autre entreprise",
      "batchFetchFailed": "Une erreur est survenue lors de la récupération de plusieurs nouvelles commandes",
      "customerBatchFetchFailed": "Une erreur est survenue lors de la récupération de plusieurs nouvelles commandes client"
    },
    "newOrderRequest": {
      "createFailed": "Échec de la création de la demande de nouvelle commande",
      "updateFailed": "Échec de la mise à jour de la demande de nouvelle commande",
      "deleteFailed": "Échec de la suppression de la demande de nouvelle commande"
    },
    "newOrderReply": {
      "fetchFailed": "Échec de la récupération des réponses aux nouvelles commandes",
      "createFailed": "Échec de la création de la réponse à la nouvelle commande",
      "updateFailed": "Échec de la mise à jour de la réponse à la nouvelle commande",
      "deleteFailed": "Échec de la suppression de la réponse à la nouvelle commande"
    },
    "auditLog": {
      "customerIdRequired": "L’ID client est requis",
      "userIdOrCustomerIdRequired": "L’ID utilisateur ou l’ID client est requis",
      "resourceNameOrCustomerIdRequired": "Le nom de la ressource ou l’ID client est requis",
      "createFailed": "Échec de la création du journal d’audit",
      "validationFailed": "Échec de la validation du journal d’audit",
      "recordFailed": "Échec de l’enregistrement du journal d’audit"
    },
    "dataUsage": {
      "userIdRequired": "L’ID utilisateur est requis",
      "customerIdRequired": "L’ID client est requis",
      "fetchFailed": "Échec de la récupération des informations d’utilisation des données",
      "createFailed": "Échec de la création de l’enregistrement d’utilisation des données",
      "updateFailed": "Échec de la mise à jour de l’utilisation des données",
      "noUpdateFields": "Aucun champ de mise à jour spécifié",
      "updateFieldRequired": "Veuillez spécifier au moins un champ à mettre à jour",
      "notFound": "Enregistrement d’utilisation des données à mettre à jour introuvable",
      "updateError": "Une erreur est survenue lors de la mise à jour de l’utilisation des données"
    },
    "limitUsage": {
      "createFailed": "Échec de la création de la limite d’utilisation",
      "updateFailed": "Échec de la mise à jour de la limite d’utilisation",
      "deleteFailed": "Échec de la suppression de la limite d’utilisation",
      "deleteOperationFailed": "Échec de la suppression de la limite d’utilisation",
      "deleteProcessingError": "Une erreur est survenue lors de la suppression de la limite d’utilisation",
      "unknownResource": "Inconnu"
    },
    "recipient": {
      "fetchFailed": "Échec de la récupération des informations de destinataire",
      "accessDenied": "Accès refusé à ces informations de destinataire",
      "notFound": "Destinataire introuvable",
      "createFailed": "Échec de la création du destinataire",
      "updateFailed": "Échec de la mise à jour du destinataire",
      "deleteFailed": "Échec de la suppression du destinataire",
      "limitUsageIdRequired": "L’ID de limite d’utilisation est requis",
      "noUpdateFields": "Aucun champ de mise à jour spécifié",
      "updateError": "Une erreur est survenue lors de la mise à jour du destinataire",
      "createError": "Une erreur est survenue lors de la création du destinataire",
      "partialUpdateFailed": "Échec de la mise à jour de certains destinataires"
    },
    "delete": {
      "userDeleteFailed": "Échec de la suppression de l’utilisateur",
      "cognitoUserDeleteFailed": "Échec de la suppression de l’utilisateur Cognito",
      "partialDeleteFailed": "Échec de l’annulation de la demande de suppression pour certains ou tous les utilisateurs",
      "authDeleteFailed": "Échec de la suppression des informations d’authentification",
      "dbDeleteFailed": "Échec de la suppression de l’utilisateur en base de données",
      "cancelRequestFailed": "Une erreur est survenue lors de l’annulation de la demande de suppression",
      "cancelRequestProcessingError": "Une erreur est survenue pendant l’annulation de la demande de suppression",
      "userDeleteSuccess": "Utilisateur supprimé avec succès",
      "cognitoUserDeleteSuccess": "Utilisateur Cognito supprimé avec succès",
      "relatedResourceDeleteError": "Une erreur est survenue lors de la suppression des ressources associées",
      "userNotFoundForDeletion": "Utilisateur à supprimer introuvable",
      "bulkDeleteNoTargets": "Aucune cible de suppression spécifiée",
      "bulkDeletePartialFailure": "Échec de la suppression de certains utilisateurs",
      "cancelDeletionSuccess": "Annulation de la demande de suppression terminée pour {count} utilisateurs",
      "cancelDeletionPartialFailure": "Succès : {successCount}, Échec : {failCount}",
      "lastAdminDeleteNotAllowed": "Impossible de supprimer le dernier utilisateur administrateur"
    },
    "cognito": {
      "usernameExists": "Utilisateur déjà enregistré",
      "invalidParameter": "Paramètre invalide",
      "invalidPassword": "Mot de passe invalide",
      "confirmationCodeIncorrect": "Le code de confirmation est incorrect",
      "confirmationCodeExpired": "Le code de confirmation a expiré",
      "userCreationFailed": "Échec de la création de l'utilisateur Cognito",
      "confirmationFailed": "Échec de la confirmation de l'inscription",
      "userNotFound": "Utilisateur introuvable",
      "emailSendFailed": "Échec de l'envoi de l'e-mail",
      "signInFailed": "Échec de la connexion",
      "passwordResetRequired": "Réinitialisation du mot de passe requise",
      "accountNotConfirmed": "Compte non confirmé. Veuillez compléter la vérification par e-mail"
    },
    "stripe": {
      "customerCreationFailed": "Échec de la création du client Stripe",
      "customerNotFound": "Client introuvable",
      "setupIntentCreationFailed": "Échec de la création du setup intent",
      "paymentMethodNotFound": "Moyen de paiement introuvable",
      "paymentMethodDetachFailed": "Échec du détachement du moyen de paiement",
      "paymentHistoryFetchFailed": "Échec de la récupération de l'historique des paiements",
      "defaultPaymentMethodSetFailed": "Échec de la définition du moyen de paiement par défaut",
      "addressUpdateFailed": "Échec de la mise à jour de l'adresse",
      "invalidLocale": "Langue spécifiée invalide",
      "customerIdRequired": "L'ID client est requis",
      "paymentMethodIdRequired": "L'ID du moyen de paiement est requis",
      "addressRequired": "L'adresse est requise",
      "nameRequired": "Le nom est requis",
      "emailRequired": "L'e‑mail est requis",
      "userAttributesRequired": "Les attributs utilisateur sont requis",
      "invalidAddress": "Format d'adresse invalide",
      "stripeError": "Erreur de l'API Stripe",
      "updateFailed": "Échec de la mise à jour",
      "validationError": "Il y a des problèmes avec la saisie",
      "cardError": "Erreur de carte",
      "requestError": "Erreur de requête",
      "apiError": "Erreur d'API",
      "connectionError": "Erreur de connexion",
      "authenticationError": "Erreur d'authentification"
    },
    "api": {
      "invalidRequest": "Requête invalide",
      "missingParameters": "Paramètres requis manquants",
      "serverError": "Erreur interne du serveur",
      "validationFailed": "Échec de la validation de la requête",
      "authenticationRequired": "Authentification requise",
      "accessDenied": "Accès refusé",
      "notFound": "Ressource introuvable",
      "methodNotAllowed": "Méthode non autorisée",
      "conflictError": "Conflit de ressource",
      "rateLimitExceeded": "Limite de débit dépassée"
    },
    "verificationEmail": {
      "sendFailed": "Échec de l’envoi de l’e‑mail de vérification",
      "templateNotFound": "Modèle d’e‑mail introuvable",
      "messageRejected": "E‑mail rejeté (destinataire invalide possible)",
      "sendingPaused": "L’envoi d’e‑mails est temporairement suspendu",
      "mailFromDomainNotVerified": "Domaine d’expéditeur non vérifié",
      "configurationSetNotFound": "Jeu de configuration SES introuvable",
      "invalidTemplate": "Modèle d’e‑mail invalide",
      "invalidAwsCredentials": "Identifiants AWS invalides",
      "invalidParameters": "Paramètres invalides"
    }
  },
  "fields": {
    "userName": "Nom d'utilisateur",
    "email": "Email",
    "department": "Département",
    "position": "Poste",
    "role": "Rôle"
  },
  "messages": {
    "dataUsage": {
      "createSuccess": "Enregistrement d’utilisation des données créé avec succès",
      "updateSuccess": "Utilisation des données mise à jour avec succès"
    },
    "policy": {
      "createSuccess": "Politique créée avec succès",
      "updateSuccess": "Politique mise à jour avec succès",
      "deleteSuccess": "Politique supprimée avec succès"
    },
    "user": {
      "createSuccess": "Utilisateur créé avec succès",
      "updateSuccess": "Informations utilisateur mises à jour avec succès",
      "deleteSuccess": "Utilisateur supprimé avec succès"
    },
    "group": {
      "createSuccess": "Groupe créé avec succès",
      "updateSuccess": "Groupe mis à jour avec succès",
      "deleteSuccess": "Groupe supprimé avec succès"
    },
    "groupPolicy": {
      "createSuccess": "Politique de groupe créée avec succès",
      "deleteSuccess": "Politique de groupe supprimée avec succès"
    },
    "userGroup": {
      "createSuccess": "Groupe d’utilisateurs créé avec succès",
      "updateSuccess": "Groupe d’utilisateurs mis à jour avec succès",
      "deleteSuccess": "Groupe d’utilisateurs supprimé avec succès"
    },
    "newOrderRequest": {
      "createSuccess": "Demande de nouvelle commande créée avec succès",
      "updateSuccess": "Demande de nouvelle commande mise à jour avec succès",
      "deleteSuccess": "Demande de nouvelle commande supprimée avec succès"
    },
    "newOrderReply": {
      "createSuccess": "Réponse à la nouvelle commande créée avec succès",
      "updateSuccess": "Réponse à la nouvelle commande mise à jour avec succès",
      "deleteSuccess": "Réponse à la nouvelle commande supprimée avec succès"
    },
    "supportRequest": {
      "createSuccess": "Demande d’assistance créée avec succès",
      "updateSuccess": "Demande d’assistance mise à jour avec succès",
      "deleteSuccess": "Demande d’assistance supprimée avec succès"
    },
    "supportReply": {
      "createSuccess": "Réponse d’assistance créée avec succès",
      "updateSuccess": "Réponse d’assistance mise à jour avec succès",
      "deleteSuccess": "Réponse d’assistance supprimée avec succès"
    },
    "limitUsage": {
      "createSuccess": "Limite d’utilisation créée avec succès",
      "updateSuccess": "Limite d’utilisation mise à jour avec succès",
      "deleteSuccess": "Limite d’utilisation supprimée avec succès"
    },
    "recipient": {
      "createSuccess": "Destinataire créé avec succès",
      "updateSuccess": "Destinataire mis à jour avec succès",
      "deleteSuccess": "Destinataire supprimé avec succès",
      "bulkUpdateSuccess": "{count} destinataires mis à jour avec succès"
    },
    "auditLog": {
      "createSuccess": "Journal d’audit créé avec succès",
      "recordSuccess": "Journal d’audit enregistré avec succès"
    },
    "stripe": {
      "customerCreateSuccess": "Client créé avec succès",
      "setupIntentCreateSuccess": "Setup intent créé avec succès",
      "paymentMethodDeleteSuccess": "Moyen de paiement supprimé avec succès",
      "paymentHistoryFetchSuccess": "Historique des paiements récupéré avec succès",
      "defaultPaymentMethodSetSuccess": "Moyen de paiement par défaut défini avec succès",
      "addressUpdateSuccess": "Adresse mise à jour avec succès"
    },
    "api": {
      "requestSuccess": "Requête exécutée avec succès",
      "operationCompleted": "Opération terminée avec succès"
    },
    "verificationEmail": {
      "sendSuccess": "E‑mail de vérification envoyé"
    },
    "cognito": {
      "emailVerificationCompleted": "Vérification par e-mail terminée",
      "signInStarted": "Processus de connexion démarré"
    }
  }
}

export default fr;


