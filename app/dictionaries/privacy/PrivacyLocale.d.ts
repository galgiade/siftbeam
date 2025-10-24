export default interface PrivacyLocale {
  title: string;
  intro: string;
  sections: StrictSections;
  annexes: StrictAnnexes;
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

// ---- Strict types that mirror the full Japanese locale structure ----
// These do not replace the default export to avoid breaking other locales,
// but can be used where a fully-specified schema is desired.

export interface TextBlock {
  title: string;
  paragraphs?: string[];
  items?: string[];
}

export interface StrictSections {
  definitions: TextBlock & { items: string[] };
  company: TextBlock & { items: string[] };
  dataCollected: TextBlock & { items: string[] };
  purposes: TextBlock & { items: string[] };
  storageDeletion: TextBlock & { paragraphs: string[] };
  thirdParties: TextBlock & { items: string[] } & { paragraphs?: string[] };
  learningOptOut: TextBlock & { items: string[] };
  security: TextBlock & { items: string[] };
  userRights: TextBlock & { paragraphs: string[] };
  legalBasisAndRoles: TextBlock & { items: string[] };
  cookies: TextBlock & { paragraphs: string[] };
  minors: TextBlock & { paragraphs: string[] };
  policyChanges: TextBlock & { paragraphs: string[] };
  contact: TextBlock & { paragraphs: string[] };
}

export interface AnnexA_DPA_Subsections {
  roles: TextBlock & { paragraphs: string[] };
  scope: TextBlock & { items: string[] };
  processorDuties: TextBlock & { items: string[] };
  subProcessors: TextBlock & { items: string[] };
  internationalTransfer: TextBlock & { paragraphs: string[] };
  retentionDeletion: TextBlock & { paragraphs: string[] };
  auditReporting: TextBlock & { paragraphs: string[] };
  liability: TextBlock & { paragraphs: string[] };
  learningInstruction: TextBlock & { paragraphs: string[] };
}

export interface AnnexB_IT_Subsections {
  applicability: TextBlock & { paragraphs: string[] };
  keyChoices: TextBlock & { items: string[] };
  dpa: TextBlock & { paragraphs: string[] };
  annexI: TextBlock & { items: string[] };
  annexII: TextBlock & { items: string[] };
  annexIII: TextBlock & { items: string[] };
  govRequests: TextBlock & { paragraphs: string[] };
  tia: TextBlock & { paragraphs: string[] };
}

export interface AnnexC_US_Subsections {
  c1: TextBlock & { paragraphs: string[] };
  c2: TextBlock & { paragraphs: string[] };
  c3: TextBlock & { paragraphs: string[] };
  c4: TextBlock & { paragraphs: string[] };
  c5: TextBlock & { paragraphs: string[] };
  c6: TextBlock & { paragraphs: string[] };
  c7: TextBlock & { paragraphs: string[] };
}

export interface StrictAnnexes {
  annexA_DPA: {
    title: string;
    subsections: AnnexA_DPA_Subsections;
  };
  annexB_InternationalTransfer: {
    title: string;
    subsections: AnnexB_IT_Subsections;
  };
  annexC_USStateLaw: {
    title: string;
    subsections: AnnexC_US_Subsections;
  };
}

export interface StrictPrivacyLocale {
  title: string;
  intro: string;
  sections: StrictSections;
  annexes: StrictAnnexes;
  appendix: {
    lastUpdated: string;
    company: {
      name: string;
      address: string;
      representative: string;
      contact: string;
    };
  };
}
