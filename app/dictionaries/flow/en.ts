import type { FlowLocale } from './flow.d';

const en: FlowLocale = {
  flow: {
    hero: {
      badge: 'Flow',
      title: 'Getting Started – Steps to Start Using',
      subtitle:
        'From sign-up to downloading processed data, follow these 5 simple steps.',
    },
    steps: {
      step1: {
        badge: 'STEP 1',
        tag: 'Start now',
        title: 'Sign up',
        description:
          'Create your account with email and password. Authentication is securely managed.',
      },
      step2: {
        badge: 'STEP 2',
        tag: 'New order page',
        title: 'Requirements hearing',
        description:
          'Tell us your analysis needs on the new order page: goals, data to use, and output format.',
      },
      step3: {
        badge: 'STEP 3',
        tag: 'About 2 weeks',
        title: 'Processing setup',
        description:
          'We design the optimal processing flow. You can track the progress on the dashboard.',
      },
      step4: {
        badge: 'STEP 4',
        tag: 'After setup is ready',
        title: 'Choose processing and upload',
        description:
          'Select the processing you want and upload files. Large files are supported.',
      },
      step5: {
        badge: 'STEP 5',
        tag: 'Auto notification',
        title: 'Complete & download',
        description:
          'You will be notified when processing is done. Download the results; you can re-run if needed.',
      },
    },
    notice:
      'Timeframe is indicative and may vary depending on complexity and data volume. Your contact person will guide you.',
    cta: {
      title: 'Get started now',
      description: 'Create an account and request your preferred analysis.',
      button: 'Go to sign up',
    },
  },
};

export default en;
