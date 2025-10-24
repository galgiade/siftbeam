export default interface HomeLocale {
  hero: {
    title: string;
    subtitle: string;
    contact: string;
    buttons: {
      howTo: string;
      pricing: string;
    };
  };
  features: {
    title: string;
    dataAnalysis: {
      title: string;
      description: string;
      points: readonly string[];
    };
    anomalyDetection: {
      title: string;
      description: string;
      points: readonly string[];
    };
    customAI: {
      title: string;
      description: string;
      points: readonly string[];
    };
  };
  steps: {
    title: string;
    step1: {
      title: string;
      description: string;
    };
    step2: {
      title: string;
      description: string;
    };
    step3: {
      title: string;
      description: string;
    };
  };
  cta: {
    title: string;
    description: string;
    button: string;
    secondaryButton: string;
  };
};
