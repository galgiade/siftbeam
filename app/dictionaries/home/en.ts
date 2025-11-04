const en = {
  hero: {
    title: "siftbeam",
    subtitle: "Leveraging corporate data to create future businesses with AI power",
    contact: "Contact Us",
    buttons: {
      howTo: "See how it works",
      pricing: "View pricing",
    }
  },
  features: {
    title: "Three Values Realized by Advanced AI Technology",
    dataAnalysis: {
      title: "Data Analysis",
      description: "Safely analyze data to discover unique patterns.",
      points: [
        "Policy selection and bulk uploads",
        "Monthly usage bar and overage alerts",
        "Filters by user/policy/date/usage",
        "ZIP bulk download, delete, toggle AI learning",
      ]
    },
    anomalyDetection: {
      title: "Real-time Anomaly Detection",
      description: "High-precision anomaly detection to identify and address business risks early.",
      points: [
        "Two modes: notify or restrict",
        "Thresholds based on usage or cost",
        "Notify or auto-restrict on exceedance",
        "Auto-suggest proper limits based on current usage",
      ]
    },
    customAI: {
      title: "Custom AI Predictions",
      description: "AI models trained on your data predict future trends and support decision-making.",
      points: [
        "Key metrics: Precision/Recall/F1/Error rate",
        "Operational metrics like P95 latency",
        "View and validate report links",
        "Filter and sort by policy",
      ]
    }
  },
  steps: {
    title: "Start with 3 Simple Steps",
    step1: {
      title: "Secure Data Integration",
      description: "Safely upload encrypted data via drag & drop or API. Two-factor authentication ensures complete security."
    },
    step2: {
      title: "AI Model Customization",
      description: "Select and adjust high-performance AI models tailored to your specific needs."
    },
    step3: {
      title: "Real-time Analysis",
      description: "Visualize analysis results in real-time with an intuitive dashboard. Pay-as-you-go model optimizes costs."
    }
  },
  cta: {
    title: "Gain the Power to Predict Your Business Future",
    description: "Take your business to the next level with the latest AI technology. Feel free to contact us now.",
    button: "Contact Us",
    secondaryButton: "See setup steps first"
  }
} as const;

export default en;