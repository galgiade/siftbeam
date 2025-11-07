const en = {
  hero: {
    title: "siftbeam",
    subtitle: "A platform for efficient data processing and management",
    contact: "Contact Us",
    buttons: {
      howTo: "See how it works",
      pricing: "View pricing",
    }
  },
  features: {
    title: "Three Core Features of the Data Processing Platform",
    dataAnalysis: {
      title: "Flexible Data Management",
      description: "Upload and manage files with policy-based controls. Track processing history in detail.",
      points: [
        "Policy selection and bulk uploads",
        "Monthly usage bar and overage alerts",
        "Filters by user/policy/date/usage",
        "ZIP bulk download, delete, toggle learning permission",
      ]
    },
    anomalyDetection: {
      title: "Usage Monitoring and Control",
      description: "Monitor data usage in real-time and execute notifications or automatic restrictions based on configured limits.",
      points: [
        "Two modes: notify or restrict",
        "Thresholds based on usage or cost",
        "Notify or auto-restrict on exceedance",
        "Auto-suggest proper limits based on current usage",
      ]
    },
    customAI: {
      title: "Processing Results Analysis and Reports",
      description: "Review detailed analysis data of processing results and utilize them for operational optimization.",
      points: [
        "Review detailed metrics of processing results",
        "Operational performance indicators like latency",
        "View and validate detailed reports",
        "Filter and sort by policy",
      ]
    }
  },
  steps: {
    title: "Start with 3 Simple Steps",
    step1: {
      title: "Policy Setup and Data Upload",
      description: "Create policies defining allowed file formats, then upload data via drag & drop or API. Two-factor authentication ensures security."
    },
    step2: {
      title: "Automated Processing Execution",
      description: "Uploaded data is automatically processed based on the selected policy. Processing results are stored for one year."
    },
    step3: {
      title: "Processing History Management and Performance Evaluation",
      description: "Review processing history with an intuitive dashboard. Monitor processing model performance metrics in real-time for optimal operations. Pay-as-you-go model optimizes costs."
    }
  },
  cta: {
    title: "Start Efficient Data Processing Now",
    description: "Define processing rules with policies and efficiently manage large volumes of data. Pay-as-you-go pricing eliminates unnecessary costs.",
    button: "Contact Us",
    secondaryButton: "See setup steps first"
  }
} as const;

export default en;