export const announcement = {
  locale: 'fr',
  hero: {
    title: 'Annonces',
    subtitle: 'Consultez les dernières annonces',
  },
  table: {
    date: 'Date',
    category: 'Catégorie',
    title: 'Titre',
    priority: 'Priorité',
    action: 'Action',
    viewDetails: 'Voir les Détails',
    noAnnouncements: 'Aucune annonce disponible',
  },
  category: {
    price: 'Prix',
    feature: 'Fonctionnalité',
    other: 'Autre',
  },
  priority: {
    high: 'Haute Priorité',
    medium: 'Priorité Moyenne',
    low: 'Basse Priorité',
  },
  error: {
    fetchFailed: 'Échec de la récupération des annonces',
    notFound: 'Annonce introuvable',
  },
  detail: {
    backToList: 'Retour aux Annonces',
    noContent: 'Aucun contenu disponible',
  },
  categoryDisplay: {
    price: 'Prix',
    feature: 'Fonctionnalité',
    other: 'Autre',
  },
} as const;

export default announcement;
