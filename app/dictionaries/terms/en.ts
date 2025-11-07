import type TermsLocale from "./TermsLocale";

const en: TermsLocale = {
  title: "Terms of Service (siftbeam)",
  intro:
    "These Terms of Service (the 'Terms') govern the use of siftbeam (the 'Service') provided by Connect Tech Inc. (the 'Company'). By using the Service, users agree to these Terms.",
  sections: {
    definitions: {
      title: "Definitions",
      items: [
        "Service: Builds/improves AI models based on user-provided data, performs prediction/clustering/classification, creates statistics, and outputs results such as CSV.",
        "User Data: Data provided by users to the Company (raw data, metadata, logs, instructions, etc.).",
        "Output Data: Results generated/processed by the Service (including CSV exports).",
        "Model: AI models created/operated/improved by the Company (features, trained weights, prompts, pipelines, metrics).",
        "Usage-based billing: Billing based on data ingestion, processing, and storage volume, etc.",
      ],
    },
    scopeChanges: {
      title: "Scope and Changes",
      paragraphs: [
        "These Terms apply to all relationships regarding the Service between the Company and users.",
        "The Company may revise these Terms and will notify material changes. Continued use after notice constitutes consent.",
      ],
    },
    account: {
      title: "Account",
      items: [
        "Keep registration information accurate and up to date; manage credentials securely.",
        "The Company is not liable for unauthorized account use unless due to willful misconduct or gross negligence.",
      ],
    },
    services: {
      title: "Service Description",
      paragraphs: [
        "The Company builds AI models per user needs and performs prediction/clustering/classification or creates statistics.",
        "With continuous data provision, the Company may improve models using such data.",
        "Processed results are exported in formats such as CSV (format/items/frequency per separate specs).",
        "Functions may be added/changed/suspended; beta features may be provided.",
      ],
    },
    dataHandling: {
      title: "Data Handling",
      subsections: {
        ownership: {
          title: "Ownership",
          items: [
            "Rights to User Data belong to users.",
            "Rights to Output Data belong to users in principle (user ensures no third-party infringement).",
            "IP rights to models/algorithms/know-how/templates belong to the Company or licensors.",
          ],
        },
        license: {
          title: "License",
          paragraphs: [
            "Users grant the Company a worldwide, royalty-free, non-exclusive right to use User Data for service provision, quality improvement, model training/evaluation/tuning, and statistics. Personal data per Privacy Policy.",
            "The Company may create/publish/use statistics and indicators that do not identify users or individuals.",
          ],
        },
        storageDeletion: {
          title: "Storage and Deletion",
          paragraphs: [
            "Default storage region is Japan (Tokyo). Changes will, in principle, be notified at least 30 days in advance by email and/or in-product notice (exceptions for emergencies/legal requirements).",
            "Users can delete data individually. Upon account deletion request, logical deletion occurs and permanent deletion after 90 days (backups may take longer).",
          ],
        },
        incidents: {
          title: "Incidents",
          paragraphs: [
            "For troubleshooting, the Company may access/use User Data to the minimum extent under access control and audit logging, and delete/anonymize promptly after resolution.",
          ],
        },
        learningOptOut: {
          title: "Learning Opt-out",
          paragraphs: [
            "Users may opt out of model improvement at account or processed-file level. Opt-out may affect quality/accuracy.",
          ],
        },
      },
    },
    privacy: {
      title: "Personal Data Handling (Japan)",
      paragraphs: [
        "The Company handles personal information contained in User Data in accordance with the APPI and related laws and guidelines.",
      ],
      items: [
        "Purposes: service provision, operation/maintenance, inquiries, quality improvement, security, legal compliance.",
        "Outsourcing/sub-processors: main partners are AWS (infra) and Stripe (payments). No further sub-processing without prior consent (except unavoidable maintenance/substitution with equivalent safeguards and prompt notice).",
        "Cross-border transfer with legal safeguards as necessary.",
        "Security: access control, encryption, logging, separation of duties, vulnerability management.",
        "Requests via Company procedures (ID verification required).",
        "Retention: delete within a reasonable period after purpose achieved or contract ends (see Section 5 priority).",
      ],
    },
    prohibited: {
      title: "Prohibited Activities",
      items: [
        "Violations of laws/public order; infringement of third-party rights.",
        "Sending personal/sensitive data without lawful basis.",
        "Unauthorized access, reverse engineering, excessive load, spam, malware.",
        "Defamation/credibility damage, false declarations.",
        "Use to build competing services without prior written consent.",
      ],
    },
    serviceChange: {
      title: "Service Changes/Suspension",
      paragraphs: [
        "The Company may change/interrupt/terminate all or part of the Service due to maintenance, failures, compliance, security, or force majeure.",
        "Except in emergencies, prior notice will be provided within a reasonable scope.",
      ],
    },
    fees: {
      title: "Fees/Billing/Payment (Usage-based)",
      subsections: {
        currencyUnit: {
          title: "Currency/Unit",
          items: [
            "Currency: USD (US cents).",
            "Measured per byte. Calculated per byte.",
          ],
        },
        unitPrices: {
          title: "Unit Prices",
          items: [
            "Processing: 0.001 US cent per B.",
            "Storage: 0.0001 US cent per B per month.",
            "No free tier, minimum fee, or setup fee.",
          ],
        },
        measurementMethod: {
          title: "Measurement",
          items: [
            "Processing on total monthly uploads including temporary expansion, intermediates, and retries.",
            "Storage by daily average or monthly maximum, whichever is higher.",
          ],
        },
        billingPayment: {
          title: "Billing/Payment",
          items: [
            "Billing cycle: Monthly closing at month-end (usage from 1st to last day of the month). Invoice issue date: 1st of the following month. Payment due date: 15th of the following month.",
            "Payment via credit card (Stripe).",
            "Rounding per Stripe precision/minimum unit (Company rounding rules).",
            "Taxes added as required by law.",
            "No refunds for services already provided (unless required by law).",
            "Late charges: 14.6% p.a.",
          ],
        },
        priceChange: {
          title: "Price Changes",
          paragraphs: [
            "Prices may change with reasonable prior notice and apply after notice.",
          ],
        },
      },
    },
    ipAndDeliverables: {
      title: "Intellectual Property and Deliverables",
      paragraphs: [
        "The Company retains intellectual property rights in models, templates, scripts, and workflows.",
        "During the contract term, users may use Output Data on a non-exclusive basis for their own business purposes.",
        "For custom models, the Company may use insights, weights, and features obtained in a form that does not identify the user to improve other services (where a separate agreement exists, it prevails).",
      ],
    },
    representations: {
      title: "Representations and Warranties",
      paragraphs: [
        "Users represent and warrant that (i) they have lawful authority/consent/contractual permission for the User Data, (ii) no third-party rights are infringed, and (iii) no applicable laws are violated.",
        "Given the nature of AI, the Company does not warrant the accuracy, completeness, usefulness, fitness, or reproducibility of outputs.",
      ],
    },
    disclaimer: {
      title: "Disclaimer",
      paragraphs: [
        "The Company is not liable for damages caused by events beyond its reasonable control, including natural disasters, network/cloud outages, changes in law, or unlawful acts by third parties.",
        "Beta/experimental features, sample code, and recommended values are provided as-is.",
      ],
    },
    liabilityLimit: {
      title: "Limitation of Liability",
      paragraphs: [
        "Except in cases of willful misconduct or gross negligence, the Company's total liability is limited to the aggregate consideration paid by the user to the Company in the preceding 12 months.",
        "This limitation does not apply to personal injury, intentional IP infringement, or breaches of confidentiality.",
      ],
    },
    thirdParty: {
      title: "Third-party Services",
      paragraphs: [
        "Third-party services/APIs integrated with the Service (e.g., AWS, Stripe) are subject to their respective terms. Changes or suspensions by such providers may affect certain functions.",
      ],
    },
    confidentiality: {
      title: "Confidentiality",
      paragraphs: [
        "Each party will treat the other party's non-public information as confidential, will not disclose or leak it to third parties, and will not use it for purposes other than the intended purpose. This obligation survives termination.",
      ],
    },
    support: {
      title: "Support",
      items: [
        "Support is provided via chat only. Phone/video calls are not provided.",
        "Target response time: within 3 business days. No commitment to specific hours/days.",
      ],
    },
    termTermination: {
      title: "Term/Termination",
      items: [
        "Use commences on the application date. Users may terminate via the method designated by the Company (for termination in the current month, submit by the Company's deadline).",
        "In cases of material breach, non-payment, or involvement with antisocial forces, the Company may suspend or terminate without notice.",
      ],
    },
    antisocialForces: {
      title: "Exclusion of Antisocial Forces",
      paragraphs: [
        "Each party represents and warrants that it is not and will not be involved with antisocial forces, and in case of breach, the other party may terminate immediately without notice.",
      ],
    },
    assignment: {
      title: "No Assignment",
      paragraphs: [
        "Users may not assign or create a security interest over their contractual status or rights/obligations without the Company's prior written consent.",
      ],
    },
    severabilityEntire: {
      title: "Severability/Entire Agreement",
      paragraphs: [
        "If any provision of these Terms is held invalid or unenforceable, the remaining provisions remain in full force and effect.",
        "These Terms constitute the entire agreement regarding the Service. Where a separate agreement exists, the separate agreement prevails.",
      ],
    },
    governingLawJurisdiction: {
      title: "Governing Law/Jurisdiction",
      paragraphs: [
        "These Terms are governed by Japanese law.",
        "Exclusive jurisdiction: Hamamatsu District Court (first instance).",
      ],
    },
    notices: {
      title: "Notices",
      paragraphs: [
        "Company contacts via in-product notice, email, or other appropriate means.",
        "User contact: connectechceomatsui@gmail.com.",
      ],
    },
  },
  appendix: {
    lastUpdated: "November 6, 2025",
    company: {
      name: "Connect Tech Inc.",
      address: "Dias Wago 202, 315-1485 Wago-cho, Chuo-ku, Hamamatsu, Shizuoka, Japan",
      representative: "Kazuaki Matsui",
      contact: "connectechceomatsui@gmail.com",
    },
  },
};
export default en;