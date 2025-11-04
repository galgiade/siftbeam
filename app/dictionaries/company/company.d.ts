export type CompanyProfileLocale = {
  alert: {
    updateSuccess: string;
    updateFail: string;
    networkError: string; // {message}
    required: string; // {label}
    fetchCustomerFailed: string;
    customerNotFound: string;
    customerDeleted: string;
    adminOnlyEditMessage: string;
    invalidEmail: string;
    invalidPhone: string;
    invalidPostalCode: string;
    nameTooLong: string;
    addressTooLong: string;
    validationError: string;
    fieldUpdateSuccess: string; // {fieldName}
    fieldUpdateFail: string; // {fieldName}
    updateError: string;
    fieldRequired: string; // {fieldLabel}
    invalidEmailFormat: string;
    invalidPhoneFormat: string;
    invalidPostalCodeFormat: string;
    invalidCountryFormat: string;
    countryRequired: string;
    errorTitle: string;
    fetchError: string;
  };
  label: {
    title: string;
    country: string;
    countryPlaceholder: string;
    postal_code: string;
    state: string;
    city: string;
    line2: string;
    line1: string;
    name: string;
    phone: string;
    email: string;
    notSet: string;
    generalUserPermission: string;
    adminPermission: string;
    adminPermissionDescription: string;
    selectPlaceholder: string; // {label}
  };
  placeholder: {
    postal_code: string;
    state: string;
    city: string;
    line2: string;
    line1: string;
    name: string;
    phone: string;
    email: string;
    phoneExample: string;
  };
  button: {
    cancel: string;
  };
};
