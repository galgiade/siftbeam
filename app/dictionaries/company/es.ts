export default {
  alert: {
    updateSuccess: "La información de la empresa se ha actualizado.",
    updateFail: "La actualización ha fallado.",
    networkError: "Error de red: {message}",
    required: '"{label}" es obligatorio.',
    fetchCustomerFailed: "Error al obtener la información del cliente",
    customerNotFound: "No se encontró la información del cliente",
    customerDeleted: "Esta cuenta de cliente ha sido eliminada",
    adminOnlyEditMessage: "Solo los administradores pueden editar la información de la empresa. No tiene permisos para editar.",
    invalidEmail: "Por favor, ingrese una dirección de correo electrónico válida",
    invalidPhone: "Por favor, ingrese un número de teléfono válido",
    invalidPostalCode: "Por favor, ingrese un código postal válido",
    nameTooLong: "El nombre de la empresa debe tener 100 caracteres o menos",
    addressTooLong: "La dirección debe tener 200 caracteres o menos",
    validationError: "Hay problemas con la entrada. Por favor, verifique."
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
    email: "Correo de facturación"
  },
  placeholder: {
    postal_code: "ej. 28001",
    state: "ej. Madrid",
    city: "ej. Madrid",
    line2: "ej. Oficina 100 (opcional)",
    line1: "ej. Calle Mayor 123",
    name: "ej. Empresa Ejemplo S.L.",
    phone: "ej. +34-91-123-4567",
    email: "ej. contacto@ejemplo.es"
  },
  button: {
    cancel: "Cancelar"
  }
} as const;


