import type { CreatePaymentLocale } from './createPayment.d.ts';

const es: CreatePaymentLocale = {
  label: {
    back: "Atrás",
    submit: "Enviar",
    loading: "Cargando...",
    paymentSetupTitle: "Configuración del método de pago",
    cardInfoLabel: "Información de la tarjeta",
    expiryLabel: "MM/AA",
    cvcLabel: "Código de seguridad",
    apply: "Aplicar",
    processing: "Procesando...",
    goToMyPage: "Ir a Mi página",
    accountCreation: "Creación de cuenta",
    companyInfo: "Información de la empresa",
    adminSetup: "Configuración de administrador",
    paymentSetup: "Configuración de pago",
    paymentMethodSaved: "✓ Método de pago guardado exitosamente",
    defaultPaymentMethodSet: "Esta tarjeta ha sido establecida como método de pago predeterminado.",
    subscriptionCreated: "✓ Suscripción creada exitosamente",
    automaticBillingEnabled: "La facturación automática basada en el uso ahora está habilitada.",
    saveInfoDescription: "Guarde su información de forma segura para compras de un clic en el futuro",
    linkCompatibleStores: "Pague rápidamente en tiendas compatibles con Link, incluyendo Soundbox predeterminado.",
    cardInfoEncrypted: "La información de la tarjeta está encriptada y almacenada de forma segura.",
    billingBasedOnUsage: "La facturación real tendrá lugar más tarde según el uso.",
    dataRetentionNotice: "Los datos procesados se almacenarán gratis durante 1 año y luego se eliminarán automáticamente",
    authenticationFlowDescription: "Por razones de seguridad, puede ser necesaria la autenticación de la tarjeta.",
    authenticationFlowSteps: "Si se requiere autenticación, se mostrará la pantalla de autenticación de su banco. Por favor complete la autenticación.",
    agreeNoticePrefix: "Al completar el registro, acepta los ",
    and: " y la ",
    agreeNoticeSuffix: ".",
    terms: "Términos de servicio",
    privacy: "Política de privacidad"
  },
  alert: {
    expiryRequired: "Por favor ingrese correctamente la fecha de vencimiento",
    cvcRequired: "Por favor ingrese correctamente el código de seguridad",
    cardInfoRequired: "La información de la tarjeta no está ingresada",
    setupIntentFailed: "Error al crear Setup Intent",
    paymentMethodFailed: "Error al crear método de pago",
    unknownError: "Ha ocurrido un error desconocido",
    customerInfoNotFound: "No se pudieron recuperar los datos del cliente.",
    defaultPaymentMethodFailed: "Error al establecer como predeterminado, pero el registro de la tarjeta está completo",
    authenticationRequired: "Se requiere autenticación de la tarjeta. Por favor complete la autenticación.",
    authenticationFailed: "La autenticación de la tarjeta falló. Por favor inténtelo de nuevo.",
    authenticationCancelled: "La autenticación de la tarjeta fue cancelada.",
    authenticationIncomplete: "La autenticación de la tarjeta no está completa. Por favor complete la autenticación."
  }
};

export default es;