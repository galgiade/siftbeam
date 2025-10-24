import type LegalDisclosuresLocale from "./legalDisclosures";

const fr: LegalDisclosuresLocale = {
  title: "Avis Légaux & Conditions Commerciales",
  intro: "Cette divulgation est fournie conformément aux lois et réglementations applicables de protection des consommateurs. ConnectTech Inc. (\"nous\", \"notre\", \"nos\") fournit les informations suivantes concernant notre service \"siftbeam\".",
  sections: {
    company: {
      title: "Informations sur l'Entreprise",
      items: [
        "Nom de l'entreprise: ConnectTech Inc.",
        "Représentant: Kazuaki Matsui",
        "Adresse: Dias Waigo 202, 315-1485 Waigo-cho, Naka-ku, Hamamatsu-shi, Shizuoka, Japon",
        "Téléphone: Disponible sur demande",
        "Email: connectechceomatsui@gmail.com",
        "Support: Support par chat (répond généralement dans les 3 jours ouvrables)",
        "Site web: https://siftbeam.com",
      ],
    },
    pricing: {
      title: "Tarification & Frais de Service",
      items: [
        "Tarification à l'usage (Devise: USD)",
        "Frais de traitement des données: 0,001 centimes US par octet (inclut 1 an de stockage)",
        "Les données traitées sont conservées 1 an puis supprimées automatiquement",
        "Aucun niveau gratuit, frais d'utilisation minimum ou coûts d'installation",
        "Les prix peuvent changer avec un préavis raisonnable",
      ],
    },
    payment: {
      title: "Méthodes de Paiement & Conditions",
      items: [
        "Méthode de paiement: Carte de crédit (via Stripe)",
        "Cycle de facturation: Fin de mois",
        "Échéance de paiement: 5 de chaque mois",
        "Arrondi: Peut se produire basé sur la précision de devise de Stripe et les unités de paiement minimum",
        "Taxes: Des frais supplémentaires peuvent s'appliquer selon la loi",
        "Frais supplémentaires: Coûts de connexion Internet (responsabilité du client)",
      ],
    },
    service: {
      title: "Livraison du Service",
      items: [
        "Disponibilité du service: Immédiatement après confirmation du paiement",
        "Configuration système requise: Versions les plus récentes de Google Chrome, Microsoft Edge ou Safari recommandées",
      ],
    },
    cancellation: {
      title: "Annulation & Remboursements",
      items: [
        "Annulation disponible à tout moment via les paramètres du compte",
        "Après demande d'annulation, les données utilisateur sont conservées jusqu'à 90 jours pour conformité légale, support et facturation",
        "Pendant la période de rétention, l'accès au service est désactivé, sans frais supplémentaires",
        "Suppression immédiate disponible sur demande au support (aucun frais de stockage supplémentaire)",
        "Suppression complète automatique après 90 jours (la suppression de sauvegarde peut nécessiter du temps supplémentaire)",
        "En raison de la nature des services numériques, les remboursements ne sont pas disponibles pour les services déjà fournis (sauf si requis par la loi)",
      ],
    },
    environment: {
      title: "Configuration Système Requise",
      items: [
        "Versions les plus récentes de Google Chrome, Microsoft Edge ou Safari recommandées",
        "Connexion Internet requise",
      ],
    },
    restrictions: {
      title: "Limitations d'Utilisation",
      items: [
        "Aucune limitation spécifique",
      ],
    },
    validity: {
      title: "Période de Validité de la Demande",
      items: [
        "Aucune période de validité spécifique",
      ],
    },
    specialConditions: {
      title: "Conditions Spéciales",
      items: [
        "Essais gratuits et offres spéciales soumis à nos conditions générales",
      ],
    },
    businessHours: {
      title: "Heures d'Ouverture & Support",
      items: [
        "Aucune heure d'ouverture fixe",
        "Support disponible uniquement par chat, répond généralement dans les 3 jours ouvrables",
      ],
    },
    governingLaw: {
      title: "Loi Applicable & Juridiction",
      items: [
        "Régie par le droit japonais",
        "Les litiges relèvent de la juridiction exclusive du Tribunal de District de Hamamatsu (selon les Conditions d'Utilisation)",
      ],
    },
  },
  appendix: {
    lastUpdated: "21 septembre 2025",
    company: {
      name: "ConnectTech Inc.",
      address: "Dias Waigo 202, 315-1485 Waigo-cho, Naka-ku, Hamamatsu-shi, Shizuoka, Japon",
      representative: "Kazuaki Matsui",
      contact: "connectechceomatsui@gmail.com",
    },
  },
};

export default fr;
