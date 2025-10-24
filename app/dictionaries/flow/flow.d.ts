export type FlowLocale = {
  flow: {
    hero: {
      badge: string;
      title: string;
      subtitle: string;
    };
    steps: {
      step1: { badge: string; tag: string; title: string; description: string };
      step2: { badge: string; tag: string; title: string; description: string };
      step3: { badge: string; tag: string; title: string; description: string };
      step4: { badge: string; tag: string; title: string; description: string };
      step5: { badge: string; tag: string; title: string; description: string };
    };
    notice: string;
    cta: {
      title: string;
      description: string;
      button: string;
    };
  };
};
