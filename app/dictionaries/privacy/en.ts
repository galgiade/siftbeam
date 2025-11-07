import type PrivacyLocale from "./PrivacyLocale";

const en: PrivacyLocale = {
  title: "Privacy Policy (including DPA) | siftbeam",
  intro:
    "This Privacy Policy (the 'Policy') explains how Connect Tech Inc. ('the Company') handles personal information and personal data in the 'siftbeam' service ('the Service'). It complies with Japanese law, including the Act on the Protection of Personal Information (APPI). Provisions relating to the Data Processing Agreement (DPA) are set out in the annexes below.",
  sections: {
    definitions: {
      title: "Definitions",
      items: [
        "Personal Information / Personal Data: As defined under the APPI.",
        "User Data: Data provided by users to the Company (raw data, logs, instructions, metadata, etc.), which may include personal information.",
        "Output Data: Results generated/processed by the Service (including exports such as CSV).",
        "Processing: Any operation including collection, recording, editing, storage, use, provision, deletion, etc.",
        "Processors/Sub-processors: Vendors engaged by the Company (e.g., AWS, Stripe).",
      ],
    },
    company: {
      title: "Company Information",
      items: [
        "Name: Connect Tech Inc.",
        "Address: Dias Wago 202, 315-1485 Wago-cho, Chuo-ku, Hamamatsu-shi, Shizuoka, Japan",
        "Representative: Kazuaki Matsui",
        "Contact: connectechceomatsui@gmail.com",
      ],
    },
    dataCollected: {
      title: "Categories of Information Collected",
      items: [
        "Account information (name, email, organization, role, etc.)",
        "Authentication and log information (auth ID, access logs, IP address, device information, cookies/similar technologies)",
        "Payment information (processed via Stripe; card details are managed by Stripe)",
        "User Data (uploaded data, data for processing/learning, instructions)",
        "Support communications (chat contents)",
      ],
    },
    purposes: {
      title: "Purposes of Use",
      items: [
        "Provision, operation, feature improvement, and quality enhancement of the Service (including model training, evaluation, and tuning)",
        "Authentication, security, incident response, and log analysis",
        "Billing, invoicing, and fraud prevention",
        "Support (chat), notifications, and updates to policies/terms",
        "Creation and publication of statistical information (only in a form that does not identify individuals or specific users)",
        "Legal compliance and protection of rights",
      ],
    },
    storageDeletion: {
      title: "Storage Location, Retention, and Deletion",
      paragraphs: [
        "Storage region: in principle, Japan (Tokyo region). Changes will be notified in advance.",
        "For region changes, the Company will, in principle, notify at least 30 days in advance via email and/or in-product notice (except in emergencies or where required by law).",
        "Retention period: processed data is stored for 1 year and then automatically deleted. Users can delete data individually.",
        "Billing & Payment: Monthly closing at month-end (usage from 1st to last day of the month). Invoice issue date: 1st of the following month. Payment due date: 15th of the following month.",
        "Account deletion: logical deletion upon request and permanent deletion after 90 days (backups may require additional time).",
        "In the event of technical trouble: the Company may access/use the minimum necessary User Data for investigation and resolution and will delete or anonymize it promptly after resolution.",
      ],
    },
    thirdParties: {
      title: "Third-party Provision, Joint Use, and Entrustment",
      items: [
        "Third-party provision: Not without consent unless required by law.",
        "Entrustment: Primary processors are AWS (infrastructure) and Stripe (payments). The Company exercises appropriate oversight.",
        "Sub-processing: No sub-processing beyond the above without the user's prior permission (where unavoidable maintenance/substitution is needed, equivalent or stronger safeguards will be imposed and prompt notice provided).",
        "International transfers: Due to circumstances such as Stripe, data may be stored/processed outside Japan (e.g., in the US), and legal safeguards will be applied.",
      ],
      paragraphs: [
        "Where international transfers occur, the Company adopts appropriate safeguards such as EU Standard Contractual Clauses (SCC), the UK IDTA/UK SCC Addendum, and the Swiss FDPIC Addendum, as applicable (see Annex B).",
      ],
    },
    learningOptOut: {
      title: "Learning Use and Opt-out",
      items: [
        "User Data may be used for model improvement.",
        "Opt-out: Users may exclude data from learning at the account level or per 'processed file'. This may affect the quality of the Service.",
      ],
    },
    security: {
      title: "Security",
      items: [
        "Implementation of safeguards including access control, encryption in transit/at rest, separation of duties, audit logs, and vulnerability management.",
        "Imposition of confidentiality obligations and training for personnel and processors.",
        "In the event of a significant breach, measures will be taken and authorities/individuals will be notified as required by law.",
      ],
    },
    userRights: {
      title: "User Rights",
      paragraphs: [
        "Users may request disclosure, correction, addition, deletion, suspension of use, or cessation of third-party provision (ID verification required). Contact: connectechceomatsui@gmail.com",
      ],
    },
    legalBasisAndRoles: {
      title: "Legal Basis and Roles (Controller/Processor)",
      items: [
        "For personal information related to account management, billing, and Service operations, the Company acts as a 'business operator' (controller-equivalent).",
        "For User Data entrusted by clients (personal data processed within the client's purposes), the Company acts as a 'processor'.",
        "Where US state laws (e.g., CCPA/CPRA) apply, the Company will comply with obligations as a 'service provider/processor' (see Annex C).",
        "This Policy is based on Japanese law; where the Service is subject to other jurisdictions (e.g., EU/EEA), additional measures (such as SCC) will be implemented as required.",
      ],
    },
    cookies: {
      title: "Cookies and Similar Technologies",
      paragraphs: [
        "We may use cookies and similar technologies for usability, security, and analytics. You can disable them in your browser settings, but some features may be affected.",
      ],
    },
    minors: {
      title: "Minors' Personal Information",
      paragraphs: [
        "As a rule, the Service is not intended for use by minors without parental consent.",
      ],
    },
    policyChanges: {
      title: "Changes to this Policy",
      paragraphs: [
        "Material changes will be notified in advance. Continued use after notice constitutes consent to the changes.",
      ],
    },
    contact: {
      title: "Contact",
      paragraphs: [
        "For inquiries regarding the handling of personal information, please contact: connectechceomatsui@gmail.com. Support is chat-only, and we aim to respond within three business days.",
      ],
    },
  },
  annexes: {
    annexA_DPA: {
      title: "Annex A | Data Processing Agreement (DPA) Clauses",
      subsections: {
        roles: {
          title: "A-1. Roles",
          paragraphs: [
            "The client is the controller; the Company is the processor and processes User Data in accordance with the client's instructions.",
          ],
        },
        scope: {
          title: "A-2. Purpose and Scope",
          items: [
            "Purpose: Provision of siftbeam, model creation and improvement, generation of outputs, maintenance and support, security, and billing.",
            "Subject data: Personal data submitted by the client (which may include names, identifiers, contact details, attributes, logs).",
            "Data subjects: The client's customers, users, employees, etc.",
          ],
        },
        processorDuties: {
          title: "A-3. Processor Obligations",
          items: [
            "Process only in accordance with the client's written (including electronic) instructions.",
            "Ensure confidentiality is maintained.",
            "Maintain appropriate technical and organizational security measures.",
            "If data subject requests are received directly by the Company, promptly forward them to and cooperate with the client.",
            "In case of a breach, notify the client without undue delay and cooperate in remediation.",
            "Cooperate with the client's reasonable audits and accountability requests under appropriate confidentiality and security safeguards.",
            "Upon termination of processing, delete or return personal data at the client's choice (unless retention is required by law).",
          ],
        },
        subProcessors: {
          title: "A-4. Sub-processors",
          items: [
            "Existing sub-processors: AWS (infrastructure) and Stripe (payments).",
            "No further sub-processing beyond the above without the client's prior permission. Where substitution is unavoidable, equivalent or stronger safeguards will be ensured and advance notice provided.",
            "Impose data protection obligations equivalent to those in this DPA on all sub-processors.",
          ],
        },
        internationalTransfer: {
          title: "A-5. International Transfers",
          paragraphs: [
            "Where processing takes place outside Japan, the Company will implement safeguards required by applicable law (e.g., contractual clauses and legally required notices).",
          ],
        },
        retentionDeletion: {
          title: "A-6. Retention and Deletion",
          paragraphs: [
            "Upon the client's instruction or after contract termination, the Company will delete or return personal data within a reasonable period. Backups will be securely overwritten/erased.",
          ],
        },
        auditReporting: {
          title: "A-7. Audit and Reporting",
          paragraphs: [
            "The client may conduct audits (e.g., document reviews) upon reasonable notice and scope. The Company will cooperate by providing necessary information.",
          ],
        },
        liability: {
          title: "A-8. Liability",
          paragraphs: [
            "Responsibilities follow the Terms of Service and this DPA. For damages caused by willful misconduct or gross negligence (e.g., breach of security obligations), the Company's liability is limited in accordance with the Terms of Service.",
          ],
        },
        learningInstruction: {
          title: "A-9. Learning Instructions",
          paragraphs: [
            "The client may specify whether learning use is permitted at the account level or per specific file. The Company will comply with such instructions.",
          ],
        },
      },
    },
    annexB_InternationalTransfer: {
      title: "Annex B | International Transfer Clauses (SCC/UK/Swiss)",
      subsections: {
        applicability: {
          title: "B-1. Applicability",
          paragraphs: [
            "For transfers from the EU/EEA, the Company adopts the SCC (2021/914).",
            "Modules: Controller→Processor (Module 2) and Processor→Processor (Module 3), as applicable.",
            "For the UK, the UK IDTA or UK SCC Addendum will be applied; for Switzerland, the FDPIC Addendum will be applied.",
          ],
        },
        keyChoices: {
          title: "B-2. Key Selections (Choices under the SCC text)",
          items: [
            "Clause 7 (Docking Clause): applicable.",
            "Clause 9 (Sub-processor): general authorization; current sub-processors (AWS, Stripe). New/changed sub-processors will be notified in principle 15 days in advance.",
            "Clause 11 (Redress): not applicable (subject to law).",
            "Clause 17 (Governing law): laws of Ireland.",
            "Clause 18 (Forum): courts of Ireland.",
          ],
        },
        dpa: {
          title: "B-3. Supervisory Authority",
          paragraphs: [
            "The intended lead supervisory authority is the Irish Data Protection Commission (DPC), unless otherwise agreed.",
          ],
        },
        annexI: {
          title: "B-4. Annex I (Transfer Details)",
          items: [
            "Parties: Data exporter (the client) and data importer (the Company).",
            "Data subjects: The client's customers, end users, employees, etc.",
            "Data categories: Identifiers, contact details, behavioral logs, transactions, instructions/metadata, etc. (depending on the client's instructions).",
            "Special categories: Not expected in principle; if included, prior agreement is required.",
            "Purpose: Provision of siftbeam, model creation/improvement (opt-out available), maintenance and security, billing, and support.",
            "Retention period: Until the purposes are achieved. After the end of the contract, data will be deleted/returned (except where legal retention is required).",
            "Frequency of transfer: Continuous and/or ad hoc.",
          ],
        },
        annexII: {
          title: "B-5. Annex II (Overview of Technical and Organizational Measures)",
          items: [
            "Access control (least privilege, MFA, segregation of duties)",
            "Data encryption (TLS in transit, AES-256 at rest)",
            "Key management (rotation, KMS)",
            "Logging/audit (tamper resistance, alerting)",
            "Secure development and operations (secure SDLC, vulnerability management, dependency monitoring)",
            "Availability (backups, intra-region redundancy, disaster recovery procedures)",
            "Vendor management (sub-processor assessment/contracts)",
            "Processes for data subject rights",
            "Incident response (detection, containment, root cause analysis, notification)",
          ],
        },
        annexIII: {
          title: "B-6. Annex III (Sub-processors)",
          items: [
            "AWS (infrastructure/hosting, Tokyo region as primary)",
            "Stripe (payments)",
            "Where additional sub-processors are added, advance notice will be provided and equivalent or stronger safeguards will be imposed.",
          ],
        },
        govRequests: {
          title: "B-7. Government Requests",
          paragraphs: [
            "Unless prohibited by law, the Company will notify the exporter without undue delay, scrutinize the legality of the request, and minimize its scope. Transparency reporting may be provided.",
          ],
        },
        tia: {
          title: "B-8. Transfer Impact Assessment (TIA)",
          paragraphs: [
            "Where necessary, the Company will reasonably cooperate with the exporter's TIA and provide relevant information.",
          ],
        },
      },
    },
    annexC_USStateLaw: {
      title: "Annex C | US State Law Addendum (CCPA/CPRA, etc.)",
      subsections: {
        c1: {
          title: "C-1. Roles and Purpose Limitation",
          paragraphs: [
            "The Company acts as a 'service provider/processor' and processes personal information only for the client's business purposes.",
          ],
        },
        c2: {
          title: "C-2. Prohibition on Sale/Sharing",
          paragraphs: [
            "The Company does not 'sell' or 'share' personal information (including cross-context behavioral advertising).",
          ],
        },
        c3: {
          title: "C-3. Prohibition on Secondary Use",
          paragraphs: [
            "The Company does not use personal information for its own independent purposes (except statistical/anonymous use as permitted by applicable law).",
          ],
        },
        c4: {
          title: "C-4. Security",
          paragraphs: [
            "The Company maintains reasonable security and, in the event of a breach, will notify and assist the client.",
          ],
        },
        c5: {
          title: "C-5. Cooperation with Consumer Rights",
          paragraphs: [
            "The Company will reasonably cooperate with requests to access, delete, correct, and opt out. Where applicable, it will respect GPC (Global Privacy Control) signals.",
          ],
        },
        c6: {
          title: "C-6. Sub-processors",
          paragraphs: [
            "The Company will flow down equivalent obligations to sub-processors and provide reasonable notice of any changes.",
          ],
        },
        c7: {
          title: "C-7. Records and Audits",
          paragraphs: [
            "The Company will maintain records necessary for CCPA/CPRA compliance and reasonably cooperate with client audits.",
          ],
        },
      },
    },
  },
  appendix: {
    lastUpdated: "November 7, 2025",
    company: {
      name: "Connect Tech Inc.",
      address: "Dias Wago 202, 315-1485 Wago-cho, Chuo-ku, Hamamatsu-shi, Shizuoka, Japan",
      representative: "Kazuaki Matsui",
      contact: "connectechceomatsui@gmail.com",
    },
  },
};
export default en;