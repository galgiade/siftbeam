import type FAQLocale from './faq.d';

const en: FAQLocale = {
  title: 'Frequently Asked Questions (FAQ)',
  description: 'Find answers to common questions about siftbeam\'s data processing service.',
  categories: {
    service: {
      title: 'Service Overview',
      items: [
        {
          question: 'What is siftbeam?',
          answer: 'siftbeam is a B2B data processing service for enterprises. We provide customizable data processing workflows for each client, enabling automated file transformation, processing, and management on secure cloud infrastructure.'
        },
        {
          question: 'What types of companies is this suitable for?',
          answer: [
            'Ideal for:',
            '• Enterprises requiring custom data processing',
            '• Companies with complex data transformation needs',
            '• Organizations seeking scalable data processing solutions',
            '• Businesses looking for secure cloud-based data workflows'
          ]
        },
        {
          question: 'How is siftbeam different from other data processing services?',
          answer: [
            'Key features:',
            '• Per-client Customization: Unlike generic tools, siftbeam offers fully customizable workflows',
            '• Enterprise-grade Reliability: Built on proven cloud infrastructure',
            '• No Vendor Lock-in: Standard data formats and open APIs',
            '• Transparent Pricing: Pay only for what you use'
          ]
        }
      ]
    },
    features: {
      title: 'Features & Specifications',
      items: [
        {
          question: 'What features are available?',
          answer: [
            'Main features:',
            '• Flexible Data Management: Policy-based file upload and management',
            '• Usage Monitoring and Control: Real-time usage monitoring with automatic notifications and restrictions',
            '• Processing Results Analysis: Detailed metrics and reports for operational optimization',
            '• Secure File Storage: Encrypted file handling with automatic 1-year retention',
            '• Multi-language Support: Available in 9 languages (Japanese, English, Chinese, Korean, French, German, Spanish, Portuguese, Indonesian)'
          ]
        },
        {
          question: 'How long is data stored?',
          answer: 'Uploaded data is automatically stored for 1 year after processing. Data is automatically deleted after 1 year. No additional storage fees apply.'
        },
        {
          question: 'What data formats are supported?',
          answer: 'We support major data formats including CSV, JSON, and more. Since we offer per-client customization, please contact us if you need specific format support.'
        },
        {
          question: 'How customizable is the data processing?',
          answer: 'Fully customizable for each client. You can build complex data processing workflows and flexibly define processing rules using policies.'
        }
      ]
    },
    pricing: {
      title: 'Pricing & Payment',
      items: [
        {
          question: 'What is the pricing structure?',
          answer: [
            'Pay-as-you-go pricing:',
            '• Data Processing Fee: $0.00001 per byte (0.001 cents per byte)',
            '• Includes 1-year storage: No additional charges',
            '• No upfront costs: No setup fees or minimum charges',
            '• Monthly billing: Usage from 1st to last day of month, billed on 1st of following month',
            '',
            'Pricing examples:',
            '• Small file (100B): $0.001',
            '• Large file (2MB × 3 files = 6,291,456B): $62.91'
          ]
        },
        {
          question: 'What payment methods are available?',
          answer: 'Credit card payment only (via Stripe). Currency is USD. Monthly charges are automatically billed on the 1st of each month for the previous month\'s usage.'
        },
        {
          question: 'Is there a free trial?',
          answer: 'We currently do not offer a free trial. With our pay-as-you-go pricing, you only pay for what you use. There are no minimum usage fees.'
        },
        {
          question: 'Can pricing change?',
          answer: 'Pricing may change with reasonable advance notice. Please check the pricing page for the latest information.'
        }
      ]
    },
    security: {
      title: 'Security & Compliance',
      items: [
        {
          question: 'How is data security ensured?',
          answer: [
            'We implement the following security measures:',
            '• Authentication: Secure authentication system with multi-factor authentication (MFA) support',
            '• Encryption: TLS for data in transit, AES-256 equivalent for data at rest',
            '• Access Control: Role-based access control based on the principle of least privilege',
            '• Audit Logs: Tamper-resistant audit log recording',
            '• Vulnerability Management: Continuous security monitoring and vulnerability response'
          ]
        },
        {
          question: 'Where is data stored?',
          answer: 'Data is stored on enterprise-grade cloud infrastructure. All data is encrypted and managed under strict access controls.'
        },
        {
          question: 'What about compliance?',
          answer: [
            'We comply with the following data protection regulations:',
            '• GDPR: Compliant with EU General Data Protection Regulation',
            '• CCPA/CPRA: Compliant with California Privacy Laws',
            '• Japanese Law: Compliant with Personal Information Protection Act',
            '• International Data Transfer: Appropriate safeguards such as EU Standard Contractual Clauses (SCC)',
            '',
            'We provide comprehensive Privacy Policy and Data Processing Agreement (DPA). Please refer to our Privacy Policy for details.'
          ]
        }
      ]
    },
    support: {
      title: 'Support & Other',
      items: [
        {
          question: 'How can I get support?',
          answer: [
            'Support options:',
            '• Contact Method: Chat support (available through the service dashboard)',
            '• Languages: 9 languages supported (Japanese, English, Chinese, Korean, French, German, Spanish, Portuguese, Indonesian)',
            '• Response Time: Typically responds within 3 business days',
            '• Business Hours: JST (Japan Standard Time)'
          ]
        },
        {
          question: 'How do I get started?',
          answer: [
            'Get started in 3 simple steps:',
            '1. Sign up (https://siftbeam.com/en/signup/auth)',
            '2. Upload your data files',
            '3. Configure your processing workflow',
            '4. Monitor processing in real-time',
            '5. Download processed results'
          ]
        },
        {
          question: 'Is an API provided?',
          answer: 'Yes, we provide APIs for data upload and processing management. Detailed documentation and sample code are available after signup.'
        }
      ]
    }
  }
};

export default en;

