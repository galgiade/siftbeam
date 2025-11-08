import type { UserProfileLocale } from './user.d.ts';

// 当面は英語を転用（将来の完全翻訳に備えてファイルを分離）
const fr: UserProfileLocale = {
  alert: {
    updateSuccess: "Informations utilisateur mises à jour avec succès.",
    updateFail: "Échec de la mise à jour des informations utilisateur.",
    updateError: "Une erreur s'est produite lors de la mise à jour.",
    fieldUpdateSuccess: "{field} a été mis à jour avec succès.",
    fieldUpdateFail: "Échec de la mise à jour de {field}.",
    emailSent: "Un code de confirmation a été envoyé à votre nouvelle adresse e-mail.",
    emailUpdateSuccess: "Adresse e-mail mise à jour avec succès.",
    emailUpdateFail: "Échec de la mise à jour de l'adresse e-mail.",
    dbUpdateFail: "Échec de la mise à jour de la base de données.",
    dbUpdateError: "Échec de la mise à jour de la base de données",
    confirmFail: "Le code de confirmation est incorrect ou la mise à jour de la base de données a échoué.",
    invalidConfirmationCode: "Le code de confirmation est incorrect. Veuillez saisir le code à 6 chiffres correct.",
    expiredConfirmationCode: "Le code de confirmation a expiré. Veuillez demander un nouveau code.",
    noEmailChange: "Aucun changement d'adresse e-mail.",
    invalidEmailFormat: "Format d'e-mail invalide. Veuillez saisir une adresse e-mail valide.",
    noChange: "Aucun changement de nom d'utilisateur.",
    invalidConfirmationCodeFormat: "Veuillez saisir un code de confirmation à 6 chiffres.",
    verificationCodeNotFound: "Code de vérification introuvable ou expiré",
    remainingAttempts: "Tentatives restantes",
    verificationCodeStoreFailed: "Échec du stockage du code de vérification. Veuillez vérifier les permissions IAM.",
    codeStoreFailed: "Échec de l'enregistrement du code.",
    adminOnlyEdit: "Seuls les administrateurs peuvent modifier ce champ.",
    validEmailRequired: "Veuillez saisir une adresse e-mail valide."
  },
  label: {
    title: "Informations utilisateur",
    userName: "Nom d'utilisateur",
    department: "Département",
    position: "Poste",
    email: "Adresse e-mail",
    locale: "Langue",
    role: "Rôle",
    edit: "Modifier",
    save: "Enregistrer",
    cancel: "Annuler",
    adminOnly: "(Admin uniquement)",
    readOnly: "(Non modifiable)",
    editableFields: "Modifiable: Nom d'utilisateur, Langue",
    adminOnlyFields: "Admin uniquement: E-mail, Département, Poste",
    allFieldsEditable: "Tous les champs sont modifiables",
    newEmailSent: "Code de vérification envoyé à \"{email}\".",
    roleAdmin: "Administrateur",
    roleUser: "Utilisateur",
    lastAdminRestriction: "Le changement de rôle est restreint si vous êtes le dernier administrateur",
    lastAdminNote: "※ S'il n'y a qu'un seul administrateur dans l'organisation, le rôle ne peut pas être changé en utilisateur régulier.",
    generalUserPermission: "Permission Utilisateur Général",
    adminPermission: "Permission Administrateur",
    verifyAndUpdate: "Vérifier et Mettre à jour",
    verificationCodePlaceholder: "Code de vérification (6 chiffres)",
    retryAfter: "Réessayer disponible après"
  },
  modal: {
    modalTitle: "Confirmation e-mail",
    description: "Veuillez saisir le code de confirmation envoyé à votre nouvelle adresse e-mail ({email}).",
    codeLabel: "Code de confirmation",
    cancel: "Annuler",
    confirm: "Confirmer",
    resend: "Renvoyer",
    verifying: "Vérification..."
  }
}

export default fr;


