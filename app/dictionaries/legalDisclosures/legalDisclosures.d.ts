export default interface LegalDisclosuresLocale {
  title: string;
  intro: string;
  sections: {
    company: {
      title: string;
      items: string[];
    };
    pricing: {
      title: string;
      items: string[];
    };
    payment: {
      title: string;
      items: string[];
    };
    service: {
      title: string;
      items: string[];
    };
    cancellation: {
      title: string;
      items: string[];
    };
    environment: {
      title: string;
      items: string[];
    };
    restrictions: {
      title: string;
      items: string[];
    };
    validity: {
      title: string;
      items: string[];
    };
    specialConditions: {
      title: string;
      items: string[];
    };
    businessHours: {
      title: string;
      items: string[];
    };
    governingLaw: {
      title: string;
      items: string[];
    };
  };
  appendix: {
    lastUpdated: string;
    company: {
      name: string;
      address: string;
      representative: string;
      contact: string;
    };
  };
};
