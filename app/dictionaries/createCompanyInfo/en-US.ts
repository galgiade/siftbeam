export default {
  label: {
    back: "Back",
    submit: "Submit",
    next: "Next",
    loading: "Loading...",
    companyInfoTitle: "Company Information",
    countryLabel: "Country",
    countryPlaceholder: "Search and select a country",
    postalCodeLabel: "Postal Code",
    postalCodePlaceholder: "e.g. 12345",
    stateLabel: "State/Province",
    statePlaceholder: "e.g. California",
    cityLabel: "City",
    cityPlaceholder: "e.g. San Francisco",
    line1Label: "Address Line 1",
    line1Placeholder: "e.g. 123 Main St",
    line2Label: "Address Line 2 (Building, Room)",
    line2Placeholder: "e.g. Suite 100",
    nameLabel: "Company Name",
    namePlaceholder: "e.g. Sample Corp",
    emailLabel: "Billing Email",
    emailPlaceholder: "e.g. billing@company.com",
    phoneLabel: "Phone Number",
    phonePlaceholder: "e.g. +1-555-123-4567",
    accountCreation: "Account Creation",
    companyInfo: "Company Information",
    adminSetup: "Admin Setup",
    paymentSetup: "Payment Setup"
  },
  alert: {
    countryRequired: "Country is required",
    postalCodeRequired: "Postal code is required",
    stateRequired: "State/Province is required",
    cityRequired: "City is required",
    line1Required: "Address line 1 is required",
    nameRequired: "Company name is required",
    emailRequired: "Email address is required",
    phoneRequired: "Phone number is required",
    userAttributeUpdateFailed: "Failed to update user attributes",
    stripeCustomerCreationFailed: "Failed to create Stripe customer",
    communicationError: "Communication error occurred"
  }
} as const;


