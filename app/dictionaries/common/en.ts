import type { CommonLocale } from './common.d.ts';

const enUS: CommonLocale = {
  common: {
    navigation: {
      home: 'Home',
      about: 'About',
      pricing: 'Pricing',
      contact: 'Contact',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      dashboard: 'Dashboard',
      flow: 'Flow',
      blog: 'Blog',
      services: 'Services',
      myPage: 'My Page',
      supportCenter: 'Support Center',
      faq: 'FAQ',
    },
    footer: {
      title: 'siftbeam',
      description:
        'Enterprise data processing service with customizable workflows to automate your business data operations.',
      links: {
        terms: 'Terms of Service',
        privacy: 'Privacy Policy',
        legalDisclosures: 'Legal Disclosures',
        blog: 'Blog',
        faq: 'FAQ',
      },
      copyright: 'Connect Tech Inc.',
    },
    fileUploader: {
      dragAndDrop: 'Drag & Drop Files',
      or: 'or',
      selectFile: 'Select Files',
      maxFilesAndSize: 'Max {maxFiles} files, {maxFileSize}MB each',
      supportedFormats: 'Supported formats: Images, Videos, Audio, Documents',
      pendingFiles: 'Pending ({count} files)',
      uploadStart: 'Start Upload',
      uploading: 'Uploading...',
      uploadedFiles: 'Uploaded ({count} files)',
      uploadComplete: 'Upload Complete',
      uploadError: 'Upload Error',
      uploadFailed: 'Upload failed',
      maxFilesExceeded: 'You can upload up to {maxFiles} files.',
      fileSizeExceeded: 'File size must be {maxFileSize}MB or less.\nOversized files: {files}',
      oversizedFiles: 'Oversized files',
    },
  },
};

export default enUS;


