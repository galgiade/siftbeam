import type { CommonLocale } from './common.d.ts';

const fr: CommonLocale = {
  common: {
    navigation: {
      home: "Accueil",
      about: "À propos",
      pricing: "Tarifs",
      contact: "Contact",
      signIn: "Se connecter",
      signUp: "S'inscrire",
      signOut: "Se déconnecter",
      dashboard: "Tableau de bord",
      flow: "Flux",
      blog: "Blog",
      services: "Services",
      myPage: "Ma page",
      supportCenter: "Centre d'assistance",
      faq: "FAQ",
    },
    footer: {
      title: "siftbeam",
      description:
        "Service de traitement de données d'entreprise avec des workflows personnalisables pour automatiser vos opérations de données.",
      links: {
        terms: "Conditions d'utilisation",
        privacy: "Politique de confidentialité",
        legalDisclosures: "Mentions légales",
        blog: "Blog",
        faq: "FAQ",
      },
      copyright: "Connect Tech Inc.",
    },
    fileUploader: {
      dragAndDrop: "Glisser-déposer des fichiers",
      or: "ou",
      selectFile: "Sélectionner des fichiers",
      maxFilesAndSize: "Max {maxFiles} fichiers, {maxFileSize}MB chacun",
      supportedFormats: "Formats pris en charge : Images, Vidéos, Audio, Documents",
      pendingFiles: "En attente ({count} fichiers)",
      uploadStart: "Démarrer le téléchargement",
      uploading: "Téléchargement en cours...",
      uploadedFiles: "Téléchargés ({count} fichiers)",
      uploadComplete: "Téléchargement terminé",
      uploadError: "Erreur de téléchargement",
      uploadFailed: "Le téléchargement a échoué",
      maxFilesExceeded: "Vous pouvez télécharger jusqu'à {maxFiles} fichiers.",
      fileSizeExceeded: "La taille du fichier doit être de {maxFileSize}MB ou moins.\nFichiers trop volumineux : {files}",
      oversizedFiles: "Fichiers trop volumineux",
    },
  },
};

export default fr;
