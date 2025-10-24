export default interface TermsLocale {
  title: string;
  intro: string;
  sections: {
    definitions: {
      title: string;
      items: string[];
    };
    scopeChanges: {
      title: string;
      paragraphs: string[];
    };
    account: {
      title: string;
      items: string[];
    };
    services: {
      title: string;
      paragraphs: string[];
    };
    dataHandling: {
      title: string;
      subsections: {
        ownership: {
          title: string;
          items: string[];
        };
        license: {
          title: string;
          paragraphs: string[];
        };
        storageDeletion: {
          title: string;
          paragraphs: string[];
        };
        incidents: {
          title: string;
          paragraphs: string[];
        };
        learningOptOut: {
          title: string;
          paragraphs: string[];
        };
      };
    };
    privacy: {
      title: string;
      paragraphs: string[];
      items: string[];
    };
    prohibited: {
      title: string;
      items: string[];
    };
    serviceChange: {
      title: string;
      paragraphs: string[];
    };
    fees: {
      title: string;
      subsections: {
        currencyUnit: {
          title: string;
          items: string[];
        };
        unitPrices: {
          title: string;
          items: string[];
        };
        measurementMethod: {
          title: string;
          items: string[];
        };
        billingPayment: {
          title: string;
          items: string[];
        };
        priceChange: {
          title: string;
          paragraphs: string[];
        };
      };
    };
    ipAndDeliverables: {
      title: string;
      paragraphs: string[];
    };
    representations: {
      title: string;
      paragraphs: string[];
    };
    disclaimer: {
      title: string;
      paragraphs: string[];
    };
    liabilityLimit: {
      title: string;
      paragraphs: string[];
    };
    thirdParty: {
      title: string;
      paragraphs: string[];
    };
    confidentiality: {
      title: string;
      paragraphs: string[];
    };
    support: {
      title: string;
      items: string[];
    };
    termTermination: {
      title: string;
      items: string[];
    };
    antisocialForces: {
      title: string;
      paragraphs: string[];
    };
    assignment: {
      title: string;
      paragraphs: string[];
    };
    severabilityEntire: {
      title: string;
      paragraphs: string[];
    };
    governingLawJurisdiction: {
      title: string;
      paragraphs: string[];
    };
    notices: {
      title: string;
      paragraphs: string[];
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
