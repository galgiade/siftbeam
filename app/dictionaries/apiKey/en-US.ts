import type { APIKeyLocale } from './apiKey.d';

const en: APIKeyLocale = {
  title: 'API Key Management',
  actions: {
    create: 'Create',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    back: 'Back',
  },
  table: {
    apiName: 'API Name',
    description: 'Description',
    createdAt: 'Created At',
    endpoint: 'Endpoint',
    actions: 'Actions',
  },
  modal: {
    title: 'Edit API Key',
    apiName: 'API Name',
    description: 'Description',
  },
  messages: {
    noData: 'No data',
    updateFailed: 'Failed to update',
    deleteFailed: 'Failed to delete',
    confirmDelete: 'Delete this API key? This action cannot be undone.',
    createFailed: 'Failed to create',
    idRequired: 'id is required',
    deleteSuccess: 'Deleted successfully',
    functionNameNotSet: 'APIGW_KEY_ISSUER_FUNCTION_NAME is not set',
    apiGatewayDeleteFailed: 'Failed to delete API Gateway key',
    idAndApiNameRequired: 'id and apiName are required',
    updateSuccess: 'Updated successfully',
  },
  alerts: {
    adminOnlyCreate: 'Only administrators can create',
    adminOnlyEdit: 'Only administrators can edit',
    adminOnlyDelete: 'Only administrators can delete',
  },
  create: {
    title: 'Issue API Key',
    fields: {
      apiName: 'API Name',
      apiDescription: 'API Description',
      policy: 'API Type (Policy)',
    },
    submit: 'Issue API Key',
    issuedNote: 'The key is shown only once. Save it securely.',
    endpointLabel: 'Upload Endpoint',
    instructions: 'Configure the following on your device.',
    apiKeyHeaderLabel: 'API Key (header x-api-key)',
    uploadExampleTitle: 'Upload example (PowerShell / PNG)',
    csvNote: 'For CSV, set Content-Type to text/csv. Adjust for other file types.',
    filePathNote: 'Specify the path to your file',
  },
};

export default en;


