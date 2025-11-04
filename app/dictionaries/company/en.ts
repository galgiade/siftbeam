import type { CompanyProfileLocale } from './company.d.ts';

const en: CompanyProfileLocale = {
  alert: {
    updateSuccess: "Company information updated.",
    updateFail: "Failed to update.",
    networkError: "Network error: {message}",
    required: "\"{label}\" is required.",
    fetchCustomerFailed: "Failed to fetch customer information",
    customerNotFound: "Customer information not found",
    customerDeleted: "This customer account has been deleted",
    adminOnlyEditMessage: "Only administrators can edit company information. Please contact an administrator if you need to make changes.",
    invalidEmail: "Please enter a valid email address",
    invalidPhone: "Please enter a valid phone number",
    invalidPostalCode: "Please enter a valid postal code",
    nameTooLong: "Company name must be 100 characters or less",
    addressTooLong: "Address must be 200 characters or less",
    validationError: "There are issues with the input. Please check.",
    fieldUpdateSuccess: "{fieldName} has been successfully updated.",
    fieldUpdateFail: "Failed to update {fieldName}.",
    updateError: "An error occurred during the update process.",
    fieldRequired: "{fieldLabel} is required.",
    invalidEmailFormat: "Please enter a valid email address.",
    invalidPhoneFormat: "Please enter a valid phone number.",
    invalidPostalCodeFormat: "Please enter a valid postal code.",
    invalidCountryFormat: "Please select a valid country.",
    countryRequired: "Country is required.",
    errorTitle: "Error",
    fetchError: "An error occurred while fetching company information."
  },
  label: {
    title: "Company Information",
    country: "Country",
    countryPlaceholder: "Search and select a country",
    postal_code: "Postal Code",
    state: "State/Province",
    city: "City",
    line2: "Building Name",
    line1: "Street Address",
    name: "Company Name",
    phone: "Phone Number",
    email: "Billing Email Address",
    notSet: "Not set",
    generalUserPermission: "General User Permission",
    adminPermission: "Administrator Permission",
    adminPermissionDescription: "You can edit all fields of company information",
    selectPlaceholder: "Select {label}"
  },
  placeholder: {
    postal_code: "e.g., 12345",
    state: "e.g., California",
    city: "e.g., San Francisco",
    line2: "e.g., Suite 100 (optional)",
    line1: "e.g., 123 Main St",
    name: "e.g., Acme Corporation",
    phone: "e.g., +1-555-123-4567",
    email: "e.g., contact@example.com",
    phoneExample: "e.g., 90-3706-7654"
  },
  button: {
    cancel: "Cancel"
  }
};

export default en;