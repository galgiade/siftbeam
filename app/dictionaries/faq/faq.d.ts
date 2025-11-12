export interface FAQItem {
  question: string;
  answer: string | string[];
}

export interface FAQCategory {
  title: string;
  items: FAQItem[];
}

export default interface FAQLocale {
  title: string;
  description: string;
  categories: {
    service: FAQCategory;
    features: FAQCategory;
    pricing: FAQCategory;
    security: FAQCategory;
    support: FAQCategory;
  };
}

