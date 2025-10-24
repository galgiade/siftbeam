export const announcement = {
  locale: 'en',
  hero: {
    title: 'Announcements',
    subtitle: 'Check the latest announcements',
  },
  table: {
    date: 'Date',
    category: 'Category',
    title: 'Title',
    priority: 'Priority',
    action: 'Action',
    viewDetails: 'View Details',
    noAnnouncements: 'No announcements available',
  },
  category: {
    price: 'Price',
    feature: 'Feature',
    other: 'Other',
  },
  priority: {
    high: 'High Priority',
    medium: 'Medium Priority',
    low: 'Low Priority',
  },
  error: {
    fetchFailed: 'Failed to fetch announcements',
    notFound: 'Announcement not found',
  },
  detail: {
    backToList: 'Back to Announcements',
    noContent: 'No content available',
  },
  categoryDisplay: {
    price: 'Price',
    feature: 'Feature',
    other: 'Other',
  },
} as const;

export default announcement;
