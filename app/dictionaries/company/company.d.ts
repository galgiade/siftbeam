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
  };
  button: {
    cancel: string;
  };
};
