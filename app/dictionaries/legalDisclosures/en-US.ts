import type LegalDisclosuresLocale from "./legalDisclosures";

const enUS: LegalDisclosuresLocale = {
  title: "Legal Disclosures & Business Terms",
  intro: "This disclosure is provided in accordance with applicable consumer protection laws and regulations. ConnectTech Inc. (\"we\", \"us\", \"our\") provides the following information regarding our \"siftbeam\" service.",
  sections: {
    company: {
      title: "Business Information",
      items: [
        "Business Name: ConnectTech Inc.",
        "Representative: Kazuaki Matsui",
        "Address: Dias Waigo 202, 315-1485 Waigo-cho, Naka-ku, Hamamatsu-shi, Shizuoka, Japan",
        "Phone: Available upon request",
        "Email: connectechceomatsui@gmail.com",
        "Support: Chat support (typically responds within 3 business days)",
        "Website: https://siftbeam.com",
      ],
    },
    pricing: {
      title: "Pricing & Service Fees",
      items: [
        "Pay-as-you-go pricing (Currency: USD)",
        "Data processing fee: 0.001 US cents per byte (includes 1-year storage)",
        "Processed data is stored for 1 year and then automatically deleted",
        "No free tier, minimum usage fee, or setup costs",
        "Prices may change with reasonable advance notice",
      ],
    },
    payment: {
      title: "Payment Methods & Terms",
      items: [
        "Payment method: Credit card (via Stripe)",
        "Billing cycle: End of month",
        "Payment due: 5th of each month",
        "Rounding: May occur based on Stripe's currency precision and minimum payment units",
        "Taxes: Additional charges may apply as required by law",
        "Additional fees: Internet connection costs (customer responsibility)",
      ],
    },
    service: {
      title: "Service Delivery",
      items: [
        "Service availability: Immediately after payment confirmation",
        "System requirements: Latest versions of Google Chrome, Microsoft Edge, or Safari recommended",
      ],
    },
    cancellation: {
      title: "Cancellation & Refunds",
      items: [
        "Cancellation available at any time through account settings",
        "After cancellation request, user data is retained for up to 90 days for legal compliance, support, and billing purposes",
        "During retention period, service access is disabled and no additional fees apply",
        "Immediate deletion available upon request to support (no further storage fees apply)",
        "Automatic complete deletion after 90 days (backup deletion may require additional time)",
        "Due to the nature of digital services, refunds are not available for services already provided (except as required by law)",
      ],
    },
    environment: {
      title: "System Requirements",
      items: [
        "Latest versions of Google Chrome, Microsoft Edge, or Safari recommended",
        "Internet connection required",
      ],
    },
    restrictions: {
      title: "Usage Limitations",
      items: [
        "No specific limitations",
      ],
    },
    validity: {
      title: "Application Validity Period",
      items: [
        "No specific validity period",
      ],
    },
    specialConditions: {
      title: "Special Conditions",
      items: [
        "Free trials and special offers subject to our terms and conditions",
      ],
    },
    businessHours: {
      title: "Business Hours & Support",
      items: [
        "No fixed business hours",
        "Support available via chat only, typically responds within 3 business days",
      ],
    },
    governingLaw: {
      title: "Governing Law & Jurisdiction",
      items: [
        "Governed by Japanese law",
        "Disputes subject to exclusive jurisdiction of Hamamatsu District Court (as per Terms of Service)",
      ],
    },
  },
  appendix: {
    lastUpdated: "September 21, 2025",
    company: {
      name: "ConnectTech Inc.",
      address: "Dias Waigo 202, 315-1485 Waigo-cho, Naka-ku, Hamamatsu-shi, Shizuoka, Japan",
      representative: "Kazuaki Matsui",
      contact: "connectechceomatsui@gmail.com",
    },
  },
};

export default enUS;
