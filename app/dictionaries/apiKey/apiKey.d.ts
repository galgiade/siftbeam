export type APIKeyLocale = {
  title: string;
  actions: {
    create: string;
    edit: string;
    delete: string;
    save: string;
    cancel: string;
    back: string;
  };
  table: {
    apiName: string;
    description: string;
    createdAt: string;
    endpoint: string;
    actions: string;
  };
  modal: {
    title: string;
    apiName: string;
    description: string;
  };
  messages: {
    noData: string;
    updateFailed: string;
    deleteFailed: string;
    confirmDelete: string;
    createFailed: string;
    idRequired: string;
    deleteSuccess: string;
    functionNameNotSet: string;
    apiGatewayDeleteFailed: string;
    idAndApiNameRequired: string;
    updateSuccess: string;
  };
  alerts: {
    adminOnlyCreate: string;
    adminOnlyEdit: string;
    adminOnlyDelete: string;
  };
  create: {
    title: string;
    fields: {
      apiName: string;
      apiDescription: string;
      policy: string;
    };
    submit: string;
    issuedNote: string;
    endpointLabel: string;
    instructions: string;
    apiKeyHeaderLabel: string;
    uploadExampleTitle: string;
    csvNote: string;
    filePathNote: string;
  };
};


