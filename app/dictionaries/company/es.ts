import type { CompanyProfileLocale } from './company.d.ts';

const es: CompanyProfileLocale = {
  alert: {
    updateSuccess: "La información de la empresa se ha actualizado.",
    updateFail: "La actualización ha fallado.",
    networkError: "Error de red: {message}",
    required: '"{label}" es obligatorio.',
    fetchCustomerFailed: "Error al obtener la información del cliente",
    customerNotFound: "No se encontró la información del cliente",
    customerDeleted: "Esta cuenta de cliente ha sido eliminada",
    adminOnlyEditMessage: "Solo los administradores pueden editar la información de la empresa. Póngase en contacto con un administrador si necesita realizar cambios.",
    invalidEmail: "Por favor, ingrese una dirección de correo electrónico válida",
    invalidPhone: "Por favor, ingrese un número de teléfono válido",
    invalidPostalCode: "Por favor, ingrese un código postal válido",
    nameTooLong: "El nombre de la empresa debe tener 100 caracteres o menos",
    addressTooLong: "La dirección debe tener 200 caracteres o menos",
    validationError: "Hay problemas con la entrada. Por favor, verifique.",
    fieldUpdateSuccess: "{fieldName} se ha actualizado correctamente.",
    fieldUpdateFail: "Error al actualizar {fieldName}.",
    updateError: "Se produjo un error durante el proceso de actualización.",
    fieldRequired: "{fieldLabel} es obligatorio.",
    invalidEmailFormat: "Por favor, ingrese una dirección de correo electrónico válida.",
    invalidPhoneFormat: "Por favor, ingrese un número de teléfono válido.",
    invalidPostalCodeFormat: "Por favor, ingrese un código postal válido.",
    invalidCountryFormat: "Por favor, seleccione un país válido.",
    countryRequired: "El país es obligatorio.",
    errorTitle: "Error",
    fetchError: "Se produjo un error al obtener la información de la empresa."
  },
  label: {
    title: "Información de la empresa",
    country: "País",
    countryPlaceholder: "Busca y selecciona un país",
    postal_code: "Código postal",
    state: "Estado/Provincia",
    city: "Ciudad",
    line2: "Edificio",
    line1: "Dirección",
    name: "Nombre de la empresa",
    phone: "Teléfono",
    email: "Correo de facturación",
    notSet: "No establecido",
    generalUserPermission: "Permiso de usuario general",
    adminPermission: "Permiso de administrador",
    adminPermissionDescription: "Puede editar todos los campos de la información de la empresa",
    selectPlaceholder: "Seleccionar {label}"
  },
  placeholder: {
    postal_code: "ej. 28001",
    state: "ej. Madrid",
    city: "ej. Madrid",
    line2: "ej. Oficina 100 (opcional)",
    line1: "ej. Calle Mayor 123",
    name: "ej. Empresa Ejemplo S.L.",
    phone: "ej. +34-91-123-4567",
    email: "ej. contacto@ejemplo.es",
    phoneExample: "ej. 90-3706-7654"
  },
  button: {
    cancel: "Cancelar"
  }
};

export default es;