export default {
  label: {
    back: "Atrás",
    submit: "Enviar",
    next: "Siguiente",
    loading: "Cargando...",
    companyInfoTitle: "Información de la empresa",
    countryLabel: "País",
    countryPlaceholder: "Busca y selecciona un país",
    postalCodeLabel: "Código postal",
    postalCodePlaceholder: "ej: 28001",
    stateLabel: "Estado/Provincia",
    statePlaceholder: "ej: Madrid",
    cityLabel: "Ciudad",
    cityPlaceholder: "ej: Madrid",
    line1Label: "Dirección línea 1",
    line1Placeholder: "ej: Calle Gran Vía 1",
    line2Label: "Dirección línea 2 (Edificio, Piso)",
    line2Placeholder: "ej: Piso 2, Oficina 201",
    nameLabel: "Nombre de la empresa",
    namePlaceholder: "ej: Empresa Ejemplo S.L.",
    emailLabel: "Correo de facturación",
    emailPlaceholder: "ej: facturacion@empresa.es",
    phoneLabel: "Teléfono",
    phonePlaceholder: "ej: +34-91-123-45-67",
    accountCreation: "Creación de cuenta",
    companyInfo: "Información de la empresa",
    adminSetup: "Configuración del administrador",
    paymentSetup: "Configuración de pago"
  },
  alert: {
    countryRequired: "El país es obligatorio",
    postalCodeRequired: "El código postal es obligatorio",
    stateRequired: "El estado/provincia es obligatorio",
    cityRequired: "La ciudad es obligatoria",
    line1Required: "La dirección línea 1 es obligatoria",
    nameRequired: "El nombre de la empresa es obligatorio",
    emailRequired: "El correo es obligatorio",
    phoneRequired: "El teléfono es obligatorio",
    userAttributeUpdateFailed: "Error al actualizar los atributos del usuario",
    stripeCustomerCreationFailed: "Error al crear el cliente de Stripe",
    communicationError: "Error de comunicación"
  }
} as const;


