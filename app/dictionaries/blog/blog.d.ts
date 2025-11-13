export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
  tags: string[];
  readingTime: string;
}

export interface BlogLocale {
  title: string;
  description: string;
  categories: {
    all: string;
    technical: string;
    tutorial: string;
    case_study: string;
    trend: string;
    product_update: string;
    comparison: string;
    security: string;
    announcement: string;
  };
  readMore: string;
  backToList: string;
  relatedPosts: string;
  share: string;
  publishedOn: string;
  updatedOn: string;
  author: string;
  readingTime: string;
  tableOfContents: string;
  summary: string;
  nextSteps: string;
}

