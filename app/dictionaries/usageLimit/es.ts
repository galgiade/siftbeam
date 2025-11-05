import type { UsageLimitLocale } from './usage-limit.d.ts';

const es: UsageLimitLocale = {
  label: {
    // Común
    save: "Guardar",
    cancel: "Cancelar",
    edit: "Editar",
    delete: "Eliminar",
    back: "Volver",
    add: "Agregar",
    create: "Crear",
    creating: "Guardando...",
    update: "Actualizar",
    
    // Página de creación
    createUsageLimitTitle: "Crear límite de uso",
    createUsageLimitDescription: "Configure límites de volumen de procesamiento de datos o gastos, y seleccione la acción a tomar cuando se exceda.",
    usageLimitSettings: "Configuración de límite de uso",
    exceedActionTitle: "Acción al exceder",
    selectAction: "Seleccionar acción",
    notifyOnlyOption: "Solo notificar",
    restrictOption: "Suspender servicio",
    notifyOnlyDescription: "Se enviará un correo de notificación cuando se exceda el límite. El servicio continuará disponible.",
    restrictDescription: "El servicio se suspenderá cuando se exceda el límite. También se enviará un correo de notificación.",
    limitTypeTitle: "Tipo de límite",
    dataLimitOption: "Límite de datos",
    amountLimitOption: "Límite de monto",
    dataLimitDescription: "Establecer límite basado en volumen de procesamiento de datos (MB/GB/TB).",
    amountLimitDescription: "Establecer límite basado en costo de procesamiento (USD).",
    dataLimitTitle: "Valor de límite de datos",
    enterLimitValue: "Ingrese valor límite (ej: 100)",
    unit: "Unidad",
    monthlyDataLimitDescription: "La acción se ejecutará cuando el volumen mensual de procesamiento de datos exceda este valor.",
    amountLimitTitle: "Valor de límite de monto",
    enterAmountValue: "Ingrese valor límite (ej: 50)",
    monthlyAmountLimitDescription: "La acción se ejecutará cuando el costo mensual de procesamiento exceda este monto.",
    notificationSettingsTitle: "Configuración de notificaciones",
    enterEmailPlaceholder: "Ingrese correo electrónico (ej: ejemplo@empresa.com)",
    notificationEmailList: "Correos electrónicos de notificación",
    notificationEmailCount: "Correos electrónicos de notificación ({count})",
    notifyOnlyEmailDescription: "Cuando se exceda el límite, se enviará una notificación a los correos electrónicos configurados aquí.",
    restrictEmailDescription: "Cuando se exceda el límite, el servicio se suspenderá y se enviará una notificación a los correos electrónicos configurados aquí.",
    cancelButton: "Cancelar",
    createNotifyLimit: "Crear límite de notificación",
    createRestrictLimit: "Crear límite de restricción",
    processingFeeOnly: "solo tarifa de procesamiento",
    conversionApproximate: "≈",

    // Pantalla principal
    limitUsageTitle: "Límites de uso",
    usageLimitManagement: "Gestión de límites de uso",
    usageLimitDescription: "Configure límites de consumo de datos y montos, y gestione las acciones cuando se sobrepasen.",
    createLimit: "Crear límite",
    notificationTarget: "Destinatario de notificaciones",
    detail: "Detalles",
    createdAt: "Creado",
    updatedAt: "Actualizado",
    limitValue: "Valor límite",
    notificationRecipients: "Destinatarios de notificación",

    // Tipos de notificación
    notify: "Notificar",
    restrict: "Suspender",
    exceedAction: "Acción al exceder",
    notifyOnly: "Solo notificar",
    notifyLimit: "Límite de notificación",
    restrictLimit: "Límite de suspensión",
    notifyLimitDescription: "Al configurar el límite se enviará una notificación cuando se supere.",
    restrictLimitDescription: "Al configurar el límite el servicio se suspenderá cuando se supere.",
    noNotifyLimits: "No hay límites de notificación",
    noRestrictLimits: "No hay límites de suspensión",

    // Monto y uso
    amount: "Monto",
    usage: "Uso",
    editTarget: "Elemento a editar",
    limitType: "Tipo de límite",
    selectLimitType: "Seleccione un tipo de límite",
    dataLimitValue: "Valor límite de datos",
    amountLimitValue: "Valor límite de monto (USD)",
    dataLimitPlaceholder: "p. ej., 100",
    amountLimitPlaceholder: "p. ej., 50",
    orSeparator: "o",
    noLimit: "Sin límite",

    // Gestión de destinatarios
    recipients: "Destinatarios",
    emailAddress: "Correo electrónico",
    emailPlaceholder: "Ingrese un correo electrónico",
    noRecipientsRegistered: "No hay destinatarios registrados",
    addEmailAddress: "Correo electrónico de notificación",
    minOneEmailRequired: "Se requiere al menos un correo electrónico de notificación.",

    // Crear / Editar
    usageNotification: "Notificación de uso",
    selectNotifyOrRestrict: "Seleccione notificación o restricción",
    selectNotificationMethod: "Seleccione el método de notificación",
    amountBasedNotification: "Notificación basada en monto",
    usageBasedNotification: "Notificación basada en uso",
    enterAmount: "Ingrese el monto",
    enterUsage: "Ingrese el uso",
    addNewRecipient: "Agregar nuevo destinatario",
    usageConversion: "Conversión de uso",
    amountConversion: "Conversión de monto",
    createNewLimit: "Crear nuevo límite de uso",
    editLimit: "Editar límite de uso",
    dataLimit: "Límite de datos",
    amountLimit: "Límite de monto",

    // Unidades
    yen: "JPY",
    unitKB: "KB",
    unitMB: "MB",
    unitGB: "GB",
    unitTB: "TB",
    usd: "USD",

    // Pantalla de error
    errorOccurred: "Se produjo un error",
    errorDetails: "Detalles del error",
    reloadPage: "Recargar página",
    backToAccount: "Volver a la cuenta",
    contactSupport: "Si el problema continúa, póngase en contacto con soporte."
  },
  alert: {
    // Validación
    amountRequired: "Ingrese el monto de uso",
    usageRequired: "Ingrese el volumen de uso",
    emailRequired: "Ingrese una dirección de correo electrónico",
    invalidEmail: "Ingrese una dirección de correo electrónico válida.",
    enterPositiveAmount: "Ingrese un número mayor o igual a 0",
    enterValidUsage: "Ingrese un número mayor que 0 y menor que 1024",
    enterPositiveDataLimit: "El valor del límite de datos debe ser mayor que 0.",
    enterPositiveAmountLimit: "El valor del límite de monto debe ser mayor que 0.",
    emailAlreadyAdded: "Este correo electrónico ya ha sido añadido.",
    minOneEmail: "Se requiere al menos un correo electrónico de notificación.",
    selectExceedAction: "Por favor seleccione una acción al exceder.",
    selectLimitType: "Por favor seleccione un tipo de límite.",
    dataLimitValueRequired: "El valor del límite de datos debe ser mayor que 0.",
    dataLimitValueMax: "El valor del límite de datos debe ser 1,000,000 o menos.",
    amountLimitValueRequired: "El valor del límite de monto debe ser mayor que 0.",
    amountLimitValueMax: "El valor del límite de monto debe ser 100,000 o menos.",
    minOneEmailRequired: "Por favor ingrese al menos un correo electrónico de notificación.",
    notifyLimitCreated: "El límite de notificación se creó correctamente.",
    restrictLimitCreated: "El límite de restricción se creó correctamente.",
    errorPrefix: "Error:",
    unexpectedError: "Ocurrió un error inesperado:",

    // Resultados
    createFailed: "No se pudo crear el límite de uso.",
    updateFailed: "No se pudo actualizar el límite de uso.",
    sendingError: "Se produjo un error al enviar.",
    savingInProgress: "Guardando...",
    createSuccess: "El límite de uso se creó correctamente.",
    updateSuccess: "El límite de uso se actualizó correctamente.",
    deleteSuccess: "El límite de uso se eliminó correctamente.",
    deleteConfirm: "¿Eliminar este límite de uso?",

    // Permisos
    adminOnlyCreateMessage: "Solo los administradores pueden crear límites de uso. Contacte a un administrador.",
    adminOnlyEditMessage: "Solo los administradores pueden editar límites de uso. No tiene permisos.",
    adminOnlyDeleteMessage: "Solo los administradores pueden eliminar límites de uso. No tiene permisos.",

    // Errores
    loginRequired: "Se requiere iniciar sesión.",
    unknownError: "Ocurrió un error desconocido.",
    accessDenied: "No tiene permiso para acceder a esta página. Solo accesible para administradores.",
    fetchFailed: "Error al obtener datos de límite de uso."
  }
};

export default es;
