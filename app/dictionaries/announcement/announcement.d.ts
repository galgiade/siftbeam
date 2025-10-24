export interface AnnouncementLocale {
  locale: string;
  hero: {
    title: string;
    subtitle: string;
  };
  table: {
    date: string;
    category: string;
    title: string;
    priority: string;
    action: string;
    viewDetails: string;
    noAnnouncements: string;
  };
  category: {
    price: string;
    feature: string;
    other: string;
  };
  priority: {
    high: string;
    medium: string;
    low: string;
  };
  error: {
    fetchFailed: string;
    notFound: string;
  };
  detail: {
    backToList: string;
    noContent: string;
  };
  categoryDisplay: {
    price: string;
    feature: string;
    other: string;
  };
}
